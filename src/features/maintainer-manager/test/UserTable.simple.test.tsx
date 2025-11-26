/**
 * UserTable UI 測試 - 不涉及 API,專注測試 UI 邏輯
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { mockUsersResponse } from "./mockData";

// Mock services - 必須在 import UserTable 之前
vi.mock("../services/userManagementServices", () => ({
  useGetUsersQuery: () => ({
    data: mockUsersResponse,
    isLoading: false,
    isFetching: false,
  }),
  useUpdateUserStatusMutation: () => [vi.fn(), { isLoading: false }],
  useArchiveUserMutation: () => [vi.fn(), { isLoading: false }],
}));

import UserTable from "../components/UserTable";

const createTestStore = () => {
  return configureStore({
    reducer: {},
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

const renderWithProvider = (ui: React.ReactElement) => {
  const store = createTestStore();
  return render(<Provider store={store}>{ui}</Provider>);
};

describe("UserTable - UI Tests", () => {
  it("should render table structure", () => {
    const { container } = renderWithProvider(
      <UserTable searchKeyword="" statusFilter="all" />
    );

    const table = container.querySelector("table");
    expect(table).toBeInTheDocument();
  });

  it("should display user data", async () => {
    renderWithProvider(<UserTable searchKeyword="" statusFilter="all" />);

    // 等待資料渲染
    expect(await screen.findByText("john_doe")).toBeInTheDocument();
    expect(screen.getByText("jane_smith")).toBeInTheDocument();
    expect(screen.getByText("archived_user")).toBeInTheDocument();
  });

  it("should display status badges", async () => {
    renderWithProvider(<UserTable searchKeyword="" statusFilter="all" />);

    // Active/Inactive 會出現在 badge 和 switch 中,所以用 getAllByText
    const activeElements = await screen.findAllByText("Active");
    expect(activeElements.length).toBeGreaterThan(0);

    const inactiveElements = screen.getAllByText("Inactive");
    expect(inactiveElements.length).toBeGreaterThan(0);

    const archivedElements = screen.getAllByText("Archived");
    expect(archivedElements.length).toBeGreaterThan(0);
  });

  it("should show Edit and Archive buttons for non-archived users", async () => {
    renderWithProvider(<UserTable searchKeyword="" statusFilter="all" />);

    await screen.findByText("john_doe");

    const editButtons = screen.getAllByText("Edit");
    const archiveButtons = screen.getAllByText("Archive");

    // 應該有 2 個 Edit 按鈕 (john_doe 和 jane_smith)
    expect(editButtons.length).toBe(2);
    // 應該有 2 個 Archive 按鈕
    expect(archiveButtons.length).toBe(2);
  });

  it("should hide action buttons for archived users", async () => {
    renderWithProvider(<UserTable searchKeyword="" statusFilter="all" />);

    await screen.findByText("archived_user");

    // archived_user 的那一行應該顯示 "Archived" 文字
    const archivedTexts = screen.getAllByText("Archived");
    // 至少 2 個: status badge + action 欄位提示
    expect(archivedTexts.length).toBeGreaterThanOrEqual(2);
  });

  it("should render status switches for non-archived users", async () => {
    const { container } = renderWithProvider(
      <UserTable searchKeyword="" statusFilter="all" />
    );

    await screen.findByText("john_doe");

    const switches = container.querySelectorAll(".ant-switch");
    // 2 個 switch: active 和 inactive 使用者
    expect(switches.length).toBe(2);
  });

  it("should call onEdit callback when edit button clicked", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();

    renderWithProvider(
      <UserTable searchKeyword="" statusFilter="all" onEdit={onEdit} />
    );

    await screen.findByText("john_doe");

    const editButtons = screen.getAllByText("Edit");
    await user.click(editButtons[0]);

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "1",
        username: "john_doe",
      })
    );
  });

  it("should display pagination info", async () => {
    renderWithProvider(<UserTable searchKeyword="" statusFilter="all" />);

    await screen.findByText("john_doe");

    // 檢查分頁總數顯示
    expect(screen.getByText(/Total \d+ items/)).toBeInTheDocument();
  });
});
