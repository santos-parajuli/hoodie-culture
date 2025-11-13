module.exports = [
"[project]/.next-internal/server/app/(client)/profile/orders/page/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[project]/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/app/(client)/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/(client)/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/lib/api.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AdminAPI",
    ()=>AdminAPI,
    "AuthAPI",
    ()=>AuthAPI,
    "CategoryAPI",
    ()=>CategoryAPI,
    "OrderAPI",
    ()=>OrderAPI,
    "ProductsAPI",
    ()=>ProductsAPI,
    "apiClient",
    ()=>apiClient
]);
const apiClient = async (endpoint, options)=>{
    const baseUrl = ("TURBOPACK compile-time truthy", 1) ? process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000' : "TURBOPACK unreachable";
    const headers = {
        'Content-Type': 'application/json',
        ...options?.headers || {}
    };
    const res = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || 'API error');
    }
    return res.json();
};
const CategoryAPI = {
    getCategories: ()=>apiClient('/api/categories', {
            method: 'GET'
        })
};
const AuthAPI = {
    register: (data)=>apiClient('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    login: (data)=>apiClient('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(data)
        })
};
const ProductsAPI = {
    getProducts: (options)=>{
        const params = new URLSearchParams();
        if (options?.limit) params.append('limit', options.limit.toString());
        if (options?.skip) params.append('skip', options.skip.toString());
        if (options?.sort) params.append('sort', options.sort);
        if (options?.categoryId) params.append('categoryId', options.categoryId);
        if (options?.search) params.append('search', options.search);
        if (options?.minPrice !== undefined) params.append('minPrice', options.minPrice.toString());
        if (options?.maxPrice !== undefined) params.append('maxPrice', options.maxPrice.toString());
        if (options?.minRating !== undefined) params.append('minRating', options.minRating.toString());
        return apiClient(`/api/products?${params.toString()}`, {
            method: 'GET'
        });
    },
    getProduct: (options)=>{
        return apiClient(`/api/products/${options?.slug}`, {
            method: 'GET'
        });
    }
};
const OrderAPI = {
    // Create a new order
    createOrder: (data)=>apiClient('/api/orders', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }),
    getOrder: (id)=>apiClient(`/api/orders/${id}`, {
            method: 'GET'
        }),
    getUserOrders: (userId)=>apiClient(`/api/orders/user/${userId}`, {
            method: 'GET'
        })
};
const AdminAPI = {
    getProducts: ()=>apiClient('/api/admin/products', {
            method: 'GET'
        }),
    getProduct: (id)=>apiClient(`/api/admin/products/${id}`, {
            method: 'GET'
        }),
    deleteProduct: (id)=>apiClient(`/api/admin/products/${id}`, {
            method: 'DELETE'
        }),
    createProduct: (data)=>apiClient('/api/admin/products', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }),
    updateProduct: (id, data)=>apiClient(`/api/admin/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }),
    getCategories: ()=>apiClient('/api/admin/categories', {
            method: 'GET'
        }),
    getCategory: (id)=>apiClient(`/api/admin/categories/${id}`, {
            method: 'GET'
        }),
    createCategory: (data)=>apiClient('/api/admin/categories', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }),
    updateCategory: (id, data)=>apiClient(`/api/admin/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }),
    deleteCategory: (id)=>apiClient(`/api/admin/categories/${id}`, {
            method: 'DELETE'
        }),
    getCustomers: ()=>apiClient('/api/admin/customers', {
            method: 'GET'
        })
};
}),
"[project]/components/client/pages/orders-client.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/components/client/pages/orders-client.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/client/pages/orders-client.tsx <module evaluation>", "default");
}),
"[project]/components/client/pages/orders-client.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/components/client/pages/orders-client.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/client/pages/orders-client.tsx", "default");
}),
"[project]/components/client/pages/orders-client.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$client$2f$pages$2f$orders$2d$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/components/client/pages/orders-client.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$client$2f$pages$2f$orders$2d$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/components/client/pages/orders-client.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$client$2f$pages$2f$orders$2d$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/utils/types/types.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[externals]/mongodb [external] (mongodb, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("mongodb", () => require("mongodb"));

module.exports = mod;
}),
"[externals]/mongoose [external] (mongoose, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("mongoose", () => require("mongoose"));

