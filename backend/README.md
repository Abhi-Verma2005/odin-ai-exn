# Algo Chat Backend

Express TypeScript backend API for the Algo Chat application.

## 🚀 Features

- **AI Integration**: Google Gemini 2.0 Flash with streaming responses
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Database**: PostgreSQL with Drizzle ORM (dual database setup)
- **Search**: Multi-tier search system (Google CSE, Brave, DuckDuckGo)
- **Rate Limiting**: Configurable rate limiting for API endpoints
- **Security**: Helmet.js security headers and CORS protection
- **File Upload**: Support for file uploads (images, PDFs)
- **Real-time Chat**: Streaming chat responses with AI tools

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # Database connections
│   ├── controllers/
│   │   ├── auth-controller.ts   # Authentication endpoints
│   │   ├── chat-controller.ts   # Chat and AI endpoints
│   │   ├── search-controller.ts # Search endpoints
│   │   └── submission-controller.ts # Code submission endpoints
│   ├── middleware/
│   │   ├── auth.ts             # JWT authentication
│   │   ├── cors.ts             # CORS configuration
│   │   └── rate-limit.ts       # Rate limiting
│   ├── models/
│   │   ├── schema.ts           # Primary database schema
│   │   └── algo-schema.ts      # External database schema
│   ├── routes/
│   │   ├── auth.ts             # Auth routes
│   │   ├── chat.ts             # Chat routes
│   │   ├── search.ts           # Search routes
│   │   └── submissions.ts      # Submission routes
│   ├── services/
│   │   ├── ai-service.ts       # AI model configuration
│   │   ├── ai-actions.ts       # AI tool functions
│   │   ├── search-service.ts   # Search functionality
│   │   └── queries.ts          # Database queries
│   └── index.ts                # Main server file
├── package.json
├── tsconfig.json
├── nodemon.json
└── env.example
```

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Server Configuration
   PORT=3001
   NODE_ENV=development
   
   # Database Configuration
   DATABASE_URL=postgresql://username:password@localhost:5432/algo_chat
   EXTERNAL_DATABASE_URL=postgresql://username:password@localhost:5432/external_db
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   
   # AI Configuration
   GOOGLE_API_KEY=your-google-api-key
   BRAVE_API_KEY=your-brave-api-key
   GOOGLE_CSE_ID=your-google-cse-id
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Chat
- `POST /api/chat/stream` - Stream AI chat responses
- `GET /api/chat/history` - Get chat history
- `DELETE /api/chat/:id` - Delete a chat

### Search
- `POST /api/search` - Web search functionality

### Submissions
- `POST /api/submissions/submit` - Submit code solutions

### Health Check
- `GET /health` - Server health status

## 🔧 Development

### Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests

### Database Setup
The backend uses two PostgreSQL databases:

1. **Primary Database** (`DATABASE_URL`): Stores chat history and code submissions
2. **External Database** (`EXTERNAL_DATABASE_URL`): Stores user data and DSA questions

### AI Integration
- Uses Google Gemini 2.0 Flash model
- Supports streaming responses
- Implements tool functions for user progress and search
- Custom middleware for request/response transformation

### Search System
Multi-tier search implementation:
1. Google Custom Search Engine (for programming queries)
2. Brave Search API
3. DuckDuckGo API
4. Curated fallback results

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Rate Limiting**: Configurable rate limits per endpoint
- **CORS Protection**: Cross-origin request handling
- **Security Headers**: Helmet.js for security headers
- **Input Validation**: Zod schema validation

## 🚀 Deployment

### Environment Variables
Ensure all required environment variables are set in production:

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=your-production-db-url
EXTERNAL_DATABASE_URL=your-production-external-db-url
JWT_SECRET=your-production-jwt-secret
GOOGLE_API_KEY=your-google-api-key
CORS_ORIGIN=your-frontend-url
```

### Build and Deploy
```bash
npm run build
npm start
```

## 🔗 Integration with Frontend

The backend is designed to work with the existing Next.js frontend. Update your frontend API calls to point to the backend:

```typescript
// Example: Update API base URL
const API_BASE_URL = 'http://localhost:3001/api';

// Chat streaming
const response = await fetch(`${API_BASE_URL}/chat/stream`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ id, messages })
});
```

## 📝 Notes

- The backend maintains the same API structure as the original Next.js API routes
- All AI functionality has been preserved and enhanced
- Database schemas and queries remain unchanged
- Authentication system has been adapted for Express
- Search functionality includes all original features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 