"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = exports.errorSchemas = void 0;
exports.buildUrl = buildUrl;
const zod_1 = require("zod");
const schema_1 = require("./schema");
exports.errorSchemas = {
    validation: zod_1.z.object({
        message: zod_1.z.string(),
        field: zod_1.z.string().optional(),
    }),
    notFound: zod_1.z.object({
        message: zod_1.z.string(),
    }),
    internal: zod_1.z.object({
        message: zod_1.z.string(),
    }),
    unauthorized: zod_1.z.object({
        message: zod_1.z.string(),
    }),
};
exports.api = {
    auth: {
        login: {
            method: 'POST',
            path: '/api/login',
            input: zod_1.z.object({ username: zod_1.z.string(), password: zod_1.z.string() }),
            responses: {
                200: zod_1.z.custom(),
                401: exports.errorSchemas.unauthorized,
            },
        },
        register: {
            method: 'POST',
            path: '/api/register',
            input: schema_1.insertUserSchema,
            responses: {
                201: zod_1.z.custom(),
                400: exports.errorSchemas.validation,
            },
        },
        logout: {
            method: 'POST',
            path: '/api/logout',
            responses: {
                200: zod_1.z.object({ message: zod_1.z.string() }),
            },
        },
        me: {
            method: 'GET',
            path: '/api/user',
            responses: {
                200: zod_1.z.custom(),
                401: exports.errorSchemas.unauthorized,
            },
        },
    },
    products: {
        list: {
            method: 'GET',
            path: '/api/products',
            responses: {
                200: zod_1.z.array(zod_1.z.custom()),
            },
        },
        get: {
            method: 'GET',
            path: '/api/products/:id',
            responses: {
                200: zod_1.z.custom(),
                404: exports.errorSchemas.notFound,
            },
        },
        create: {
            method: 'POST',
            path: '/api/products',
            input: schema_1.insertProductSchema,
            responses: {
                201: zod_1.z.custom(),
                400: exports.errorSchemas.validation,
                403: exports.errorSchemas.unauthorized,
            },
        },
        update: {
            method: 'PUT',
            path: '/api/products/:id',
            input: schema_1.insertProductSchema.partial(),
            responses: {
                200: zod_1.z.custom(),
                404: exports.errorSchemas.notFound,
                403: exports.errorSchemas.unauthorized,
            },
        },
        delete: {
            method: 'DELETE',
            path: '/api/products/:id',
            responses: {
                204: zod_1.z.void(),
                404: exports.errorSchemas.notFound,
                403: exports.errorSchemas.unauthorized,
            },
        },
    },
    orders: {
        create: {
            method: 'POST',
            path: '/api/orders',
            input: zod_1.z.object({
                productId: zod_1.z.number(),
                quantity: zod_1.z.number(),
                shippingAddress: zod_1.z.string().optional(),
                city: zod_1.z.string().optional(),
                state: zod_1.z.string().optional(),
                zipCode: zod_1.z.string().optional(),
                phone: zod_1.z.string().optional(),
            }),
            responses: {
                201: zod_1.z.object({ orderId: zod_1.z.number(), razorpayOrderId: zod_1.z.string(), amount: zod_1.z.number(), currency: zod_1.z.string() }),
                400: exports.errorSchemas.validation,
            },
        },
        verifyPayment: {
            method: 'POST',
            path: '/api/orders/verify',
            input: zod_1.z.object({
                razorpay_order_id: zod_1.z.string(),
                razorpay_payment_id: zod_1.z.string(),
                razorpay_signature: zod_1.z.string(),
            }),
            responses: {
                200: zod_1.z.object({ status: zod_1.z.string() }),
                400: exports.errorSchemas.validation,
            },
        },
        list: {
            method: 'GET',
            path: '/api/orders',
            responses: {
                200: zod_1.z.array(zod_1.z.custom()),
                401: exports.errorSchemas.unauthorized,
            },
        },
        get: {
            method: 'GET',
            path: '/api/orders/:id',
            responses: {
                200: zod_1.z.custom(),
                401: exports.errorSchemas.unauthorized,
                404: exports.errorSchemas.notFound,
            },
        },
        updateDelivery: {
            method: 'PATCH',
            path: '/api/orders/:id/delivery',
            input: zod_1.z.object({
                deliveryStatus: zod_1.z.string().optional(),
                trackingNumber: zod_1.z.string().optional(),
                estimatedDelivery: zod_1.z.string().optional(),
            }),
            responses: {
                200: zod_1.z.custom(),
                403: exports.errorSchemas.unauthorized,
                404: exports.errorSchemas.notFound,
            },
        },
    },
    contact: {
        submit: {
            method: 'POST',
            path: '/api/contact',
            input: schema_1.insertContactSchema,
            responses: {
                201: zod_1.z.custom(), // Typo fix: returns generic success
                400: exports.errorSchemas.validation,
            },
        },
    },
};
function buildUrl(path, params) {
    let url = path;
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (url.includes(`:${key}`)) {
                url = url.replace(`:${key}`, String(value));
            }
        });
    }
    return url;
}
