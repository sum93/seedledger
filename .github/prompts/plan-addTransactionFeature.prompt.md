# Add Transaction Feature - Implementation Guide

## Key Components Needed

1. **Form Component** (UI for input)
2. **Validation Logic** (client-side + server-side)
3. **API Integration** (tRPC mutation)
4. **State Management** (form state + optimistic updates)
5. **Error Handling** (user feedback)

---

## Step-by-Step Implementation

### 1. Create the Form UI

**What you need:**

- Input fields: Type (dropdown), Amount (number), Date (date picker), Description (text), Category (dropdown/text)
- Submit button
- Cancel/Close button (if modal)
- Loading state indicator
- Error message display

**Decisions:**

- Modal popup vs inline form?
- Controlled inputs (React state) vs uncontrolled (refs)?
- Client-side validation timing: onChange, onBlur, or onSubmit?

---

### 2. Form Validation

**Required fields:**

- `type`: Must be "inflow" or "outflow"
- `amount`: Must be > 0, integer (stored in cents)

**Optional fields:**

- `date`: Defaults to current date/time
- `description`: Can be null
- `category`: Can be null

**Edge cases:**

- ❌ Amount = 0 → Invalid
- ❌ Amount negative → Invalid
- ❌ Amount with decimals → Convert to cents (e.g., 10.50 → 1050)
- ❌ Amount = "abc" → Invalid (NaN)
- ❌ Date in far future (year 3000) → Should you allow?
- ❌ Date before account creation → Should you allow?
- ✅ Empty description/category → Valid (null)
- ❌ Type not selected → Invalid
- ❌ Very long description (10,000 chars) → Set max length?

---

### 3. API Integration (tRPC Mutation)

**Server side already exists:**

- Check `services/transactions/src/routes/trpc/transactions.ts`
- Look for `addTransaction` mutation
- Review validation schema in `packages/contracts/src/validation/transactions.ts`

**Client side needed:**

- Import tRPC mutation hook
- Call mutation with form data
- Handle success/error responses

**Example:**

```tsx
const addMutation = trpc.addTransaction.useMutation({
  onSuccess: () => {
    // Refresh transaction list
    // Close form
    // Show success message
  },
  onError: (error) => {
    // Show error message
  },
});
```

---

### 4. State Management

**Form state:**

- Track each field value
- Track validation errors
- Track submission state (idle, submitting, success, error)

**List state:**

- After successful add, you need to:
  - **Option A:** Refetch entire list from server
  - **Option B:** Optimistic update (add to local state immediately, rollback on error)
  - **Option C:** Append server response to list (server returns new transaction with generated ID)

**Recommended:** Option C (most reliable)

---

### 5. Error Handling

**Client-side errors:**

- Validation failures → Show inline error messages
- Network offline → "Check your connection"
- Form incomplete → Highlight missing fields

**Server-side errors:**

- 400 Bad Request → Validation failed on server (show which field)
- 500 Internal Server Error → "Something went wrong, try again"
- Network timeout → "Request timed out"

**Edge cases:**

- User submits twice quickly → Disable button during submission
- User closes form during submission → Cancel request or let it complete?
- Server returns success but UI doesn't update → Show success but refresh list

---

## Best Case Scenario

✅ User fills form correctly → Submit → Server validates → DB insert succeeds → New transaction appears in list → Form closes → Success message shown

**Flow:**

1. Click "Add Transaction"
2. Fill: Type=Inflow, Amount=$100, Date=Today, Description="Salary"
3. Click Submit
4. Loading spinner shows (0.2s)
5. Success! Transaction appears at top of table
6. Form closes
7. Toast: "Transaction added successfully"

---

## Worst Case Scenarios

### Scenario 1: Invalid Input

❌ Amount = -50 → Client validation catches → Show error "Amount must be positive" → User corrects → Submits again → Success

### Scenario 2: Server Validation Fails

❌ Client allows invalid data → Server rejects → Return 400 error → Show error from server → User fixes → Re-submits

### Scenario 3: Database Error

❌ Server validation passes → DB write fails (disk full, constraint violation) → Return 500 → Show "Server error, contact support" → User tries again later

### Scenario 4: Network Failure

❌ User submits → Network drops mid-request → Timeout after 10s → Show "Network error" → User retries → Maybe duplicate transaction created? Need idempotency!

### Scenario 5: Duplicate Submission

❌ User clicks Submit twice → Two requests sent → Two transactions created with same data → **Solution:** Disable button after first click OR use idempotency key

### Scenario 6: Data Type Mismatch

❌ User enters amount "10.99" → Client doesn't convert to cents → Server receives float instead of int → Server validation fails → Error shown

---

## Critical Edge Cases

| Edge Case                             | Handling                                   |
| ------------------------------------- | ------------------------------------------ |
| **Amount with decimals**              | Convert $10.50 → 1050 cents before sending |
| **Empty amount field**                | Show "Required" error                      |
| **Amount = 0**                        | Show "Must be greater than 0"              |
| **Negative amount**                   | Show "Must be positive" (or flip type?)    |
| **Very large amount**                 | Set max (e.g., $1 million)? Or allow any?  |
| **Date in past**                      | Allow (historical transactions)            |
| **Date in future**                    | Allow or block? Business decision          |
| **No category selected**              | Send `null`                                |
| **Special characters in description** | Allow (server should sanitize for XSS)     |
| **SQL injection attempt**             | Server ORM (Drizzle) handles this          |
| **Rapid clicking Submit**             | Disable after first click                  |
| **Network timeout**                   | Show retry option                          |
| **Server down**                       | Show friendly error message                |

---

## Implementation Checklist

**Frontend:**

- [ ] Create form component (modal or inline)
- [ ] Add form fields with proper input types
- [ ] Implement controlled inputs with useState
- [ ] Add client-side validation
- [ ] Connect to tRPC addTransaction mutation
- [ ] Handle loading state (disable button, show spinner)
- [ ] Handle success (close form, refresh list, show toast)
- [ ] Handle errors (show error message near field)
- [ ] Convert dollar amount to cents
- [ ] Test all edge cases

**Backend (verify existing):**

- [ ] Check `addTransaction` mutation exists
- [ ] Verify validation schema matches requirements
- [ ] Confirm auto-generated fields (id, date default)
- [ ] Test server-side validation

**Testing:**

- [ ] Valid submission works
- [ ] Invalid amount rejected
- [ ] Missing type rejected
- [ ] Null description/category accepted
- [ ] Date defaults to now if omitted
- [ ] Duplicate prevention works
- [ ] Error messages are clear

---

## Recommended Approach

**Phase 1: Basic Form**

- Simple modal with required fields only (type, amount)
- Basic validation
- Submit → Success/Error feedback

**Phase 2: Enhanced UX**

- Add optional fields (description, category, date)
- Better validation messages
- Optimistic updates
- Toast notifications

**Phase 3: Polish**

- Keyboard shortcuts (Esc to close, Enter to submit)
- Focus management
- Accessibility (ARIA labels)
- Loading states
