module.exports = [
"[project]/.next-internal/server/app/api/admin/categories/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/mongoose [external] (mongoose, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("mongoose", () => require("mongoose"));

module.exports = mod;
}),
"[project]/utils/models/Category.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const imageSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    url: {
        type: String,
        required: true
    },
    alt: {
        type: String
    },
    public_id: {
        type: String
    }
}, {
    _id: false
} // don’t create separate _id for image object
);
const categorySchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    parentId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: 'Category',
        default: null
    },
    image: imageSchema,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
const Category = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["models"].Category || (0, __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["model"])('Category', categorySchema);
const __TURBOPACK__default__export__ = Category;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/mongodb [external] (mongodb, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("mongodb", () => require("mongodb"));

module.exports = mod;
}),
"[project]/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clientPromise",
    ()=>clientPromise,
    "dbConnect",
    ()=>dbConnect
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongodb [external] (mongodb, cjs)");
// lib/db.ts
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
;
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error('Missing MONGODB_URI');
const mongoOptions = {
    serverApi: {
        version: __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["ServerApiVersion"].v1,
        strict: true,
        deprecationErrors: true
    }
};
async function dbConnect() {
    if (!global._mongoose) {
        global._mongoose = await __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connect(MONGODB_URI, {
            bufferCommands: true
        });
        console.log('✅ Mongoose connected');
    }
    if (!global._mongoClient) {
        global._mongoClient = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["MongoClient"](MONGODB_URI, mongoOptions);
        global._clientPromise = global._mongoClient.connect().then((client)=>{
            console.log('✅ MongoClient connected');
            return client;
        });
    }
    return {
        mongoose: global._mongoose,
        client: await global._clientPromise
    };
}
const clientPromise = (async ()=>{
    const { client } = await dbConnect();
    return client;
})();
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/utils/types/types.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// utils/types/db.ts
__turbopack_context__.s([
    "convertId",
    ()=>convertId,
    "customProductId",
    ()=>customProductId,
    "serializeCart",
    ()=>serializeCart,
    "serializeCategories",
    ()=>serializeCategories,
    "serializeCategory",
    ()=>serializeCategory,
    "serializeOrder",
    ()=>serializeOrder,
    "serializeOrders",
    ()=>serializeOrders,
    "serializeProduct",
    ()=>serializeProduct,
    "serializeProducts",
    ()=>serializeProducts,
    "serializeUser",
    ()=>serializeUser
]);
function convertId(id) {
    return id.toString();
}
function serializeCategory(category) {
    return {
        id: convertId(category._id),
        name: category.name,
        slug: category.slug,
        parentId: category.parentId ? serializeCategory(category.parentId) : undefined,
        image: category.image,
        createdAt: new Date(category.createdAt),
        updatedAt: new Date(category.updatedAt)
    };
}
function serializeCategories(categories) {
    return categories.map((c)=>serializeCategory(c));
}
function serializeProducts(products) {
    return products.map((p)=>serializeProduct(p));
}
function serializeProduct(product) {
    return {
        id: convertId(product._id),
        title: product.title,
        slug: product.slug,
        description: product.description,
        price: product.price,
        categoryIds: product.categoryIds.map(serializeCategory),
        images: product.images,
        variants: product.variants,
        stock: product.stock,
        rating: product.rating,
        aboutItem: product.aboutItem,
        createdAt: new Date(product.createdAt),
        updatedAt: new Date(product.updatedAt)
    };
}
function serializeUser(user) {
    return {
        id: convertId(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        addresses: user.addresses,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt)
    };
}
function serializeCart(cart) {
    return {
        id: convertId(cart._id),
        userId: convertId(cart.userId),
        items: cart.items.map((item)=>({
                productId: item.productId,
                variantId: item.variantId,
                qty: item.qty,
                name: item.name,
                price: item.price,
                image: item.image
            })),
        createdAt: new Date(cart.createdAt),
        updatedAt: new Date(cart.updatedAt)
    };
}
function serializeOrders(order) {
    return order.map((p)=>serializeOrder(p));
}
function serializeOrder(order) {
    return {
        id: convertId(order._id),
        userId: serializeUser(order.userId),
        status: order.status,
        total: order.total,
        shippingAddress: order.shippingAddress,
        items: order.items.map((item)=>({
                productId: item.productId,
                variantId: item.variantId,
                qty: item.qty,
                name: item.name,
                price: item.price,
                image: item.image
            })),
        createdAt: new Date(order.createdAt),
        updatedAt: new Date(order.updatedAt)
    };
}
const customProductId = {
    id: '68c99c72fbf6a5383f061826',
    title: 'Customized Hoodie',
    slug: 'customize',
    description: 'Customized Hoodie',
    price: 50,
    images: [],
    variants: [],
    stock: 10,
    rating: 5,
    aboutItem: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryIds: []
};
}),
"[project]/app/api/admin/categories/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$models$2f$Category$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/models/Category.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$jwt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next-auth/jwt.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth$2f$core$2f$jwt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@auth/core/jwt.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$types$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/types/types.ts [app-route] (ecmascript)");
;
;
;
;
;
async function GET(req) {
    const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth$2f$core$2f$jwt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getToken"])({
        req,
        secret: process.env.AUTH_SECRET
    });
    if (!token || token.role !== 'admin') {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: 'Unauthorized'
        }, {
            status: 401
        });
    }
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbConnect"])();
    try {
        const categories = await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$models$2f$Category$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({}).populate('parentId');
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json((0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$types$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["serializeCategories"])(categories));
    } catch (error) {
        console.error(error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: 'Internal server error'
        }, {
            status: 500
        });
    }
}
async function POST(req) {
    const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth$2f$core$2f$jwt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getToken"])({
        req,
        secret: process.env.AUTH_SECRET
    });
    if (!token || token.role !== 'admin') {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: 'Unauthorized'
        }, {
            status: 401
        });
    }
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbConnect"])();
    try {
        const { name, slug, parentId, image } = await req.json(); // ✅ include image
        if (!name || !slug) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: 'Name and slug are required'
            }, {
                status: 400
            });
        }
        const existingCategory = await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$models$2f$Category$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
            slug
        });
        if (existingCategory) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: 'Slug must be unique'
            }, {
                status: 400
            });
        }
        const newCategory = new __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$models$2f$Category$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]({
            name,
            slug,
            parentId: parentId || null,
            image: image || null
        });
        await newCategory.save();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(newCategory, {
            status: 201
        });
    } catch (error) {
        console.error(error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: 'Internal server error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c286a4f8._.js.map