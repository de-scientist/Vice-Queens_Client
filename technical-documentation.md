# Vice Queen Industries Technical Documentation

## Overview

This document provides a comprehensive overview of the Vice Queen Industries e-commerce platform, built with React, TypeScript, Redux Toolkit, and @heroui/react components.

## Project Structure

```
src/
├── components/      # Reusable UI components
├── layouts/         # Layout components
├── pages/          # Page components
├── store/          # Redux store and slices
│   ├── slices/     # Redux slice definitions
│   └── store.ts    # Store configuration
├── services/       # API services
├── utils/          # Utility functions
└── types/          # TypeScript type definitions
```

## Core Technologies

- React + TypeScript
- Redux Toolkit for state management
- @heroui/react for UI components
- React Query for data fetching
- Formik + Yup for form handling
- React Router for navigation

## State Management

The application uses Redux Toolkit with the following main slices:

### Store Configuration

```typescript
// Main store slices:
- auth: Authentication state
- user: User profile information
- cart: Shopping cart state
- product: Product catalog
- category: Product categories
- analytics: Admin dashboard analytics
```

### Authentication Flow

1. User authentication is managed through the authStore slice
2. Token-based authentication with secure cookie storage
3. Protected routes using ProtectedRoute component

## Key Features

### 1. Authentication

- Two-step login process
- Social authentication integration (Google, Facebook)
- Role-based access control (Admin/User)

### 2. Shopping Cart

```typescript
interface CartItem {
  id: string;
  name: string;
  currentPrice: number;
  previousPrice?: number;
  quantity: number;
  imageUrl: string;
}
```

### 3. Payment Processing

- Multiple payment methods (M-Pesa, Credit Card, PayPal)
- Order confirmation emails
- Secure payment gateway integration

### 4. Admin Dashboard

Features:

- Analytics overview
- Order management
- Product management
- Category management
- User management

## Component Architecture

### 1. Layout Components

```typescript
- MainLayout: General website layout
- AdminDashboardLayout: Admin interface layout
- CustomerDashboardLayout: Customer account layout
```

### 2. Core Components

```typescript
- LazyImage: Image loading with skeleton
- ProductCard: Product display component
- AdminNavbar: Admin navigation
- AdminSidebar: Admin sidebar navigation
```

## API Integration

### 1. Base Configuration

```typescript
// Axios instance configuration
const apiRequest = axios.create({
  baseURL: process.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
```

### 2. API Services

- Authentication services
- Product services
- Category services
- Order services
- Payment services

## Form Handling

### 1. Form Validation

Using Yup schemas for validation:

```typescript
const validation = object({
  email: string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});
```

### 2. Form Submission

Using Formik for form management:

```typescript
const formik = useFormik({
  initialValues,
  validationSchema: validation,
  onSubmit: async (values) => {
    // Form submission logic
  },
});
```

## Security Measures

1. Authentication

- JWT token-based authentication
- Secure cookie storage
- CSRF protection

2. Data Protection

- Input sanitization
- Form validation
- API request validation

## Error Handling

1. Global Error Handling

```typescript
- API error responses
- Form validation errors
- Payment processing errors
```

2. User Feedback

```typescript
- Toast notifications
- Form field error messages
- Loading states
```

## Performance Optimizations

1. Code Splitting

- Lazy loading of routes
- Dynamic imports for heavy components

2. Image Optimization

- Lazy loading images
- Skeleton loading states
- Optimized image formats

3. State Management

- Normalized Redux store
- Efficient re-rendering with proper memoization

## Testing Strategy

1. Unit Tests

- Component testing
- Redux slice testing
- Utility function testing

2. Integration Tests

- API integration testing
- Form submission testing
- Payment flow testing

## Deployment Considerations

1. Environment Variables

```env
VITE_API_URL=
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

2. Build Process

```bash
npm run build
```

3. Performance Monitoring

- API response times
- Component render performance
- State updates monitoring

## Maintenance Guidelines

1. Code Style

- Follow TypeScript best practices
- Use consistent naming conventions
- Maintain component documentation

2. State Management

- Keep state normalized
- Use appropriate slice structure
- Implement proper error handling

3. Component Updates

- Maintain backward compatibility
- Document breaking changes
- Update type definitions
