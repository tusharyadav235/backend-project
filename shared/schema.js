"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertContactSchema = exports.insertOrderItemSchema = exports.insertOrderSchema = exports.insertProductSchema = exports.insertUserSchema = exports.contactMessages = exports.orderItems = exports.orders = exports.products = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_zod_1 = require("drizzle-zod");
// === TABLE DEFINITIONS ===
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    username: (0, pg_core_1.text)("username").notNull().unique(),
    password: (0, pg_core_1.text)("password").notNull(),
    role: (0, pg_core_1.text)("role").notNull().default("customer"), // 'admin' or 'customer'
    fullName: (0, pg_core_1.text)("full_name"),
    email: (0, pg_core_1.text)("email"),
    phone: (0, pg_core_1.text)("phone"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
exports.products = (0, pg_core_1.pgTable)("products", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    price: (0, pg_core_1.decimal)("price", { precision: 10, scale: 2 }).notNull(),
    discount: (0, pg_core_1.integer)("discount").default(0),
    imageUrl: (0, pg_core_1.text)("image_url").notNull(),
    category: (0, pg_core_1.text)("category"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
exports.orders = (0, pg_core_1.pgTable)("orders", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.integer)("user_id").references(() => exports.users.id),
    totalAmount: (0, pg_core_1.decimal)("total_amount", { precision: 10, scale: 2 }).notNull(),
    status: (0, pg_core_1.text)("status").notNull().default("pending"), // pending, paid, shipped, delivered
    razorpayOrderId: (0, pg_core_1.text)("razorpay_order_id"),
    paymentStatus: (0, pg_core_1.text)("payment_status").default("pending"),
    // Delivery fields
    shippingAddress: (0, pg_core_1.text)("shipping_address"),
    city: (0, pg_core_1.text)("city"),
    state: (0, pg_core_1.text)("state"),
    zipCode: (0, pg_core_1.text)("zip_code"),
    phone: (0, pg_core_1.text)("phone"),
    deliveryStatus: (0, pg_core_1.text)("delivery_status").default("pending"), // pending, processing, shipped, delivered
    estimatedDelivery: (0, pg_core_1.text)("estimated_delivery"),
    trackingNumber: (0, pg_core_1.text)("tracking_number"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
exports.orderItems = (0, pg_core_1.pgTable)("order_items", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    orderId: (0, pg_core_1.integer)("order_id").references(() => exports.orders.id).notNull(),
    productId: (0, pg_core_1.integer)("product_id").references(() => exports.products.id).notNull(),
    quantity: (0, pg_core_1.integer)("quantity").notNull(),
    price: (0, pg_core_1.decimal)("price", { precision: 10, scale: 2 }).notNull(),
});
exports.contactMessages = (0, pg_core_1.pgTable)("contact_messages", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
    email: (0, pg_core_1.text)("email").notNull(),
    phone: (0, pg_core_1.text)("phone"),
    message: (0, pg_core_1.text)("message").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// === SCHEMAS ===
exports.insertUserSchema = (0, drizzle_zod_1.createInsertSchema)(exports.users).omit({ id: true, createdAt: true });
exports.insertProductSchema = (0, drizzle_zod_1.createInsertSchema)(exports.products).omit({ id: true, createdAt: true });
exports.insertOrderSchema = (0, drizzle_zod_1.createInsertSchema)(exports.orders).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertOrderItemSchema = (0, drizzle_zod_1.createInsertSchema)(exports.orderItems).omit({ id: true });
exports.insertContactSchema = (0, drizzle_zod_1.createInsertSchema)(exports.contactMessages).omit({ id: true, createdAt: true });
