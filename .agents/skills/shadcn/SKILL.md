---
name: shadcn
description: Project-aware skill for building, composing, styling, debugging, and maintaining shadcn/ui interfaces. Use it whenever working with shadcn components, forms, dialogs, tables, dashboards, navigation, theming, registries, presets, or components.json.
user-invocable: false
---

# shadcn/ui Skill

Use shadcn/ui as the project's primary reusable UI composition layer when it fits the task. Components are source code added to the repository, not a black-box component package, so preserve project conventions and customize intentionally.

## Project-first workflow

1. Inspect the existing project before adding anything: `components.json`, package manager, Tailwind version, aliases, icon library, base primitives, installed components, and `src/components/ui`.
2. Prefer existing components over custom markup.
3. Before adding a component, preview the change with the shadcn CLI when execution is available.
4. After adding or changing a component, review imports, accessibility, variants, responsive behavior, dark/light tokens, and build compatibility.
5. Never overwrite a customized component without reviewing the diff first.

## CLI reference

Use the project's package runner. Typical commands:

```bash
npx shadcn@latest info --json
npx shadcn@latest search @shadcn -q "component"
npx shadcn@latest docs button dialog select
npx shadcn@latest view @shadcn/button
npx shadcn@latest add button card dialog --dry-run
npx shadcn@latest add button card dialog
```

When the project uses pnpm or bun, use the equivalent `pnpm dlx shadcn@latest` or `bunx --bun shadcn@latest` command.

## Composition rules

- Compose interfaces from shadcn primitives before creating bespoke controls.
- Buttons use `Button` variants and sizes instead of duplicated button CSS.
- Forms should use the project's shadcn form/field primitives, clear labels, validation states, and accessible error messaging.
- Dialog, Sheet, Drawer, and AlertDialog must have accessible titles.
- Tabs triggers belong inside `TabsList`.
- Avatar must include a fallback.
- Use `Card` composition (`CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`) when the content is genuinely card-like.
- Use `Alert`, `Badge`, `Separator`, `Skeleton`, `Progress`, `Tooltip`, `Popover`, `DropdownMenu`, and other existing primitives instead of recreating them from styled divs.
- Use `AlertDialog` for destructive confirmations such as deleting accounts or plans.

## Styling rules

- Prefer semantic tokens: `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, `text-primary-foreground`.
- Avoid hardcoded light/dark colors when a semantic token exists.
- Use `gap-*` for spacing instead of `space-x-*` / `space-y-*` in new composition work.
- Use `size-*` when width and height are equal.
- Use `cn()` for conditional classes.
- Keep one coherent radius, shadow, spacing, and typography system across the product.
- Adapt shadcn components to the Body Métrica design language; do not leave them looking like untouched defaults.
- Maintain WCAG-friendly contrast in both light and dark modes.

## Icons

Use the icon library already configured by the project. Do not introduce a second icon family without a deliberate migration. Icons inside buttons should support the button content rather than become the primary visual hierarchy.

## Body Métrica priorities

For this repository, prioritize:

- professional health/fitness presentation;
- strong readable hierarchy;
- consistent cards and admin controls;
- reliable responsive behavior;
- accessible forms for login, registration, account editing, plans and administration;
- semantic light/dark mode tokens;
- reusable confirmation dialogs for destructive actions;
- tables, badges, filters and dashboards that remain visually consistent with the platform;
- avoiding duplicate theme controls or redundant UI actions.

## Quality gate

Before considering a shadcn task complete, verify:

- component already installed or deliberately added;
- imports match project aliases;
- keyboard and focus behavior works;
- labels/titles required for accessibility exist;
- mobile layout is stable;
- light and dark contrast remain correct;
- no duplicated primitive was hand-built unnecessarily;
- local customizations were preserved;
- the change is compatible with the current project build.

## Official source

This skill follows the current shadcn/ui agent-skill workflow and CLI conventions documented by the shadcn/ui project. For APIs that may have changed, consult the current official shadcn/ui documentation or CLI docs before implementing.