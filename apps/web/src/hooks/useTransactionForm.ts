import { useState } from "react";

const AMOUNT_REGEX = /^[0-9]+$/;

interface TransactionFormData {
  type: "inflow" | "outflow";
  amount: string;
  date: string;
  category: string;
  description: string;
}

interface TransactionFormErrors {
  amount?: string;
  category?: string;
}

interface UseTransactionFormReturn {
  formData: TransactionFormData;
  errors: TransactionFormErrors;
  handleAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAmountBlur: () => void;
  handleCategoryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCategoryBlur: () => void;
  handleTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  validateForm: () =>
    | {
        isValid: false;
      }
    | {
        isValid: true;
        data: {
          type: "inflow" | "outflow";
          amount: number;
          date: Date;
          category: string;
          description: string | null;
        };
      };
  clearErrors: () => void;
}

export function useTransactionForm(): UseTransactionFormReturn {
  const [formData, setFormData] = useState<TransactionFormData>({
    type: "inflow",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category: "",
    description: "",
  });

  const [errors, setErrors] = useState<TransactionFormErrors>({});

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, amount: value });

    if (errors.amount) {
      setErrors({ ...errors, amount: undefined });
    }
  };

  const handleAmountBlur = () => {
    if (!formData.amount.trim()) {
      setErrors({ ...errors, amount: "Amount is required" });
    } else if (!AMOUNT_REGEX.test(formData.amount)) {
      setErrors({
        ...errors,
        amount: "Amount must be a positive whole number",
      });
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, category: value });

    if (errors.category) {
      setErrors({ ...errors, category: undefined });
    }
  };

  const handleCategoryBlur = () => {
    const trimmed = formData.category.trim();
    if (formData.category && !trimmed) {
      setErrors({ ...errors, category: "Category cannot be only whitespace" });
    } else if (!trimmed) {
      setErrors({ ...errors, category: "Category is required" });
    }
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      type: e.target.value as "inflow" | "outflow",
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, date: e.target.value });
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, description: e.target.value });
  };

  const validateForm = () => {
    const newErrors: TransactionFormErrors = {};

    if (!formData.amount.trim()) {
      newErrors.amount = "Amount is required";
    } else if (!AMOUNT_REGEX.test(formData.amount)) {
      newErrors.amount = "Amount must be a positive whole number";
    }

    const normalizedCategory = formData.category.trim().toLowerCase();
    if (formData.category && !normalizedCategory) {
      newErrors.category = "Category cannot be only whitespace";
    } else if (!normalizedCategory) {
      newErrors.category = "Category is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return {
        isValid: false as const,
      };
    }

    return {
      isValid: true as const,
      data: {
        type: formData.type,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date),
        category: normalizedCategory,
        description: formData.description?.trim() || null,
      },
    };
  };

  const clearErrors = () => {
    setErrors({});
  };

  return {
    formData,
    errors,
    handleAmountChange,
    handleAmountBlur,
    handleCategoryChange,
    handleCategoryBlur,
    handleTypeChange,
    handleDateChange,
    handleDescriptionChange,
    validateForm,
    clearErrors,
  };
}
