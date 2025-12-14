/**
 * UserTable 單元測試
 *
 * 測試使用者表格的渲染、搜尋、狀態切換、編輯和歸檔功能
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import UserTable from "../components/UserTable";
import { userManagementApi } from "../services/userManagementServices";

// Mock Ant Design message
vi.mock("antd", async () => {
  const actual = await vi.importActual("antd");
  return {
    ...actual,
    message: {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
      info: vi.fn(),
    },
  };
});

/**
 * 建立測試用的 Redux store
 */
const createTestStore = () => {
  return configureStore({
    reducer: {
      [userManagementApi.reducerPath]: userManagementApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(userManagementApi.middleware),
  });
};

/**
 * 渲染包含 Redux Provider 的元件
 */
const renderWithProvider = (ui: React.ReactElement) => {
  const store = createTestStore();
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store,
  };
};

describe("UserTable", () => {
  it("should render user table with data from API", async () => {
    renderWithProvider(<UserTable searchKeyword="" statusFilter="all" />);

    // 等待 API 呼叫完成並渲染資料
    const username = await screen.findByText("john_doe", {}, { timeout: 5000 });
    expect(username).toBeInTheDocument();

    expect(screen.getByText("jane_smith")).toBeInTheDocument();
    expect(screen.getByText("archived_user")).toBeInTheDocument();
  });

  it("should render status badges correctly", async () => {
    renderWithProvider(<UserTable searchKeyword="" statusFilter="all" />);

    await waitFor(() => {
      expect(screen.getByText("john_doe")).toBeInTheDocument();
    });

    // 使用 getAllByText 因為 Switch 也會顯示狀態文字
    const activeElements = screen.getAllByText("Active");
    expect(activeElements.length).toBeGreaterThan(0);

    const inactiveElements = screen.getAllByText("Inactive");
    expect(inactiveElements.length).toBeGreaterThan(0);

    const archivedElements = screen.getAllByText("Archived");
    expect(archivedElements.length).toBeGreaterThan(0);
  });

  it("should format dates correctly", async () => {
    renderWithProvider(<UserTable searchKeyword="" statusFilter="all" />);

    await waitFor(() => {
      // 檢查日期是否被格式化為本地化字串（會有多個日期欄位）
      const dateCells = screen.getAllByText(/2024/);
      expect(dateCells.length).toBeGreaterThan(0);
    });
  });

  it("should show edit and archive buttons for active users", async () => {
    renderWithProvider(<UserTable searchKeyword="" statusFilter="all" />);

    await waitFor(() => {
      expect(screen.getByText("john_doe")).toBeInTheDocument();
    });

    // 檢查 Edit 和 Archive 按鈕存在
    const editButtons = screen.getAllByText("Edit");
    const archiveButtons = screen.getAllByText("Archive");

    expect(editButtons.length).toBeGreaterThan(0);
    expect(archiveButtons.length).toBeGreaterThan(0);
  });

  it("should hide action buttons for archived users", async () => {
    renderWithProvider(<UserTable searchKeyword="" statusFilter="all" />);

    await waitFor(() => {
      expect(screen.getByText("archived_user")).toBeInTheDocument();
    });

    // archived_user 那一行應該顯示 "Archived" 文字而非按鈕
    const archivedTexts = screen.getAllByText("Archived");
    // 至少有 2 個 "Archived": 1 個是 status badge, 1 個是 action 欄位的提示文字
    expect(archivedTexts.length).toBeGreaterThanOrEqual(2);
  });

  it("should render status switch for non-archived users", async () => {
    renderWithProvider(<UserTable searchKeyword="" statusFilter="all" />);

    await waitFor(() => {
      expect(screen.getByText("john_doe")).toBeInTheDocument();
    });

    // 檢查 Switch 元件存在
    const switches = document.querySelectorAll(".ant-switch");
    // 應該有 2 個 switch (active 和 inactive 使用者各一個)
    expect(switches.length).toBe(2);
  });

  it("should call onEdit when edit button is clicked", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();

    renderWithProvider(
      <UserTable searchKeyword="" statusFilter="all" onEdit={onEdit} />
    );

    await waitFor(() => {
      expect(screen.getByText("john_doe")).toBeInTheDocument();
    });

    // 點擊第一個 Edit 按鈕
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

  it("should show confirmation modal when archive button is clicked", async () => {
    const user = userEvent.setup();

    renderWithProvider(<UserTable searchKeyword="" statusFilter="all" />);

    await waitFor(() => {
      expect(screen.getByText("john_doe")).toBeInTheDocument();
    });

    // 點擊第一個 Archive 按鈕
    const archiveButtons = screen.getAllByText("Archive");
    await user.click(archiveButtons[0]);

    // 檢查確認 modal 是否出現（modal 中會有標題和按鈕都是"確認歸檔"）
    await waitFor(() => {
      const confirmElements = screen.getAllByText("確認歸檔");
      expect(confirmElements.length).toBeGreaterThan(0);
    });

    expect(screen.getByText(/確定要歸檔使用者/)).toBeInTheDocument();
  });

  it("should show confirmation modal when status switch is toggled", async () => {
    const user = userEvent.setup();

    renderWithProvider(<UserTable searchKeyword="" statusFilter="all" />);

    await waitFor(() => {
      expect(screen.getByText("john_doe")).toBeInTheDocument();
    });

    // 點擊第一個 switch
    const switches = document.querySelectorAll(".ant-switch");
    await user.click(switches[0]);

    // 檢查確認 modal 是否出現
    await waitFor(() => {
      expect(screen.getByText("確認變更狀態")).toBeInTheDocument();
    });
  });

  it("should display pagination controls", async () => {
    renderWithProvider(<UserTable searchKeyword="" statusFilter="all" />);

    await waitFor(() => {
      expect(screen.getByText("john_doe")).toBeInTheDocument();
    });

    // 檢查分頁控制項
    expect(screen.getByText(/Total \d+ items/)).toBeInTheDocument();
  });

  it("should render empty state when no data", async () => {
    // 覆寫 API handler 回傳空資料
    const { server } = await import("@test/server");
    const { http, HttpResponse } = await import("msw");

    server.use(
      http.get("http://localhost:30000/api/users", () => {
        return HttpResponse.json({
          error_code: '00000',
          data: {
            users: [],
            total: 0,
            page: 1,
            pageSize: 10,
          }
        });
      })
    );

    renderWithProvider(<UserTable searchKeyword="" statusFilter="all" />);

    // Ant Design Table 會顯示 "No data" 提示（可能有多個）
    await waitFor(() => {
      const emptyTexts = screen.getAllByText(/no data/i);
      expect(emptyTexts.length).toBeGreaterThan(0);
    });
  });
});
