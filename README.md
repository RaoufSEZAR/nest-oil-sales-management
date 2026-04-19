# Oil Sales - E-Commerce Platform

A comprehensive e-commerce platform built with modern web technologies for managing products, orders, payments, reviews, and user interactions.

## 🚀 Project Overview

Oil Sales is a full-featured e-commerce backend application designed to handle product catalog management, user authentication, order processing, payment integration, and comprehensive notification systems. The platform supports multiple user roles (Admin, User) with role-based access control and advanced features like discounts, wishlists, and review systems.

## 💻 Technology Stack

### Programming Languages & Frameworks

- **TypeScript** - Primary programming language
- **Node.js** - JavaScript runtime
- **NestJS** - Progressive Node.js framework

### Core Technologies

- **PostgreSQL** - Relational database management system
- **TypeORM** - Object-Relational Mapping framework
- **JWT** (JSON Web Tokens) - Authentication mechanism
- **Passport** - Authentication middleware
- **Swagger/OpenAPI** - API documentation

### Key Libraries & Tools

- `@nestjs/common`, `@nestjs/core` - Core NestJS functionality
- `bcrypt` - Password hashing
- `class-validator` & `class-transformer` - DTO validation
- `@nestjs/throttler` - Rate limiting
- `swagger-ui-express` - API documentation UI

## 📦 Features

### Authentication & Authorization

- ✅ **JWT-based Authentication** - Secure token-based authentication
- ✅ **Role-Based Access Control (RBAC)** - Admin and User roles
- ✅ **Password Encryption** - Bcrypt password hashing
- ✅ **Rate Limiting** - Protection against brute-force attacks (3 req/min for auth, 20 req/min for general endpoints)

### User Management

- ✅ **User Registration & Login**
- ✅ **User Profiles** with gender support
- ✅ **User Roles** - Admin and regular users
- ✅ **User Activity Tracking**
- ✅ **Pagination** for user listings

### Product Management

- ✅ **Item Catalog** - Complete product management
- ✅ **Categories** - Hierarchical category system
- ✅ **Item Status** - Active/Inactive items
- ✅ **Featured Items**
- ✅ **Product Search & Filtering**
- ✅ **Item Details** - Comprehensive product information
- ✅ **Slug-based URLs** for SEO-friendly routes
- ✅ **Pagination** support

### Shopping Features

- ✅ **Shopping Cart** - Wishlist functionality
- ✅ **Purchase Management** - Order tracking
- ✅ **Order Status** - Multiple order states
- ✅ **Purchase History**

### Payment System

- ✅ **Multiple Payment Methods**:
  - Credit Card
  - Debit Card
  - Bank Transfer
  - Wallet
  - Cash on Delivery
- ✅ **Payment Gateways** - Stripe, PayPal, Manual
- ✅ **Payment Status Tracking** - Pending, Completed, Failed, Refunded
- ✅ **Payment Transactions** - Detailed transaction history
- ✅ **Refund Management**
- ✅ **Payment Timestamps** - Created, completed, and failed timestamps

### Discount System

- ✅ **Discount Codes** - Customizable discount codes
- ✅ **Discount Types**:
  - Percentage-based discounts
  - Fixed amount discounts
- ✅ **Discount Scope**:
  - General discounts (all users)
  - User-specific discounts
- ✅ **Usage Limits** - Control discount usage count
- ✅ **Date Validity** - Start and end dates
- ✅ **Minimum Purchase Requirements**
- ✅ **Maximum Discount Caps**

### Reviews & Ratings

- ✅ **Product Reviews** - User-generated reviews
- ✅ **Rating System** - 1-5 star ratings
- ✅ **Review Verification** - Verified purchase reviews
- ✅ **Review Filtering** - By rating, item, user
- ✅ **Review Pagination**

### Advertising

- ✅ **Ad Management** - Create and manage advertisements
- ✅ **Ad Types** - Different ad formats
- ✅ **Ad Positioning** - Placement control
- ✅ **Priority System** - Ad prioritization
- ✅ **Ad Status** - Active/Inactive ads

### Complaint Management

