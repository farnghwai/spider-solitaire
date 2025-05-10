# Spider Solitaire
[![Deploy to GitHub Pages](https://github.com/farnghwai/spider-solitaire/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/farnghwai/spider-solitaire/actions/workflows/deploy.yml)

## Features
- [x] Completed Card deck
- [x] Undo
- [x] Winning Animation
- [x] Settings
- [X] Github Pages
- [X] Mobile Responsive Design
- [X] Touch Screen
- [ ] Progressive Web App (PWA)
- [ ] Card Pattern
- [ ] Flip card

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
- Generative AI Models
  - [Claude 3.7 Sonnet](https://claude.ai/):
    - Overall draft
    - Drag and drop with Touch support
    - Settings
    - Winning Animation
  - [ChatGPT GPT-4o](https://chatgpt.com/):
    - Undo
- Others
  - Transitions effect - [transitions.ts](https://svelte.dev/tutorial/svelte/animations)
