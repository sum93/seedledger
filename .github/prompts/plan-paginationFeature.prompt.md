# Pagination Feature - Implementation Guide

## Key Components Needed

1. **State Management** (current page, items per page)
2. **Pagination Logic** (calculate pages, slice data)
3. **UI Components** (page controls, items per page selector)
4. **User Experience** (maintain state during sort/filter)

---

## Step-by-Step Implementation

### 1. Add State Variables

**What you need:**

```tsx
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(10);
```

**Decisions:**

- Should page state persist in URL query params? (e.g., `?page=2&perPage=20`) **No**
- Reset to page 1 when sorting changes? **Yes**
- Reset to page 1 when items per page changes? **Yes**

---

### 2. Pagination Calculations

**Key calculations:**

```tsx
const totalItems = sortedTransactions.length;
const totalPages = Math.ceil(totalItems / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
const paginatedTransactions = sortedTransactions.slice(startIndex, endIndex);
```

**Important:**

- Use `paginatedTransactions` in your `.map()` instead of `sortedTransactions`
- Display "Showing X-Y of Z transactions"

---

### 3. Items Per Page Selector

**UI Component:**

```tsx
<select
  value={itemsPerPage}
  onChange={(e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page
  }}
>
  <option value={10}>10 per page</option>
  <option value={20}>20 per page</option>
  <option value={50}>50 per page</option>
</select>
```

**Edge cases:**

- What if total items < 10? Show dropdown or hide it?
- Should there be an "All" option to show everything?

---

### 4. Pagination Controls

**Components needed:**

- **Previous button**: Disabled when `currentPage === 1`
- **Next button**: Disabled when `currentPage === totalPages`
- **Page numbers**: Show subset (e.g., `1 ... 5 6 7 ... 20`)
- **First/Last buttons**: Jump to first/last page

**Example structure:**

```tsx
<div className="pagination-controls">
  <button disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>
    First
  </button>

  <button
    disabled={currentPage === 1}
    onClick={() => setCurrentPage((p) => p - 1)}
  >
    Previous
  </button>

  {/* Page numbers */}
  <span>
    Page {currentPage} of {totalPages}
  </span>

  <button
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage((p) => p + 1)}
  >
    Next
  </button>

  <button
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage(totalPages)}
  >
    Last
  </button>
</div>
```

---

## Edge Cases

| Edge Case                        | Handling                                        |
| -------------------------------- | ----------------------------------------------- |
| **0 transactions**               | Hide pagination, show "No transactions" message |
| **Fewer items than page size**   | Hide or disable pagination (only 1 page)        |
| **On page 5, change to 50/page** | Reset to page 1                                 |
| **On page 10, delete item**      | Page 10 now empty → Go back to page 9           |
| **Sort while on page 5**         | Reset to page 1                                 |
| **Items per page > total items** | Show all items, only 1 page exists              |
| **Navigate to page 999**         | Clamp to max page (totalPages)                  |
| **Negative page number**         | Clamp to page 1                                 |
| **User types in page number**    | Validate and clamp to valid range               |

---

## Best Case Scenario

✅ User views table → Sees first 10 rows → Clicks "Next" → Sees rows 11-20 → Changes to "50 per page" → Resets to page 1, sees 50 rows → Smooth experience

**Flow:**

1. Load page with 100 transactions
2. Shows rows 1-10, pagination shows "Page 1 of 10"
3. User clicks page 3 → Shows rows 21-30
4. User changes to "20 per page" → Resets to page 1, shows rows 1-20
5. Now pagination shows "Page 1 of 5"

---

## Worst Case Scenarios

### Scenario 1: Current Page Becomes Invalid

❌ On page 10 with 10/page (100 items) → Change to 50/page → Only 2 pages exist now → **Solution:** Reset to page 1

### Scenario 2: Delete Last Item on Page

❌ On page 10, last page has 1 item → Delete it → Page 10 now empty → **Solution:** Auto-navigate to page 9 (previous page)

### Scenario 3: No Results After Filter

❌ User on page 5 → Applies filter → Only 3 items match → Page 5 doesn't exist → **Solution:** Reset to page 1 when filter changes

### Scenario 4: Direct URL Access

❌ User opens `?page=999` → Page doesn't exist → **Solution:** Validate page number, clamp to valid range (1 to totalPages)

### Scenario 5: Sorting + Pagination

❌ User on page 5 → Sorts by amount → Different items on page 5 now → **Solution:** Reset to page 1 when sorting (decided approach)

---

## Interaction with Existing Features

### With Sorting:

- **Chosen Approach:** Reset to page 1 when sorting
- Reason: Less confusing, user expects to see results from start

