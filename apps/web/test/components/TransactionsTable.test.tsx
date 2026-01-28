import { fireEvent, render, screen } from "@testing-library/react";
import { TransactionsTable } from "../../src/app/components/TransactionsTable";

const mockTransactions = [
  {
    id: "1",
    type: "inflow" as const,
    amount: 100.0,
    date: "2024-01-15",
    description: "Salary",
    category: "Income",
  },
  {
    id: "2",
    type: "outflow" as const,
    amount: 50.0,
    date: "2024-01-10",
    description: "Groceries",
    category: "Food",
  },
];

describe("TransactionsTable", () => {
  describe("empty state", () => {
    it("should show empty state when no transactions", () => {
      render(<TransactionsTable transactions={undefined} />);
      expect(screen.getByText("No transactions yet")).toBeInTheDocument();
    });

    it("should show empty state when transactions array is empty", () => {
      render(<TransactionsTable transactions={[]} />);
      expect(screen.getByText("No transactions yet")).toBeInTheDocument();
    });

    it("should display empty state message", () => {
      render(<TransactionsTable transactions={[]} />);
      expect(
        screen.getByText(/Your transaction history will appear here/i),
      ).toBeInTheDocument();
    });
  });

  describe("table rendering", () => {
    it("should render table headers", () => {
      render(<TransactionsTable transactions={mockTransactions} />);
      expect(screen.getByText("Date")).toBeInTheDocument();
      expect(screen.getByText("Type")).toBeInTheDocument();
      expect(screen.getByText("Amount (HUF)")).toBeInTheDocument();
      expect(screen.getByText("Category")).toBeInTheDocument();
      expect(screen.getByText("Description")).toBeInTheDocument();
    });

    it("should render all transactions", () => {
      render(<TransactionsTable transactions={mockTransactions} />);
      expect(screen.getByText("Salary")).toBeInTheDocument();
      expect(screen.getByText("Groceries")).toBeInTheDocument();
    });

    it("should display transaction types", () => {
      render(<TransactionsTable transactions={mockTransactions} />);
      expect(screen.getByText("Inflow")).toBeInTheDocument();
      expect(screen.getByText("Outflow")).toBeInTheDocument();
    });

    it("should format amounts with signs", () => {
      render(<TransactionsTable transactions={mockTransactions} />);
      expect(screen.getByText(/\+100,00/)).toBeInTheDocument();
      expect(screen.getByText(/-50,00/)).toBeInTheDocument();
    });

    it("should display categories", () => {
      render(<TransactionsTable transactions={mockTransactions} />);
      expect(screen.getByText("Income")).toBeInTheDocument();
      expect(screen.getByText("Food")).toBeInTheDocument();
    });

    it("should show em dash for null description", () => {
      const txWithNull = [
        {
          ...mockTransactions[0],
          description: null,
        },
      ];
      render(<TransactionsTable transactions={txWithNull} />);
      expect(screen.getByText("—")).toBeInTheDocument();
    });
  });

  describe("sorting functionality", () => {
    it("should sort by date descending by default", () => {
      render(<TransactionsTable transactions={mockTransactions} />);
      const rows = screen.getAllByRole("row");
      // First data row should be the most recent (Jan 15)
      expect(rows[1]).toHaveTextContent("Salary");
    });

    it("should toggle sort order when clicking same column", () => {
      render(<TransactionsTable transactions={mockTransactions} />);
      const dateHeader = screen.getByText("Date").closest("th");

      // Click to toggle to ascending
      fireEvent.click(dateHeader!);
      let rows = screen.getAllByRole("row");
      expect(rows[1]).toHaveTextContent("Groceries"); // Jan 10 first

      // Click again to toggle back to descending
      fireEvent.click(dateHeader!);
      rows = screen.getAllByRole("row");
      expect(rows[1]).toHaveTextContent("Salary"); // Jan 15 first
    });

    it("should change sort field when clicking different column", () => {
      render(<TransactionsTable transactions={mockTransactions} />);
      const amountHeader = screen.getByText(/Amount/).closest("th");

      fireEvent.click(amountHeader!);
      const rows = screen.getAllByRole("row");
      // Should sort by amount ascending (smallest first)
      expect(rows[1]).toHaveTextContent("Groceries");
    });

    it("should sort by type", () => {
      render(<TransactionsTable transactions={mockTransactions} />);
      const typeHeader = screen.getByText("Type").closest("th");

      fireEvent.click(typeHeader!);
      // Should sort alphabetically, inflow before outflow
      const badges = screen.getAllByText(/flow/);
      expect(badges[0]).toHaveTextContent("Inflow");
    });

    it("should sort by category", () => {
      render(<TransactionsTable transactions={mockTransactions} />);
      const categoryHeader = screen.getByText("Category").closest("th");

      fireEvent.click(categoryHeader!);
      const rows = screen.getAllByRole("row");
      expect(rows[1]).toHaveTextContent("Food"); // Alphabetically first
    });

    it("should sort by description", () => {
      render(<TransactionsTable transactions={mockTransactions} />);
      const descHeader = screen.getByText("Description").closest("th");

      fireEvent.click(descHeader!);
      const rows = screen.getAllByRole("row");
      expect(rows[1]).toHaveTextContent("Groceries"); // Alphabetically first
    });
  });

  describe("styling", () => {
    it("should apply inflow styling", () => {
      render(<TransactionsTable transactions={mockTransactions} />);
      const inflowBadge = screen.getByText("Inflow");
      expect(inflowBadge).toHaveClass("bg-green-100");
    });

    it("should apply outflow styling", () => {
      render(<TransactionsTable transactions={mockTransactions} />);
      const outflowBadge = screen.getByText("Outflow");
      expect(outflowBadge).toHaveClass("bg-red-100");
    });

    it("should have hoverable rows", () => {
      const { container } = render(
        <TransactionsTable transactions={mockTransactions} />,
      );
      const rows = container.querySelectorAll("tbody tr");
      expect(rows[0]).toHaveClass("hover:bg-zinc-50");
    });
  });
});
