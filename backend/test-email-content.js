require('dotenv').config();
const { createWelcomeEmailTemplate } = require('./utils/emailService');

// Test to see what content is being generated
function testEmailContent() {
  console.log('🔍 Testing email content generation...');
  
  const userName = 'Test User';
  const emailContent = createWelcomeEmailTemplate(userName);
  
  console.log('\n📧 Generated Email Content:');
  console.log('=' .repeat(50));
  
  // Extract and show the main content parts
  const contentParts = {
    'Header': emailContent.includes('Welcome to ShikshaHub! 🚀') ? '✅ Found' : '❌ Missing',
    'Greeting': emailContent.includes('Hey Test User,') ? '✅ Found' : '❌ Missing',
    'Welcome Message': emailContent.includes('Welcome aboard! 🌟') ? '✅ Found' : '❌ Missing',
    'Welcome Badge': emailContent.includes('🏆 Welcome Badge 🏆') ? '✅ Found' : '❌ Missing',
    'Features Section': emailContent.includes('Here\'s what you can look forward to:') ? '✅ Found' : '❌ Missing',
    'Feature 1': emailContent.includes('📚 Join or request access to learning communities') ? '✅ Found' : '❌ Missing',
    'Feature 2': emailContent.includes('📝 Share your thoughts through blogs') ? '✅ Found' : '❌ Missing',
    'Feature 3': emailContent.includes('🔍 Quickly catch up with our blog summarization feature') ? '✅ Found' : '❌ Missing',
    'Feature 4': emailContent.includes('🤖 Chatbot for instant help and guidance') ? '✅ Found' : '❌ Missing',
    'Feature 5': emailContent.includes('📅 Stay informed about events happening in your space') ? '✅ Found' : '❌ Missing',
    'CTA Button': emailContent.includes('Go to My Dashboard') ? '✅ Found' : '❌ Missing',
    'Hashtag': emailContent.includes('Let\'s build. Let\'s blog. Let\'s grow. 🚀') ? '✅ Found' : '❌ Missing',
    'Footer': emailContent.includes('Team ShikshaHub') ? '✅ Found' : '❌ Missing'
  };
  
  console.log('\n📋 Content Check Results:');
  Object.entries(contentParts).forEach(([part, status]) => {
    console.log(`${part}: ${status}`);
  });
  
  console.log('\n📄 Full HTML Length:', emailContent.length, 'characters');
  console.log('📄 Content Preview (first 500 chars):');
  console.log(emailContent.substring(0, 500) + '...');
  
  // Save to file for inspection
  const fs = require('fs');
  fs.writeFileSync('email-content-test.html', emailContent);
  console.log('\n💾 Full email content saved to: email-content-test.html');
  console.log('   Open this file in your browser to see the exact email content');
}

testEmailContent(); 