### With Add Transaction:

- New transaction added → Reset to page 1 to show new item
- If sorted by date desc and new transaction is today → Will appear on page 1

### With Delete Transaction:

- If deleting last item on current page → Navigate to previous page
- Otherwise stay on same page

### With Search/Filter (future feature):

- Applying filter → Reset to page 1
- Clearing filter → Reset to page 1

---

## UI/UX Considerations

**Information Display:**

```
Showing 11-20 of 150 transactions    [10 per page ▼]

[First] [<] [1] [2] [3] ... [10] [>] [Last]
```

**Accessibility:**

- `aria-label` on page buttons
- Keyboard navigation (arrows keys for prev/next)
- Screen reader announcements for page changes
- Disabled buttons should be visually distinct

**Mobile Considerations:**

- Simplified pagination on small screens (just prev/next, no page numbers)
- Dropdown should be touch-friendly
- Consider "Load More" button instead of pagination?

---

## Advanced Features (Optional)

### 1. Page Number Input:

```tsx
Go to page: [___] [Go]
```

### 2. URL Persistence:

```tsx
// Update URL when page changes
const router = useRouter();
router.push(`?page=${currentPage}&perPage=${itemsPerPage}`);
```

### 3. Ellipsis in Page Numbers:

```
[1] [2] [3] ... [8] [9] [10]  // When many pages
```

### 4. Smart Page Calculation (Alternative):

When changing items per page, try to show same items:

```tsx
const firstVisibleItem = (currentPage - 1) * itemsPerPage;
const newPage = Math.floor(firstVisibleItem / newItemsPerPage) + 1;
```

**Note:** We decided against this for simplicity - always reset to page 1.

---

## Implementation Checklist

### State & Logic:

- [x] Add `currentPage` and `itemsPerPage` state
- [x] Calculate `totalPages`, `startIndex`, `endIndex`
- [x] Create `paginatedTransactions` slice
- [x] Handle page navigation (next, prev, first, last, specific)
- [x] Handle items per page change
- [x] Validate page numbers (clamp to valid range)

### UI Components:

- [x] Items per page dropdown (10, 20, 50)
- [x] Previous/Next buttons with disabled states
- [x] First/Last buttons
- [x] Current page indicator (e.g., "Page 3 of 10")
- [x] Item range display (e.g., "Showing 21-30 of 150")
- [ ] Page number buttons (optional, for small page counts)

### Integration:

- [x] Reset to page 1 when sorting changes
- [x] Reset to page 1 when items per page changes
- [ ] Handle edge case: last item deleted on page
- [x] Show/hide pagination when only 1 page exists
- [ ] Update pagination after adding new transaction

### Styling:

- [x] Disabled button styles
- [x] Active page indicator
- [x] Responsive layout (mobile-friendly)
- [ ] Loading state during page change
- [ ] Smooth transitions

### Testing:

- [ ] Navigate through all pages
- [ ] Change items per page on different pages
- [ ] Test with 0 transactions
- [ ] Test with fewer items than page size
- [ ] Test sorting interaction
- [ ] Test with exactly 10, 20, 50 items
- [ ] Test page boundaries (first/last)
- [ ] Test keyboard navigation

---

## Completed Implementation

### Phase 1: Basic Pagination ✅

- Add state variables ✅
- Implement data slicing ✅
- Add simple prev/next buttons ✅
- Show current page indicator ✅

### Phase 2: Items Per Page ✅

- Add dropdown selector ✅
- Handle page reset on change ✅
- Show items range display ✅

### Phase 3: Enhanced Navigation ✅

- Add first/last buttons ✅
- Better disabled states and styling ✅

### Phase 4: Polish (Future)

- [ ] URL persistence (query params)
- [ ] Keyboard shortcuts
- [ ] Smooth transitions
- [ ] Mobile optimization

---

## Design Decisions Made

1. **Sorting behavior:** Reset to page 1 ✅
2. **Items per page change:** Reset to page 1 ✅
3. **Show pagination:** Only when totalPages > 1 ✅
4. **Items per page options:** 10, 20, 50 ✅
5. **Navigation style:** First/Prev/Page X of Y/Next/Last ✅
6. **Page numbers:** Simple text indicator (not clickable buttons) ✅

---

## Future Enhancements

1. **URL persistence** - Maintain pagination state in URL
2. **Keyboard shortcuts** - Arrow keys for navigation
3. **Page number buttons** - Clickable page numbers for direct access
4. **Smooth transitions** - Animate page changes
5. **Mobile load more** - Alternative UX for mobile devices
6. **Remember preference** - Save itemsPerPage to localStorage
