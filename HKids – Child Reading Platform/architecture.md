# 🏗️ HKids Platform Architecture

## System Overview

HKids is a full-stack web application designed as a child-friendly digital reading platform with a secure content management system. The architecture follows a client-server model with clear separation between frontend and backend.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│                                                                 │
│  ┌──────────────────┐         ┌──────────────────┐            │
│  │  Child Interface │         │  Admin Dashboard │            │
│  │  (React + Vite)  │         │  (React + Vite)  │            │
│  └────────┬─────────┘         └────────┬─────────┘            │
│           │                            │                       │
│           └────────────┬───────────────┘                       │
│                        │                                       │
│                 ┌──────▼──────┐                                │
│                 │  React Router│                                │
│                 │  Auth Context│                                │
│                 │  API Service │                                │
│                 └──────┬───────┘                                │
└────────────────────────┼───────────────────────────────────────┘
                         │ HTTP/REST API
                         │ (Axios)
┌────────────────────────▼───────────────────────────────────────┐
│                      API LAYER                                  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              Express.js Server                            │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │ │
│  │  │ Auth Routes  │  │ Book Routes  │  │ Static Files  │  │ │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │ │
│  │         │                 │                  │           │ │
│  │  ┌──────▼─────────────────▼──────────────────▼───────┐  │ │
│  │  │           Middleware Layer                         │  │ │
│  │  │  • JWT Authentication                              │  │ │
│  │  │  • Admin Authorization                             │  │ │
│  │  │  • File Upload (Multer)                            │  │ │
│  │  │  • CORS                                            │  │ │
│  │  └──────┬─────────────────────────────────────────────┘  │ │
│  └─────────┼────────────────────────────────────────────────┘ │
│            │                                                   │
│  ┌─────────▼───────────────────────────────────────────────┐ │
│  │              Controller Layer                           │ │
│  │  • AuthController (login, register, profile)            │ │
│  │  • BookController (CRUD operations)                     │ │
│  └─────────┬───────────────────────────────────────────────┘ │
└────────────┼───────────────────────────────────────────────────┘
             │
┌────────────▼───────────────────────────────────────────────────┐
│                    DATA LAYER                                   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              MongoDB Database                             │ │
│  │                                                           │ │
│  │  ┌──────────────┐         ┌──────────────┐             │ │
│  │  │  Users       │         │   Books       │             │ │
│  │  │  Collection  │         │  Collection   │             │ │
│  │  │              │         │               │             │ │
│  │  │ • _id        │         │ • _id         │             │ │
│  │  │ • username   │         │ • title       │             │ │
│  │  │ • email      │         │ • description │             │ │
│  │  │ • password   │         │ • ageGroup    │             │ │
│  │  │ • role       │         │ • category    │             │ │
│  │  └──────────────┘         │ • coverImage  │             │ │
│  │                           │ • pages[]    │             │ │
│  │                           │ • isPublished│             │ │
│  │                           │ • uploadedBy │             │ │
│  │                           └──────────────┘             │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │         File Storage (Local Filesystem)                   │ │
│  │                                                           │ │
│  │  backend/uploads/                                         │ │
│  │  ├── coverImage-*.jpg                                    │ │
│  │  └── pages-*.jpg                                         │ │
│  └──────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### Frontend Architecture

#### 1. **Presentation Layer**
- **Pages:** Top-level route components
  - `Home.jsx` - Landing page with navigation
  - `ReadingInterface.jsx` - Child reading experience
  - `AdminLogin.jsx` - Admin authentication
  - `AdminDashboard.jsx` - Content management interface

#### 2. **Component Layer**
- **Reusable Components:**
  - `BookCard.jsx` - Book display card
  - `BookForm.jsx` - Book creation/editing form
  - `ProtectedRoute.jsx` - Route guard for admin pages

#### 3. **Service Layer**
- **API Service (`api.js`):**
  - Centralized Axios instance
  - Request/response interceptors
  - Token management
  - Error handling

- **Auth Context (`AuthContext.jsx`):**
  - Global authentication state
  - Login/logout functions
  - User session management

#### 4. **State Management**
- React Context API for authentication
- Local component state for UI interactions
- Server state via API calls

### Backend Architecture

