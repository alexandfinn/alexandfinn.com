# alexandfinn.com

The Alex & Finn website is a single static page in `index.html`.

## Deployment

This repository is automatically deployed to Netlify whenever changes are
pushed to `main`. Netlify copies `index.html` into its `out` publish directory;
there is no framework build step.

## Local preview

Run a static file server from the repository root, for example:

```sh
python3 -m http.server 4173
```
