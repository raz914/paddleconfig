// EmailJS Configuration
// Replace these values with your actual EmailJS credentials
// Get them from: https://dashboard.emailjs.com/

export const EMAILJS_CONFIG = {
  // Your EmailJS Service ID (e.g., 'service_abc123')
  SERVICE_ID: 'service_6ixxo0a',

  // Your EmailJS Template ID
  TEMPLATE_ID: 'template_y5e70fo',

  // Your EmailJS Public Key (e.g., 'your_public_key_here')
  PUBLIC_KEY: '_BtOrONYmJwrltx_-'
}

/**
 * Format quote data for EmailJS template
 * @param {Object} formData - Form data from user
 * @param {Object} config - Configuration selections
 * @param {Array} breakdown - Price breakdown
 * @param {number} total - Total price
 * @returns {Object} Formatted template parameters
 */
export function formatEmailParams(formData, config, breakdown, total) {
  // Format breakdown as HTML list
  const breakdownHTML = breakdown.map(item => {
    const priceDisplay = item.included
      ? 'Included'
      : `+$${item.price.toLocaleString()}`
    return `<li>${item.name}: <strong>${priceDisplay}</strong></li>`
  }).join('')

  return {
    // Customer information
    customer_name: formData.name,
    customer_email: formData.email,
    email: formData.email, // Added alias to match screenshot parameter
    customer_phone: formData.phone,
    customer_company: formData.company || 'N/A',

    // Configuration details
    view_type: config.viewType,
    track_color: config.trackColor,
    turf_color: config.turfColor,
    glass_tint: config.glassTint,

    // Pricing
    price_breakdown: breakdownHTML,
    total_price: `$${total.toLocaleString()}`,

    // Additional info
    date: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}

// Email template HTML structure guide:
// 
// You'll need to create a template in EmailJS with these variables:
// - {{customer_name}}
// - {{customer_email}}
// - {{customer_phone}}
// - {{customer_company}}
// - {{view_type}}
// - {{track_color}}
// - {{turf_color}}
// - {{glass_tint}}
// - {{price_breakdown}} (HTML list)
// - {{total_price}}
// - {{date}}
//
// Example template HTML:
/*
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
    <h1 style="color: white; margin: 0;">Paddle Court Quote Request</h1>
  </div>
  
  <div style="padding: 30px; background: #f9fafb;">
    <h2 style="color: #1f2937;">Customer Information</h2>
    <p><strong>Name:</strong> {{customer_name}}</p>
    <p><strong>Email:</strong> {{customer_email}}</p>
    <p><strong>Phone:</strong> {{customer_phone}}</p>
    <p><strong>Company:</strong> {{customer_company}}</p>
    
    <h2 style="color: #1f2937; margin-top: 30px;">Configuration</h2>
    <p><strong>View Type:</strong> {{view_type}}</p>
    <p><strong>Track Color:</strong> {{track_color}}</p>
    <p><strong>Turf Color:</strong> {{turf_color}}</p>
    <p><strong>Glass Tint:</strong> {{glass_tint}}</p>
    
    <h2 style="color: #1f2937; margin-top: 30px;">Price Breakdown</h2>
    <ul style="list-style: none; padding: 0;">
      {{{price_breakdown}}}
    </ul>
    
    <div style="background: #667eea; color: white; padding: 20px; text-align: center; margin-top: 20px; border-radius: 8px;">
      <h2 style="margin: 0;">Total Price: {{total_price}}</h2>
    </div>
    
    <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
      Date: {{date}}
    </p>
  </div>
  
  <div style="background: #1f2937; color: white; padding: 20px; text-align: center;">
    <p style="margin: 0;">Lofthouse Padel Court Specialists</p>
    <p style="margin: 5px 0 0 0; font-size: 14px;">We'll be in touch soon!</p>
  </div>
</div>
*/