#### 1. **Route Layer**
- **Auth Routes (`authRoutes.js`):**
  - `/api/auth/register` - Admin registration
  - `/api/auth/login` - Admin login
  - `/api/auth/profile` - Get current user (protected)

- **Book Routes (`bookRoutes.js`):**
  - `/api/books/published` - Public: Get published books
  - `/api/books` - Admin: Get all books
  - `/api/books/:id` - Admin: Get/Update/Delete book
  - `/api/books` (POST) - Admin: Create book

#### 2. **Middleware Layer**
- **Authentication (`auth.js`):**
  - JWT token verification
  - User extraction from token
  - Admin role verification

- **File Upload (Multer):**
  - Image/PDF validation
  - File size limits (10MB)
  - Secure file naming

#### 3. **Controller Layer**
- **Auth Controller:**
  - User registration with password hashing
  - Login with credential verification
  - Profile retrieval

- **Book Controller:**
  - CRUD operations
  - File management (upload/delete)
  - Published/unpublished filtering

#### 4. **Model Layer**
- **User Model:**
  - Schema: username, email, password, role
  - Password hashing middleware
  - Password comparison method

- **Book Model:**
  - Schema: title, description, ageGroup, category, coverImage, pages, isPublished
  - Indexes for efficient queries
  - Relationships with User model

## Data Flow

### Reading Flow (Child Interface)
```
User → Home Page → Reading Interface
  ↓
Filter by Age/Category
  ↓
Select Book → Fetch Book Details
  ↓
Display Cover → Navigate Pages
  ↓
Page Flip Animation (Framer Motion)
```

### Admin Flow
```
Admin → Login → JWT Token
  ↓
Dashboard → Fetch All Books
  ↓
Create/Edit/Delete → API Request
  ↓
File Upload → Multer → Save to Disk
  ↓
Database Update → MongoDB
```

### Authentication Flow
```
Login Request → Auth Controller
  ↓
Verify Credentials → Compare Password (bcrypt)
  ↓
Generate JWT Token → Return to Client
  ↓
Store Token (localStorage) → Include in Requests
  ↓
Protected Routes → Verify Token → Allow Access
```

## Technology Stack Justification

### Frontend Choices

1. **React.js (Vite)**
   - **Why:** Modern, component-based architecture
   - **Vite:** Fast development server, instant HMR
   - **Performance:** Optimized for low-power devices

2. **Tailwind CSS**
   - **Why:** Utility-first approach, rapid UI development
   - **Child-friendly:** Easy to create large, colorful buttons
   - **Responsive:** Built-in responsive utilities

3. **Framer Motion**
   - **Why:** Smooth, performant animations
   - **Page flip:** Realistic book reading experience
   - **Hardware-accelerated:** Optimized for tablets

4. **React Router**
   - **Why:** Client-side routing, no page reloads
   - **Protected routes:** Secure admin access
   - **SPA benefits:** Fast navigation

5. **Axios**
   - **Why:** Promise-based HTTP client
   - **Interceptors:** Automatic token injection
   - **Error handling:** Centralized error management

### Backend Choices

1. **Node.js + Express**
   - **Why:** JavaScript full-stack consistency
   - **Express:** Minimal, flexible framework
   - **Middleware:** Easy to add authentication, CORS, etc.

2. **MongoDB (Mongoose)**
   - **Why:** Flexible schema for books (variable pages)
   - **NoSQL:** Easy to add new fields
   - **Scalability:** Horizontal scaling capability

3. **JWT Authentication**
   - **Why:** Stateless, scalable authentication
   - **Security:** Token-based, no server-side sessions
   - **Mobile-ready:** Works with any client

4. **Multer**
   - **Why:** Standard Express file upload middleware
   - **Flexibility:** Supports multiple files
   - **Validation:** File type and size checks

5. **bcryptjs**
   - **Why:** Secure password hashing
   - **Industry standard:** Widely used, well-tested
   - **Salt rounds:** Configurable security level

## Hardware Assumptions

### Target Devices
- **Primary:** Tablets (iPad, Android tablets)
- **Secondary:** Low-power laptops/netbooks
- **Screen sizes:** 7" to 12" displays
- **Touch support:** Swipe gestures for page turning

### Performance Optimizations
1. **Image optimization:**
   - Serve appropriately sized images
   - Lazy loading for book covers
   - Compressed file formats

2. **Code splitting:**
   - Vite automatically code-splits
   - Route-based lazy loading possible

