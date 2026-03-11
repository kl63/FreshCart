# 🛒 FreshCart - Full-Stack E-commerce Platform

A production-ready, full-stack supermarket e-commerce platform built with Next.js 15, TypeScript, and FastAPI. Features complete backend integration, admin dashboard, Stripe payments, and real-time order management.

![FreshCart Preview](https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=400&auto=format&fit=crop)

## 🌟 Overview

FreshCart is a comprehensive e-commerce solution designed for grocery stores and supermarkets. It includes a customer-facing storefront, complete admin dashboard, and seamless integration with a FastAPI backend for real-time data management.

**Live Backend API**: `https://fastapi.kevinlinportfolio.com/api/v1`

## ✨ Features

### 🎨 Design & UI
- **Modern Green Theme** - Fresh, professional design optimized for grocery businesses
- **Fully Responsive** - Mobile-first design that works on all devices
- **shadcn/ui Components** - Beautiful, accessible UI components
- **Smooth Animations** - Enhanced user experience with Framer Motion
- **Image Optimization** - Next.js Image component with Unsplash integration
- **Loading States** - Skeleton screens and loading indicators throughout

### 🛍️ Customer Features
- **Product Catalog** - Browse products organized by categories
- **Real-time Search** - Search products with advanced filtering
- **Shopping Cart** - Persistent cart with Zustand state management
- **Product Details** - Detailed product pages with images, pricing, and descriptions
- **Wishlist** - Save favorite products for later
- **User Accounts** - Complete authentication with profile management
- **Order History** - View past orders and track deliveries
- **Stripe Checkout** - Secure payment processing with Stripe

### 🔐 Authentication & Authorization
- **User Registration** - Email-based account creation
- **Secure Login** - JWT token-based authentication
- **Profile Management** - Update personal information and preferences
- **Role-Based Access** - Admin and customer role separation
- **Password Protection** - Secure password handling via backend API

### 💳 Payment & Checkout
- **Stripe Integration** - Production-ready payment processing
- **Address Management** - Save and manage shipping addresses
- **Order Creation** - Complete checkout flow with payment intent
- **Order Confirmation** - Email and on-site order confirmations
- **Payment History** - View transaction details

### 👨‍💼 Admin Dashboard
- **Product Management** - CRUD operations for products with pagination
- **Category Management** - Organize products into categories
- **Order Management** - View and update order statuses with detailed order items
- **User Management** - Manage customers, roles, and permissions
- **Real-time Updates** - Live data synchronization with backend
- **Bulk Operations** - Efficient management of multiple items
- **Search & Filter** - Advanced filtering across all admin panels

### 🔌 Backend Integration
- **FastAPI Backend** - Python-based RESTful API
- **Real-time Data** - Live product, order, and user data
- **API Authentication** - Bearer token authentication for all requests
- **Error Handling** - Comprehensive error handling and user feedback
- **Data Validation** - TypeScript interfaces matching backend schemas
- **Optimistic Updates** - Fast UI updates with API sync

### 🔧 Technical Features
- **Next.js 15** - Latest Next.js with App Router and Turbopack
- **TypeScript** - Full type safety across the application
- **TailwindCSS v4** - Modern utility-first CSS framework
- **Zustand** - Lightweight state management for cart
- **Docker Support** - Containerized deployment ready
- **Environment Configuration** - Flexible env-based configuration
- **SEO Optimized** - Meta tags and structured data

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- FastAPI backend running (or use the live demo backend)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kl63/FreshCart.git
   cd freshcart-site
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   # Backend API
   NEXT_PUBLIC_API_URL=https://fastapi.kevinlinportfolio.com/api/v1
   
   # Stripe (for payments)
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### 🔑 Admin Access

To access the admin dashboard:
1. Register a user account at `/auth/register`
2. Have the backend admin grant admin privileges to your account
3. Access the dashboard at `/admin`

**Admin Features:**
- Product management at `/admin/products`
- Order management at `/admin/orders`
- User management at `/admin/users`
- Category management at `/admin/categories`

## 📁 Project Structure

```
freshcart-site/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── admin/               # Admin dashboard
│   │   │   ├── products/        # Product management
│   │   │   ├── orders/          # Order management
│   │   │   ├── users/           # User management
│   │   │   └── categories/      # Category management
│   │   ├── auth/                # Authentication pages
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── products/            # Product pages
│   │   │   └── [id]/           # Dynamic product details
│   │   ├── categories/          # Category pages
│   │   │   └── [slug]/         # Category listings
│   │   ├── cart/               # Shopping cart
│   │   ├── checkout/           # Checkout flow
│   │   ├── account/            # User account
│   │   ├── api/                # API routes
│   │   │   ├── products/
│   │   │   ├── categories/
│   │   │   ├── orders/
│   │   │   └── addresses/
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── layout/             # Layout components
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   └── admin-layout.tsx
│   │   ├── home/               # Homepage sections
│   │   ├── product/            # Product components
│   │   └── admin/              # Admin components
│   ├── lib/
│   │   ├── products.ts         # Product API functions
│   │   ├── categories.ts       # Category API functions
│   │   ├── stripe.ts           # Stripe integration
│   │   └── utils.ts            # Utility functions
│   ├── store/
│   │   └── cart.ts             # Zustand cart store
│   └── types/
│       └── index.ts            # TypeScript definitions
├── docs/                        # Documentation
│   ├── api/                    # API documentation
│   ├── auth/                   # Authentication guides
│   ├── cart-checkout/          # Checkout documentation
│   ├── stripe/                 # Stripe integration
│   ├── debug/                  # Troubleshooting
│   └── setup/                  # Setup guides
├── public/                      # Static assets
├── .env.local                  # Environment variables
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── docker-compose.yml          # Docker configuration
```

