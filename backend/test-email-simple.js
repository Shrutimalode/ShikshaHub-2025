require('dotenv').config();
const { sendWelcomeEmail } = require('./utils/emailService');

async function testEmail() {
  console.log('🔧 Testing email configuration...');
  console.log('Email User:', process.env.EMAIL_USER ? '✅ Set' : '❌ Not set');
  console.log('Email Password:', process.env.EMAIL_PASSWORD ? '✅ Set' : '❌ Not set');
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('\n❌ Please set EMAIL_USER and EMAIL_PASSWORD in your .env file');
    console.log('Example:');
    console.log('EMAIL_USER=smalode514@gmail.com');
    console.log('EMAIL_PASSWORD=your-16-character-app-password');
    return;
  }

  console.log('\n📧 Sending test email...');
  
  try {
    const result = await sendWelcomeEmail('smalode514@gmail.com', 'Test User');
    
    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log('Message ID:', result.messageId);
      console.log('📬 Check your inbox at smalode514@gmail.com');
    } else {
      console.log('❌ Failed to send email:');
      console.log('Error:', result.error);
    }
  } catch (error) {
    console.log('❌ Error testing email:', error.message);
  }
}

testEmail(); 