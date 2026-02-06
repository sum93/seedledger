import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi, beforeEach } from "vitest";
import NewTransactionPage from "@/app/transactions/new/page";

// Mock variables declared before mocks
let mockMutate: ((data: unknown) => void) | undefined;
let mockInvalidateQueries: (() => void) | undefined;
let mockPush: ((path: string) => void) | undefined;

beforeEach(() => {
  mockMutate = vi.fn();
  mockInvalidateQueries = vi.fn();
  mockPush = vi.fn();
});

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    back: vi.fn(),
  }),
}));

// Mock tRPC
vi.mock("@/lib/trpc", () => ({
  trpc: {
    addTransaction: {
      mutationOptions: (options: {
        onSuccess?: () => Promise<void>;
        onError?: (error: unknown) => void;
      }) => ({
        mutationFn: async (data: unknown) => {
          if (mockMutate) mockMutate(data);
          if (options?.onSuccess) {
            await options.onSuccess();
          }
        },
      }),
    },
    getTransactions: {
      queryKey: () => ["getTransactions"],
    },
  },
  queryClient: {
    invalidateQueries: () => mockInvalidateQueries?.(),
  },
}));

vi.mock("@tanstack/react-query", () => ({
  useMutation: (options: { mutationFn: (data: unknown) => Promise<void> }) => ({
    mutate: options.mutationFn,
    isPending: false,
    isError: false,
    error: null,
  }),
}));

describe("NewTransactionPage", () => {
  describe("Form Validation", () => {
    test("should display amount error when field loses focus with empty value", async () => {
      const user = userEvent.setup();
      render(<NewTransactionPage />);

      const amountInput = screen.getByLabelText(/amount/i);
      await user.click(amountInput);
      await user.tab(); // Lose focus

      await waitFor(() => {
        expect(screen.getByText(/amount is required/i)).toBeInTheDocument();
      });
    });

    test("should display error for non-numeric amount", async () => {
      const user = userEvent.setup();
      render(<NewTransactionPage />);

      const amountInput = screen.getByLabelText(/amount/i);
      await user.type(amountInput, "abc");
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText(/amount must be a positive whole number/i),
        ).toBeInTheDocument();
      });
    });

    test("should display error for decimal amount", async () => {
      const user = userEvent.setup();
      render(<NewTransactionPage />);

      const amountInput = screen.getByLabelText(/amount/i);
      await user.type(amountInput, "123.45");
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText(/amount must be a positive whole number/i),
        ).toBeInTheDocument();
      });
    });

    test("should clear amount error when user starts typing", async () => {
      const user = userEvent.setup();
      render(<NewTransactionPage />);

      const amountInput = screen.getByLabelText(/amount/i);
      await user.click(amountInput);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/amount is required/i)).toBeInTheDocument();
      });

      await user.type(amountInput, "100");

      await waitFor(() => {
        expect(
          screen.queryByText(/amount is required/i),
        ).not.toBeInTheDocument();
      });
    });

    test("should display category error when empty", async () => {
      const user = userEvent.setup();
      render(<NewTransactionPage />);

      const categoryInput = screen.getByLabelText(/category/i);
      await user.click(categoryInput);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/category is required/i)).toBeInTheDocument();
      });
    });

    test("should display error for whitespace-only category", async () => {
      const user = userEvent.setup();
      render(<NewTransactionPage />);

      const categoryInput = screen.getByLabelText(/category/i);
      await user.type(categoryInput, "   ");
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText(/category cannot be only whitespace/i),
        ).toBeInTheDocument();
      });
    });

    test("should show red border on fields with errors", async () => {
      const user = userEvent.setup();
      render(<NewTransactionPage />);

      const amountInput = screen.getByLabelText(/amount/i);
      await user.click(amountInput);
      await user.tab();

      await waitFor(() => {
        expect(amountInput).toHaveClass("border-red-500");
      });
    });
  });

  describe("Form Submission", () => {
    test("should prevent submission with invalid data", async () => {
      const user = userEvent.setup();
      render(<NewTransactionPage />);

      const submitButton = screen.getByRole("button", {
        name: /add transaction/i,
      });
      await user.click(submitButton);

      expect(mockMutate).not.toHaveBeenCalled();
    });

    test("should submit with valid data and normalize category", async () => {
      const user = userEvent.setup();
      render(<NewTransactionPage />);

      // Fill in valid data
      const amountInput = screen.getByLabelText(/amount/i);
      await user.type(amountInput, "500");

      const categoryInput = screen.getByLabelText(/category/i);
      await user.type(categoryInput, "  Groceries  ");

      const submitButton = screen.getByRole("button", {
        name: /add transaction/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith(
          expect.objectContaining({
            amount: 500,
            category: "groceries", // Should be trimmed and lowercased
            type: "inflow",
          }),
        );
      });
    });

    test("should trim description whitespace on submission", async () => {
      const user = userEvent.setup();
      render(<NewTransactionPage />);

      const amountInput = screen.getByLabelText(/amount/i);
      await user.type(amountInput, "100");

      const categoryInput = screen.getByLabelText(/category/i);
      await user.type(categoryInput, "test");

      const descriptionInput = screen.getByLabelText(/description/i);
      await user.type(descriptionInput, "  Test description  ");

      const submitButton = screen.getByRole("button", {
        name: /add transaction/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith(
          expect.objectContaining({
            description: "Test description",
          }),
        );
      });
    });

    test("should set description to null when empty", async () => {
      const user = userEvent.setup();
      render(<NewTransactionPage />);

      const amountInput = screen.getByLabelText(/amount/i);
      await user.type(amountInput, "100");

      const categoryInput = screen.getByLabelText(/category/i);
      await user.type(categoryInput, "test");

      const submitButton = screen.getByRole("button", {
        name: /add transaction/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith(
          expect.objectContaining({
            description: null,
          }),
        );
      });
    });
  });

  describe("Error States", () => {
    test("should display amount error when submitting empty amount", async () => {
      const user = userEvent.setup();
      render(<NewTransactionPage />);

      // Fill only category to trigger amount validation
      const categoryInput = screen.getByLabelText(/category/i);
      await user.type(categoryInput, "test");

      const amountInput = screen.getByLabelText(/amount/i);
      await user.click(amountInput);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/amount is required/i)).toBeInTheDocument();
      });
    });
  });

  describe("User Interaction", () => {
    test("should allow switching transaction type", async () => {
      const user = userEvent.setup();
      render(<NewTransactionPage />);

      const typeSelect = screen.getByLabelText(/type/i);
      expect(typeSelect).toHaveValue("inflow");

      await user.selectOptions(typeSelect, "outflow");
      expect(typeSelect).toHaveValue("outflow");
    });

    test("should allow setting date", async () => {
      const user = userEvent.setup();
      render(<NewTransactionPage />);

      const dateInput = screen.getByLabelText(/date/i);
      await user.clear(dateInput);
      await user.type(dateInput, "2024-12-25");

      expect(dateInput).toHaveValue("2024-12-25");
    });
  });
});
