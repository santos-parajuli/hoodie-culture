# Hoodie Culture - E-commerce Platform

Welcome to Hoodie Culture, a full-stack e-commerce platform for selling and customizing hoodies. This application is built with Next.js and features a complete client-facing storefront and a comprehensive admin dashboard for managing products, orders, and more.

## Features

### Client-Facing Storefront
- **User Authentication**: Secure sign-up and login with credentials or Google.
- **Product Showcase**: Browse products with advanced filtering (by category, price, rating) and sorting options.
- **Product Details**: View detailed information for each product, including multiple images, descriptions, and variant selections.
- **3D Hoodie Customizer**: An interactive, step-by-step wizard to customize hoodie colors on a 3D model, powered by React Three Fiber.
- **Shopping Cart**: Add products to the cart, update quantities, and see a real-time summary.
- **Checkout & Orders**: A seamless checkout process and the ability for users to view their order history.
- **Responsive Design**: A mobile-first design that looks great on all devices.

### Admin Dashboard
- **Secure Admin Panel**: Protected routes accessible only to administrators.
- **Product Management**: Full CRUD (Create, Read, Update, Delete) functionality for products, including image uploads to Cloudinary.
- **Category Management**: Manage product categories and subcategories.
- **Order Management**: View and update the status of all customer orders.
- **Data Tables**: Interactive tables for easy management of products, categories, and orders, complete with sorting and filtering.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [Shadcn/UI](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **3D Visualization**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) & [Drei](https://github.com/pmndrs/drei)
- **Image Management**: [Cloudinary](https://cloudinary.com/)

## Getting Started

### Prerequisites

- Node.js (v20.x or later)
- npm
- MongoDB instance (local or cloud-hosted)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/hoodie-culture.git
   cd hoodie-culture
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root of your project and add the following variables.

   ```env
   # MongoDB
   MONGODB_URI=your_mongodb_connection_string

   # NextAuth
   AUTH_SECRET=your_auth_secret # Generate one: openssl rand -hex 32
   GOOGLE_ID=your_google_client_id
   GOOGLE_SECRET=your_google_client_secret

   # Cloudinary
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   NEXT_PUBLIC_CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Base URL
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

### Running the Application

Execute the following command to start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Folder Structure

Here is a high-level overview of the project's folder structure:

```
/
├── app/                  # Next.js App Router pages and layouts
│   ├── (auth)/           # Auth routes (login, signup)
│   ├── (client)/         # Client-facing routes
│   ├── admin/            # Admin dashboard routes
│   └── api/              # API endpoints
├── components/           # React components
│   ├── client/           # Components for the client storefront
│   ├── admin/            # Components for the admin dashboard
│   ├── shared/           # Components used across the app
│   └── ui/               # Shadcn/UI components
├── lib/                  # Core logic and utilities
│   ├── api.ts            # API client functions
│   ├── auth.ts           # NextAuth configuration
│   ├── db.ts             # Database connection
│   └── store.ts          # Zustand state management
├── public/               # Static assets (images, 3D models)
└── utils/                # Utilities, helpers, and type definitions
    ├── helpers/          # Helper functions
    ├── models/           # Mongoose schemas
    └── types/            # TypeScript types and interfaces
```
