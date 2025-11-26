/**
 * UserStatusBadge 單元測試
 *
 * 測試三種狀態的渲染結果
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import UserStatusBadge from "../components/UserStatusBadge";
import type { UserStatus } from "../types/user.types";

describe("UserStatusBadge", () => {
  it("should render active status correctly", () => {
    render(<UserStatusBadge status="active" />);

    const badge = screen.getByText("Active");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-success-light", "text-success");
  });

  it("should render inactive status correctly", () => {
    render(<UserStatusBadge status="inactive" />);

    const badge = screen.getByText("Inactive");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-error-light", "text-error");
  });

  it("should render archived status correctly", () => {
    render(<UserStatusBadge status="archived" />);

    const badge = screen.getByText("Archived");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-gray-200", "text-gray-500");
  });

  it("should have base styling classes", () => {
    render(<UserStatusBadge status="active" />);

    const badge = screen.getByText("Active");
    expect(badge).toHaveClass("px-2", "py-1", "rounded", "text-regular-xs");
  });

  it("should render as span element", () => {
    const { container } = render(<UserStatusBadge status="active" />);

    const span = container.querySelector("span");
    expect(span).toBeInTheDocument();
    expect(span).toHaveTextContent("Active");
  });

  // 參數化測試 - 驗證所有狀態
  it.each<{
    status: UserStatus;
    expectedText: string;
    expectedClasses: string[];
  }>([
    {
      status: "active",
      expectedText: "Active",
      expectedClasses: ["bg-success-light", "text-success"],
    },
    {
      status: "inactive",
      expectedText: "Inactive",
      expectedClasses: ["bg-error-light", "text-error"],
    },
    {
      status: "archived",
      expectedText: "Archived",
      expectedClasses: ["bg-gray-200", "text-gray-500"],
    },
  ])(
    "should render $status status with correct styling",
    ({ status, expectedText, expectedClasses }) => {
      render(<UserStatusBadge status={status} />);

      const badge = screen.getByText(expectedText);
      expect(badge).toBeInTheDocument();

      expectedClasses.forEach((className) => {
        expect(badge).toHaveClass(className);
      });
    }
  );
});
