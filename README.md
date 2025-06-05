# Spider Solitaire
[![Deploy to GitHub Pages](https://github.com/farnghwai/spider-solitaire/actions/workflows/deploy.yml/badge.svg)](https://github.com/farnghwai/spider-solitaire/actions/workflows/deploy.yml)

## Overview
Spider Solitaire is a modern implementation of the classic card game, built with Svelte 5 and SvelteKit 2 for fast frontend performance. This PWA (Progressive Web App) offers a responsive design that works seamlessly on desktop and mobile devices, including touch screen support. The game features a complete card deck, undo functionality, winning animations, and customizable settings. Developed with TypeScript and Tailwind CSS 4.1 for styling, it's hosted on GitHub Pages with automated deployment via GitHub Actions.

## Features
- [x] Completed Card deck
- [x] Undo
- [x] Winning Animation
- [x] Settings
- [X] Github Pages
- [X] Mobile Responsive Design
- [X] Touch Screen
- [x] Progressive Web App (PWA)
- [x] Flip card
- [x] Card Pattern

## Known Issues
1. Rendering not work well in Safari browser.
2. Trigger Android Protect Scanning when try install as PWA.
3. Manual override vulnerable versions of cookie 0.6.0 used by current @sveltejs/kit to 0.7.0 
  - https://github.com/sveltejs/kit/pull/12767#issuecomment-2402562640

## Technology Stacks
- Hosting
  - Github Pages & Actions
- Frontend
  - Logic & Rendering - Svelte 5 & SvelteKit 2
  - Styling - Tailwind CSS 4.1
  - Type Constraint - Typescript
- Development
  - IDE - VS Code
  - Server - Node 22
  - Formatting - Prettier

## Workspace Setup
### VS Code Extensions
1. Prettier - Code formatter
2. Svelte for VS Code
3. Tailwind CSS IntelliSense

### VS Code Workspace Configuration (.vscode/settings.json)
```json
{
    "[typescript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode",
        "editor.formatOnSave": true
    },
    "[svelte]": {
        "editor.defaultFormatter": "svelte.svelte-vscode",
        "editor.formatOnSave": true
    },
}
```

## Github Pages 
1. Refer [Configuring a publishing source for your GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) to change the Build and Deployment source to **Github Actions**.


## References
- Documentations 
  - [Svelte 5](https://svelte.dev/docs/svelte/overview)
  - [SvelteKit 2](https://svelte.dev/docs/kit/introduction)
  - [Tailwind CSS 4.1](https://tailwindcss.com/docs/installation/using-vite)
  - [Mozilla Web docs - JavaScript (JS)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
  - [Mozilla Web docs - CSS: Cascading Style Sheets (CSS)](https://developer.mozilla.org/en-US/docs/Web/CSS)
- Generative AI Models
  - Cloud
    - [Claude 3.7 Sonnet](https://claude.ai/):
      - Overall draft
      - Drag and drop with Touch support
      - Settings
      - Winning Animation
    - [ChatGPT GPT-4o](https://chatgpt.com/):
      - Undo
      - Generate J,Q,K image
  - Local
    - Gemma3 12B
    - Qwen3 8B
      - Generate JSDoc (Primary)
      - Generate Game Play Guide
    - Qwen 2.5 Code 7B
    - Qwen 2.5 Code 1.5B
    - Devstral 24B (2505) - UD-Q2_K_XL quant
      - Generate JSDoc (Experiment)
- Others
  - Transitions effect - [transitions.ts](https://svelte.dev/tutorial/svelte/animations)
  - Mobile Screen Height handling - [100vh height when address bar is shown - Chrome Mobile](https://stackoverflow.com/questions/52848856/100vh-height-when-address-bar-is-shown-chrome-mobile)
  - Converting image to svg - [Inskscape](https://inkscape.org/)
