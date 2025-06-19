require('dotenv').config();
const { sendWelcomeEmail } = require('./utils/emailService');

async function quickTest() {
  console.log('🚀 Quick Email Test');
  console.log('Email User:', process.env.EMAIL_USER ? '✅ Set' : '❌ Not set');
  console.log('Email Password:', process.env.EMAIL_PASSWORD ? '✅ Set' : '❌ Not set');
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('\n❌ Please set EMAIL_USER and EMAIL_PASSWORD in your .env file');
    return;
  }

  console.log('\n📧 Sending test email...');
  
  try {
    const result = await sendWelcomeEmail('test@example.com', 'Test User');
    
    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log('Message ID:', result.messageId);
      console.log('📬 Check your email inbox');
    } else {
      console.log('❌ Failed to send email:');
      console.log('Error:', result.error);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

quickTest(); 