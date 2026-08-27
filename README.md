# AEM Secrets — Frontend

[![Angular](https://img.shields.io/badge/Angular-18.2-DD0031?logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![RxJS](https://img.shields.io/badge/RxJS-7.8-B7178C?logo=reactivex&logoColor=white)](https://rxjs.dev/)
[![Karma](https://img.shields.io/badge/Tests-Karma%20%2B%20Jasmine-995B00?logo=karma&logoColor=white)](https://karma-runner.github.io/)
[![Apache](https://img.shields.io/badge/Deploy-Apache%202.4-D22128?logo=apache&logoColor=white)](deploy/apache/aemsecrets-vhost.conf)

Angular SPA for the [AEM Secrets](https://aemsecrets.com/) blog — a public **reader** site and a JWT-protected **editor** dashboard. Consumes a separate Spring Boot REST API (not in this repo).

## Stack

| Layer | Technologies |
|-------|--------------|
| App | Angular 18, TypeScript 5.5, RxJS, NgModules + lazy-loaded feature modules |
| UI | Tailwind CSS v4, `@ng-icons` (Material), CSS theme variables (`light` / `dark` / `middle`) |
| Editor | `@kolkov/angular-editor` |
| Security | DOMPurify + `SafeHtmlPipe`, reCAPTCHA v3, JWT bearer auth |
| Tests | Karma + Jasmine (no e2e, no CI in repo) |
| Deploy | Apache 2.4 (prod), IIS + `web.config` (local Windows) |

## Architecture

Two lazy-loaded modules share models and endpoint maps under `src/app/shared/`:

| Module | Route | Auth | Purpose |
|--------|-------|------|---------|
| `ReaderModule` | `/` | None | Posts, categories, tags, newsletter, contact, static pages |
| `EditorModule` | `/editor` | JWT | Posts, categories, comments, subscribers |

Editor HTTP calls use `withAuth()`; `AuthInterceptor` attaches the bearer token. Reader and editor each have their own service classes bound to `READER_API_BASE_URL` / `EDITOR_API_BASE_URL` injection tokens.

```
/          → ReaderModule  →  /api  (public)
/editor    → EditorModule  →  /api  (Bearer JWT via AuthInterceptor)
```

## Project layout

```
src/app/
├── core/          auth (guard, interceptor, JWT), theme
├── reader/        public pages, components, services
├── editor/        admin pages, post editor, services
└── shared/        models, http/*-endpoints, security (reCAPTCHA, sanitization), header/footer
public/            static assets, web.config, robots.txt, sitemap.xml
```

## Features

**Reader:** featured & paginated posts, single post with comments, category/tag filters, newsletter subscribe/unsubscribe, contact form, about/terms/privacy pages, theme switcher.

**Editor:** login, post CRUD with rich-text editor & image upload, category management, comment moderation, subscriber list.

## Getting started

**Prerequisites:** Node 20.x, npm 10.x, backend API on port `8090`.

```bash
npm install
npm start          # http://localhost:4201
```

Dev API URL: `http://localhost:8090/api` in `src/environments/environment.ts`. Production uses relative `/api` (`environment.prod.ts`); the web server proxies to the backend.

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Dev server (port 4201) |
| `npm run build-prod` | Production build → `dist/aem-blog-fe/` |
| `npm test` | Unit tests (Karma) |

## Deployment

1. `npm run build-prod`
2. Serve `dist/aem-blog-fe/browser/` as a static SPA (fallback to `index.html`)
3. Reverse-proxy `/api` → backend (e.g. `http://127.0.0.1:8090/api`)

See `public/web.config` (IIS).

## Angular CLI

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.21.

```bash
ng new aem-blog-fe --routing --standalone false --ssr false --style css --skip-install
```

```text
$ ng version

     _                      _                 ____ _     ___
    / \   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
   / △ \ | '_ \ / _` | | | | |/ _` | '__|   | |   | |    | |
  / ___ \| | | | (_| | |_| | | (_| | |      | |___| |___ | |
 /_/   \_\_| |_|\__, |\__,_|_|\__,_|_|       \____|_____|___|
                |___/


Angular CLI: 18.2.21
Node: 20.11.1
Package Manager: npm 10.2.4
OS: win32 x64

Angular: 18.2.14
... animations, common, compiler, compiler-cli, core, forms
... platform-browser, platform-browser-dynamic, router

Package                         Version
---------------------------------------------------------
@angular-devkit/architect       0.1802.21
@angular-devkit/build-angular   18.2.21
@angular-devkit/core            18.2.21
@angular-devkit/schematics      18.2.21
@angular/cli                    18.2.21
@schematics/angular             18.2.21
rxjs                            7.8.2
typescript                      5.5.4
zone.js                         0.14.10
```
