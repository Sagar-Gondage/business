exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // Parse the request body
    const data = JSON.parse(event.body);
    const { firstName, lastName, subject, message } = data;

    // Validate required fields
    if (!firstName || !lastName || !subject || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Missing required fields',
          message: 'Please fill in all fields' 
        }),
      };
    }

    // Here you would normally send an email or save to a database
    // For now, we'll just return a success response
    console.log('Contact form submission:', data);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return success response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: 'Thank you for contacting us! We will get back to you soon.',
        data: {
          firstName,
          lastName,
          subject,
          timestamp: new Date().toISOString(),
        },
      }),
    };
  } catch (error) {
    console.error('Error processing contact form:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: 'Something went wrong. Please try again later.',
      }),
    };
  }
};
