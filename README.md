# Test Recorder

## Package content

- `src/background` - service-worker
- `src/devTools` - creating tab for dev panel
- `src/contentScript` - content and injectable scripts. Content has access to inspected DOM page, but is executed in different global context. Injectable is embedded to the document to intercept events.
- `src/panel` - dev tool UI app
- `src/testPage` - test application to debug tool
- `src/manifest.json` - extension manifest

## Development

Run `npm i` and `npm start` to start development. It will run webpack dev server on the 8080 port. To get the test page use: `http://localhost:8080/testPage.html`
