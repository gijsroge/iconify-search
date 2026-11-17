A **renderless** React component for searching [Iconify](https://iconify.design) icons. You get the search state, grouping, and selection logic—you build the UI (dialog, dropdown, inline list, etc.).

Want a **ready-to-use** component (button + dialog) with [shadcn/ui](https://ui.shadcn.com)? Use the [iconify-search](https://github.com/gijsroge/iconify-search) repo and add the block via the shadcn registry—it uses this package under the hood.

## Installation

```bash
npm install @gijsroge/iconify-search
```

Peer dependencies (install them if you don’t already have them):

```bash
npm install react @tanstack/react-query @tanstack/react-pacer
```

To render the icons, use `@iconify/react`:

```bash
npm install @iconify/react
```

> **Render icons with `@iconify/react`, not `<img>`.** Iconify's public API rate limits clients that send it too many requests (Cloudflare error 1015). An `<img>` per icon makes one request per icon, which a scrolling result list turns into hundreds per second. `<Icon icon={iconId} />` from [`@iconify/react`](https://iconify.design/docs/icon-components/react/) loads all icons on screen in one request per icon set and caches them.

## Quick example

```tsx
import { IconifySearchPrimitive } from "@gijsroge/iconify-search";
import { Icon } from "@iconify/react";

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
                    aria-label={iconId}
                  >
                    <Icon icon={iconId} width={24} height={24} />
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

| Prop                 | Type                     | Default | Description                                                                 |
| -------------------- | ------------------------ | ------- | --------------------------------------------------------------------------- |
| `multiple`           | `boolean`                | `false` | Allow selecting multiple icons. When `false`, max one.                      |
| `debounceMs`         | `number`                 | `300`   | Debounce delay (ms) before calling the Iconify search API.                  |
| `value`              | `string[]`               | —       | Controlled selected icon IDs (e.g. `["mdi:home"]`). Use with `onValueChange`. |
| `defaultValue`       | `string[]`               | `[]`    | Initial selected icon IDs when uncontrolled.                                |
| `onValueChange`      | `(value: string[]) => void` | —    | Called when the selection changes.                                          |
| `searchValue`        | `string`                 | —       | Controlled search query. Use with `onSearchChange`.                         |
| `defaultSearchValue` | `string`                 | `""`    | Initial search query when uncontrolled.                                     |
| `onSearchChange`     | `(value: string) => void` | —     | Called when the search query changes.                                      |
| `children`           | `(state) => ReactNode`   | —       | Render prop receiving the search state.                                     |

### State (`IconifySearchState`)

| Property           | Type                                        | Description                                               |
| ------------------ | ------------------------------------------- | --------------------------------------------------------- |
| `query`            | `string`                                    | Current input value.                                      |
| `setQuery`         | `(value: string) => void`                   | Update the search query.                                  |
| `debouncedQuery`   | `string`                                    | Query used for API calls (debounced).                     |
| `isPending`        | `boolean`                                   | `true` while debouncing or fetching.                      |
| `data`             | `IconifySearchResponse \| undefined`        | Raw API response.                                         |
| `groups`           | `Array<{ prefix, name, icons }>`            | Icons grouped by collection.                              |
| `selectedIcons`    | `string[]`                                  | Selected icon IDs (e.g. `["mdi:home", "lucide:search"]`). |
| `setSelectedIcons` | `(ids: string[]) => void`                   | Set selection (respects `multiple`).                      |
| `selectIcon`       | `(iconId: string) => void`                  | Toggle (multiple) or set (single) selection.              |
| `getIconUrl`       | `(iconId: string, size?: number) => string` | **Deprecated.** Iconify CDN URL for an icon. Don't use it to render result lists; see the note above. |
| `multiple`         | `boolean`                                   | Same as the prop.                                         |

### Hooks and utilities

- **`useIconifySearchAll(query)`** — React Query hook that fetches search results for a given (debounced) query. Use this if you want to wire the API yourself instead of using the primitive.
- **`searchIcons(query, { limit?, start? })`** — Fetches from the Iconify search API. Returns a promise of `IconifySearchResponse`.
- **`getIconSvg(iconId, size?)`** — Fetches the SVG markup of one icon, e.g. to store the picked icon. One request per call.
- **`getIconUrl(iconId, size?)`** — **Deprecated.** Returns the Iconify CDN URL for an icon ID (e.g. `"mdi:home"`). Fine for a one-off link; rendering lists with it gets you rate limited.

## License

MIT
