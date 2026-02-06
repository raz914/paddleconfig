// Pricing configuration for paddle court configurator
// All prices in USD

const PRICING = {
  BASE_PRICE: 25000,

  VIEW_TYPES: {
    default: 0,
    panoramic: 5000
  },

  TRACK_COLORS: {
    blue: 0,
    white: 0,
    lightgray: 0,
    darkgray: 0,
    black: 0
  },

  TURF_COLORS: {
    default: 0,
    green: 0,
    lime: 1500,
    brown: 1500
  },

  GLASS_TINTS: {
    clear: 0,
    blue: 2000,
    green: 2000,
    smoke: 2000
  }
}

/**
 * Calculate total price based on configuration
 * @param {Object} config - Configuration object
 * @param {string} config.viewType - Selected view type (default/panoramic)
 * @param {string} config.trackColor - Selected track color
 * @param {string} config.turfColor - Selected turf color
 * @param {string} config.glassTint - Selected glass tint
 * @returns {number} Total price in USD
 */
export function calculatePrice(config) {
  const { viewType = 'default', trackColor = 'black', turfColor = 'default', glassTint = 'clear' } = config

  let total = PRICING.BASE_PRICE

  // Add view type cost
  total += PRICING.VIEW_TYPES[viewType] || 0

  // Add track color cost
  total += PRICING.TRACK_COLORS[trackColor] || 0

  // Add turf color cost
  total += PRICING.TURF_COLORS[turfColor] || 0

  // Add glass tint cost
  total += PRICING.GLASS_TINTS[glassTint] || 0

  return total
}

/**
 * Get itemized price breakdown
 * @param {Object} config - Configuration object
 * @returns {Array} Array of line items with name and price
 */
export function getPriceBreakdown(config) {
  const { viewType = 'default', trackColor = 'black', turfColor = 'default', glassTint = 'clear' } = config

  const breakdown = [
    {
      name: 'Base Paddle Court',
      price: PRICING.BASE_PRICE,
      included: true
    }
  ]

  // View type
  const viewCost = PRICING.VIEW_TYPES[viewType] || 0
  breakdown.push({
    name: `${viewType === 'default' ? 'Classic' : viewType.charAt(0).toUpperCase() + viewType.slice(1)} View`,
    price: viewCost,
    included: viewCost === 0
  })

  // Track colour
  const trackCost = PRICING.TRACK_COLORS[trackColor] || 0
  breakdown.push({
    name: `Track Colour: ${trackColor.charAt(0).toUpperCase() + trackColor.slice(1)}`,
    price: trackCost,
    included: trackCost === 0
  })

  // Turf colour
  const turfCost = PRICING.TURF_COLORS[turfColor] || 0
  breakdown.push({
    name: `Turf Colour: ${turfColor === 'default' ? 'Classic' : turfColor.charAt(0).toUpperCase() + turfColor.slice(1)}`,
    price: turfCost,
    included: turfCost === 0
  })

  // Glass tint
  const glassCost = PRICING.GLASS_TINTS[glassTint] || 0
  breakdown.push({
    name: `Glass Tint: ${glassTint.charAt(0).toUpperCase() + glassTint.slice(1)}`,
    price: glassCost,
    included: glassCost === 0
  })

  return breakdown
}

/**
 * Format price for display
 * @param {number} price - Price in USD
 * @returns {string} Formatted price string
 */
export function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}
