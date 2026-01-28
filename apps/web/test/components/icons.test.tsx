import { render } from "@testing-library/react";
import {
  SortDownIcon,
  SortUpIcon,
  UnsortedIcon,
} from "../../src/app/components/icons";

describe("Icon Components", () => {
  describe("UnsortedIcon", () => {
    it("should render SVG element", () => {
      const { container } = render(<UnsortedIcon />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should apply default className", () => {
      const { container } = render(<UnsortedIcon />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("h-4", "w-4");
    });

    it("should accept custom className", () => {
      const { container } = render(<UnsortedIcon className="custom-class" />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("custom-class");
    });
  });

  describe("SortUpIcon", () => {
    it("should render SVG element", () => {
      const { container } = render(<SortUpIcon />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should have correct path data for up arrow", () => {
      const { container } = render(<SortUpIcon />);
      const path = container.querySelector("path");
      expect(path?.getAttribute("d")).toBe("M5 15l7-7 7 7");
    });
  });

  describe("SortDownIcon", () => {
    it("should render SVG element", () => {
      const { container } = render(<SortDownIcon />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should have correct path data for down arrow", () => {
      const { container } = render(<SortDownIcon />);
      const path = container.querySelector("path");
      expect(path?.getAttribute("d")).toBe("M19 9l-7 7-7-7");
    });
  });
});
