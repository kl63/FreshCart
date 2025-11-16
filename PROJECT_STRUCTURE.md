# FreshCart Project Structure

Clean, organized project structure for the FreshCart e-commerce platform.

## 📁 Root Directory

```
freshcart-site/
├── docs/                   # Documentation (26 files organized by topic)
├── scripts/                # Test and debug scripts
├── src/                    # Source code
│   ├── app/               # Next.js App Router pages
│   ├── components/        # React components
│   ├── data/              # Mock data and constants
│   ├── lib/               # Utility functions
│   ├── store/             # Zustand state management
│   └── types/             # TypeScript type definitions
├── public/                # Public static assets (empty - using external CDN)
├── .env.local            # Environment variables (git-ignored)
├── README.md             # Main project documentation
└── package.json          # Dependencies and scripts
```

## 📚 Documentation Structure

```
docs/
├── README.md              # Documentation index
├── api/                   # API documentation (2 files)
├── auth/                  # Authentication guides (2 files)
├── cart-checkout/         # Cart & checkout flow (4 files)
├── debug/                 # Troubleshooting guides (5 files)
├── setup/                 # Setup & integration (4 files)
└── stripe/                # Stripe payment integration (8 files)
```

## 🔧 Scripts & Tools

```
scripts/
├── README.md                      # Scripts documentation
├── test-network.js               # Network testing
├── test-stripe-integration.js    # Stripe testing
└── test-api.html                 # API testing interface
```

## 🗂️ Source Code Organization

### App Directory (Next.js 15)
```
src/app/
├── globals.css            # Global styles
├── layout.tsx            # Root layout
├── page.tsx              # Homepage
├── products/             # Product pages
├── cart/                 # Shopping cart
├── checkout/             # Checkout flow
├── search/               # Search functionality
├── auth/                 # Authentication pages
├── order/                # Order pages
└── api/                  # API routes (Next.js)
```

### Components
```
src/components/
├── ui/                   # Reusable UI components
│   ├── button.tsx
│   ├── card.tsx
│   ├── badge.tsx
│   └── ...
├── layout/               # Layout components
│   ├── header.tsx
│   └── footer.tsx
├── home/                 # Homepage sections
│   ├── hero-section.tsx
│   ├── category-grid.tsx
│   ├── featured-products.tsx
│   └── features-section.tsx
└── product/              # Product components
    └── product-card.tsx
```

### State Management
```
src/store/
└── cart.ts              # Shopping cart state (Zustand)
```

### Type Definitions
```
src/types/
└── index.ts             # TypeScript interfaces
```

### Utilities & Services
```
src/lib/
├── utils.ts             # Helper functions
├── products.ts          # Product API calls
├── categories.ts        # Category API calls
└── stripe.ts            # Stripe integration
```

## 🚫 Ignored Files

The following are ignored in `.gitignore`:
- `node_modules/` - Dependencies
- `.next/` - Build output
- `.env*` - Environment variables
- `*.log` - Log files
- `.DS_Store` - macOS metadata

## ✅ Clean Project Checklist

- [x] Documentation organized in `/docs`
- [x] Test scripts in `/scripts`
- [x] No example files in root
- [x] No temporary/debug files
- [x] No unused assets in `/public`
- [x] Clean source code structure
- [x] Proper `.gitignore` configuration

## 📊 Project Stats

- **Total Documentation**: 26 markdown files
- **Main Components**: ~20 React components
- **API Routes**: 2 Next.js API routes
- **Pages**: 10+ dynamic routes
- **Dependencies**: See `package.json`

## 🎯 Development Workflow

1. **Documentation**: Check `/docs` for guides
2. **Development**: Work in `/src`
3. **Testing**: Use scripts in `/scripts`
4. **Build**: `npm run build`
5. **Deploy**: Automated via Vercel

---

**Last Updated**: November 2024  
**Status**: Production Ready ✅