module.exports = mod;
}),
"[project]/lib/db.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/utils/models/User.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const userSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String
    },
    role: {
        type: String,
        enum: [
            'user',
            'admin'
        ],
        default: 'user'
    },
    passwordHash: {
        type: String,
        required: true
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpires: {
        type: Date
    },
    addresses: [
        {
            line1: String,
            line2: String,
            city: String,
            state: String,
            postalCode: String,
            country: String
        }
    ],
    orders: [
        {
            type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
            ref: 'Order'
        }
    ]
}, {
    timestamps: true
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["models"].User || (0, __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["model"])('User', userSchema);
}),
"[externals]/bcrypt [external] (bcrypt, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("bcrypt", () => require("bcrypt"));

module.exports = mod;
}),
"[project]/lib/auth.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "auth",
    ()=>auth,
    "handlers",
    ()=>handlers,
    "signIn",
    ()=>signIn,
    "signOut",
    ()=>signOut
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$types$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/types/types.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$providers$2f$credentials$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next-auth/providers/credentials.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth$2f$core$2f$providers$2f$credentials$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@auth/core/providers/credentials.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$providers$2f$google$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next-auth/providers/google.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth$2f$core$2f$providers$2f$google$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@auth/core/providers/google.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth$2f$mongodb$2d$adapter$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@auth/mongodb-adapter/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next-auth/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$models$2f$User$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/models/User.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$bcrypt__$5b$external$5d$__$28$bcrypt$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/bcrypt [external] (bcrypt, cjs)");
;
;
;
;
;
;
;
;
const { handlers, signIn, signOut, auth } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])({
    adapter: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth$2f$mongodb$2d$adapter$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["MongoDBAdapter"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["clientPromise"]),
    session: {
        strategy: 'jwt'
    },
    providers: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth$2f$core$2f$providers$2f$credentials$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])({
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'text'
                },
                password: {
                    label: 'Password',
                    type: 'password'
                }
            },
            async authorize (credentials) {
                if (!credentials?.email || !credentials.password) return null;
                const { email, password } = credentials;
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["dbConnect"])();
                const user = await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$models$2f$User$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].findOne({
                    email
                });
                if (!user) return null;
                const isValid = await __TURBOPACK__imported__module__$5b$externals$5d2f$bcrypt__$5b$external$5d$__$28$bcrypt$2c$__cjs$29$__["default"].compare(password, user.passwordHash);
                if (!isValid) return null;
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$types$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serializeUser"])(user);
            }
        }),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth$2f$core$2f$providers$2f$google$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET
        })
    ],
    callbacks: {
        async jwt ({ token, user }) {
            if (user) {
                const u = user;
                token.id = u.id;
                token.role = u.role;
                token.picture = u.image;
                token.name = u.name;
                token.email = u.email;
                return token;
            }
            if (token.id) {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["dbConnect"])();
                const dbUser = await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$models$2f$User$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].findById(token.id);
                if (dbUser) {
                    const serialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$types$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serializeUser"])(dbUser);
                    token.name = serialized.name;
                    token.email = serialized.email;
                    token.picture = serialized.image;
                    token.role = serialized.role;
                }
            }
            return token;
        },
        async session ({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture;
                session.user.role = token.role;
            }
            return session;
        }
    }
});
}),
"[project]/app/(client)/profile/orders/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OrdersPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$client$2f$pages$2f$orders$2d$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/client/pages/orders-client.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
;
;
;
;
;
async function OrdersPage() {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auth"])();
    if (!session?.user) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/login?callbackUrl=/profile/orders');
    }
    const orders = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["OrderAPI"].getUserOrders(session.user.id);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "container mx-auto p-4 md:p-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-3xl font-bold",
                        children: "My Orders"
                    }, void 0, false, {
                        fileName: "[project]/app/(client)/profile/orders/page.tsx",
                        lineNumber: 16,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-muted-foreground",
                        children: "Here is a list of your past orders."
                    }, void 0, false, {
                        fileName: "[project]/app/(client)/profile/orders/page.tsx",
                        lineNumber: 17,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(client)/profile/orders/page.tsx",
                lineNumber: 15,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$client$2f$pages$2f$orders$2d$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                orders: orders
            }, void 0, false, {
                fileName: "[project]/app/(client)/profile/orders/page.tsx",
                lineNumber: 19,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(client)/profile/orders/page.tsx",
        lineNumber: 14,
        columnNumber: 3
    }, this);
}
}),
"[project]/app/(client)/profile/orders/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/(client)/profile/orders/page.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__57bcbc92._.js.map