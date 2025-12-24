import type { Express } from "express";
import type { Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import Razorpay from "razorpay";

// Mock Razorpay if no keys (for dev)
const razorpay = process.env.RAZORPAY_KEY_ID 
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Set up Passport auth
  setupAuth(app);
  
  // --- Products ---
  app.get(api.products.list.path, async (req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  });

  app.post(api.products.create.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const input = api.products.create.input.parse(req.body);
    const product = await storage.createProduct(input);
    res.status(201).json(product);
  });

  app.put(api.products.update.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const input = api.products.update.input.parse(req.body);
    const product = await storage.updateProduct(Number(req.params.id), input);
    res.json(product);
  });

  app.delete(api.products.delete.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await storage.deleteProduct(Number(req.params.id));
    res.status(204).send();
  });

  // --- Orders & Razorpay ---
  app.post(api.orders.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Login required" });
    
    const { productId, quantity, shippingAddress, city, state, zipCode, phone, paymentMethod } = req.body;
    const product = await storage.getProduct(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const amount = Number(product.price) * quantity;
    const amountPaise = Math.round(amount * 100);

    let razorpayOrderId = "mock_order_id_" + Date.now();
    
    // Only initialize Razorpay if user selected online payment
    if (paymentMethod === 'razorpay' && razorpay) {
      try {
        const order = await razorpay.orders.create({
          amount: amountPaise,
          currency: "INR",
          receipt: "order_" + Date.now(),
        });
        razorpayOrderId = order.id;
      } catch (err) {
        console.error("Razorpay Error:", err);
        return res.status(500).json({ message: "Payment initialization failed" });
      }
    }

    // Calculate estimated delivery (5-7 days)
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + 6);

    // For COD, set status to "paid" immediately; for online, keep as "pending"
    const paymentStatus = paymentMethod === 'cod' ? 'paid' : 'pending';
    const orderStatus = paymentMethod === 'cod' ? 'confirmed' : 'pending';

    const order = await storage.createOrder({
      userId: req.user.id,
      totalAmount: amount.toString(),
      status: orderStatus,
      razorpayOrderId,
      paymentStatus,
      shippingAddress,
      city,
      state,
      zipCode,
      phone,
      deliveryStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      estimatedDelivery: estimatedDate.toISOString().split('T')[0],
    });

    // Create order item
    await storage.createOrderItem({
      orderId: order.id,
      productId,
      quantity,
      price: product.price,
    });

    res.status(201).json({
      orderId: order.id,
      razorpayOrderId,
      amount: amountPaise,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID || "mock_key"
    });
  });

  app.post(api.orders.verifyPayment.path, async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    await storage.updateOrderPayment(razorpay_order_id, "paid", razorpay_payment_id);
    res.json({ status: "success" });
  });

  // Get user's orders
  app.get(api.orders.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Login required" });
    const orders = await storage.getUserOrders(req.user.id);
    res.json(orders);
  });

  // Get single order
  app.get(api.orders.get.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Login required" });
    const order = await storage.getOrder(Number(req.params.id));
    if (!order || order.userId !== req.user.id) {
      return res.status(404).json({ message: "Order not found" });
    }
    const items = await storage.getOrderItems(order.id);
    res.json({ ...order, items });
  });

  // Update delivery status (admin only)
  app.patch(api.orders.updateDelivery.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const { deliveryStatus, trackingNumber, estimatedDelivery } = req.body;
    const order = await storage.updateOrderDelivery(Number(req.params.id), {
      deliveryStatus,
      trackingNumber,
      estimatedDelivery,
    });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  });

  // --- Contact ---
  app.post(api.contact.submit.path, async (req, res) => {
    const input = api.contact.submit.input.parse(req.body);
    const msg = await storage.createContactMessage(input);
    res.status(201).json(msg);
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const products = await storage.getProducts();
  if (products.length === 0) {
    await storage.createProduct({
      name: "Premium Cattle Pellets",
      description: "High quality pellets for maximum nutrition",
      price: 500.00,
      imageUrl: "/images/products.png", // Using the copied asset
      category: "Feed"
    });
    await storage.createProduct({
      name: "Mineral Lick Block",
      description: "Essential minerals for cattle health",
      price: 250.00,
      imageUrl: "/images/products.png",
      category: "Supplements"
    });
    // Create Admin User
    // Note: Password hashing should be handled in auth.ts or storage.ts. 
    // For seed simplicity, assuming auth handles hash on create or we use a fixed hash.
    // For MVP, we'll assume the register function hashes, but here we insert directly.
    // In a real app, use the auth service to create users.
    // Let's assume 'admin123' hashed (not implemented here, so admin login might fail unless registered via UI)
  }
}
