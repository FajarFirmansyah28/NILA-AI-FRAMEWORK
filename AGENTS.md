# Workspace Instructions

This workspace contains two related apps:
- [nila-be](nila-be/) — Laravel backend
- [nila-fe](nila-fe/) — React + Vite frontend

## Compact folder conventions

Prefer a compact, easy-to-scan structure over deep nesting.
- Reuse the existing top-level folders before creating new ones.
- Keep related files close to their current domain rather than spreading them across many subfolders.
- Use descriptive filenames and small feature folders only when they clearly reduce clutter.

## Project-specific guidance

### Backend (Laravel)
- Keep app logic under the existing top-level folders in [nila-be/app](nila-be/app/): Http, Models, Providers, and Scripts.
- Place routes in [nila-be/routes](nila-be/routes/) and database changes in [nila-be/database](nila-be/database/).
- Follow Laravel’s conventional structure unless there is a strong reason to introduce a new layer.

### Frontend (React/Vite)
- Keep UI code in [nila-fe/src](nila-fe/src/) under the existing areas: components, layouts, pages, routes, services.
- Add new UI pieces to the closest existing folder instead of creating many nested folders.
- Use the current app entry points in [nila-fe/src/App.jsx](nila-fe/src/App.jsx) and [nila-fe/src/main.jsx](nila-fe/src/main.jsx) as the starting point for feature work.

## Useful commands
- Backend: run from [nila-be](nila-be/) with `composer test`, `php artisan serve`, or `npm run dev` for the Vite-side workflow.
- Frontend: run from [nila-fe](nila-fe/) with `npm run dev`, `npm run build`, or `npm run lint`.

## References
- [nila-be/README.md](nila-be/README.md)
- [nila-fe/README.md](nila-fe/README.md)
