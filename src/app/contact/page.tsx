'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
    alert('Thank you for your message! We\'ll get back to you soon.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="space-y-8">
              {/* Customer Service */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="text-2xl mr-3">📞</span>
                    Customer Service
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Need help with your order or have questions about our products?
                  </p>
                  <div className="space-y-2">
                    <p className="font-medium">Phone: (555) 123-4567</p>
                    <p className="font-medium">Email: support@freshcart.com</p>
                    <p className="text-sm text-gray-600">
                      Monday - Friday: 8AM - 8PM<br />
                      Saturday - Sunday: 9AM - 6PM
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Store Location */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="text-2xl mr-3">📍</span>
                    Store Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Visit our flagship store for the full FreshCart experience.
                  </p>
                  <div className="space-y-2">
                    <p className="font-medium">
                      123 Fresh Market Street<br />
                      Grocery District<br />
                      Anytown, ST 12345
                    </p>
                    <p className="text-sm text-gray-600">
                      Store Hours:<br />
                      Daily: 7AM - 10PM
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Business Inquiries */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="text-2xl mr-3">💼</span>
                    Business Inquiries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Interested in partnering with us or bulk orders?
                  </p>
                  <div className="space-y-2">
                    <p className="font-medium">Email: business@freshcart.com</p>
                    <p className="font-medium">Phone: (555) 123-4568</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select a subject</option>
                      <option value="order-inquiry">Order Inquiry</option>
                      <option value="product-question">Product Question</option>
                      <option value="delivery-issue">Delivery Issue</option>
                      <option value="account-help">Account Help</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="newsletter"
                      className="mr-2"
                    />
                    <label htmlFor="newsletter" className="text-sm text-gray-600">
                      I&apos;d like to receive updates about new products and special offers
                    </label>
                  </div>

                  <Button type="submit" className="w-full md:w-auto">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      What are your delivery hours?
                    </h4>
                    <p className="text-gray-600 text-sm">
                      We deliver Monday through Sunday from 8AM to 8PM. Same-day delivery 
                      is available for orders placed before 2PM.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Do you offer organic products?
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Yes! We have a wide selection of certified organic produce, dairy, 
                      and pantry items. Look for the &ldquo;Organic&rdquo; badge on product pages.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      What&apos;s your return policy?
                    </h4>
                    <p className="text-gray-600 text-sm">
                      We guarantee the freshness and quality of all our products. If you&apos;re 
                      not satisfied, contact us within 24 hours for a full refund or replacement.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      How can I track my order?
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Once your order is confirmed, you&apos;ll receive a tracking link via email 
                      and SMS. You can also track your order in your account dashboard.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