## 🎨 Customization

### Theme Colors
The green supermarket theme is defined in `src/app/globals.css`:

```css
:root {
  --primary: #16a34a;        /* Fresh green */
  --primary-dark: #15803d;
  --primary-light: #22c55e;
  --secondary: #f0fdf4;      /* Light green background */
  --accent: #fbbf24;         /* Golden yellow for highlights */
}
```

### Backend API Configuration
Update the API URL in `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api/v1
```

The frontend uses these main API endpoints:
- `GET /products/` - Fetch products with filters and pagination
- `GET /categories/` - Fetch product categories
- `GET /orders/` - Fetch user orders
- `POST /auth/login` - User authentication
- `POST /orders/create-order-with-payment` - Create orders with Stripe

### Adding Products
Products are managed through the admin dashboard at `/admin/products` or via the backend API. The backend handles all product data including:
- Product information (name, description, price)
- Images (Unsplash URLs)
- Categories and tags
- Stock management
- Pricing and discounts

## 🛠️ Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router and Turbopack
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[TailwindCSS v4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Re-usable component library
- **[Zustand](https://zustand-demo.pmnd.rs/)** - State management for cart
- **[Heroicons](https://heroicons.com/)** - SVG icon library
- **[Lucide React](https://lucide.dev/)** - Additional icons
- **[Stripe](https://stripe.com/)** - Payment processing

### Backend
- **[FastAPI](https://fastapi.tiangolo.com/)** - Python web framework
- **[PostgreSQL](https://www.postgresql.org/)** - Database
- **[SQLAlchemy](https://www.sqlalchemy.org/)** - ORM
- **[JWT](https://jwt.io/)** - Authentication tokens

### Infrastructure
- **[Docker](https://www.docker.com/)** - Containerization
- **[Vercel](https://vercel.com/)** - Frontend deployment (optional)
- **[AWS/DigitalOcean](https://aws.amazon.com/)** - Backend hosting (optional)

## 📦 Key Dependencies

```json
{
  "dependencies": {
    "next": "^15.4.5",
    "react": "^19.0.0",
    "typescript": "^5.7.3",
    "@heroicons/react": "^2.2.0",
    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-dropdown-menu": "^2.1.2",
    "@stripe/stripe-js": "^4.16.0",
    "zustand": "^5.0.2",
    "tailwindcss": "^4.1.0",
    "tailwind-merge": "^2.5.5",
    "class-variance-authority": "^0.7.1",
    "lucide-react": "^0.468.0"
  }
}
```

## 🚀 Deployment

### Vercel (Recommended for Frontend)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Configure environment variables in Vercel dashboard
4. Deploy automatically

### Docker Deployment
The project includes Docker configuration for containerized deployment:

```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build manually
docker build -t freshcart-frontend .
docker run -p 3000:3000 freshcart-frontend
```

### Manual Production Build
```bash
# Build for production
npm run build

# Start production server
npm run start
```

### Environment Variables for Production
Ensure these are set in your production environment:
- `NEXT_PUBLIC_API_URL` - Backend API endpoint
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe public key
- `NODE_ENV=production`

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:

```env
# Backend API Configuration
NEXT_PUBLIC_API_URL=https://fastapi.kevinlinportfolio.com/api/v1

# Stripe Payment Integration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Image Domains
Configure allowed image domains in `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'images.unsplash.com' },
      { hostname: 'plus.unsplash.com' },
      { hostname: 'source.unsplash.com' },
      { hostname: 'unsplash.com' },
      { hostname: 'fastapi.kevinlinportfolio.com' },
    ],
  },
}
```

## 📱 Pages & Features

### Public Pages
- **Homepage** (`/`) - Hero section, featured products, categories
- **Products** (`/products`) - Product catalog with search and filters
- **Product Details** (`/products/[id]`) - Detailed product information
- **Categories** (`/categories`) - Browse by category
- **Category Listings** (`/categories/[slug]`) - Products in specific category
- **Cart** (`/cart`) - Shopping cart with quantity management
- **Checkout** (`/checkout`) - Stripe payment integration
- **About** (`/about`) - Company information
- **Contact** (`/contact`) - Contact form

### User Pages
- **Login** (`/auth/login`) - User authentication
- **Register** (`/auth/register`) - New user registration
- **Account** (`/account`) - User profile management
- **Orders** (`/orders`) - Order history

### Admin Dashboard
- **Admin Home** (`/admin`) - Dashboard overview
- **Products** (`/admin/products`) - Product CRUD with pagination
- **Orders** (`/admin/orders`) - Order management with details modal
- **Users** (`/admin/users`) - User management and permissions
- **Categories** (`/admin/categories`) - Category management

### Key Features by Page

**Shopping Cart:**
- Persistent storage with Zustand
- Real-time price calculations
- Quantity updates
- Remove items
- Clear cart functionality

**Checkout:**
- Shipping address form
- Stripe payment integration
- Order summary
- Payment confirmation
- Error handling

**Admin Products:**
- View all products with pagination
- Load more functionality
- Search and filter products
- Edit product details
- Delete products
- Stock management

**Admin Orders:**
- View all orders with customer info
- Order details modal showing:
  - Customer information
  - Order items with prices
  - Order totals (subtotal, tax, shipping)
  - Order status
- Filter and search orders
- Update order status

## 🔌 API Integration

### Backend Endpoints Used

**Authentication:**
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile

**Products:**
- `GET /products/` - List products (with pagination, filters, search)
- `GET /products/{id}` - Get product details
- `POST /products/` - Create product (admin)
- `PUT /products/{id}` - Update product (admin)
- `DELETE /products/{id}` - Delete product (admin)

**Categories:**
- `GET /categories/` - List categories
- `GET /categories/{slug}` - Get category by slug
- `POST /categories/` - Create category (admin)
- `PUT /categories/{id}` - Update category (admin)

**Orders:**
- `GET /orders/` - List orders (user's orders or all for admin)
- `GET /orders/{id}` - Get order details with items
- `POST /orders/create-payment-intent` - Create Stripe payment intent
- `POST /orders/create-order-with-payment` - Create order with payment

**Users (Admin):**
- `GET /users/` - List all users
- `PUT /users/{id}` - Update user details
- `DELETE /users/{id}` - Delete user

**Addresses:**
- `POST /shipping-addresses/` - Create shipping address
- `GET /shipping-addresses/` - List user addresses

### API Response Handling
- All API calls include Bearer token authentication
- Comprehensive error handling with user-friendly messages
- Loading states for better UX
- Automatic retry on network failures
- TypeScript interfaces matching backend schemas

## 🎯 Roadmap

### ✅ Completed
- [x] User Authentication & Authorization
- [x] User Profile Management
- [x] Product Catalog with Real API
- [x] Category Management
- [x] Shopping Cart with Persistent Storage
- [x] Checkout Process
- [x] Stripe Payment Integration
- [x] Order Creation & Management
- [x] Complete Admin Dashboard
- [x] Product Management (CRUD)
- [x] Order Management with Details
- [x] User Management
- [x] Real-time Data Sync
- [x] Image Optimization
- [x] Docker Support

### 🚧 In Progress
- [ ] Advanced Search & Filters
- [ ] Product Reviews & Ratings
- [ ] Wishlist Persistence
- [ ] Email Notifications

### 📋 Planned
- [ ] Delivery Tracking
- [ ] Multi-language Support
- [ ] Customer Support Chat
- [ ] Analytics Dashboard
- [ ] Inventory Management
- [ ] Promotional Campaigns
- [ ] Mobile App (React Native)

## 📚 Documentation

Comprehensive documentation is organized in the **[docs/](./docs/)** directory:

### Documentation Structure
- **[Setup Guide](./docs/setup/)** - Installation, configuration, and deployment
  - `QUICK_START.md` - Get up and running quickly
  - `BACKEND_SETUP_NEEDED.md` - Backend configuration guide
  - `MIGRATION_GUIDE.md` - Migration and upgrade guides
  
- **[API Reference](./docs/api/)** - Complete API documentation
  - `API_DOCUMENTATION.md` - Full API specifications
  - `API_ENDPOINTS_REFERENCE.md` - Endpoint details and examples
  
- **[Stripe Integration](./docs/stripe/)** - Payment processing guides
  - `STRIPE_INTEGRATION_GUIDE.md` - Complete Stripe setup
  - `STRIPE_INTEGRATION_TESTING.md` - Testing payment flows
  
- **[Cart & Checkout](./docs/cart-checkout/)** - Shopping cart documentation
  - `CHECKOUT_INTEGRATION_COMPLETE.md` - Checkout implementation
  - `CART_SYNC_FIXED.md` - Cart synchronization details
  
- **[Authentication](./docs/auth/)** - User authentication guides
  - `AUTH_FIX.md` - Authentication troubleshooting
  - `LOGIN_FIXED.md` - Login implementation details
  
- **[Troubleshooting](./docs/debug/)** - Debug guides and solutions
  - `TROUBLESHOOTING.md` - Common issues and fixes
  - Debug scripts and helpers

## 🧪 Testing

### Running the Development Server
```bash
npm run dev
```

### Building for Production
```bash
npm run build
npm run start
```

### Type Checking
```bash
npx tsc --noEmit
```

### Linting
```bash
npm run lint
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ for modern e-commerce**

*FreshCart - Full-stack e-commerce platform for the digital age*
