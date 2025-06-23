# Analytics Event Generator

A comprehensive web application for generating, managing, and documenting Google Analytics 4 (GA4) events with visual references and implementation specifications.

![Analytics Event Generator](public/vml.png)

## 🚀 Features

### 📊 Multi-Tab Event Generation
- **Experience Events** - Standard GA4 events with custom parameters
- **E-commerce Events** - Purchase, add_to_cart, view_item, and other e-commerce tracking
- **Data Layer Builder** - Custom data layer objects with nested properties

### 🖼️ Visual Documentation
- **Image Upload & Compression** - Automatic client-side image compression (up to 90% size reduction)
- **Screenshot Integration** - Attach mobile screenshots or wireframes to events
- **Visual Reference** - Perfect for documenting user flows and UI interactions

### 📋 Comprehensive Output
- **Data Layer Specifications** - Complete GTM data layer code
- **Tagging Plan** - Implementation guidance with triggers and variables
- **Excel Export** - Professional documentation with images, code, and tagging plans

### 💾 Project Management
- **Multi-Project Support** - Save and manage multiple analytics projects
- **Auto-Save** - Automatic saving when working on active projects
- **Project Persistence** - Resume work exactly where you left off after browser refresh
- **Storage Management** - Monitor browser storage usage and clear old projects

### 🔒 Enterprise Security
- **Auth0 Integration** - Secure authentication with organization-level access control
- **Protected Routes** - All functionality requires authentication
- **Session Management** - Secure login/logout flow

## 🛠️ Technology Stack

- **Backend**: Node.js + Express
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Authentication**: Auth0 (express-openid-connect)
- **Excel Generation**: ExcelJS
- **Image Processing**: HTML5 Canvas API
- **Storage**: Browser localStorage

## 📦 Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Auth0 account and application

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd analytics-event-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   AUTH0_SECRET=your-auth0-secret
   AUTH0_CLIENT_ID=your-auth0-client-id
   AUTH0_ORGANIZATION=your-auth0-organization-id
   BASE_URL=http://localhost:3000
   PORT=3000
   ```

4. **Start the application**
   ```bash
   npm start
   ```

5. **Access the application**
   Navigate to `http://localhost:3000`

## 🔧 Auth0 Configuration

### Application Settings
- **Application Type**: Regular Web Application
- **Allowed Callback URLs**: `http://localhost:3000/callback`
- **Allowed Logout URLs**: `http://localhost:3000`
- **Allowed Web Origins**: `http://localhost:3000`

### Organization Setup
- Enable organizations in your Auth0 dashboard
- Add users to your organization
- Update `AUTH0_ORGANIZATION` in your `.env` file

## 📖 Usage Guide

### Getting Started

1. **Authentication**
   - Visit the application URL
   - You'll be redirected to Auth0 for login
   - After successful authentication, you'll access the main interface

2. **Creating Events**
   - Choose the appropriate tab (Experience Events, E-commerce Events, or Data Layer Builder)
   - Fill in the required fields
   - Upload an optional screenshot or wireframe
   - Click "Generate Event" to add to your collection

### Experience Events Tab
- **Screen Name**: Page or screen identifier
- **Event Action**: Select from predefined actions or create custom
- **Event Label**: Descriptive label for the event
- **Additional Context**: Optional custom parameters

### E-commerce Events Tab
- **Transaction Details**: Order ID, value, currency
- **Product Information**: Multiple products with details
- **Event Types**: Purchase, add_to_cart, view_item, etc.

### Data Layer Builder Tab
- **Custom Properties**: Build complex nested objects
- **Property Types**: String, Number, Boolean, Object, Array
- **Live Preview**: Real-time data layer preview
- **Flexible Structure**: Support for any GA4 event structure

### Project Management

#### Saving Projects
1. Click "💾 Save Progress"
2. Enter project name and description
3. Project becomes active with auto-save enabled

#### Loading Projects
1. Click "📁 Load Progress"
2. Select from your saved projects
3. Project loads with all events and becomes active

#### Active Projects
- Green indicator shows current active project
- Auto-saves every time you generate events
- Persists across browser sessions
- Click "Stop Working" to disable auto-save

### Storage Management
1. Click "🗂️ Storage" to view usage
2. See storage breakdown by project
3. Export all projects for backup
4. Clear old projects to free space

### Excel Export
- **Single Project**: Click "Export to Excel" 
- **All Projects**: Use Storage Management → "Export All Projects"
- **Three Columns**: Experience Image, Data Layer Specifications, Tagging Plan
- **Professional Format**: Ready for sharing with development teams

## 🏗️ Project Structure

```
analytics-event-generator/
├── server.js                 # Express server with Auth0 integration
├── package.json              # Dependencies and scripts
├── .env                      # Environment variables (not in repo)
├── public/
│   ├── index.html           # Main application HTML
│   ├── app.js               # Client-side JavaScript (70KB)
│   ├── styles.css           # Application styling
│   └── vml.png              # VML logo
└── README.md                # This file
```

## 🔧 Key Features Deep Dive

### Image Compression
- **Automatic Processing**: All uploaded images are compressed client-side
- **Smart Resizing**: Maximum 800x600px while maintaining aspect ratio
- **Format Optimization**: Converts to JPEG with 80% quality
- **Storage Savings**: Typically 70-90% size reduction
- **Console Logging**: Shows compression statistics

### Storage System
- **Browser localStorage**: All data stored locally
- **Multi-Project Support**: Unlimited named projects
- **Auto-Save**: Active projects save automatically
- **Storage Monitoring**: Real-time usage tracking
- **Migration Support**: Handles legacy save formats

### Excel Generation
- **Server-Side Processing**: Uses ExcelJS for professional output
- **Image Embedding**: Screenshots embedded directly in Excel
- **Smart Sizing**: Row heights match image dimensions
- **Three-Column Layout**: Visual, Technical, Implementation
- **Proper Formatting**: Text wrapping and alignment

## 🚀 Deployment

### Production Environment Variables
```env
AUTH0_SECRET=your-production-secret
AUTH0_CLIENT_ID=your-production-client-id
AUTH0_ORGANIZATION=your-organization-id
BASE_URL=https://your-domain.com
PORT=3000
NODE_ENV=production
```

### Deployment Platforms
- **Heroku**: `git push heroku main`
- **Vercel**: Connect GitHub repository
- **Railway**: Deploy from GitHub
- **DigitalOcean App Platform**: Use GitHub integration

## 🔍 Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify Auth0 configuration
   - Check callback URLs match exactly
   - Ensure organization settings are correct

2. **Storage Full Errors**
   - Use Storage Management to clear old projects
   - Export projects before clearing
   - Use smaller/compressed images

3. **Excel Export Issues**
   - Check server console for errors
   - Verify image formats are supported
   - Ensure sufficient server memory

### Debug Mode
- Open browser developer tools
- Check console for compression statistics
- Monitor network requests for export operations
- Review localStorage contents

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the package.json file for details.

## 🙋‍♂️ Support

For support and questions:
- Check the troubleshooting section above
- Review browser console for error messages
- Ensure all environment variables are properly configured

## 🎯 Use Cases

- **Analytics Implementation**: Document GA4 event requirements
- **Developer Handoffs**: Provide visual and technical specifications
- **QA Testing**: Reference documentation for event validation
- **Client Presentations**: Professional documentation with screenshots
- **Team Collaboration**: Share comprehensive analytics specifications

---

**Built with ❤️ for modern analytics implementation workflows** 