import React, { useRef, useState, useEffect } from 'react';
import Header from '../components/Header';
import '../App.css';

const HomePage = () => {
  const homeRef = useRef(null);
  const projectsRef = useRef(null);
  const servicesRef = useRef(null);
  const pricingRef = useRef(null);
  const contactRef = useRef(null);
  const [activeSection, setActiveSection] = useState('home');
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    subject: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'
  const [submitMessage, setSubmitMessage] = useState('');
  
  // Pricing modal state
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [pricingFormData, setPricingFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [pricingFormErrors, setPricingFormErrors] = useState({});
  const [isPricingSubmitting, setIsPricingSubmitting] = useState(false);
  const [pricingSubmitStatus, setPricingSubmitStatus] = useState(null);
  const [pricingSubmitMessage, setPricingSubmitMessage] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: 'home', ref: homeRef },
        { id: 'projects', ref: projectsRef },
        { id: 'services', ref: servicesRef },
        { id: 'pricing', ref: pricingRef },
        { id: 'contact', ref: contactRef },
      ];

      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const section of sections) {
        if (section.ref.current) {
          const { offsetTop, offsetHeight } = section.ref.current;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous status
    setSubmitStatus(null);
    setSubmitMessage('');
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/.netlify/functions/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage(data.message || 'Thank you for contacting us! We will get back to you soon.');
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          subject: '',
          message: ''
        });
        setFormErrors({});
      } else {
        setSubmitStatus('error');
        setSubmitMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setSubmitMessage('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pricing modal handlers
  const openPricingModal = (plan) => {
    setSelectedPlan(plan);
    setIsPricingModalOpen(true);
    setPricingSubmitStatus(null);
    setPricingSubmitMessage('');
  };

  const closePricingModal = () => {
    setIsPricingModalOpen(false);
    setSelectedPlan('');
    setPricingFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      message: ''
    });
    setPricingFormErrors({});
    setPricingSubmitStatus(null);
    setPricingSubmitMessage('');
  };

  const handlePricingInputChange = (e) => {
    const { name, value } = e.target;
    setPricingFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (pricingFormErrors[name]) {
      setPricingFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validatePricingForm = () => {
    const errors = {};
    
    if (!pricingFormData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!pricingFormData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pricingFormData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!pricingFormData.phone.trim()) {
      errors.phone = 'Phone is required';
    }
    
    return errors;
  };

  const handlePricingSubmit = async (e) => {
    e.preventDefault();
    
    setPricingSubmitStatus(null);
    setPricingSubmitMessage('');
    
    const errors = validatePricingForm();
    if (Object.keys(errors).length > 0) {
      setPricingFormErrors(errors);
      return;
    }
    
    setIsPricingSubmitting(true);
    
    try {
      const response = await fetch('/.netlify/functions/pricing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...pricingFormData,
          plan: selectedPlan
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setPricingSubmitStatus('success');
        setPricingSubmitMessage(data.message || 'Thank you for your interest! Our team will contact you soon.');
        // Reset form after 2 seconds and close modal
        setTimeout(() => {
          closePricingModal();
        }, 2000);
      } else {
        setPricingSubmitStatus('error');
        setPricingSubmitMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting pricing form:', error);
      setPricingSubmitStatus('error');
      setPricingSubmitMessage('Failed to send request. Please try again later.');
    } finally {
      setIsPricingSubmitting(false);
    }
  };

  const scrollToSection = (sectionId) => {
    const refs = {
      home: homeRef,
      projects: projectsRef,
      services: servicesRef,
      pricing: pricingRef,
      contact: contactRef,
    };

    if (refs[sectionId]?.current) {
      refs[sectionId].current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Header onNavClick={scrollToSection} activeSection={activeSection} />

      {/* Pricing Modal */}
      {isPricingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeInUp" style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(5px)' }} onClick={closePricingModal}>
          <div className="relative w-full max-w-2xl rounded-2xl p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)', border: '2px solid rgba(77, 138, 201, 0.3)' }} onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button 
              onClick={closePricingModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition z-10"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#1d283a' }}>
              {selectedPlan === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
            </h3>
            <p className="mb-6" style={{ color: '#4a5f77' }}>
              {selectedPlan} Plan - Fill in your details and we'll get back to you
            </p>

            {pricingSubmitStatus && (
              <div className={`mb-4 p-4 rounded-lg ${pricingSubmitStatus === 'success' ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`}>
                <p className="text-sm">{pricingSubmitMessage}</p>
              </div>
            )}

            <form onSubmit={handlePricingSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#1d283a' }}>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={pricingFormData.name}
                    onChange={handlePricingInputChange}
                    className="w-full px-4 py-2.5 rounded-lg focus:outline-none transition duration-300"
                    placeholder="John Doe"
                    style={{ backgroundColor: '#f5f7fa', color: '#1d283a', border: `1px solid ${pricingFormErrors.name ? '#ef4444' : '#e0e7ff'}` }}
                  />
                  {pricingFormErrors.name && (
                    <p className="text-red-600 text-xs mt-1">{pricingFormErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#1d283a' }}>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={pricingFormData.email}
                    onChange={handlePricingInputChange}
                    className="w-full px-4 py-2.5 rounded-lg focus:outline-none transition duration-300"
                    placeholder="john@example.com"
                    style={{ backgroundColor: '#f5f7fa', color: '#1d283a', border: `1px solid ${pricingFormErrors.email ? '#ef4444' : '#e0e7ff'}` }}
                  />
                  {pricingFormErrors.email && (
                    <p className="text-red-600 text-xs mt-1">{pricingFormErrors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#1d283a' }}>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={pricingFormData.phone}
                    onChange={handlePricingInputChange}
                    className="w-full px-4 py-2.5 rounded-lg focus:outline-none transition duration-300"
                    placeholder="+91 1234567890"
                    style={{ backgroundColor: '#f5f7fa', color: '#1d283a', border: `1px solid ${pricingFormErrors.phone ? '#ef4444' : '#e0e7ff'}` }}
                  />
                  {pricingFormErrors.phone && (
                    <p className="text-red-600 text-xs mt-1">{pricingFormErrors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#1d283a' }}>Company (Optional)</label>
                  <input
                    type="text"
                    name="company"
                    value={pricingFormData.company}
                    onChange={handlePricingInputChange}
                    className="w-full px-4 py-2.5 rounded-lg focus:outline-none transition duration-300"
                    placeholder="Your Company Name"
                    style={{ backgroundColor: '#f5f7fa', color: '#1d283a', border: '1px solid #e0e7ff' }}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2" style={{ color: '#1d283a' }}>Message (Optional)</label>
                <textarea
                  name="message"
                  value={pricingFormData.message}
                  onChange={handlePricingInputChange}
                  rows="3"
                  className="w-full px-4 py-2.5 rounded-lg focus:outline-none transition duration-300 resize-none"
                  placeholder="Any specific requirements..."
                  style={{ backgroundColor: '#f5f7fa', color: '#1d283a', border: '1px solid #e0e7ff' }}
                />
              </div>

              <button
                type="submit"
                disabled={isPricingSubmitting}
                className="w-full text-white font-bold py-3 rounded-lg transition duration-300 transform hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #4d8ac9 0%, #3a6ba5 100%)' }}
              >
                {isPricingSubmitting ? 'Submitting...' : 'Submit Request →'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Home Section */}
      <section ref={homeRef} className="relative min-h-screen flex items-center justify-center text-white overflow-hidden" style={{ background: 'linear-gradient(135deg, #1d283a 0%, #2d3e52 50%, #1a2332 100%)' }}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full filter blur-3xl animate-blob" style={{ background: 'radial-gradient(circle, rgba(77, 138, 201, 0.6) 0%, transparent 70%)' }}></div>
          <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full filter blur-3xl animate-blob" style={{ animationDelay: '2s', background: 'radial-gradient(circle, rgba(99, 160, 223, 0.5) 0%, transparent 70%)' }}></div>
          <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full filter blur-3xl animate-blob" style={{ animationDelay: '4s', background: 'radial-gradient(circle, rgba(60, 100, 142, 0.6) 0%, transparent 70%)' }}></div>
        </div>

        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>

        {/* Content */}
        <div className="text-center relative z-10 px-4 md:px-8 animate-fadeInUp">
          <div className="mb-4 md:mb-6 inline-block px-4 md:px-6 py-2 rounded-full" style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <span className="text-xs md:text-sm font-semibold tracking-wide">🚀 PROFESSIONAL WEB SOLUTIONS</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 md:mb-6 drop-shadow-2xl" style={{ background: 'linear-gradient(to right, #ffffff, #e0e7ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>ShopHubSolutions</h1>
          <p className="text-xl sm:text-2xl md:text-3xl mb-4 md:mb-6 font-bold drop-shadow-md px-4" style={{ color: '#b0c4de' }}>Premier E-commerce Solutions for Sellers</p>
          <p className="text-base md:text-lg max-w-3xl mx-auto drop-shadow-md leading-relaxed mb-6 md:mb-10 px-4" style={{ color: '#d4dfe8' }}>
            We provide comprehensive e-commerce solutions for saree sellers, dress sellers, and other retailers. Build your online presence with ShopHubSolutions and scale your business globally.
          </p>
          <div className="flex justify-center gap-3 md:gap-4 flex-wrap px-4">
            <button className="px-6 md:px-8 py-3 md:py-4 font-bold rounded-full transform hover:scale-105 transition duration-300 shadow-2xl text-sm md:text-base" style={{ background: 'linear-gradient(135deg, #4d8ac9 0%, #3a6ba5 100%)', color: '#ffffff' }}>
              Get Started →
            </button>
            <button className="px-6 md:px-8 py-3 md:py-4 font-bold rounded-full transform hover:scale-105 transition duration-300 text-sm md:text-base" style={{ backgroundColor: 'transparent', color: '#ffffff', border: '2px solid rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(10px)' }}>
              View Services
            </button>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="#f5f7fa"/>
          </svg>
        </div>
      </section>

      {/* Projects Section */}
      <section ref={projectsRef} className="min-h-screen py-12 md:py-20 px-4 md:px-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #f0f4f8 0%, #e8ecf1 50%, #dce4ec 100%)' }}>
        {/* Animated Background Elements */}
        <div className="absolute top-20 right-0 w-96 h-96 rounded-full filter blur-3xl opacity-30" style={{ background: 'radial-gradient(circle, rgba(77, 138, 201, 0.4) 0%, transparent 70%)' }}></div>
        <div className="absolute bottom-20 left-0 w-96 h-96 rounded-full filter blur-3xl opacity-30" style={{ background: 'radial-gradient(circle, rgba(58, 107, 165, 0.4) 0%, transparent 70%)' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full filter blur-3xl opacity-20" style={{ background: 'radial-gradient(circle, rgba(99, 160, 223, 0.3) 0%, transparent 70%)', transform: 'translate(-50%, -50%)' }}></div>
        
        {/* Decorative Dots Pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #1d283a 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-3 md:mb-4 animate-slideInFromLeft px-4" style={{ color: '#1d283a' }}>Solutions We Offer</h2>
          <p className="text-center mb-8 md:mb-12 text-base md:text-lg px-4" style={{ color: '#4a5f77' }}>Specialized e-commerce solutions tailored for different business types</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Solution Card 1 */}
            <div className="rounded-2xl shadow-xl p-8 hover:shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition duration-300 animate-fadeInUp" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)', border: '2px solid rgba(77, 138, 201, 0.2)', boxShadow: '0 10px 30px rgba(29, 40, 58, 0.1)' }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #4d8ac9 0%, #3a6ba5 100%)', boxShadow: '0 4px 15px rgba(77, 138, 201, 0.3)' }}>
                <span className="text-2xl">👗</span>
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#1d283a' }}>Fashion & Apparel</h3>
              <p className="leading-relaxed" style={{ color: '#4a5f77' }}>
                Comprehensive solutions for fashion retailers including product catalogs, size management, color variations, and trend-based inventory management.
              </p>
            </div>

            {/* Solution Card 2 */}
            <div className="rounded-2xl shadow-xl p-8 hover:shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition duration-300 animate-fadeInUp" style={{ animationDelay: '0.1s', background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)', border: '2px solid rgba(77, 138, 201, 0.2)', boxShadow: '0 10px 30px rgba(29, 40, 58, 0.1)' }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #4d8ac9 0%, #3a6ba5 100%)', boxShadow: '0 4px 15px rgba(77, 138, 201, 0.3)' }}>
                <span className="text-2xl">🛍️</span>
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#1d283a' }}>Multi-Brand Retail</h3>
              <p className="leading-relaxed" style={{ color: '#4a5f77' }}>
                Unified platform for managing multiple product categories, vendor management, cross-seller promotions, and centralized order fulfillment.
              </p>
            </div>

            {/* Solution Card 3 */}
            <div className="rounded-2xl shadow-xl p-8 hover:shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition duration-300 animate-fadeInUp" style={{ animationDelay: '0.2s', background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)', border: '2px solid rgba(77, 138, 201, 0.2)', boxShadow: '0 10px 30px rgba(29, 40, 58, 0.1)' }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #4d8ac9 0%, #3a6ba5 100%)', boxShadow: '0 4px 15px rgba(77, 138, 201, 0.3)' }}>
                <span className="text-2xl">🏪</span>
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#1d283a' }}>Marketplace Platform</h3>
              <p className="leading-relaxed" style={{ color: '#4a5f77' }}>
                Scalable marketplace ecosystem enabling multiple sellers to operate independently while maintaining unified payment and logistics management.
              </p>
            </div>

            {/* Solution Card 4 */}
            <div className="rounded-2xl shadow-xl p-8 hover:shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition duration-300 animate-fadeInUp" style={{ animationDelay: '0.3s', background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)', border: '2px solid rgba(77, 138, 201, 0.2)', boxShadow: '0 10px 30px rgba(29, 40, 58, 0.1)' }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #4d8ac9 0%, #3a6ba5 100%)', boxShadow: '0 4px 15px rgba(77, 138, 201, 0.3)' }}>
                <span className="text-2xl">🏭</span>
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#1d283a' }}>B2B E-commerce</h3>
              <p className="leading-relaxed" style={{ color: '#4a5f77' }}>
                Wholesale and bulk ordering platforms with tiered pricing, bulk purchase discounts, order history tracking, and supplier management features.
              </p>
            </div>

            {/* Solution Card 5 */}
            <div className="rounded-2xl shadow-xl p-8 hover:shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition duration-300 animate-fadeInUp" style={{ animationDelay: '0.4s', background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)', border: '2px solid rgba(77, 138, 201, 0.2)', boxShadow: '0 10px 30px rgba(29, 40, 58, 0.1)' }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #4d8ac9 0%, #3a6ba5 100%)', boxShadow: '0 4px 15px rgba(77, 138, 201, 0.3)' }}>
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#1d283a' }}>Subscription & Membership</h3>
              <p className="leading-relaxed" style={{ color: '#4a5f77' }}>
                Recurring billing platforms for subscription boxes, memberships, SaaS products with flexible billing cycles and customer portal management.
              </p>
            </div>

            {/* Solution Card 6 */}
            <div className="rounded-2xl shadow-xl p-8 hover:shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition duration-300 animate-fadeInUp" style={{ animationDelay: '0.5s', background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)', border: '2px solid rgba(77, 138, 201, 0.2)', boxShadow: '0 10px 30px rgba(29, 40, 58, 0.1)' }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #4d8ac9 0%, #3a6ba5 100%)', boxShadow: '0 4px 15px rgba(77, 138, 201, 0.3)' }}>
                <span className="text-2xl">💿</span>
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#1d283a' }}>Digital Products Store</h3>
              <p className="leading-relaxed" style={{ color: '#4a5f77' }}>
                Platform for selling digital products such as ebooks, courses, templates, plugins with instant delivery and license management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section ref={servicesRef} className="min-h-screen py-12 md:py-20 px-4 md:px-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #dce4ec 0%, #e8ecf1 50%, #f0f4f8 100%)' }}>
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-0 w-96 h-96 rounded-full filter blur-3xl opacity-30" style={{ background: 'radial-gradient(circle, rgba(77, 138, 201, 0.4) 0%, transparent 70%)' }}></div>
        <div className="absolute bottom-20 right-0 w-96 h-96 rounded-full filter blur-3xl opacity-30" style={{ background: 'radial-gradient(circle, rgba(58, 107, 165, 0.4) 0%, transparent 70%)' }}></div>
        <div className="absolute top-1/2 right-1/3 w-96 h-96 rounded-full filter blur-3xl opacity-20" style={{ background: 'radial-gradient(circle, rgba(99, 160, 223, 0.3) 0%, transparent 70%)' }}></div>
        
        {/* Decorative Lines */}
        <div className="absolute top-0 left-1/4 w-px h-full opacity-10" style={{ background: 'linear-gradient(to bottom, transparent, #1d283a, transparent)' }}></div>
        <div className="absolute top-0 right-1/4 w-px h-full opacity-10" style={{ background: 'linear-gradient(to bottom, transparent, #1d283a, transparent)' }}></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-3 md:mb-4 animate-slideInFromRight px-4" style={{ color: '#1d283a' }}>Our Services</h2>
          <p className="text-center mb-8 md:mb-12 text-base md:text-lg px-4" style={{ color: '#4a5f77' }}>Comprehensive technology solutions for your business needs</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Service 1 - Web Development */}
            <div className="rounded-2xl p-8 hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 animate-fadeInUp relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)', border: '2px solid rgba(77, 138, 201, 0.2)', boxShadow: '0 10px 30px rgba(29, 40, 58, 0.1)' }}>
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full filter blur-2xl opacity-30" style={{ background: 'radial-gradient(circle, #4d8ac9 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}></div>
              <div className="text-5xl mb-4">💻</div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#1d283a' }}>Web Development</h3>
              <p className="mb-4 font-semibold" style={{ color: '#1d283a' }}>Custom websites that stand out with modern design and functionality</p>
              <ul className="space-y-2" style={{ color: '#4a5f77' }}>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Responsive design for all devices</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>SEO optimization</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Content management systems</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Performance optimization</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Accessibility compliance</span>
                </li>
              </ul>
            </div>

            {/* Service 2 - E-commerce Solutions */}
            <div className="rounded-2xl p-8 hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 animate-fadeInUp relative overflow-hidden" style={{ animationDelay: '0.1s', background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)', border: '2px solid rgba(77, 138, 201, 0.2)', boxShadow: '0 10px 30px rgba(29, 40, 58, 0.1)' }}>
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full filter blur-2xl opacity-30" style={{ background: 'radial-gradient(circle, #4d8ac9 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}></div>
              <div className="text-5xl mb-4">🛒</div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#1d283a' }}>E-commerce Solutions</h3>
              <p className="mb-4 font-semibold" style={{ color: '#1d283a' }}>Complete online store setup with seamless shopping experience</p>
              <ul className="space-y-2" style={{ color: '#4a5f77' }}>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Shopping cart and checkout</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Payment gateway integration</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Inventory management</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Order tracking system</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Customer analytics</span>
                </li>
              </ul>
            </div>

            {/* Service 3 - Mobile Applications */}
            <div className="rounded-2xl p-8 hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 animate-fadeInUp relative overflow-hidden" style={{ animationDelay: '0.2s', background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)', border: '2px solid rgba(77, 138, 201, 0.2)', boxShadow: '0 10px 30px rgba(29, 40, 58, 0.1)' }}>
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full filter blur-2xl opacity-30" style={{ background: 'radial-gradient(circle, #4d8ac9 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}></div>
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#1d283a' }}>Mobile Applications</h3>
              <p className="mb-4 font-semibold" style={{ color: '#1d283a' }}>Native and cross-platform apps for iOS and Android</p>
              <ul className="space-y-2" style={{ color: '#4a5f77' }}>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>iOS app development</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Android app development</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Cross-platform solutions</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>User-friendly interface</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Push notifications</span>
                </li>
              </ul>
            </div>

            {/* Service 4 - Custom Web Applications */}
            <div className="rounded-2xl p-8 hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 animate-fadeInUp relative overflow-hidden" style={{ animationDelay: '0.3s', background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)', border: '2px solid rgba(77, 138, 201, 0.2)', boxShadow: '0 10px 30px rgba(29, 40, 58, 0.1)' }}>
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full filter blur-2xl opacity-30" style={{ background: 'radial-gradient(circle, #4d8ac9 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}></div>
              <div className="text-5xl mb-4">⚙️</div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#1d283a' }}>Custom Web Applications</h3>
              <p className="mb-4 font-semibold" style={{ color: '#1d283a' }}>Tailored applications for your specific business needs</p>
              <ul className="space-y-2" style={{ color: '#4a5f77' }}>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Business-specific solutions</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Workflow automation</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Real-time data processing</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>User role management</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Scalable architecture</span>
                </li>
              </ul>
            </div>

            {/* Service 5 - Database & Backend Solutions */}
            <div className="rounded-2xl p-8 hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 animate-fadeInUp relative overflow-hidden" style={{ animationDelay: '0.4s', background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)', border: '2px solid rgba(77, 138, 201, 0.2)', boxShadow: '0 10px 30px rgba(29, 40, 58, 0.1)' }}>
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full filter blur-2xl opacity-30" style={{ background: 'radial-gradient(circle, #4d8ac9 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}></div>
              <div className="text-5xl mb-4">🗄️</div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#1d283a' }}>Database & Backend</h3>
              <p className="mb-4 font-semibold" style={{ color: '#1d283a' }}>Robust backend infrastructure and database solutions</p>
              <ul className="space-y-2" style={{ color: '#4a5f77' }}>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Database design and optimization</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>RESTful API development</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Cloud infrastructure setup</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Data security and encryption</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Performance monitoring</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section ref={pricingRef} className="min-h-screen py-12 md:py-20 px-4 md:px-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #f0f4f8 0%, #e8ecf1 50%, #dce4ec 100%)' }}>
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full filter blur-3xl opacity-30" style={{ background: 'radial-gradient(circle, rgba(77, 138, 201, 0.4) 0%, transparent 70%)' }}></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full filter blur-3xl opacity-30" style={{ background: 'radial-gradient(circle, rgba(58, 107, 165, 0.4) 0%, transparent 70%)' }}></div>
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #1d283a 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-3 md:mb-4 animate-slideInFromLeft px-4" style={{ color: '#1d283a' }}>Simple, Transparent Pricing</h2>
          <p className="text-center mb-8 md:mb-12 text-base md:text-lg px-4" style={{ color: '#4a5f77' }}>Choose the perfect plan for your business needs</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <div className="rounded-2xl p-8 hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 animate-fadeInUp relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)', border: '2px solid rgba(77, 138, 201, 0.2)', boxShadow: '0 10px 30px rgba(29, 40, 58, 0.1)' }}>
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full filter blur-2xl opacity-20" style={{ background: 'radial-gradient(circle, #4d8ac9 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2" style={{ color: '#1d283a' }}>Starter</h3>
                <p className="mb-6" style={{ color: '#4a5f77' }}>Perfect for small businesses</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold" style={{ color: '#1d283a' }}>₹15,000</span>
                  <span className="text-lg" style={{ color: '#4a5f77' }}>/month</span>
                </div>
                <ul className="space-y-3 mb-8" style={{ color: '#4a5f77' }}>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500 font-bold">✓</span>
                    <span>Basic e-commerce website</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500 font-bold">✓</span>
                    <span>Up to 100 products</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500 font-bold">✓</span>
                    <span>Payment gateway integration</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500 font-bold">✓</span>
                    <span>Mobile responsive design</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500 font-bold">✓</span>
                    <span>Basic SEO optimization</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500 font-bold">✓</span>
                    <span>Email support</span>
                  </li>
                </ul>
                <button onClick={() => openPricingModal('Starter')} className="w-full py-3 rounded-lg font-bold transition duration-300 transform hover:scale-105" style={{ background: 'linear-gradient(135deg, #e8ecf1 0%, #dce4ec 100%)', color: '#1d283a', border: '2px solid #4d8ac9' }}>
                  Get Started
                </button>
              </div>
            </div>

            {/* Professional Plan - Featured */}
            <div className="rounded-2xl p-8 hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 animate-fadeInUp relative overflow-hidden scale-105" style={{ animationDelay: '0.1s', background: 'linear-gradient(135deg, #1d283a 0%, #2d3e52 100%)', border: '2px solid #4d8ac9', boxShadow: '0 20px 40px rgba(29, 40, 58, 0.3)' }}>
              <div className="absolute top-0 right-0 px-4 py-1 rounded-bl-lg font-bold text-sm" style={{ background: 'linear-gradient(135deg, #4d8ac9 0%, #3a6ba5 100%)', color: '#ffffff' }}>POPULAR</div>
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full filter blur-2xl opacity-30" style={{ background: 'radial-gradient(circle, #4d8ac9 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2" style={{ color: '#ffffff' }}>Professional</h3>
                <p className="mb-6" style={{ color: '#b0c4de' }}>Best for growing businesses</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold" style={{ color: '#ffffff' }}>₹35,000</span>
                  <span className="text-lg" style={{ color: '#b0c4de' }}>/month</span>
                </div>
                <ul className="space-y-3 mb-8" style={{ color: '#d4dfe8' }}>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-400 font-bold">✓</span>
                    <span>Advanced e-commerce platform</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-400 font-bold">✓</span>
                    <span>Unlimited products</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-400 font-bold">✓</span>
                    <span>Multi-payment gateways</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-400 font-bold">✓</span>
                    <span>Custom design & branding</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-400 font-bold">✓</span>
                    <span>Advanced SEO & analytics</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-400 font-bold">✓</span>
                    <span>Inventory management</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-400 font-bold">✓</span>
                    <span>Priority support (24/7)</span>
                  </li>
                </ul>
                <button onClick={() => openPricingModal('Professional')} className="w-full py-3 rounded-lg font-bold transition duration-300 transform hover:scale-105" style={{ background: 'linear-gradient(135deg, #4d8ac9 0%, #3a6ba5 100%)', color: '#ffffff', boxShadow: '0 4px 15px rgba(77, 138, 201, 0.4)' }}>
                  Get Started
                </button>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="rounded-2xl p-8 hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 animate-fadeInUp relative overflow-hidden" style={{ animationDelay: '0.2s', background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)', border: '2px solid rgba(77, 138, 201, 0.2)', boxShadow: '0 10px 30px rgba(29, 40, 58, 0.1)' }}>
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full filter blur-2xl opacity-20" style={{ background: 'radial-gradient(circle, #4d8ac9 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2" style={{ color: '#1d283a' }}>Enterprise</h3>
                <p className="mb-6" style={{ color: '#4a5f77' }}>For large-scale operations</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold" style={{ color: '#1d283a' }}>Custom</span>
                </div>
                <ul className="space-y-3 mb-8" style={{ color: '#4a5f77' }}>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500 font-bold">✓</span>
                    <span>Full marketplace platform</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500 font-bold">✓</span>
                    <span>Multi-vendor support</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500 font-bold">✓</span>
                    <span>Custom integrations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500 font-bold">✓</span>
                    <span>White-label solution</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500 font-bold">✓</span>
                    <span>Dedicated infrastructure</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500 font-bold">✓</span>
                    <span>Advanced security features</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500 font-bold">✓</span>
                    <span>Dedicated account manager</span>
                  </li>
                </ul>
                <button onClick={() => openPricingModal('Enterprise')} className="w-full py-3 rounded-lg font-bold transition duration-300 transform hover:scale-105" style={{ background: 'linear-gradient(135deg, #e8ecf1 0%, #dce4ec 100%)', color: '#1d283a', border: '2px solid #4d8ac9' }}>
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} className="relative min-h-screen text-white py-12 md:py-20 px-4 md:px-8 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1d283a 0%, #2d3e52 50%, #1a2332 100%)' }}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 w-96 h-96 rounded-full filter blur-3xl animate-blob" style={{ background: 'radial-gradient(circle, rgba(77, 138, 201, 0.6) 0%, transparent 70%)' }}></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full filter blur-3xl animate-blob" style={{ animationDelay: '2s', background: 'radial-gradient(circle, rgba(99, 160, 223, 0.5) 0%, transparent 70%)' }}></div>
        </div>
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-3 md:mb-4 animate-slideInFromLeft px-4">Get In Touch</h2>
          <p className="text-center mb-8 md:mb-12 text-base md:text-lg px-4" style={{ color: '#b0c4de' }}>We'd love to hear from you. Let's discuss your e-commerce needs.</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Left Side - Contact Info */}
            <div className="space-y-4 md:space-y-6">
              <div className="p-6 rounded-2xl transition duration-300 transform hover:scale-105 backdrop-blur-sm animate-fadeInUp" style={{ background: 'linear-gradient(135deg, rgba(77, 138, 201, 0.2) 0%, rgba(58, 107, 165, 0.2) 100%)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div className="flex items-center gap-4">
                  <div className="text-4xl">✉️</div>
                  <div>
                    <h3 className="text-xl font-bold mb-1" style={{ color: '#ffffff' }}>Email</h3>
                    <a href="mailto:sagargondage370@gmail.com" className="hover:underline transition" style={{ color: '#b0c4de' }}>sagargondage370@gmail.com</a>
                  </div>
                </div>
              </div>
              
              <div className="p-6 rounded-2xl transition duration-300 transform hover:scale-105 backdrop-blur-sm animate-fadeInUp" style={{ animationDelay: '0.1s', background: 'linear-gradient(135deg, rgba(77, 138, 201, 0.2) 0%, rgba(58, 107, 165, 0.2) 100%)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div className="flex items-center gap-4">
                  <div className="text-4xl">📞</div>
                  <div>
                    <h3 className="text-xl font-bold mb-1" style={{ color: '#ffffff' }}>Phone</h3>
                    <a href="tel:+917741049598" className="hover:underline transition" style={{ color: '#b0c4de' }}>+91 7741049598</a>
                  </div>
                </div>
              </div>
              
              <div className="p-6 rounded-2xl transition duration-300 transform hover:scale-105 backdrop-blur-sm animate-fadeInUp" style={{ animationDelay: '0.2s', background: 'linear-gradient(135deg, rgba(77, 138, 201, 0.2) 0%, rgba(58, 107, 165, 0.2) 100%)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div className="flex items-center gap-4">
                  <div className="text-4xl">📍</div>
                  <div>
                    <h3 className="text-xl font-bold mb-1" style={{ color: '#ffffff' }}>Address</h3>
                    <p style={{ color: '#b0c4de' }}>BTM 2nd Stage, Bengaluru, 560076</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="rounded-2xl p-6 md:p-8 transition duration-300 backdrop-blur-sm animate-fadeInUp" style={{ animationDelay: '0.3s', background: 'linear-gradient(135deg, rgba(45, 62, 82, 0.8) 0%, rgba(29, 40, 58, 0.8) 100%)', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)' }}>
              <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6" style={{ color: '#ffffff' }}>Send us a message</h3>
              
              {/* Success/Error Message */}
              {submitStatus && (
                <div className={`mb-4 p-4 rounded-lg ${submitStatus === 'success' ? 'bg-green-500 bg-opacity-20 border border-green-500' : 'bg-red-500 bg-opacity-20 border border-red-500'}`}>
                  <p className="text-white text-sm">{submitMessage}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg focus:outline-none transition duration-300"
                      placeholder="John"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', border: `1px solid ${formErrors.firstName ? '#ef4444' : 'rgba(255, 255, 255, 0.2)'}`, backdropFilter: 'blur(10px)' }}
                    />
                    {formErrors.firstName && (
                      <p className="text-red-400 text-xs mt-1">{formErrors.firstName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg focus:outline-none transition duration-300"
                      placeholder="Doe"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', border: `1px solid ${formErrors.lastName ? '#ef4444' : 'rgba(255, 255, 255, 0.2)'}`, backdropFilter: 'blur(10px)' }}
                    />
                    {formErrors.lastName && (
                      <p className="text-red-400 text-xs mt-1">{formErrors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none transition duration-300"
                    placeholder="E-commerce consultation"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', border: `1px solid ${formErrors.subject ? '#ef4444' : 'rgba(255, 255, 255, 0.2)'}`, backdropFilter: 'blur(10px)' }}
                  />
                  {formErrors.subject && (
                    <p className="text-red-400 text-xs mt-1">{formErrors.subject}</p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="6"
                    className="w-full px-4 py-3 rounded-lg focus:outline-none transition duration-300 resize-none"
                    placeholder="Tell us about your e-commerce needs..."
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', border: `1px solid ${formErrors.message ? '#ef4444' : 'rgba(255, 255, 255, 0.2)'}`, backdropFilter: 'blur(10px)' }}
                  />
                  {formErrors.message && (
                    <p className="text-red-400 text-xs mt-1">{formErrors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-white font-bold py-3 rounded-lg transition duration-300 transform hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #4d8ac9 0%, #3a6ba5 100%)' }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message →'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 md:py-12 px-4 md:px-8 text-center" style={{ background: 'linear-gradient(135deg, #0f1419 0%, #1d283a 100%)', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center gap-4 md:gap-6">
            <div className="text-gray-400">
              <p className="font-semibold text-white mb-2 text-base md:text-lg">© 2026 ShopHubSolutions</p>
              <p className="text-xs md:text-sm">Building exceptional digital experiences</p>
            </div>
            
            <div className="flex gap-4 md:gap-6 mt-2 md:mt-4">
              <button onClick={() => window.open('https://linkedin.com/in/sagar-gondage', '_blank')} className="w-12 h-12 flex items-center justify-center rounded-full transition duration-300 transform hover:scale-110 hover:shadow-lg" style={{ background: 'linear-gradient(135deg, #4d8ac9 0%, #3a6ba5 100%)' }} aria-label="LinkedIn">
                <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </button>
              
              <button onClick={() => window.open('https://github.com/sagar-gondage', '_blank')} className="w-12 h-12 flex items-center justify-center rounded-full transition duration-300 transform hover:scale-110 hover:shadow-lg" style={{ background: 'linear-gradient(135deg, #4d8ac9 0%, #3a6ba5 100%)' }} aria-label="GitHub">
                <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
              </button>
              
              <button onClick={() => window.open('https://instagram.com/sagar_gondage', '_blank')} className="w-12 h-12 flex items-center justify-center rounded-full transition duration-300 transform hover:scale-110 hover:shadow-lg" style={{ background: 'linear-gradient(135deg, #4d8ac9 0%, #3a6ba5 100%)' }} aria-label="Instagram">
                <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default HomePage;