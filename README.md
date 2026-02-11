# Iconify Search

![Demo](docs/demo.gif)

Search and pick icons from [Iconify](https://iconify.design) in your React app. Use the ready-to-use component via shadcn, or the renderless primitive to build your own UI.

> This project uses the [Iconify API](https://iconify.design) to search icons. If you find it useful, please consider [supporting Iconify](https://iconify.design/sponsors/).

## Installation

### Option 1: shadcn registry

Add the ready-to-use component to your shadcn/ui project:

```bash
npx shadcn@latest add "https://raw.githubusercontent.com/gijsroge/iconify-search-component/refs/heads/main/apps/web/registry.json"
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
