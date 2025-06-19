# ShikshaHub - Educational Platform

ShikshaHub is a comprehensive educational platform that connects students, teachers, and educational content creators. The platform facilitates learning through communities, study materials, blogs, and interactive features.

## Tech Stack

### Frontend
- **React.js** (v17.0.2) - Frontend framework
- **React Router DOM** (v6.0.2) - Client-side routing
- **React Bootstrap** (v2.0.3) - UI components and styling
- **Axios** (v0.24.0) - HTTP client for API requests
- **Bootstrap** (v5.1.3) - CSS framework

### Backend
- **Node.js** - Runtime environment
- **Express.js** (v4.17.1) - Web framework
- **MongoDB** - Database
- **Mongoose** (v6.0.12) - MongoDB object modeling
- **JWT** (v8.5.1) - Authentication
- **Bcryptjs** (v2.4.3) - Password hashing
- **Multer** (v1.4.3) - File upload handling
- **Google Generative AI** (v0.24.1) - AI integration
- **Nodemailer** - Email functionality
- **CORS** (v2.8.5) - Cross-origin resource sharing
- **Dotenv** (v10.0.0) - Environment variable management

### Development Tools
- **Docker** - Containerization
- **Nodemon** - Development server with auto-reload
- **Git** - Version control

## API Endpoints

### Authentication (`/api/auth`)
- User registration and login
- JWT-based authentication
- Password hashing and security
- **Welcome email notifications** for new registrations

### Communities (`/api/communities`)
- Create and manage learning communities
- Join/leave communities
- Community discussions and interactions

### Study Materials (`/api/materials`)
- Upload and manage educational content
- File handling with Multer
- Material categorization and search

### Blogs (`/api/blogs`)
- Create and manage educational blog posts
- Content management
- Blog interactions and comments

### Chat System (`/api`)
- Real-time communication
- User-to-user messaging
- Community chat features

### File Storage
- Static file serving for uploads
- Secure file access
- Organized storage structure

## Features
1. User Authentication and Authorization
2. **Welcome Email Notifications** - Automated welcome emails for new users
3. Community-based Learning
4. Study Material Management
5. Educational Blogging
6. Real-time Chat System
7. File Upload and Management
8. AI Integration for Enhanced Learning
9. Responsive Design

## Email System

### Welcome Email Feature
- **Automated welcome emails** sent to newly registered users
- **Beautiful HTML email templates** with modern styling
- **Customizable content** including features list and call-to-action
- **Non-blocking email sending** - doesn't affect registration speed
- **Error handling** with detailed logging

### Email Setup
See `backend/EMAIL_SETUP.md` for detailed setup instructions.

### Email Template Features
- Responsive HTML design
- Welcome badge display
- Feature highlights
- Call-to-action button
- Professional styling

## Blog System Features

### Blog Approval System
1. **Role-Based Approval**:
   - Admin blogs are auto-approved
   - Teacher blogs require admin approval
   - Student blogs can be approved by teachers or admins

2. **Approval Workflow**:
   - New blogs start in 'pending' status
   - Reviewers can approve or reject with feedback
   - Rejected blogs can be resubmitted after edits
   - Status changes to 'pending' when edited after approval

3. **Review Process**:
   - Teachers can review student blogs
   - Admins can review all blogs
   - Required feedback for rejections
   - Optional comments for approvals

### Blog Summarization
1. **AI-Powered Summaries**:
   - Uses Google's Gemini AI model
   - Generates concise 2-3 sentence summaries
   - Available for all blog posts
   - Helps with quick content understanding

2. **Summarization Features**:
   - One-click summary generation
   - Modal display of summaries
   - Error handling for failed generations
   - Loading states during generation

### Blog Management
1. **Content Types**:
   - Original content
   - Shared content with attribution
   - Source URL tracking
   - Author role tracking

2. **Content Organization**:
   - Tag-based categorization
   - Community-specific blogs
   - Search functionality
   - Status filtering

3. **User Permissions**:
   - Authors can edit their own blogs
   - Reviewers can approve/reject based on role
   - Community members can view approved blogs
   - Original authors can track content sharing

## Getting Started

### Prerequisites
- Node.js
- MongoDB
- Docker (optional)

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   npm install
   ```
3. Set up environment variables
4. Start the development servers:
   ```bash
   # Frontend
   npm start

   # Backend
   npm run dev
   ```

### Docker Deployment
```bash
docker-compose up --build
```

## Environment Variables
Create a `.env` file in the backend directory with:
```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000

# Email Configuration (for welcome emails)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:3000
```

**Note**: For email functionality, you'll need to set up Gmail app passwords. See `backend/EMAIL_SETUP.md` for detailed instructions. 