- ✅ **Complaint System** - User complaint handling
- ✅ **Complaint Categories** - Organized complaint types
- ✅ **Priority Levels** - Urgency classification
- ✅ **Status Tracking** - Complaint workflow
- ✅ **Admin Assignment** - Assign complaints to admins

### Wishlist

- ✅ **User Wishlist** - Save favorite items
- ✅ **Wishlist Management** - Add/remove items
- ✅ **Wishlist Analytics** - Most wishlisted items
- ✅ **Pagination** support

### Notifications

- ✅ **Notification System** - Comprehensive notification management
- ✅ **Notification Types**:
  - Order notifications (placed, confirmed, shipped, delivered, cancelled)
  - Payment notifications (received, failed)
  - Marketing notifications (discounts, new items)
  - User engagement (reviews, complaints, wishlist)
- ✅ **Multi-User Targeting** - Send to multiple users or general broadcast
- ✅ **Read Tracking** - Track who read which notifications
- ✅ **Notification Priorities** - Low, Normal, High, Urgent
- ✅ **Status Management** - Pending, Sent, Failed
- ✅ **Metadata Support** - Additional data, links, icons

### API Features

- ✅ **RESTful API** - Well-structured REST endpoints
- ✅ **Request Validation** - Input validation using class-validator
- ✅ **Pagination** - All list endpoints support pagination
- ✅ **Filtering** - Advanced filtering capabilities
- ✅ **Search Functionality** - Search across multiple fields
- ✅ **API Documentation** - Swagger/OpenAPI documentation
- ✅ **Error Handling** - Comprehensive error responses
- ✅ **CORS Support** - Cross-origin resource sharing

### Database Features

- ✅ **Relational Database** - PostgreSQL with TypeORM
- ✅ **Entity Relationships** - One-to-Many, Many-to-One, Many-to-Many
- ✅ **Database Indexing** - Optimized queries
- ✅ **Timestamps** - Automatic createdAt/updatedAt tracking
- ✅ **Soft Deletes** - Optional soft delete support
- ✅ **Migration Support** - Database versioning

### Security

- ✅ **Authentication Guards** - JWT-based protection
- ✅ **Role Guards** - Role-based route protection
- ✅ **Rate Limiting** - API abuse prevention
- ✅ **Password Hashing** - Secure password storage
- ✅ **Input Validation** - Prevent injection attacks
- ✅ **CORS Configuration** - Secure cross-origin access

## 🏗️ Project Structure

```
oil-sales-app/
├── src/
│   ├── ads/              # Advertisement management
│   ├── auth/             # Authentication & authorization
│   ├── categories/       # Category management
│   ├── complaints/       # Complaint management
│   ├── common/           # Shared utilities and decorators
│   ├── discount/         # Discount management
│   ├── items/            # Product/item management
│   ├── notifications/    # Notification system
│   ├── payments/         # Payment processing
│   ├── purchases/        # Purchase/order management
│   ├── reviews/          # Review & rating system
│   ├── users/            # User management
│   ├── wishlist/         # Wishlist functionality
│   ├── app.module.ts     # Root application module
│   └── main.ts           # Application entry point
├── test/                 # Test files
├── config.env            # Environment configuration
├── package.json          # Dependencies and scripts
└── README.md            # Project documentation
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd oil-sales-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `config.env` file in the root directory:

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=oil-sales-app

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=24h

   # Application Configuration
   PORT=3000
   NODE_ENV=development
   ```

4. **Set up the database**

   ```bash
   # Create PostgreSQL database
   createdb oil-sales-app
   ```

5. **Run database migrations** (if any)

   ```bash
   npm run build
   ```

6. **Start the application**

   ```bash
   # Development mode with hot-reload
   npm run start:dev

   # Production mode
   npm run build
   npm run start:prod
   ```

## 📚 API Documentation

Once the application is running, access the Swagger API documentation at:

```
http://localhost:3000/api/docs
```

### Base URL

```
http://localhost:3000
```

### Authentication

All protected endpoints require a JWT token in the header:

```
Authorization: Bearer <your-jwt-token>
```

### Main API Endpoints

#### Authentication

- `POST /auth/register` - User registration
- `POST /auth/login` - User login

#### Users

