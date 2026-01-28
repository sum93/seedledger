# Testing Plan for Web App

## Overview

Set up Vitest testing framework for the SeedLedger web application to test utility functions and React components.

## Installation

### Option 1: Minimal (Utility Functions Only)

```bash
npm install -D vitest -w apps/web
```

Allows testing of pure functions without React components.

### Option 2: Full Setup (Including Component Testing)

```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom -w apps/web
```

**Package purposes:**

- `vitest` - Test runner
- `@vitejs/plugin-react` - Vite plugin for React support
- `@testing-library/react` - React component testing utilities
- `@testing-library/jest-dom` - Custom matchers for DOM assertions
- `@testing-library/user-event` - User interaction simulation
- `jsdom` - DOM implementation for Node.js

## Configuration Files

### vitest.config.ts (apps/web/)

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### test/setup.ts (apps/web/)

```typescript
import "@testing-library/jest-dom";
```

## Package.json Scripts

Add to `apps/web/package.json`:

```json
"scripts": {
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest --coverage"
}
```

## Test Cases

### 1. formatting.test.ts - Format Utility Functions

**Location:** `apps/web/test/utils/formatting.test.ts`

**Test Coverage:**

- `formatDate()`
  - Format Date object correctly
  - Format ISO string correctly
  - Handle different date formats
- `formatAmount()`
  - Format amount without type (no sign)
  - Format inflow with + sign
  - Format outflow with - sign
  - Handle zero amount
  - Handle large amounts
  - Handle small amounts (cents)
  - Always show 2 decimal places

**Dependencies:** Vitest only

### 2. transactions.test.ts - Sort Utility Functions

**Location:** `apps/web/test/utils/transactions.test.ts`

**Test Coverage:**

- `sortTransactions()`
  - Sort by date (ascending/descending)
  - Sort by amount (ascending/descending)
  - Sort by type (ascending/descending)
  - Sort by description (ascending/descending, null handling)
  - Sort by category (ascending/descending, null handling)
  - Should not mutate original array
  - Handle empty array
  - Handle single transaction

**Dependencies:** Vitest only

### 3. TransactionsTable.test.tsx - Component Testing

**Location:** `apps/web/test/components/TransactionsTable.test.tsx`

**Test Coverage:**

- Empty state
  - Show empty state when no transactions
  - Show empty state when transactions array is empty
  - Display empty state message
- Table rendering
  - Render table headers with currency
  - Render all transactions
  - Display transaction types with badges
  - Format amounts with signs (+/-)
  - Display categories
  - Show em dash for null description/category
- Sorting functionality
  - Sort by date descending by default
  - Toggle sort order when clicking same column
  - Change sort field when clicking different column
  - Sort by type
  - Sort by category
  - Sort by description
- Styling
  - Apply inflow styling (green badge)
  - Apply outflow styling (red badge)
  - Have hoverable rows

**Dependencies:** Vitest + @testing-library/react + jsdom

### 4. icons.test.tsx - Icon Components

**Location:** `apps/web/test/components/icons.test.tsx`

**Test Coverage:**

- `UnsortedIcon`
  - Render SVG element
  - Apply default className
  - Accept custom className
- `SortUpIcon`
  - Render SVG element
  - Have correct path data for up arrow
- `SortDownIcon`
  - Render SVG element
  - Have correct path data for down arrow

**Dependencies:** Vitest + @testing-library/react

## Test Implementation Details

### Mock Data Structure

```typescript
const mockTransactions = [
  {
    id: "1",
    type: "inflow" as const,
    amount: 10000,
    date: "2024-01-15",
    description: "Salary",
    category: "Income",
  },
  {
    id: "2",
    type: "outflow" as const,
    amount: 5000,
    date: "2024-01-10",
    description: "Groceries",
    category: "Food",
  },
  {
    id: "3",
    type: "inflow" as const,
    amount: 20000,
    date: "2024-01-20",
    description: null,
    category: null,
  },
];
```

### Locale-Specific Expectations

Since `DEFAULT_LOCALE = "hu-HU"`, expect Hungarian number formatting:

- Thousands separator: space
- Decimal separator: comma
- Example: `1 234,56` instead of `1,234.56`

### Date Format Expectations

Hungarian date format: `2024. jan. 15.`

## Running Tests

```bash
# Run all tests
npm test -w apps/web

# Run with UI
npm run test:ui -w apps/web

# Run with coverage
npm run test:coverage -w apps/web

# Run specific test file
npm test -w apps/web -- formatting.test.ts

# Watch mode (default)
npm test -w apps/web
```

## Recommended Approach

### Phase 1: Utility Functions (Immediate)

1. Install minimal Vitest setup
2. Implement `formatting.test.ts`
3. Implement `transactions.test.ts`
4. Verify all utility functions work correctly

### Phase 2: Component Testing (Future)

1. Install full testing dependencies
2. Set up vitest.config.ts and test setup
3. Implement `TransactionsTable.test.tsx`
4. Implement `icons.test.tsx`

## Notes

- Vitest alone is sufficient for testing pure functions
- React Testing Library is only needed for component testing
- Hungarian locale affects number/date formatting expectations in tests
- All sorting functions must not mutate original arrays
- Handle null values in description and category fields
- Test both ascending and descending sort orders for all fields
