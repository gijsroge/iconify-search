import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { IconifySearchPrimitive } from "./iconify-search-primitive.js";

// Mock hooks to avoid network and debounce in tests
vi.mock("./use-iconify-search.js", () => ({
  useIconifySearchAll: () => ({
    data: {
      icons: ["mdi:home", "mdi:search"],
      total: 2,
      limit: 64,
      start: 0,
      collections: { mdi: { name: "Material Design Icons" } },
      request: {},
    },
    isLoading: false,
    isFetching: false,
  }),
}));

vi.mock("@tanstack/react-pacer", () => ({
  useDebouncedValue: (value: string) => [
    value,
    { state: { isPending: false } },
    {},
  ],
}));

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("IconifySearchPrimitive", () => {
  it("renders children with search state", () => {
    let state: { query: string; getIconUrl: (id: string) => string } | null =
      null;
    renderWithProviders(
      <IconifySearchPrimitive>
        {(s) => {
          state = s;
          return <div data-testid="child">query: {s.query}</div>;
        }}
      </IconifySearchPrimitive>
    );
    expect(screen.getByTestId("child").textContent).toBe("query: ");
    expect(state).not.toBeNull();
    expect(state!.query).toBe("");
    expect(state!.getIconUrl("mdi:home")).toBe(
      "https://api.iconify.design/mdi/home.svg?height=24"
    );
  });

  it("single selection: setQuery updates query, selectIcon sets one icon", async () => {
    const user = userEvent.setup();
    let state: {
      query: string;
      setQuery: (q: string) => void;
      selectedIcons: string[];
      selectIcon: (id: string) => void;
    } | null = null;
    renderWithProviders(
      <IconifySearchPrimitive multiple={false}>
        {(s) => {
          state = s;
          return (
            <div>
              <input
                data-testid="input"
                value={s.query}
                onChange={(e) => s.setQuery(e.target.value)}
              />
              <span data-testid="selected">{s.selectedIcons.join(",")}</span>
              <button
                data-testid="select-home"
                onClick={() => s.selectIcon("mdi:home")}
              />
              <button
                data-testid="select-search"
                onClick={() => s.selectIcon("mdi:search")}
              />
            </div>
          );
        }}
      </IconifySearchPrimitive>
    );
    expect(state!.selectedIcons).toEqual([]);
    await user.click(screen.getByTestId("select-home"));
    expect(state!.selectedIcons).toEqual(["mdi:home"]);
    await user.click(screen.getByTestId("select-search"));
    expect(state!.selectedIcons).toEqual(["mdi:search"]);
    await user.type(screen.getByTestId("input"), "test");
    expect(state!.query).toBe("test");
  });

  it("multiple selection: selectIcon toggles icons", async () => {
    const user = userEvent.setup();
    let state: {
      selectedIcons: string[];
      selectIcon: (id: string) => void;
    } | null = null;
    renderWithProviders(
      <IconifySearchPrimitive multiple>
        {(s) => {
          state = s;
          return (
            <div>
              <span data-testid="selected">{s.selectedIcons.join(",")}</span>
              <button
                data-testid="select-home"
                onClick={() => s.selectIcon("mdi:home")}
              />
              <button
                data-testid="select-search"
                onClick={() => s.selectIcon("mdi:search")}
              />
            </div>
          );
        }}
      </IconifySearchPrimitive>
    );
    await user.click(screen.getByTestId("select-home"));
    expect(state!.selectedIcons).toEqual(["mdi:home"]);
    await user.click(screen.getByTestId("select-search"));
    expect(state!.selectedIcons).toEqual(["mdi:home", "mdi:search"]);
    await user.click(screen.getByTestId("select-home"));
    expect(state!.selectedIcons).toEqual(["mdi:search"]);
  });

  it("exposes groups from search data", () => {
    let state: {
      groups: Array<{ prefix: string; name: string; icons: string[] }>;
    } | null = null;
    renderWithProviders(
      <IconifySearchPrimitive>
        {(s) => {
          state = s;
          return <div data-testid="child" />;
        }}
      </IconifySearchPrimitive>
    );
    expect(state!.groups.length).toBeGreaterThanOrEqual(1);
    const mdiGroup = state!.groups.find((g) => g.prefix === "mdi");
    expect(mdiGroup).toBeDefined();
    expect(mdiGroup!.icons).toContain("mdi:home");
    expect(mdiGroup!.icons).toContain("mdi:search");
  });

  it("uses defaultValue for initial selected icons when uncontrolled", () => {
    let state: { selectedIcons: string[] } | null = null;
    renderWithProviders(
      <IconifySearchPrimitive defaultValue={["mdi:home"]}>
        {(s) => {
          state = s;
          return <span data-testid="selected">{s.selectedIcons.join(",")}</span>;
        }}
      </IconifySearchPrimitive>
    );
    expect(screen.getByTestId("selected").textContent).toBe("mdi:home");
    expect(state!.selectedIcons).toEqual(["mdi:home"]);
  });

  it("uses defaultSearchValue for initial query when uncontrolled", () => {
    let state: { query: string } | null = null;
    renderWithProviders(
      <IconifySearchPrimitive defaultSearchValue="hello">
        {(s) => {
          state = s;
          return <div data-testid="child">query: {s.query}</div>;
        }}
      </IconifySearchPrimitive>
    );
    expect(screen.getByTestId("child").textContent).toBe("query: hello");
    expect(state!.query).toBe("hello");
  });

  it("controlled value: selection reflects value prop and onValueChange is called", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    let state: { selectIcon: (id: string) => void; selectedIcons: string[] } | null = null;
    const { rerender } = renderWithProviders(
      <IconifySearchPrimitive value={["mdi:home"]} onValueChange={onValueChange}>
        {(s) => {
          state = s;
          return (
            <div>
              <span data-testid="selected">{s.selectedIcons.join(",")}</span>
              <button data-testid="select-search" onClick={() => s.selectIcon("mdi:search")} />
            </div>
          );
        }}
      </IconifySearchPrimitive>
    );
    expect(screen.getByTestId("selected").textContent).toBe("mdi:home");
    expect(state!.selectedIcons).toEqual(["mdi:home"]);

    await user.click(screen.getByTestId("select-search"));
    expect(onValueChange).toHaveBeenCalledWith(["mdi:search"]);
    expect(onValueChange).toHaveBeenCalledTimes(1);
    // State still shows controlled value until parent rerenders
    expect(state!.selectedIcons).toEqual(["mdi:home"]);

    rerender(
      <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
        <IconifySearchPrimitive value={["mdi:search"]} onValueChange={onValueChange}>
          {(s) => {
            state = s;
            return (
              <div>
                <span data-testid="selected">{s.selectedIcons.join(",")}</span>
                <button data-testid="select-search" onClick={() => s.selectIcon("mdi:search")} />
              </div>
            );
          }}
        </IconifySearchPrimitive>
      </QueryClientProvider>
    );
    expect(screen.getByTestId("selected").textContent).toBe("mdi:search");
    expect(state!.selectedIcons).toEqual(["mdi:search"]);
  });

  it("controlled searchValue: query reflects searchValue prop and onSearchChange is called", () => {
    const onSearchChange = vi.fn();
    let state: { query: string; setQuery: (q: string) => void } | null = null;
    renderWithProviders(
      <IconifySearchPrimitive searchValue="initial" onSearchChange={onSearchChange}>
        {(s) => {
          state = s;
          return (
            <div>
              <input
                data-testid="input"
                value={s.query}
                onChange={(e) => s.setQuery(e.target.value)}
              />
            </div>
          );
        }}
      </IconifySearchPrimitive>
    );
    expect((screen.getByTestId("input") as HTMLInputElement).value).toBe("initial");
    expect(state!.query).toBe("initial");

    state!.setQuery("test");
    expect(onSearchChange).toHaveBeenCalledWith("test");
    // Query still shows controlled value (parent has not updated searchValue)
    expect(state!.query).toBe("initial");
  });

  it("uncontrolled: onValueChange and onSearchChange are called when state changes", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onSearchChange = vi.fn();
    let state: {
      query: string;
      setQuery: (q: string) => void;
      selectedIcons: string[];
      selectIcon: (id: string) => void;
    } | null = null;
    renderWithProviders(
      <IconifySearchPrimitive onValueChange={onValueChange} onSearchChange={onSearchChange}>
        {(s) => {
          state = s;
          return (
            <div>
              <input
                data-testid="input"
                value={s.query}
                onChange={(e) => s.setQuery(e.target.value)}
              />
              <span data-testid="selected">{s.selectedIcons.join(",")}</span>
              <button data-testid="select-home" onClick={() => s.selectIcon("mdi:home")} />
            </div>
          );
        }}
      </IconifySearchPrimitive>
    );
    await user.click(screen.getByTestId("select-home"));
    expect(onValueChange).toHaveBeenCalledWith(["mdi:home"]);
    await user.type(screen.getByTestId("input"), "x");
    expect(onSearchChange).toHaveBeenCalledWith("x");
  });
});
