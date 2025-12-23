import { db } from "./db";
import {
  users, products, orders, orderItems, contactMessages,
  type User, type InsertUser, type Product, type InsertProduct, type Order, type InsertOrder, 
  type OrderItem, type InsertOrderItem, type ContactMessage, type InsertContactMessage
} from "@shared/schema";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;

  // Order
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderPayment(razorpayOrderId: string, status: string, paymentId?: string): Promise<Order | undefined>;
  getUserOrders(userId: number): Promise<Order[]>;
  getOrder(orderId: number): Promise<Order | undefined>;
  updateOrderDelivery(orderId: number, updates: Partial<InsertOrder>): Promise<Order | undefined>;
  
  // Order Items
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  
  // Contact
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product> {
    const [updated] = await db.update(products).set(updates).where(eq(products.id, id)).returning();
    return updated;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(insertOrder).returning();
    return order;
  }

  async updateOrderPayment(razorpayOrderId: string, status: string, paymentId?: string): Promise<Order | undefined> {
    // Note: In a real app, you'd verify the signature here or in the route
    // This simple update assumes the route handled verification
    const [updated] = await db
      .update(orders)
      .set({ status, paymentStatus: status }) // Simplified
      .where(eq(orders.razorpayOrderId, razorpayOrderId))
      .returning();
    return updated;
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [msg] = await db.insert(contactMessages).values(message).returning();
    return msg;
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId));
  }

  async getOrder(orderId: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
    return order;
  }

  async updateOrderDelivery(orderId: number, updates: Partial<InsertOrder>): Promise<Order | undefined> {
    const [updated] = await db.update(orders).set(updates).where(eq(orders.id, orderId)).returning();
    return updated;
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const [orderItem] = await db.insert(orderItems).values(item).returning();
    return orderItem;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }
}

export const storage = new DatabaseStorage();
