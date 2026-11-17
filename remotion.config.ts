import { Config } from '@remotion/cli/config';

// src/videos/<slug> are symlinks into the writing repo: resolve imports from the link, not the real path,
// so ../../templates/... and node_modules come from this repo.
Config.overrideWebpackConfig((c) => ({ ...c, resolve: { ...c.resolve, symlinks: false } }));
