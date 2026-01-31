import { useState } from 'react'

function Menu() {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { name: 'Home', href: '#', active: true },
    { name: 'Products', href: '#' },
    { name: 'About', href: '#' },
    { name: 'Contact', href: '#' },
  ]

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">ItemFits AI</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`${
                    item.active
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-150`}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150">
              Get Started
            </button>
          </div>
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`${
                  item.active
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-150`}
              >
                {item.name}
              </a>
            ))}
            <div className="pt-4 pb-3">
              <button className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150">
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Menu

