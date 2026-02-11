# @gijsroge/iconify-search

A **renderless** React component for searching [Iconify](https://iconify.design) icons. You get the search state, grouping, and selection logic—you build the UI (dialog, dropdown, inline list, etc.).

Want a **ready-to-use** component (button + dialog) with [shadcn/ui](https://ui.shadcn.com)? Use the [iconify-search-component](https://github.com/gijsroge/iconify-search-component) repo and add the block via the shadcn registry—it uses this package under the hood.

## Installation

```bash
npm install @gijsroge/iconify-search
```

Peer dependencies (install them if you don’t already have them):

```bash
npm install react @tanstack/react-query @tanstack/react-pacer
```

## Quick example

```tsx
import { IconifySearchPrimitive } from "@gijsroge/iconify-search";

function MyIconPicker() {
  return (
    <IconifySearchPrimitive debounceMs={300} multiple={false}>
      {(state) => (
        <>
          <input
            placeholder="Search icons..."
            value={state.query}
            onChange={(e) => state.setQuery(e.target.value)}
          />
          {state.isPending && <span>Searching...</span>}
          {state.groups.map(({ prefix, name, icons }) => (
            <div key={prefix}>
              <h3>{name}</h3>
              <div className="icon-grid">
                {icons.map((iconId) => (
                  <button
                    key={iconId}
                    onClick={() => state.selectIcon(iconId)}
                    aria-pressed={state.selectedIcons.includes(iconId)}
                  >
                    <img
                      src={state.getIconUrl(iconId, 24)}
                      alt={iconId}
                      width={24}
                      height={24}
                    />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </IconifySearchPrimitive>
  );
}
```

## API

### `IconifySearchPrimitive`

| Prop        | Type     | Default | Description                                              |
| ----------- | -------- | ------- | -------------------------------------------------------- |
| `multiple`  | `boolean`| `false` | Allow selecting multiple icons. When `false`, max one.   |
| `debounceMs`| `number` | `300`   | Debounce delay (ms) before calling the Iconify search API. |
| `children`  | `(state) => ReactNode` | — | Render prop receiving the search state.                  |

### State (`IconifySearchState`)

| Property         | Type     | Description |
| ---------------- | -------- | ----------- |
| `query`          | `string` | Current input value. |
| `setQuery`       | `(value: string) => void` | Update the search query. |
| `debouncedQuery` | `string` | Query used for API calls (debounced). |
| `isPending`      | `boolean`| `true` while debouncing or fetching. |
| `data`           | `IconifySearchResponse \| undefined` | Raw API response. |
| `groups`         | `Array<{ prefix, name, icons }>` | Icons grouped by collection. |
| `selectedIcons`  | `string[]` | Selected icon IDs (e.g. `["mdi:home", "lucide:search"]`). |
| `setSelectedIcons` | `(ids: string[]) => void` | Set selection (respects `multiple`). |
| `selectIcon`     | `(iconId: string) => void` | Toggle (multiple) or set (single) selection. |
| `getIconUrl`     | `(iconId: string, size?: number) => string` | Iconify CDN URL for an icon. |
| `multiple`       | `boolean` | Same as the prop. |

### Hooks and utilities

- **`useIconifySearchAll(query)`** — React Query hook that fetches search results for a given (debounced) query. Use this if you want to wire the API yourself instead of using the primitive.
- **`searchIcons(query, { limit?, start? })`** — Fetches from the Iconify search API. Returns a promise of `IconifySearchResponse`.
- **`getIconUrl(iconId, size?)`** — Returns the Iconify CDN URL for an icon ID (e.g. `"mdi:home"`).

## License

MIT
