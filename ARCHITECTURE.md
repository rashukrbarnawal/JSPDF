# JSPDF Architecture Documentation

## Table of Contents
1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [Directory Structure](#directory-structure)
5. [Component Details](#component-details)
6. [Database Schema](#database-schema)
7. [API Endpoints](#api-endpoints)
8. [Request/Response Flow](#requestresponse-flow)
9. [Security Considerations](#security-considerations)
10. [Deployment & Operations](#deployment--operations)

---

## Overview

JSPDF is a Node.js/Express-based web application for managing student records with image uploads. The application uses MongoDB for persistent storage and Pug for server-side template rendering. It provides functionality for user authentication, student record management, and image upload/processing.

### Key Features
- User authentication (login/registration)
- Student record management (CRUD operations)
- Image upload and storage
- Data export/download capabilities
- Web-based administrative interface

---

## Technology Stack

### Backend Framework
- **Express.js** (~4.16.1) - Web application framework
- **Node.js** - JavaScript runtime environment

### Database
- **MongoDB** - NoSQL document database
- **Monk** (~7.1.2) - MongoDB wrapper/driver

### File Upload & Processing
- **Multer** (~1.4.2) - Middleware for handling file uploads
- **Base64-img** (~1.0.4) - Image to base64 conversion
- **Image-to-base64** (~2.0.1) - Alternative image conversion library

### Templating & Frontend
- **Pug** (~2.0.4) - Server-side template engine
- Express static file serving for CSS/JavaScript

### Utilities
- **Morgan** (~1.9.1) - HTTP request logging
- **Cookie-parser** (~1.4.4) - Cookie parsing middleware
- **http-errors** (~1.6.3) - HTTP error generation
- **Debug** (~2.6.9) - Debugging utility

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Web Browser (Client)                    │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP Requests
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   bin/www                                   │
│            (HTTP Server Entry Point)                        │
│  - Creates Node.js HTTP server                              │
│  - Listens on port 3000 (default)                           │
│  - Handles port normalization & errors                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   app.js                                    │
│            (Express Configuration)                          │
│  - Middleware setup (logging, parsing, cookies)             │
│  - View engine configuration (Pug)                          │
│  - Static file serving (/public)                            │
│  - Route mounting                                           │
│  - Error handling                                           │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         │                               │
         ▼                               ▼
    ┌─────────────┐            ┌──────────────────┐
    │ Index Router │            │  Users Router    │
    │ (index.js)  │            │  (users.js)      │
    └──────┬──────┘            └──────────────────┘
           │
           ├─── Student Records Management
           ├─── User Authentication
           ├─── Image Upload Handling
           ├─── Data Export/Download
           └─── CRUD Operations
           │
           ▼
    ┌──────────────────────────────────┐
    │   Multer (File Upload Handling)  │
    │   Disk Storage: public/uploads/  │
    └──────────────────────────────────┘
           │
           ▼
    ┌──────────────────────────────────┐
    │      MongoDB (Local Connection)  │
    │   mongodb://localhost:27017/ocr  │
    │                                  │
    │  Collections:                    │
    │  ├─ admindetails (users)         │
    │  └─ images (student records)     │
    └──────────────────────────────────┘
```

---

## Directory Structure

```
JSPDF/
├── bin/
│   └── www                      # HTTP server entry point
│                                # - Port configuration (default 3000)
│                                # - Server initialization
│                                # - Error/listening event handlers
│
├── routes/
│   ├── index.js                # Main application routes
│   │                            # - Authentication endpoints
│   │                            # - CRUD operations for student records
│   │                            # - Image upload handling
│   │                            # - Data management
│   │
│   └── users.js                # User management routes
│
├── views/                       # Pug template files
│   ├── index.pug               # Home/upload page
│   ├── loginreg.pug            # Login/registration page
│   ├── table.pug               # Student records display
│   └── error.pug               # Error page
│
├── public/                      # Static assets
│   ├── uploads/                # File upload destination
│   ├── images/                 # Static images
│   ├── javascripts/            # Frontend scripts
│   └── stylesheets/            # CSS files
│
├── app.js                       # Express application setup
│                                # - Middleware configuration
│                                # - View engine setup
│                                # - Route mounting
│                                # - Error handling
│
├── package.json                # NPM dependencies and scripts
├── package-lock.json           # Dependency lock file
└── README.md                    # Project documentation
```

---

## Component Details

### Entry Point: `bin/www`

**Purpose**: Bootstrap the HTTP server and initialize the application.

**Key Functions**:
- Retrieves port from environment variable or defaults to 3000
- Creates HTTP server using Node.js `http` module
- Implements port normalization for string/number ports
- Handles server errors (EACCES, EADDRINUSE)
- Logs server listening events for debugging

**Configuration**:
```javascript
var port = normalizePort(process.env.PORT || '3000');
var server = http.createServer(app);
server.listen(port);
```

---

### Application Core: `app.js`

**Purpose**: Configure Express application with middleware, view engine, and routing.

**Middleware Pipeline** (in order):
1. **Logger Middleware** - Morgan in 'dev' mode for HTTP request logging
2. **JSON Parser** - Parses incoming JSON payloads
3. **URL-Encoded Parser** - Parses form-encoded data
4. **Cookie Parser** - Extracts cookies from request headers
5. **Static File Server** - Serves files from `/public` directory
6. **Route Handlers** - Mounted routers for specific endpoints
7. **404 Handler** - Catches unmatched routes
8. **Error Handler** - Centralizes error response rendering

**View Engine Configuration**:
```javascript
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
```

---

### Route Handler: `routes/index.js`

**Purpose**: Implement all business logic for student records, authentication, and file uploads.

**Connected Collections**:
- `admindetails` - Stores admin user credentials
- `images` - Stores student records and image metadata

**File Upload Configuration**:
```javascript
var storage = multer.diskStorage({
  destination: 'public/uploads',
  filename: file.originalname
});
```

---

## Database Schema

### MongoDB Connection
```
URL: mongodb://localhost:27017/ocr
Database: ocr
```

### Collection: `admindetails`

**Purpose**: Stores administrator credentials for authentication.

**Document Structure**:
```javascript
{
  _id: ObjectId,
  username: String,      // Admin username
  password: String       // Admin password (plaintext - SECURITY CONCERN)
}
```

**Usage**: Login/registration verification

---

### Collection: `images`

**Purpose**: Stores student records and their associated images.

**Document Structure**:
```javascript
{
  _id: ObjectId,
  image: String,         // Original filename
  rollno: String,        // Student roll number (unique identifier)
  name: String,          // Student full name
  validtill: String,     // Validity period
  college: String,       // Institution name
  department: String,    // Department/faculty
  city: String,          // City location
  course: String         // Course/program name
}
```

**Indexing Recommendations**:
- `rollno` (unique index) - Used for lookups and prevents duplicates

---

## API Endpoints

### GET Routes

#### `GET /`
- **Purpose**: Home page (index/upload form)
- **Response**: Renders `index.pug` template
- **Status**: 200 OK

#### `GET /loginreg`
- **Purpose**: Display login/registration page with admin list
- **Query Params**: None
- **Response**: Renders `loginreg.pug` with admin details
- **Status**: 200 OK
- **Query Processing**:
  ```javascript
  collection.find({}) → gets all admins
  docs[s-1] → accesses last admin (s = length)
  ```

#### `GET /table`
- **Purpose**: Display all student records in table format
- **Query Params**: None
- **Response**: Renders `table.pug` with student data
- **Status**: 200 OK
- **Data Flow**: Fetches all documents from `images` collection

#### `GET /getdata`
- **Purpose**: Retrieve all student records as JSON
- **Response**: JSON array of all student records
- **Status**: 200 OK
- **Content-Type**: application/json

---

### POST Routes

#### `POST /upload`
- **Purpose**: Upload student image and record details
- **Middleware**: Multer single file upload (`photo` field)
- **Request Body**:
  ```javascript
  {
    photo: File,           // Multipart file upload
    rollno: String,        // Student roll number
    name: String,          // Student name
    validtill: String,     // Validity period
    college: String,       // College name
    department: String,    // Department
    city: String,          // City
    course: String         // Course name
  }
  ```
- **Response**: Renders `index.pug`
- **Validation**: Checks for duplicate rollno
- **Error Response**: `{"exist":"rollno already exist"}`
- **File Storage**: Saved to `public/uploads/` with original filename

#### `POST /signin`
- **Purpose**: Authenticate admin user
- **Request Body**:
  ```javascript
  {
    username: String,
    password: String
  }
  ```
- **Success**: Redirects to `/table`
- **Failure**: Renders `index.pug` with error message
- **Response**: `{"error":"invalid details"}` on auth failure

#### `POST /getdata` (Alternative)
- **Alias**: See `GET /getdata` above

#### `POST /editdata`
- **Purpose**: Update student record
- **Request Body**:
  ```javascript
  {
    _id: ObjectId,         // Document ID
    ...fields to update    // Any student record fields
  }
  ```
- **Database Operation**: `update({_id}, {$set: body})`
- **Response**: Updated document

#### `POST /delete`
- **Purpose**: Delete student record by roll number
- **Request Body**:
  ```javascript
  {
    rollno: String
  }
  ```
- **Database Operation**: `remove({rollno})`
- **Response**: Deletion result

#### `POST /edit`
- **Purpose**: Fetch specific student record for editing
- **Request Body**:
  ```javascript
  {
    b: String              // Roll number to search
  }
  ```
- **Response**: JSON document matching the roll number
- **Field Name**: Uses `rollno` for comparison despite body parameter `b`

#### `POST /download`
- **Purpose**: Retrieve student record for download
- **Request Body**:
  ```javascript
  {
    id: String             // Roll number (parameter named 'id' but searches 'rollno')
  }
  ```
- **Response**: JSON document matching the roll number

#### `POST /update`
- **Purpose**: Update student record and redirect
- **Request Body**:
  ```javascript
  {
    id: ObjectId,          // Document ID
    ...fields to update    // Any student record fields
  }
  ```
- **Database Operation**: `update({_id: id}, {$set: body})`
- **Response**: Redirect to `/table`

---

## Request/Response Flow

### User Authentication Flow

```
┌──────────────┐
│   Browser    │
└──────┬───────┘
       │ GET /loginreg
       ▼
┌──────────────────────────────┐
│ Express Router               │
│ collection.find({})          │
└──────┬───────────────────────┘
       │ Query MongoDB
       ▼
┌──────────────────────────────┐
│ MongoDB                      │
│ admindetails collection      │
└──────┬───────────────────────┘
       │ Admin documents
       ▼
┌──────────────────────────────┐
│ Pug Template (loginreg.pug)  │
│ Renders: form + admin list   │
└──────┬───────────────────────┘
       │ HTML response
       ▼
┌──────────────┐
│   Browser    │
│ Displays     │
│ login form   │
└──────────────┘
       │ POST /signin (username, password)
       ▼
┌──────────────────────────────┐
│ Express Router               │
│ findOne({username, password})│
└──────┬───────────────────────┘
       │ Query MongoDB
       ▼
┌──────────────────────────────┐
│ MongoDB Authentication       │
│ Credential verification      │
└──────┬───────────────────────┘
       │ docs found?
       ├─ YES ──────────────┐
       │                    │
       NO                   ▼
       │          ┌────────────────────┐
       │          │ Redirect to /table │
       │          │ (student records)  │
       │          └────────────────────┘
       │
       └────────┐
                │ docs not found
                ▼
        ┌──────────────────────────────┐
        │ Render index.pug with error  │
        │ "invalid details"            │
        └──────────────────────────────┘
```

### File Upload Flow

```
┌──────────────┐
│   Browser    │
└──────┬───────┘
       │ POST /upload (multipart)
       │ - file: photo
       │ - rollno, name, college, etc.
       ▼
┌──────────────────────────────┐
│ Multer Middleware            │
│ - Parses multipart data      │
│ - Saves file to public/uploads/
│ - Extracts form fields       │
└──────┬───────────────────────┘
       │ req.file, req.body
       ▼
┌──────────────────────────────┐
│ Express Route Handler        │
│ /upload POST                 │
└──────┬───────────────────────┘
       │ findOne({rollno})
       │ Check for duplicates
       ▼
┌──────────────────────────────┐
│ MongoDB Query                │
│ images collection            │
└──────┬───────────────────────┘
       │ doc found?
       ├─ YES ──────────────┐
       │                    │
       NO                   ▼
       │          ┌──────────────────────┐
       │          │ Render with error    │
       │          │ "rollno already exist"
       │          └──────────────────────┘
       │
       └────────┐
                │ doc not found
                ▼
        ┌──────────────────────────────┐
        │ images.insert({...})         │
        │ Store new student record     │
        └──────┬───────────────────────┘
               │ Document inserted
               ▼
        ┌──────────────────────────────┐
        │ Render index.pug (success)   │
        │ Upload form clears           │
        └──────────────────────────────┘
```

### Data Display Flow

```
┌──────────────┐
│   Browser    │
└──────┬───────┘
       │ GET /table
       ▼
┌──────────────────────────────┐
│ Express Route Handler        │
│ GET /table                   │
└──────┬───────────────────────┘
       │ images.find({})
       ▼
┌──────────────────────────────┐
│ MongoDB Query                │
│ images collection            │
│ Retrieve all records         │
└──────┬───────────────────────┘
       │ Array of documents
       ▼
┌──────────────────────────────┐
│ Pug Template (table.pug)     │
│ Renders: data in table format│
│ - Headers: rollno, name, etc │
│ - Rows: student records      │
└──────┬───────────────────────┘
       │ HTML response
       ▼
┌──────────────┐
│   Browser    │
│ Displays     │
│ student table│
└──────────────┘
```

---

## Security Considerations

### ⚠️ Critical Issues

#### 1. **Plaintext Password Storage**
- **Location**: `admindetails` collection stores passwords as plaintext
- **Risk**: HIGH - Credentials exposed in database backups/unauthorized access
- **Recommendation**: Use bcrypt or similar hashing (bcryptjs, argon2)

#### 2. **SQL/NoSQL Injection Vulnerability**
- **Location**: Direct user input in queries (e.g., `signin`, `edit`, `download`)
- **Risk**: HIGH - Input validation not performed
- **Recommendation**: Use parameterized queries, input sanitization

#### 3. **Missing Authentication**
- **Issue**: File upload endpoint (`/upload`) has no authentication check
- **Risk**: MEDIUM-HIGH - Anyone can upload student records
- **Recommendation**: Implement session middleware, authentication middleware

#### 4. **Unrestricted File Upload**
- **Location**: `POST /upload` via Multer
- **Risk**: MEDIUM - No file type/size validation
- **Recommendation**: 
  - Validate file MIME types
  - Implement file size limits
  - Rename uploaded files (don't use original names)
  - Store uploads outside web root

#### 5. **Missing Input Validation**
- **Location**: All POST endpoints accept unvalidated input
- **Risk**: MEDIUM - NoSQL injection, data corruption
- **Recommendation**: Use validation library (joi, express-validator)

#### 6. **No CSRF Protection**
- **Risk**: MEDIUM - Forms vulnerable to cross-site request forgery
- **Recommendation**: Implement CSRF tokens (express-csurf)

#### 7. **Insecure Direct Object References**
- **Location**: `/edit`, `/delete`, `/update` endpoints accept `_id` directly
- **Risk**: MEDIUM - Users could modify other users' records if authenticated
- **Recommendation**: Implement authorization checks

---

## Deployment & Operations

### Development Setup

```bash
# Clone repository
git clone <repository-url>
cd JSPDF

# Install dependencies
npm install

# Ensure MongoDB is running locally
mongod --dbpath /path/to/data

# Start development server
npm start
# Server accessible at http://localhost:3000
```

### Environment Configuration

**Current Configuration** (Hardcoded):
```javascript
// Database connection
const db = monk('localhost:27017/ocr');

// Server port
const port = process.env.PORT || '3000';

// File upload destination
const uploadDir = 'public/uploads';
```

**Recommended Environment Variables**:
```bash
NODE_ENV=development
PORT=3000
MONGODB_URL=mongodb://localhost:27017/ocr
UPLOAD_DIR=/path/to/uploads
SESSION_SECRET=<secure-random-string>
```

### Production Deployment Recommendations

#### 1. **Environment Setup**
- Use `.env` file with environment-specific variables
- Load via `dotenv` package
- Never commit secrets to repository

#### 2. **Database**
- Deploy MongoDB to managed service (Atlas, Azure CosmosDB)
- Enable authentication with strong passwords
- Implement backup/recovery strategy
- Use replica sets for redundancy

#### 3. **Server Hosting**
- Deploy to Node-compatible platform (AWS EC2, Heroku, DigitalOcean)
- Use process manager (PM2) for automatic restarts
- Implement reverse proxy (Nginx) for load balancing
- Configure SSL/TLS certificates (Let's Encrypt)

#### 4. **Security Hardening**
- Implement authentication/authorization
- Use helmet middleware for HTTP headers
- Add rate limiting (express-rate-limit)
- Enable CORS protection
- Implement HTTPS redirect

#### 5. **Logging & Monitoring**
- Centralize logs (Winston, Bunyan)
- Monitor application performance
- Set up error tracking (Sentry)
- Configure alerts for failures

#### 6. **File Storage**
- Move uploads to cloud storage (AWS S3, Azure Blob)
- Implement cleanup policy for old uploads
- Virus scanning for uploaded files

### Production Package.json Enhancements

```json
{
  "scripts": {
    "start": "node ./bin/www",
    "dev": "nodemon ./bin/www",
    "prod": "NODE_ENV=production node ./bin/www",
    "test": "jest --coverage",
    "lint": "eslint ."
  },
  "devDependencies": {
    "nodemon": "^2.0.0",
    "eslint": "^7.0.0",
    "jest": "^26.0.0"
  }
}
```

---

## Performance Considerations

### Database Optimization
- Add index on `admindetails.username` for faster login queries
- Add unique index on `images.rollno` to prevent duplicates
- Consider pagination for large datasets in `/table` endpoint

### Caching Strategy
- Cache admin list in memory (doesn't change frequently)
- Implement HTTP caching headers for static assets

### File Upload Handling
- Limit file sizes to prevent server overload
- Implement async processing for large batch uploads
- Consider image compression before storage

### API Response Optimization
- Implement pagination for `/getdata` endpoint
- Only return necessary fields in responses
- Use streaming for large file downloads

---

## Testing Strategy

### Unit Tests
- Test route handlers in isolation
- Mock MongoDB operations
- Verify input validation

### Integration Tests
- Test complete request/response cycles
- Use test database
- Verify data persistence

### Security Tests
- SQL/NoSQL injection attempts
- Unauthorized access attempts
- File upload boundary conditions

### Example Test Structure
```javascript
describe('Student Management', () => {
  describe('POST /upload', () => {
    it('should reject duplicate roll numbers');
    it('should validate file types');
    it('should require authentication');
  });
  
  describe('POST /signin', () => {
    it('should authenticate valid credentials');
    it('should reject invalid credentials');
  });
});
```

---

## Maintenance & Operations

### Regular Tasks
- Monitor MongoDB disk space
- Archive old uploads
- Review application logs
- Update dependencies (security patches)
- Backup database daily

### Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Connection refused | MongoDB not running | Start MongoDB service |
| EADDRINUSE | Port 3000 in use | Kill process or change PORT env var |
| Upload fails | No write permissions | Check `public/uploads/` permissions |
| Slow queries | Missing indexes | Add database indexes |
| Memory leak | Long-running processes | Implement connection pooling |

---

## Conclusion

JSPDF is a straightforward Express.js application for student record management. While functional for development/learning purposes, it requires significant security enhancements before production deployment. Priority improvements include password hashing, input validation, authentication middleware, and proper error handling.

For questions or improvements, refer to the main README.md file or project documentation.
