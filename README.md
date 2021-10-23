# Test Recorder

## Package content

- `src/background` - service-worker
- `src/devTools` - creating tab for dev panel
- `src/eventsInterceptor` - content and injectable scripts. Content has access to inspected DOM page, but is executed in different global context. Injectable is embedded to the document to intercept events.
- `src/panel` - dev tool UI app
- `src/index.html` - test application to debug tool
- `static/manifest.json` - extension manifest

## Development

Run `npm i` and `npm start` to start development. It will run parcel watcher and http-server to serve static for test page.
