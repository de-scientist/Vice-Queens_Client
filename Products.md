# Products Feature Documentation

## Overview

The products feature provides comprehensive functionality for managing products in the e-commerce system, including CRUD operations, image management, and inventory tracking.

## Components

### ProductCard

Displays individual product information with the following features:

- Product image display
- Price information with discount calculation
- Rating display
- Add to cart functionality
- View/Delete actions

#### Testing ProductCard:

```typescript
// Test rendering
expect(screen.getByText("Product Name")).toBeTruthy();

// Test price display
expect(screen.getByText("Ksh. 100")).toBeTruthy();

// Test discount calculation
expect(screen.getByText("20% OFF")).toBeTruthy();

// Test actions
fireEvent.click(screen.getByText("Add to Cart"));
```

### Inventory Management

Provides administrative interface for product management:

- Product listing with pagination
- Search functionality
- CRUD operations
- Category management
- Stock tracking

#### Testing Inventory:

```typescript
// Test product listing
expect(screen.getAllByRole("row")).toHaveLength(expectedLength);

// Test search
fireEvent.change(screen.getByPlaceholderText("Search product"), {
  target: { value: "test" },
});

// Test delete confirmation
fireEvent.click(screen.getByLabelText("Delete"));
expect(screen.getByText("Confirm Delete")).toBeTruthy();
```

## API Integration

### Product Service

- GET /api/products - List all products
- GET /api/categories/:categoryId/product - Get category products
- POST /api/categories/:categoryId/product - Create product
- PUT /api/products/:id - Update product
- DELETE /api/products/:id - Delete product

### Testing Strategy

1. Component Testing:

   - Render testing
   - User interaction testing
   - State management testing
   - Error handling testing

2. Integration Testing:

   - API integration testing
   - Redux store integration
   - React Query integration

3. End-to-End Testing:
   - Product creation flow
   - Product update flow
   - Product deletion flow
   - Image upload flow

## Running Tests

```bash
# Run all tests
npm run test

# Run specific test file
npm run test ProductCard.test.tsx

# Run with coverage
npm run test:coverage
```

## Common Test Cases

1. ProductCard:

   - Renders correctly with all props
   - Calculates discount correctly
   - Handles missing optional props
   - Triggers correct actions on button clicks

2. Inventory:

   - Renders product list correctly
   - Handles pagination
   - Performs search correctly
   - Handles delete confirmation
   - Shows loading states
   - Handles errors appropriately

3. Product Service:
   - Makes correct API calls
   - Handles responses correctly
   - Manages cache correctly
   - Handles errors appropriately

## Best Practices

1. Always test:

   - Component rendering
   - User interactions
   - Error states
   - Loading states
   - Edge cases

2. Mock external dependencies:

   - API calls
   - Redux store
   - React Query
   - Image uploads

3. Use meaningful test descriptions

4. Group related tests together

5. Clean up after each test

## Example Test Setup

```typescript
describe("Product Feature", () => {
  beforeEach(() => {
    // Setup test environment
  });

  afterEach(() => {
    // Clean up
  });

  it("should handle normal operations", () => {
    // Test normal flow
  });

  it("should handle error cases", () => {
    // Test error handling
  });

  it("should handle loading states", () => {
    // Test loading states
  });
});
```

```

</file>

Make sure to:
1. Run all tests
2. Check test coverage
3. Verify edge cases
4. Test error scenarios
5. Test loading states
6. Verify component integration
7. Test API integration

The tests and documentation provide comprehensive coverage of the products feature while maintaining good testing practices.
```
