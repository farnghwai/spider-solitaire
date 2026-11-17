import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({ PUBLIC_GITHUB_REPO_URL: { public: true, static: true } });
