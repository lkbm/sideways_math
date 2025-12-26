# Sideways Arithmetic

A simple math puzzle built with preeact, TypeScript, Vite, and Cloudflare Workers.

You can see it deployed at https://sidewaysarithmetic.lucamasters.com/

# Run locally
* nvm use
* nvm install
* npm run dev

# Deploy

You'll need a wrangler.toml file configured for your Cloudflare account:
```
name = "sideways-arithmetic"
main = "src/main.tsx"
compatibility_date = "2024-01-01"


[[kv_namespaces]]
binding = "SIDEWAYSARITHMETIC"
id = "<your-kv-namespace-id>"

[assets]
directory = "./dist"

[build]
command = "npm run build"
```

Then run:
npx wrangler deploy

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
