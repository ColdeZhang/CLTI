# Coding Language Type Indicator

CLTI is a Vue 3 + TypeScript quiz app that matches users to a programming language persona and renders a shareable result poster.

## Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

Production builds use the repository subpath `/CodingLanguageTypeIndicator/`, so generated assets are ready for GitHub Pages.

## GitHub Pages Deployment

This repository includes a workflow at `.github/workflows/deploy-pages.yml` that deploys the Vite `dist/` output to GitHub Pages.

Required repository setting:

1. Open GitHub repository settings.
2. Go to `Pages`.
3. Set `Source` to `GitHub Actions`.

After that, every push to `master` will build and publish the site.
