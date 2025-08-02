# 🛒 FreshCart - Supermarket E-commerce Boilerplate

A modern, responsive supermarket e-commerce website built with Next.js, TypeScript, and TailwindCSS. Features a beautiful green theme perfect for grocery and fresh produce businesses.

![FreshCart Preview](https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=400&auto=format&fit=crop)

## ✨ Features

### 🎨 Design & UI
- **Green Supermarket Theme** - Fresh, modern design with green color scheme
- **Responsive Design** - Mobile-first approach, works on all devices
- **Modern UI Components** - Built with Radix UI and custom components
- **Smooth Animations** - Framer Motion for delightful interactions
- **Dark Mode Ready** - CSS variables for easy theme switching

### 🛍️ E-commerce Features
- **Product Catalog** - Organized by categories (Produce, Meat, Dairy, etc.)
- **Shopping Cart** - Persistent cart with Zustand state management
- **Product Search** - Search functionality with filters
- **Product Details** - Rich product pages with images and descriptions
- **Wishlist** - Save favorite products
- **Discount System** - Support for sales and discount codes

### 🏪 Supermarket Specific
- **Fresh Produce Focus** - Specialized for grocery and fresh food
- **Organic Products** - Dedicated organic product filtering
- **Weight-based Products** - Support for products sold by weight
- **Nutrition Information** - Product nutrition facts
- **Delivery Options** - Same-day delivery features

### 🔧 Technical Features
- **Next.js 15** - Latest Next.js with App Router
- **TypeScript** - Full type safety
- **TailwindCSS v4** - Modern styling with CSS variables
- **Zustand** - Lightweight state management
- **Responsive Images** - Optimized images with Next.js Image
- **SEO Optimized** - Meta tags and structured data ready

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd freshcart-site
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles with green theme
│   ├── layout.tsx         # Root layout with header/footer
│   └── page.tsx           # Homepage
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── button.tsx     # Button component
│   │   ├── card.tsx       # Card component
│   │   └── badge.tsx      # Badge component
│   ├── layout/            # Layout components
│   │   ├── header.tsx     # Navigation header
│   │   └── footer.tsx     # Site footer
│   ├── home/              # Homepage sections
│   │   ├── hero-section.tsx
│   │   ├── category-grid.tsx
│   │   ├── featured-products.tsx
│   │   └── features-section.tsx
│   └── product/           # Product components
│       └── product-card.tsx
├── data/
│   └── mock-products.ts   # Sample product data
├── lib/
│   └── utils.ts           # Utility functions
├── store/
│   └── cart.ts            # Shopping cart state
└── types/
    └── index.ts           # TypeScript type definitions
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
  /* ... more colors */
}
```

### Adding Products
Update the product data in `src/data/mock-products.ts`:

```typescript
export const mockProducts: Product[] = [
  {
    id: 'your-product-id',
    name: 'Product Name',
    description: 'Product description',
    price: 9.99,
    image: 'https://your-image-url.jpg',
    category: 'Fresh Produce',
    inStock: true,
    isOrganic: true,
    // ... more properties
  }
]
```

### Categories
Modify categories in `src/data/mock-products.ts`:

```typescript
export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Fresh Produce',
    slug: 'produce',
    icon: '🥬',
    productCount: 156
  }
  // ... more categories
]
```

## 🛠️ Built With

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[TailwindCSS v4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Zustand](https://zustand-demo.pmnd.rs/)** - State management
- **[Radix UI](https://www.radix-ui.com/)** - Headless UI components
- **[Heroicons](https://heroicons.com/)** - Beautiful SVG icons
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Lucide React](https://lucide.dev/)** - Icon library

## 📦 Key Dependencies

```json
{
  "@heroicons/react": "^2.2.0",
  "@radix-ui/react-dialog": "^1.1.2",
  "@radix-ui/react-dropdown-menu": "^2.1.2",
  "framer-motion": "^11.15.0",
  "lucide-react": "^0.468.0",
  "zustand": "^5.0.2",
  "tailwind-merge": "^2.5.5",
  "class-variance-authority": "^0.7.1"
}
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy automatically

### Other Platforms
```bash
npm run build
npm run start
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://your-api-url.com

# Payment Integration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Image Domains
External images are configured in `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Add your image domains here
    ],
  },
}
```

## 📱 Features Overview

### Homepage
- **Hero Carousel** - Rotating promotional banners
- **Category Grid** - Visual category navigation
- **Featured Products** - Highlighted products
- **Features Section** - Key selling points

### Product Features
- **Product Cards** - Rich product display with images, prices, ratings
- **Badges** - Organic, Fresh, Sale indicators
- **Add to Cart** - One-click shopping cart integration
- **Wishlist** - Save favorites functionality

### Shopping Cart
- **Persistent Storage** - Cart persists across sessions
- **Quantity Management** - Easy quantity updates
- **Price Calculation** - Automatic totals with tax and delivery
- **Discount Codes** - Promotional code support

## 🎯 Roadmap

- [ ] User Authentication
- [ ] Checkout Process
- [ ] Payment Integration
- [ ] Order Management
- [ ] Admin Dashboard
- [ ] Inventory Management
- [ ] Customer Reviews
- [ ] Search & Filters
- [ ] Delivery Tracking
- [ ] Multi-language Support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💡 Support

If you find this boilerplate helpful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 🤝 Contributing to the project

---

**Built with ❤️ for the supermarket and grocery industry**
