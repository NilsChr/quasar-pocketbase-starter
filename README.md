# Quasar Pocketbase Starter Template

A template with basic login functionality for a pocketbase app.

## Setup with pocketbase

Add Pocketbase URL to quasar.config.json
```json
      env: {
       POCKETBASE_URL: ctx.dev ? TEST-URL : PROD-URL,
       BASE_URL: ctx.dev ? "http://localhost:8080" : PROD-PAGE
      }
```

## Generate Icon

Replace logo-template.png in the project root directory.
```bash
npm run logo
```

## Install the dependencies
```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js).
