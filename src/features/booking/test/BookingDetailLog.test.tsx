/**
 * BookingDetailLog 單元測試
 *
 * 測試 View Log 頁面的 UI 渲染、按鈕互動、Export 下載
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { http, HttpResponse } from "msw";
import { server } from "../../../test/server";
import { bookingHistoryApi } from "../api/bookingHistoryApi";
import BookingDetailLog from "../pages/BookingDetailLog";

// ---------- Test helpers ----------

const API_BASE = "http://localhost:30000";

const createTestStore = () =>
  configureStore({
    reducer: {
      [bookingHistoryApi.reducerPath]: bookingHistoryApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(bookingHistoryApi.middleware),
  });

const renderPage = (bookingId = "42") => {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[`/booking/history/${bookingId}/log`]}>
        <Routes>
          <Route
            path="/booking/history/:id/log"
            element={<BookingDetailLog />}
          />
          <Route
            path="/booking/history/:id"
            element={<div data-testid="details-page">Details</div>}
          />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
};

// ---------- Mock data ----------

const mockLogContent =
  "2025-08-10 09:00:00 [INFO] Container started\n2025-08-10 09:00:01 [INFO] Service ready";

const mockContainerStatus = {
  status: "running",
  start_at: "2025-08-10T09:00:00Z",
};

// ---------- MSW handlers ----------

// Wrap data in API response envelope (baseQueryWithErrorHandler unwraps res.data)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const apiResponse = (data: any) =>
  HttpResponse.json({ error_code: "00000", data });

const containerLogHandler = http.get(
  `${API_BASE}/bookings/:id/log`,
  () => apiResponse({ log: mockLogContent }),
);

const containerStatusHandler = http.get(
  `${API_BASE}/bookings/:id/container_status`,
  () => apiResponse(mockContainerStatus),
);

const emptyLogHandler = http.get(
  `${API_BASE}/bookings/:id/log`,
  () => apiResponse({ log: "" }),
);

// ---------- Tests ----------

describe("BookingDetailLog", () => {
  beforeEach(() => {
    server.use(containerLogHandler, containerStatusHandler);
  });

  // --- Rendering ---

  it("should render page title 'View Log'", async () => {
    renderPage();
    expect(
      await screen.findByRole("heading", { name: "View Log" }),
    ).toBeInTheDocument();
  });

  it("should render breadcrumb items including 'Booking Details' and 'View Log'", async () => {
    renderPage();
    // "Booking" also appears in sidebar, so use getAllByText
    const bookingTexts = await screen.findAllByText("Booking");
    expect(bookingTexts.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Booking Details")).toBeInTheDocument();
    // "View Log" appears in both breadcrumb and heading
    const viewLogTexts = screen.getAllByText("View Log");
    expect(viewLogTexts.length).toBeGreaterThanOrEqual(2);
  });

  it("should render back button with aria-label", async () => {
    renderPage();
    expect(
      await screen.findByRole("button", { name: "Go back" }),
    ).toBeInTheDocument();
  });

  it("should render info alert with read-only message", async () => {
    renderPage();
    expect(
      await screen.findByText(/read-only view of the container log/i),
    ).toBeInTheDocument();
  });

  it("should render Docker Log section title", async () => {
    renderPage();
    expect(
      await screen.findByRole("heading", { name: "Docker Log" }),
    ).toBeInTheDocument();
  });

  it("should render Refresh and Export buttons", async () => {
    renderPage();
    expect(
      await screen.findByRole("button", { name: /refresh/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /export/i }),
    ).toBeInTheDocument();
  });

  it("should render status bar with 'Status' label", async () => {
    renderPage();
    expect(await screen.findByText("Status")).toBeInTheDocument();
  });

  // --- Log content ---

  it("should display log content from API", async () => {
    renderPage();
    expect(
      await screen.findByText(/Container started/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Service ready/)).toBeInTheDocument();
  });

  it("should show 'No log available.' when log is empty", async () => {
    server.use(emptyLogHandler);
    renderPage();
    expect(
      await screen.findByText("No log available."),
    ).toBeInTheDocument();
  });

  // --- Status bar ---

  it("should display capitalized status from API", async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText("Running")).toBeInTheDocument();
    });
  });

  // --- Navigation ---

  it("should navigate back to BookingDetails when back button is clicked", async () => {
    const user = userEvent.setup();
    renderPage("42");

    const backButton = await screen.findByRole("button", { name: "Go back" });
    await user.click(backButton);

    expect(await screen.findByTestId("details-page")).toBeInTheDocument();
  });

  // --- Refresh ---

  it("should trigger API call again when Refresh button is clicked", async () => {
    const user = userEvent.setup();
    let callCount = 0;

    // Override handler to count calls — must be registered AFTER beforeEach
    server.use(
      http.get(`${API_BASE}/bookings/:id/log`, () => {
        callCount++;
        return apiResponse({ log: mockLogContent });
      }),
      containerStatusHandler,
    );

    renderPage();

    // Wait for initial load to complete
    await screen.findByText(/Container started/);

    // callCount should be at least 1 after initial load
    await waitFor(() => {
      expect(callCount).toBeGreaterThanOrEqual(1);
    });

    const initialCallCount = callCount;

    const refreshBtn = screen.getByRole("button", { name: /refresh/i });
    await user.click(refreshBtn);

    await waitFor(() => {
      expect(callCount).toBeGreaterThan(initialCallCount);
    });
  });

  // --- Export ---

  it("should trigger file download when Export button is clicked", async () => {
    const user = userEvent.setup();

    // jsdom doesn't have URL.createObjectURL — define them
    const mockUrl = "blob:http://localhost/fake-blob-url";
    const createObjectURLMock = vi.fn().mockReturnValue(mockUrl);
    const revokeObjectURLMock = vi.fn();
    globalThis.URL.createObjectURL = createObjectURLMock;
    globalThis.URL.revokeObjectURL = revokeObjectURLMock;

    // Spy on anchor element creation
    const clickSpy = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation(
      (tag: string, options?: ElementCreationOptions) => {
        if (tag === "a") {
          const anchor = originalCreateElement("a", options);
          anchor.click = clickSpy;
          return anchor;
        }
        return originalCreateElement(tag, options);
      },
    );

    renderPage();
    await screen.findByText(/Container started/);

    const exportBtn = screen.getByRole("button", { name: /export/i });
    await user.click(exportBtn);

    expect(createObjectURLMock).toHaveBeenCalledWith(expect.any(Blob));
    expect(clickSpy).toHaveBeenCalled();
    expect(revokeObjectURLMock).toHaveBeenCalledWith(mockUrl);

    vi.restoreAllMocks();
  });

  // --- Alert closable ---

  it("should allow closing the info alert", async () => {
    const user = userEvent.setup();
    renderPage();

    const alertMessage = await screen.findByText(
      /read-only view of the container log/i,
    );
    expect(alertMessage).toBeInTheDocument();

    // AntD Alert close button
    const closeBtn = screen.getByRole("button", { name: /close/i });
    await user.click(closeBtn);

    await waitFor(() => {
      expect(
        screen.queryByText(/read-only view of the container log/i),
      ).not.toBeInTheDocument();
    });
  });
});
