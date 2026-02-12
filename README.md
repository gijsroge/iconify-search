# Iconify Search

![Demo](docs/demo.gif)

Search and pick icons from [Iconify](https://iconify.design) in your React app. Use the ready-to-use component via shadcn, or the renderless primitive to build your own UI.

> This project uses the [Iconify API](https://iconify.design) to search icons. If you find it useful, please consider [supporting Iconify](https://iconify.design/sponsors/).

## Installation

### Option 1: shadcn registry

Add the ready-to-use component to your shadcn/ui project:

```bash
npx shadcn@latest add "https://gijsroge.github.io/iconify-search/r/iconify-search.json"
```

### Option 2: Package manager

Installs only the renderless component — no pre-built UI. You get `IconifySearchPrimitive` and build whatever you want.

```bash
bun add @gijsroge/iconify-search
npm install @gijsroge/iconify-search
pnpm add @gijsroge/iconify-search
yarn add @gijsroge/iconify-search
```

Requires `@tanstack/react-query` and `@tanstack/react-pacer` as peer dependencies. Add them if not already installed:

```bash
bun add @tanstack/react-query @tanstack/react-pacer
```

## Examples

### Ready-to-use component (shadcn)

`IconifySearch` — a button that opens a search interface to browse icons.

```tsx
import { IconifySearch } from "@/components/iconify-search";

// Single icon selection
<IconifySearch />

// Multiple icon selection
<IconifySearch multiple />
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `multiple` | `boolean` | `false` | When `true`, allows selecting multiple icons. When `false`, selecting an icon closes the dialog and replaces the previous selection. |
| `disabled` | `boolean` | `false` | Disables the trigger button, clear button, search input, and icon selection. |
| `value` | `string[]` | — | Controlled selected icon IDs (e.g. `["mdi:home", "lucide:search"]`). Use with `onValueChange` for controlled mode. |
| `defaultValue` | `string[]` | `[]` | Initial selected icon IDs when uncontrolled. |
| `onValueChange` | `(value: string[]) => void` | — | Called when the selection changes. Receives the new array of selected icon IDs. |
| `searchValue` | `string` | — | Controlled search input value. Use with `onSearchChange` for controlled mode. |
| `defaultSearchValue` | `string` | `""` | Initial search input value when uncontrolled. |
| `onSearchChange` | `(value: string) => void` | — | Called when the user types in the search field. Receives the new search string. |

Icon IDs are in the form `prefix:name` (e.g. `mdi:home`, `lucide:search`).

### Renderless component

`IconifySearchPrimitive` exposes search state and actions via render props. Build any UI you want.

```tsx
import { IconifySearchPrimitive } from "@gijsroge/iconify-search";

<IconifySearchPrimitive multiple debounceMs={300}>
  {(state) => (
    <div>
      <input
        value={state.query}
        onChange={(e) => state.setQuery(e.target.value)}
        placeholder="Search icons..."
      />
      {state.isPending && <span>Loading...</span>}
      <div>
        {state.groups.map(({ prefix, icons }) => (
          <div key={prefix}>
            {icons.map((iconId) => (
              <button key={iconId} onClick={() => state.selectIcon(iconId)}>
                <img src={state.getIconUrl(iconId, 24)} alt={iconId} />
              </button>
            ))}
          </div>
        ))}
      </div>
      <p>Selected: {state.selectedIcons.join(", ")}</p>
    </div>
  )}
</IconifySearchPrimitive>;
```
