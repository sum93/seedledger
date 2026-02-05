import { sortTransactions } from "../../src/lib/transactions";

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

describe("sortTransactions", () => {
  describe("sort by date", () => {
    it("should sort by date ascending", () => {
      const result = sortTransactions(mockTransactions, "date", "asc");
      expect(result[0].id).toBe("2");
      expect(result[1].id).toBe("1");
      expect(result[2].id).toBe("3");
    });

    it("should sort by date descending", () => {
      const result = sortTransactions(mockTransactions, "date", "desc");
      expect(result[0].id).toBe("3");
      expect(result[1].id).toBe("1");
      expect(result[2].id).toBe("2");
    });
  });

  describe("sort by amount", () => {
    it("should sort by amount ascending", () => {
      const result = sortTransactions(mockTransactions, "amount", "asc");
      expect(result[0].amount).toBe(5000);
      expect(result[1].amount).toBe(10000);
      expect(result[2].amount).toBe(20000);
    });

    it("should sort by amount descending", () => {
      const result = sortTransactions(mockTransactions, "amount", "desc");
      expect(result[0].amount).toBe(20000);
      expect(result[2].amount).toBe(5000);
    });
  });

  describe("sort by type", () => {
    it("should sort by type ascending (inflow before outflow)", () => {
      const result = sortTransactions(mockTransactions, "type", "asc");
      expect(result[0].type).toBe("inflow");
      expect(result[2].type).toBe("outflow");
    });

    it("should sort by type descending", () => {
      const result = sortTransactions(mockTransactions, "type", "desc");
      expect(result[0].type).toBe("outflow");
    });
  });

  describe("sort by description", () => {
    it("should sort by description ascending (null treated as empty string, comes first)", () => {
      const result = sortTransactions(mockTransactions, "description", "asc");
      expect(result[0].description).toBe(null);
      expect(result[1].description).toBe("Groceries");
      expect(result[2].description).toBe("Salary");
    });

    it("should handle null values correctly", () => {
      const result = sortTransactions(mockTransactions, "description", "desc");
      expect(result[0].description).toBe("Salary");
      expect(result[1].description).toBe("Groceries");
      expect(result[2].description).toBe(null);
    });
  });

  describe("sort by category", () => {
    it("should sort by category ascending (null first)", () => {
      const result = sortTransactions(mockTransactions, "category", "asc");
      expect(result[0].category).toBe(null);
      expect(result[1].category).toBe("Food");
      expect(result[2].category).toBe("Income");
    });

    it("should handle null categories in descending order", () => {
      const result = sortTransactions(mockTransactions, "category", "desc");
      expect(result[0].category).toBe("Income");
      expect(result[1].category).toBe("Food");
      expect(result[2].category).toBe(null);
    });
  });

  it("should not mutate original array", () => {
    const original = [...mockTransactions];
    sortTransactions(mockTransactions, "amount", "asc");
    expect(mockTransactions).toEqual(original);
  });

  it("should handle empty array", () => {
    const result = sortTransactions([], "date", "asc");
    expect(result).toEqual([]);
  });

  it("should handle single transaction", () => {
    const single = [mockTransactions[0]];
    const result = sortTransactions(single, "date", "asc");
    expect(result).toEqual(single);
  });
});