3. **Caching:**
   - Static assets cached by browser
   - API responses can be cached

4. **Minimal dependencies:**
   - Lightweight bundle size
   - Tree-shaking enabled

## Security Architecture

### Authentication & Authorization
```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │ 1. Login Request (email, password)
       ▼
┌─────────────────┐
│  Auth Controller│
│  • Verify email │
│  • Hash compare │
└──────┬──────────┘
       │ 2. Generate JWT (userId, expiresIn: 7d)
       ▼
┌─────────────────┐
│  Client Storage │
│  (localStorage) │
└──────┬──────────┘
       │ 3. Include in Authorization header
       ▼
┌─────────────────┐
│  Auth Middleware│
│  • Verify token │
│  • Extract user │
│  • Check admin  │
└──────┬──────────┘
       │ 4. Attach user to request
       ▼
┌─────────────────┐
│   Controller    │
│  (Authorized)   │
└─────────────────┘
```

### Data Protection
- **Password hashing:** bcrypt with salt rounds
- **JWT secrets:** Environment variables
- **File upload:** Type and size validation
- **CORS:** Restricted to frontend URL
- **Input validation:** Required fields, type checking

## Scalability Considerations

### Current Architecture (POC)
- Single server instance
- Local file storage
- MongoDB single instance

### Future Scalability Paths

1. **Horizontal Scaling:**
   - Load balancer → Multiple Express instances
   - Session stickiness not needed (JWT stateless)

2. **Database Scaling:**
   - MongoDB replica sets
   - Read replicas for book queries
   - Sharding for large datasets

3. **File Storage:**
   - Move to cloud storage (AWS S3, Cloudinary)
   - CDN for image delivery
   - Automatic image optimization

4. **Caching:**
   - Redis for session tokens (if needed)
   - CDN caching for static assets
   - API response caching

5. **Microservices (if needed):**
   - Separate auth service
   - Separate file upload service
   - Separate content service

## Deployment Architecture

### Development
```
┌──────────────┐         ┌──────────────┐
│   Frontend   │────────▶│   Backend    │
│  (Vite Dev)  │  Proxy  │  (Express)   │
│  :5173       │         │    :5000     │
└──────────────┘         └──────┬───────┘
                                │
                         ┌──────▼──────┐
                         │   MongoDB   │
                         │  (Local)    │
                         └─────────────┘
```

### Production (Recommended)
```
┌─────────────────┐
│   CDN/Static    │
│   Hosting       │
│  (Vercel/Netlify)│
└─────────────────┘
         │
         │ API Calls
         ▼
┌─────────────────┐
│   Load Balancer │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼───┐
│Server │ │Server│
│   1   │ │  2   │
└───┬───┘ └──┬───┘
    │        │
    └────┬───┘
         │
    ┌────▼────┐
    │ MongoDB │
    │  Atlas  │
    └─────────┘
         │
    ┌────▼────┐
    │  Cloud  │
    │ Storage │
    │  (S3)   │
    └─────────┘
```

## API Design Principles

### RESTful Conventions
- **GET** - Retrieve resources
- **POST** - Create resources
- **PUT** - Update resources
- **DELETE** - Delete resources

### Response Format
```json
{
  "message": "Success message",
  "data": { ... },
  "error": "Error message (if any)"
}
```

### Error Handling
- **400** - Bad Request (validation errors)
- **401** - Unauthorized (invalid/missing token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found
- **500** - Server Error

## Future Architecture Enhancements

### Phase 2: Audio Narration
```
Book Model → Add audioFile field
Reading Interface → Audio player component
Backend → Audio file upload endpoint
```

### Phase 3: Parental Dashboard
```
New User Model → Parent role
New Collection → Reading Sessions
Analytics API → Track reading time, books read
```

### Phase 4: Offline Support
```
Service Worker → Cache books
PWA Manifest → Installable app
IndexedDB → Local book storage
```

## Conclusion

The HKids platform is architected for:
- **Simplicity:** Easy to understand and maintain
- **Security:** JWT auth, password hashing, protected routes
- **Performance:** Optimized for low-power devices
- **Scalability:** Can grow from POC to production
- **Modularity:** Easy to add new features

The separation of concerns (frontend/backend) allows for independent scaling and deployment, making it suitable for both small-scale and enterprise deployments.
