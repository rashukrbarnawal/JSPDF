# JSPDF - Student Record Management System

A comprehensive student record management system built with the MEAN stack (MongoDB, Express.js, Angular, Node.js) that includes image upload capabilities for student identification documents and records.

## 📋 Overview

JSPDF is an educational project designed to manage student records with image upload functionality. The application provides features for student authentication, CRUD operations on student data, image management, and record editing/deletion capabilities. It's built as a learning project to demonstrate full-stack web development practices.

## ✨ Features

- **User Authentication**: Admin login system with username and password verification
- **Student Record Management**: Complete CRUD operations for student information
- **Image Upload**: Upload and manage student identification images/documents
- **Data Display**: View all student records in a structured table format
- **Record Editing**: Edit existing student records with updated information
- **Record Deletion**: Remove student records from the system
- **Data Export/Download**: Retrieve specific student data by roll number
- **Database Storage**: MongoDB integration for persistent data storage

## 🛠️ Tech Stack

- **Backend**: Node.js with Express.js framework
- **Frontend**: Pug (Jade) templating engine for views
- **Database**: MongoDB with Monk ODM
- **File Upload**: Multer for handling multipart form data
- **Additional Dependencies**:
  - `cookie-parser`: Parse cookie headers
  - `morgan`: HTTP request logger
  - `debug`: Debugging utility
  - `base64-img` & `image-to-base64`: Image encoding utilities
  - `http-errors`: HTTP error handling

## 📁 Project Structure

```
JSPDF/
├── app.js                          # Main Express application setup
├── package.json                    # Project dependencies and metadata
├── bin/
│   └── www                         # Application entry point
├── routes/
│   ├── index.js                    # Main API routes and handlers
│   └── users.js                    # Additional user routes
├── views/                          # Pug template files
│   ├── layout.pug                  # Base layout template
│   ├── index.pug                   # Home page
│   ├── loginreg.pug                # Login/Registration page
│   ├── table.pug                   # Student records table view
│   ├── page2.pug                   # Additional page
│   └── error.pug                   # Error page
├── public/
│   ├── uploads/                    # Directory for uploaded student images
│   ├── images/                     # Static images
│   ├── javascripts/                # Client-side JavaScript files
│   └── stylesheets/                # CSS files
└── README.md                       # This file
```

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** (v10.0.0 or higher)
- **npm** (Node Package Manager)
- **MongoDB** (v3.6 or higher) running locally or accessible at `localhost:27017`

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rashukrbarnawal/JSPDF.git
   cd JSPDF
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure MongoDB**:
   - Ensure MongoDB is running on your system
   - The application connects to `localhost:27017/ocr` database by default
   - You can modify the connection string in `routes/index.js` (line 4):
     ```javascript
     var db = monk('localhost:27017/ocr');
     ```

4. **Start the application**:
   ```bash
   npm start
   ```
   
   Or alternatively:
   ```bash
   node ./bin/www
   ```

5. **Access the application**:
   - Open your browser and navigate to `http://localhost:3000`
   - Default port is 3000 (can be modified in `bin/www`)

## 📡 API Endpoints

| Method | Route | Description | Parameters |
|--------|-------|-------------|------------|
| GET | `/` | Render home page | - |
| GET | `/loginreg` | Load login/registration page | - |
| GET | `/table` | Display all student records | - |
| POST | `/signin` | Authenticate admin user | `username`, `password` |
| POST | `/upload` | Upload student record with image | `photo` (file), `rollno`, `name`, `validtill`, `college`, `department`, `city`, `course` |
| GET | `/getdata` | Get all student records (JSON) | - |
| POST | `/edit` | Get specific student by roll number | `b` (roll number) |
| POST | `/download` | Download student data by ID | `id` (roll number) |
| POST | `/editdata` | Update student record | `_id`, `rollno`, `name`, `validtill`, `college`, `department`, `city`, `course` |
| POST | `/update` | Update and redirect | `id`, `rollno`, `name`, `validtill`, `college`, `department`, `city`, `course` |
| POST | `/delete` | Delete student record | `rollno` |

## 🗄️ Database Schema

### Collections

#### 1. `admindetails` Collection
Stores admin/user credentials:
```
{
  _id: ObjectId,
  username: String,
  password: String
}
```

#### 2. `images` Collection
Stores student records with image references:
```
{
  _id: ObjectId,
  image: String,              // Filename of uploaded image
  rollno: String,             // Student roll number (unique)
  name: String,               // Student full name
  validtill: String,          // Validity period of record
  college: String,            // College name
  department: String,         // Department/Major
  city: String,               // City of origin
  course: String              // Course/Program name
}
```

## ⚙️ Configuration

### MongoDB Connection
Edit `routes/index.js` to change database configuration:
```javascript
var db = monk('your_mongo_uri/database_name');
```

### Port Configuration
Edit `bin/www` to change the application port:
```javascript
var port = process.env.PORT || 3000;
```

### Upload Directory
The upload directory is configured in `routes/index.js` (line 10):
```javascript
destination: function (req, file, cb) {
  cb(null, 'public/uploads')
}
```

## ⚠️ Security Notes

**Important**: This is a learning/educational project. It should not be used in production without significant security enhancements:

- **Password Storage**: Currently stores passwords in plain text. Use bcrypt or similar for hashing in production.
- **Input Validation**: Add comprehensive input validation and sanitization
- **Authentication**: Implement proper JWT or session-based authentication
- **CORS**: Add CORS configuration for production
- **Error Handling**: Enhance error messages to avoid information leakage
- **File Upload Security**: 
  - Validate file types and sizes
  - Scan uploaded files for malware
  - Implement rate limiting
- **Database Security**: 
  - Use authentication for MongoDB
  - Restrict network access
  - Use environment variables for sensitive data

## 📝 Usage Example

### Upload a Student Record

```
POST /upload
Content-Type: multipart/form-data

photo: [image file]
rollno: 12345
name: John Doe
validtill: 2024-12-31
college: ABC University
department: Computer Science
city: New York
course: B.Tech
```

### Query Student Records

```
GET /getdata
Response: [
  {
    _id: "...",
    rollno: "12345",
    name: "John Doe",
    ...
  }
]
```

## 🐛 Troubleshooting

- **MongoDB Connection Error**: Ensure MongoDB is running and accessible at the configured URI
- **Port Already in Use**: Change the port in `bin/www` or stop the application using the current port
- **File Upload Issues**: Check that `public/uploads` directory exists and has write permissions
- **Pug Template Errors**: Ensure all template files are properly formatted

## 📚 Learning Resources

This project demonstrates:
- Express.js routing and middleware
- MongoDB operations with Monk ODM
- File upload handling with Multer
- Pug templating engine
- RESTful API design
- CRUD operations
- Form handling and validation

## 📄 License

This is an educational project. Please refer to the repository for any licensing information.

## 👨‍💻 Author

**Rashu Khurana** - [rashukrbarnawal](https://github.com/rashukrbarnawal)

## 🤝 Contributing

This is a student learning project. Feel free to fork, learn, and enhance the codebase!

---

**Note**: This is a 1st MEAN stack project created for educational purposes. It's designed to teach web development fundamentals and practices.
