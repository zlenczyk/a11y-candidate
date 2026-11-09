# Championship Day — accessibility audit

The audit targets WCAG 2.1 Level AA and starts from the axe DevTools, WAVE, ARC Toolkit and Lighthouse reports. I then went through the code with Claude Code and tested the app by hand with keyboard and mouse in Chrome, Edge and Firefox, on mobile and desktop; I worked on Windows, so Safari wasn't tested, and my devices didn't let me test with a screen reader. After the fixes axe-core reports no violations, and `pnpm test`, `pnpm check`, `pnpm lint` and `pnpm build` pass.

## 1. WCAG 2.1 fixes

1. **Session filters (keyboard).** The filters were clickable `div`s: only "Live only" was in the Tab order and none responded to Enter or Space. They are now native buttons. [2.1.1 Keyboard](https://www.w3.org/TR/WCAG21/#keyboard)
2. **Session filters (selected state).** The selected filter was marked only by its styling, not exposed to screen readers. Added `aria-pressed`. [4.1.2 Name, Role, Value](https://www.w3.org/TR/WCAG21/#name-role-value)
3. **Result status.** Every Status cell showed "—", and the code told Qualified and Eliminated apart only by a green or pink background. The status is now shown as text, and the colours stay as an extra cue. [1.4.1 Use of Color](https://www.w3.org/TR/WCAG21/#use-of-color), [1.3.1 Info and Relationships](https://www.w3.org/TR/WCAG21/#info-and-relationships)
4. **Favourite button.** An icon-only button with no name, whose state was shown only by the filled star. Added the name "Favorite event" and `aria-pressed`. [4.1.2](https://www.w3.org/TR/WCAG21/#name-role-value), [1.1.1 Non-text Content](https://www.w3.org/TR/WCAG21/#non-text-content)
5. **Share button.** Announced as "Menu", although it's a share button that shows "Link copied". Renamed to "Copy link". [1.1.1](https://www.w3.org/TR/WCAG21/#non-text-content)
6. **Course banner.** An image of text with `alt=""`, so screen-reader users missed "58 gates, 180 m vertical drop" and the text couldn't follow the user's own font, spacing or colour settings. Replaced with real text in the same box. [1.1.1](https://www.w3.org/TR/WCAG21/#non-text-content), [1.4.5 Images of Text](https://www.w3.org/TR/WCAG21/#images-of-text)
7. **Alert preferences dialog.** The custom overlay wasn't modal: Tab moved to controls behind it, and focus was lost when it closed. It is now a native `<dialog>` opened with `showModal()`, and focus returns to "Manage alerts". [2.4.3 Focus Order](https://www.w3.org/TR/WCAG21/#focus-order)
8. **View switcher.** Links with `role="tab"` but no tab panels, pointing to page fragments that don't exist. Replaced with plain buttons with `aria-pressed` in a labelled group. [4.1.2](https://www.w3.org/TR/WCAG21/#name-role-value)
9. **Bib sort button.** Labelled "Bib" but named "Sort by rank". Renamed to "Sort by bib". [2.5.3 Label in Name](https://www.w3.org/TR/WCAG21/#label-in-name)
10. **Athlete column.** The header cell was empty. Added "Athlete". [1.3.1](https://www.w3.org/TR/WCAG21/#info-and-relationships)

## 2. Other accessibility improvements

- **Dialog name.** The dialog is now named by its heading, "Alert preferences". WCAG doesn't clearly cover containers, but [WAI-ARIA requires a name for dialogs](https://www.w3.org/TR/wai-aria-1.2/#dialog).
- **Hidden duplicate table removed.** A visually hidden second "Heat results" table contained only "—", so screen readers found two tables with the same name, one of them empty.

## 3. Supporting changes

- **Colour palette.** The tokens in `panda.config.ts` only exist under `.light` and `.dark`, and nothing set either class, so the dialog was transparent (its text overlapped the page) and the selected filter looked like the others. Added `class="light"` to `<html>` and fixed the body background variable (`--colors-background-base` doesn't exist).
- **Banner colours** added to the palette as `surface.banner` and `text.on_banner`. The text uses the existing `h_large` and `t_small` text styles.
- **TypeScript.** `pnpm check` failed on the starter (12 errors) because `tsc` didn't see the jest-dom matchers. Added `vitest.setup.ts` to `tsconfig.json`.
- **Lint.** `pnpm lint` failed on the starter. Applied Biome's default formatting and import order in a separate commit; no rules were disabled. The view group is a `<fieldset>` because Biome's `useSemanticElements` rejects `div role="group"`.

## 4. Tests

Each fix area has one short test in `src/App.test.tsx` that fails on the original code, and three existing tests were updated for the new button names and roles. Happy DOM can't check modal behaviour, Escape or contrast, so I tested those by hand in Chrome.

## 5. Noticed but left out

| Finding | Why I left it |
| --- | --- |
| Nothing shows which column the table is sorted by or in which direction, visually or for screen readers. | Not a WCAG requirement, since the sort state isn't shown visually either. The usual fix is an arrow plus `aria-sort`, as in the [W3C sortable table example](https://www.w3.org/WAI/ARIA/apg/patterns/table/examples/sortable-table/). |
| No skip link: keyboard users tab through six controls (header buttons and the view switcher) before reaching the content. | [2.4.1 Bypass Blocks](https://www.w3.org/TR/WCAG21/#bypass-blocks) is about blocks repeated across pages, and this is a single page, so I didn't treat it as a failure. |
| Three buttons are all named "Details", so in a list of buttons a screen reader doesn't say which heat each one belongs to. | Each button sits right under its heat's heading, which passes [2.4.6 Headings and Labels](https://www.w3.org/TR/WCAG21/#headings-and-labels). |
| "Copy link" shows "Link copied" but never writes to the clipboard, so the message is false for everyone. | It looks like a deliberate placeholder in the exercise app, and it's a functional bug rather than an accessibility one, so I left it. In a real product the button should either copy the link or not say that it did. |
| The palette defines dark colours, but nothing in the app uses them. | Dark mode would be a whole new feature, and the original app always rendered in the light theme. |
