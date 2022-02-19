# Dakka

[![CI/CD](https://github.com/roboportal/dakka/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/roboportal/dakka/actions/workflows/ci.yml)

<div align="center">
  <img src="https://user-images.githubusercontent.com/7383804/154784941-8baab235-a20e-4b61-baeb-37e4e3915b61.svg" width="120px" height="80px" />
</div>

<div align="center">
  <a href="https://www.dakka.dev/">Install</a>
  <a href="https://www.dakka.dev/">Dcoumentation</a>
</div>




## Installing

##

## Contributing
### Package content

- `src/background` - service-worker
- `src/devTools` - creating tab for dev panel
- `src/contentScript` - content and injectable scripts. Content has access to inspected DOM page, but is executed in different global context. Injectable is embedded to the document to intercept events.
- `src/panel` - dev tool UI app
- `src/testPage` - test application to debug tool
- `src/manifest.json` - extension manifest

### Development

Run `npm i` and `npm start` to start development. It will run webpack dev server on the 8080 port. To get the test page use: `http://127.0.0.1:8080/testPage/testPage.html`

### Build details

There are two webpack configs to bundle the extension:

- `webpack.panel.config.js` - builds devTool and panel pages. This config supports HMR.
- `webpack.scripts.config.js`- builds background, content and injection scripts. This part doesn't use HMR cause it leads to the behaviour when the panel app stops receiving chrome.runtime messages from content and background scripts.

It's noticed, that when multiple webpack processes work concurrently, it might cause a stale dev-server port after stopping the processes. To clean up such a process use `kill:stale-dev-server`.

## Using remote devtools

To use React and Redux devtools, start the servers first: `npm run devtools`. In redux-devtools panel open `Settings` and select `use local` option in the `Connection` tab. The hostname should be `localhost`, and the port should be `8000`.

### Building for production

Run to create production build: `npm run build` and `npm run pack` to compress it as zip file.
