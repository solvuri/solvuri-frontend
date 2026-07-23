## Solvuri Web — project notes

- Static marketing site — no auth, no data layer (`@repo/data` isn't a dependency here), no client-side state beyond simple component state (e.g. the Navbar's mobile-menu toggle).
- Shared design tokens (background/surface/foreground/border/ring/radius/fonts) come from `packages/ui/src/styles/solvuri-theme.css`'s vocabulary, imported by `app/globals.css`. Use the token classes (`bg-background`, `text-primary`, etc.) rather than hardcoded hex.
- `components/navigation/Navbar.tsx`/`Footer.tsx` are thin wrappers around `@repo/ui`'s shared `Navbar`/`Footer` (`variant="floating"`) — this app's actual chrome markup lives in `packages/ui/src/navbar.tsx`/`footer.tsx`'s `FloatingNavbar`/`FloatingFooter` branches. Pass content via props; don't add markup back into this app's local wrapper files.
- This is the only app with `--max-warnings 0` enforced from the start; `check-types` also runs `next typegen` before `tsc --noEmit`.