- `GET /users` - Get all users (Admin only)
- `GET /users/:id` - Get user by ID
- `POST /users` - Create user (Admin only)
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user (Admin only)

#### Items

- `GET /items` - Get all items
- `GET /items/public` - Get active items (Public)
- `GET /items/:id` - Get item by ID
- `POST /items` - Create item (Admin only)
- `PATCH /items/:id` - Update item (Admin only)
- `DELETE /items/:id` - Delete item (Admin only)

#### Categories

- `GET /categories` - Get all categories
- `GET /categories/public` - Get active categories (Public)
- `GET /categories/:id` - Get category by ID
- `POST /categories` - Create category (Admin only)
- `PATCH /categories/:id` - Update category (Admin only)

#### Payments

- `GET /payments` - Get all payments (Admin only)
- `GET /payments/my` - Get my payments
- `POST /payments` - Create payment
- `GET /payments/:id` - Get payment by ID
- `PATCH /payments/:id` - Update payment (Admin only)

#### Purchases

- `GET /purchases/my` - Get my purchases
- `POST /purchases` - Create purchase
- `GET /purchases/item/:itemId` - Get purchases for item (Admin only)

#### Reviews

- `GET /reviews` - Get all reviews
- `POST /reviews` - Create review
- `GET /reviews/:id` - Get review by ID
- `PATCH /reviews/:id` - Update review

#### Wishlist

- `GET /wishlist` - Get my wishlist
- `POST /wishlist` - Add item to wishlist
- `GET /wishlist/count` - Get wishlist count
- `DELETE /wishlist/:id` - Remove from wishlist

#### Discounts

- `GET /discount` - Get all discounts
- `POST /discount` - Create discount (Admin only)
- `GET /discount/:id` - Get discount by ID
- `PATCH /discount/:id` - Update discount (Admin only)
- `DELETE /discount/:id` - Delete discount (Admin only)

#### Notifications

- `GET /notifications` - Get all notifications (Admin only)
- `GET /notifications/my` - Get my notifications
- `POST /notifications` - Create notification (Admin only)
- `POST /notifications/:id/read` - Mark as read
- `POST /notifications/read-all` - Mark all as read

## 🔧 Development Scripts

```bash
# Development
npm run start:dev      # Start with hot-reload
npm run start:debug    # Start with debug mode

# Production
npm run build          # Build for production
npm run start:prod     # Start production server

# Testing
npm run test           # Run unit tests
npm run test:e2e       # Run e2e tests
npm run test:cov       # Run tests with coverage

# Code Quality
npm run lint           # Lint code
npm run format         # Format code
```

## 📋 Database Schema

### Core Entities

- **Users** - User accounts and profiles
- **Categories** - Product categories
- **Items** - Products/items in the catalog
- **Purchases** - Order/transaction records
- **Payments** - Payment transactions
- **Reviews** - Product reviews and ratings
- **Complaints** - User complaints
- **Ads** - Advertisement management
- **Wishlist** - User wishlists
- **Discounts** - Discount codes and rules
- **Notifications** - Notification records

### Key Relationships

- Users ↔ Purchases (One-to-Many)
- Users ↔ Payments (One-to-Many)
- Users ↔ Reviews (One-to-Many)
- Items ↔ Purchases (One-to-Many)
- Categories ↔ Items (One-to-Many)

## 🔐 Security Features

1. **JWT Authentication** - Secure token-based authentication
2. **Password Hashing** - Bcrypt with salt rounds
3. **Role-Based Access** - Admin and User permissions
4. **Rate Limiting** - API abuse prevention
5. **Input Validation** - DTO validation on all endpoints
6. **CORS Protection** - Configured CORS settings
7. **Environment Variables** - Sensitive data protection

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run e2e tests
npm run test:e2e

# Generate coverage report
npm run test:cov
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the UNLICENSED License.

## 👥 Authors

- **Development Team** - Raouf Satto

## 🙏 Acknowledgments

- NestJS community
- PostgreSQL team
- All contributors to open-source libraries used

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Version:** 1.0.0  
**Last Updated:** October 2024  
**Node Version:** 16.x or higher  
**Database:** PostgreSQL 12 or higher
**Happy Coding! 🚀**
