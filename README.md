# Quasar Pocketbase Starter Template

A template with basic login functionality for a pocketbase app.


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

## Connect to pocketbase instance

Add Pocketbase URL to quasar.config.json
```javascript
env: {
    POCKETBASE_URL: ctx.dev ? TEST-URL : PROD-URL,
    BASE_URL: ctx.dev ? "http://localhost:8080" : PROD-PAGE
}
```

## Generate Icon

Replace logo-template.png in the project root directory and run command to generate images
```bash
npm run logo
```

## Build the app for production
```bash
quasar build
```

## Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js).
