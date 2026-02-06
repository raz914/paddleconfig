import { useState } from 'react'
import emailjs from '@emailjs/browser'
import { calculatePrice, getPriceBreakdown, formatPrice } from '../utils/pricing'
import { EMAILJS_CONFIG, formatEmailParams } from '../utils/emailConfig'

function QuoteModal({ isOpen, onClose, configuration }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: ''
    })
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState(null) // 'success' | 'error' | null

    // Calculate pricing
    const totalPrice = calculatePrice(configuration)
    const breakdown = getPriceBreakdown(configuration)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        // Clear error for this field when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required'
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email'
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required'
        } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsSubmitting(true)
        setSubmitStatus(null)

        try {
            // Format email parameters
            const emailParams = formatEmailParams(formData, configuration, breakdown, totalPrice)

            console.log('Sending quote with config:', {
                serviceId: EMAILJS_CONFIG.SERVICE_ID,
                templateId: EMAILJS_CONFIG.TEMPLATE_ID,
                publicKey: EMAILJS_CONFIG.PUBLIC_KEY,
                params: emailParams
            })

            // Send email via EmailJS
            await emailjs.send(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.TEMPLATE_ID,
                emailParams,
                EMAILJS_CONFIG.PUBLIC_KEY
            )

            setSubmitStatus('success')

            // Reset form after 2 seconds and close modal
            setTimeout(() => {
                setFormData({ name: '', email: '', phone: '', company: '' })
                setSubmitStatus(null)
                onClose()
            }, 3000)

        } catch (error) {
            console.error('Error sending quote:', error)
            setSubmitStatus('error')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="shrink-0 bg-gradient-to-r from-[#ba975d] to-[#9e7f4a] text-white p-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Get Your Quote</h2>
                            <p className="text-white/90">Custom Paddle Court Configuration</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white transition-colors"
                            disabled={isSubmitting}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
                    <div className="p-8">
                        {/* Success Message */}
                        {submitStatus === 'success' && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <h3 className="font-semibold text-green-900">Quote Sent Successfully!</h3>
                                        <p className="text-sm text-green-700">We'll get back to you shortly.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {submitStatus === 'error' && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <h3 className="font-semibold text-red-900">Failed to Send Quote</h3>
                                        <p className="text-sm text-red-700">Please try again or contact us directly.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Configuration Summary */}
                        <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Configuration</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600">View Type:</span>
                                    <span className="ml-2 font-medium text-gray-900 capitalize">{configuration.viewType === 'default' ? 'Classic' : configuration.viewType}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Track Colour:</span>
                                    <span className="ml-2 font-medium text-gray-900 capitalize">{configuration.trackColor}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Turf Colour:</span>
                                    <span className="ml-2 font-medium text-gray-900 capitalize">{configuration.turfColor === 'default' ? 'Classic' : configuration.turfColor}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Glass Tint:</span>
                                    <span className="ml-2 font-medium text-gray-900 capitalize">{configuration.glassTint}</span>
                                </div>
                            </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Breakdown</h3>
                            <div className="space-y-2">
                                {breakdown.map((item, index) => (
                                    <div key={index} className="flex justify-between text-sm">
                                        <span className="text-gray-700">{item.name}</span>
                                        <span className={`font-medium ${item.included ? 'text-gray-500' : 'text-blue-600'}`}>
                                            {item.included ? 'Included' : `+${formatPrice(item.price)}`}
                                        </span>
                                    </div>
                                ))}
                                <div className="border-t border-blue-200 pt-3 mt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-900">Total Price</span>
                                        <span className="text-2xl font-bold text-blue-600">{formatPrice(totalPrice)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Information</h3>

                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.name ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="John Doe"
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="john@example.com"
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                            </div>

                            {/* Phone */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="+1 (555) 123-4567"
                                />
                                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                            </div>

                            {/* Company (Optional) */}
                            <div>
                                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                                    Company <span className="text-gray-400">(Optional)</span>
                                </label>
                                <input
                                    type="text"
                                    id="company"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="Your Company Name"
                                />
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#ba975d] to-[#9e7f4a] text-white rounded-lg font-medium hover:from-[#a88652] hover:to-[#8c6f40] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            Send Quote Request
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Footer with Logo */}
                    <div className="bg-gray-50 px-8 py-6 rounded-b-2xl border-t border-gray-200">
                        <div className="flex items-center justify-center gap-3">
                            <img
                                src="/logo-lofthouse.png"
                                alt="Lofthouse Padel Court Specialists"
                                className="h-12 object-contain"
                            />
                        </div>
                        <p className="text-center text-sm text-gray-500 mt-2">
                            We'll review your quote and get back to you within 24 hours
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuoteModal
