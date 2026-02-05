import { formatAmount, formatDate } from "../../src/lib/formatting";

describe("formatDate", () => {
  it("should format Date object correctly", () => {
    const date = new Date("2024-01-15");
    const result = formatDate(date);
    expect(result).toMatch(/2024\. jan\. 15\./);
  });

  it("should format ISO string correctly", () => {
    const result = formatDate("2024-01-15T10:30:00Z");
    expect(result).toMatch(/2024\. jan\. 15\./);
  });

  it("should handle different date formats", () => {
    const result = formatDate("2024/12/25");
    expect(result).toMatch(/2024\. dec\. 25\./);
  });
});

describe("formatAmount", () => {
  it("should format amount without type (no sign)", () => {
    expect(formatAmount(1234.56)).toBe("1234,56");
  });

  it("should format inflow with + sign", () => {
    expect(formatAmount(1234.56, "inflow")).toBe("+1234,56");
  });

  it("should format outflow with - sign", () => {
    expect(formatAmount(1234.56, "outflow")).toBe("-1234,56");
  });

  it("should handle zero amount", () => {
    expect(formatAmount(0, "inflow")).toBe("+0,00");
  });

  it("should handle large amounts", () => {
    const result = formatAmount(12345678.9, "outflow");
    // Use regex to handle non-breaking space in thousands separator
    expect(result).toMatch(/^-12.345.678,90$/);
  });

  it("should handle small amounts", () => {
    expect(formatAmount(0.01, "inflow")).toBe("+0,01");
  });

  it("should always show 2 decimal places", () => {
    expect(formatAmount(100)).toBe("100,00");
  });
});
