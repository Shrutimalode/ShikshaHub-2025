const { sendWelcomeEmail } = require('./utils/emailService');

// Test email functionality
async function testEmail() {
  console.log('Testing email functionality...');
  
  const testEmail = 'test@example.com'; // Replace with your email for testing
  const testName = 'Test User';
  
  try {
    const result = await sendWelcomeEmail(testEmail, testName);
    
    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log('Message ID:', result.messageId);
    } else {
      console.log('❌ Failed to send email:');
      console.log('Error:', result.error);
    }
  } catch (error) {
    console.log('❌ Error testing email:', error.message);
  }
}

// Run the test
testEmail(); 