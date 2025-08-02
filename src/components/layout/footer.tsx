import Link from 'next/link'

const footerNavigation = {
  shop: [
    { name: 'Fresh Produce', href: '/categories/produce' },
    { name: 'Meat & Seafood', href: '/categories/meat-seafood' },
    { name: 'Dairy & Eggs', href: '/categories/dairy' },
    { name: 'Bakery', href: '/categories/bakery' },
    { name: 'Organic', href: '/categories/organic' },
  ],
  account: [
    { name: 'My Account', href: '/account' },
    { name: 'Order History', href: '/orders' },
    { name: 'Track Order', href: '/track' },
    { name: 'Delivery Info', href: '/delivery' },
    { name: 'Returns', href: '/returns' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Store Locations', href: '/stores' },
    { name: 'Sustainability', href: '/sustainability' },
    { name: 'Press', href: '/press' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQs', href: '/faq' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Privacy Policy', href: '/privacy' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter signup */}
      <div className="bg-green-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Fresh with FreshCart</h3>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              Get exclusive deals, fresh recipes, and be the first to know about new organic arrivals.
            </p>
            <div className="max-w-md mx-auto flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              <button className="bg-green-800 hover:bg-green-900 px-6 py-3 rounded-r-lg font-semibold transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🛒</span>
              </div>
              <span className="text-2xl font-bold text-green-400">FreshCart</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted partner for fresh, quality groceries delivered right to your doorstep.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-400">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323C5.902 8.198 7.053 7.708 8.35 7.708s2.448.49 3.323 1.297c.876.807 1.366 1.958 1.366 3.255s-.49 2.448-1.297 3.323c-.876.876-2.027 1.366-3.324 1.366zm7.718 0c-1.297 0-2.448-.49-3.323-1.297-.876-.807-1.366-1.958-1.366-3.255s.49-2.448 1.297-3.323c.876-.876 2.027-1.366 3.324-1.366s2.448.49 3.323 1.297c.876.807 1.366 1.958 1.366 3.255s-.49 2.448-1.297 3.323c-.876.876-2.027 1.366-3.324 1.366z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              {footerNavigation.shop.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-400 hover:text-green-400 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Account</h3>
            <ul className="space-y-2">
              {footerNavigation.account.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-400 hover:text-green-400 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerNavigation.company.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-400 hover:text-green-400 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerNavigation.support.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-400 hover:text-green-400 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <span className="text-gray-400">We accept:</span>
              <div className="flex space-x-2">
                <div className="w-8 h-5 bg-gray-700 rounded"></div>
                <div className="w-8 h-5 bg-gray-700 rounded"></div>
                <div className="w-8 h-5 bg-gray-700 rounded"></div>
                <div className="w-8 h-5 bg-gray-700 rounded"></div>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <Link href="/terms" className="hover:text-green-400">Terms of Service</Link>
              <Link href="/privacy" className="hover:text-green-400">Privacy Policy</Link>
              <span>&copy; 2024 FreshCart. All rights reserved.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
