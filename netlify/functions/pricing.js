exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    const { name, email, phone, company, message, plan } = JSON.parse(event.body);

    // Validate required fields
    if (!name || !email || !phone || !plan) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          message: 'Missing required fields. Please provide name, email, phone, and service.' 
        }),
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          message: 'Please provide a valid email address.' 
        }),
      };
    }

    // Log the inquiry (in production, you would save this to a database or send an email)
    console.log('Pricing Inquiry Received:', {
      name,
      email,
      phone,
      company: company || 'Not provided',
      message: message || 'No message',
      plan,
      timestamp: new Date().toISOString(),
    });

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return dummy success response
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: `Thank you for your interest in ${plan}! Our team will contact you within 24 hours.`,
        data: {
          inquiryId: `INQ-${Date.now()}`,
          service: plan,
          name: name,
        },
      }),
    };
  } catch (error) {
    console.error('Error processing pricing inquiry:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Internal server error. Please try again later.' 
      }),
    };
  }
};
