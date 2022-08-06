# Dakka

[![Unit](https://github.com/roboportal/dakka/actions/workflows/unit.yml/badge.svg)](https://github.com/roboportal/dakka/actions/workflows/unit.yml)
[![Integration](https://github.com/roboportal/dakka/actions/workflows/integration.yml/badge.svg)](https://github.com/roboportal/dakka/actions/workflows/integration.yml)

<div align="center">
  <img alt="Dakka logo" src="https://user-images.githubusercontent.com/15819745/160267166-c1f78bee-67f4-44d2-8193-b999b4df61a4.svg" width="180px" height="60px" />
  <h3>Generate tests for Cypress, Playwright and Puppeteer using Dakka</3>
</div>

<div align="center">
  <a href="https://chrome.google.com/webstore/detail/dakka/gllikifiancbeplnkdnpnmmhhlncghej" target="_blank" rel="noreferrer">Dakka Chrome Extension</a> |
  <a href="https://www.dakka.dev/" target="_blank" rel="noreferrer">Documentation</a>
</div>

## What's Dakka?

Dakka is an open source Chrome Extension which helps to generate end-to-end tests for Cypress, Playwright and Puppeteer.

### Demo

Demo website link: https://roboportal.io/

![Demo](https://user-images.githubusercontent.com/7383804/155093359-37df3741-4010-4c26-a93a-4fdfa02ed336.gif)

## Installing

To install Dakka click <a href="https://chrome.google.com/webstore/detail/dakka/gllikifiancbeplnkdnpnmmhhlncghej" target="_blank" rel="noreferrer">Chrome extension</a> and this will take you to Chrome Web Store. Follow next steps to start generating tests:

1. Open Chrome devtools
2. Enable Dakka
3. Click Record button
4. Start interacting with the page

<br/>
<div align="center">
<img width="760" alt="Dakka demo" src="https://user-images.githubusercontent.com/7383804/154786735-1fd140c2-3515-4978-a52e-3bb26e3e8c3a.png">
</div>

## User Actions

Once user starts recording, Dakka will catch:

- Mouse clicks, double-clicks and right button clicks
- Keyboard inputs including meta and special keys
- File uploads
- Browser navigation
- Screen resize

Not only Dakka tracks events for the page, but also for all its iframes (all origins supported!).

## Adding Assertions

Assertion Blocks are validation steps, which are converted to assertion logic such as <code>cy.get('#loading').should('not.exist')</code>.
To add an assertion hover over the floating plus sign and drag and drop assertion block.

![Adding Assertions](https://user-images.githubusercontent.com/7383804/154787750-16716f68-40d1-4360-bc96-0152128a635a.gif)

After adding Assertion Block you will need to configure assertion logic - locate the element on the page or manually add the element selector, choose the assertion from dropdown and edit the value if needed.

<br/>
<div align="center">
<img width="360" alt="assertion setup 1" src="https://user-images.githubusercontent.com/7383804/154793765-c04130a5-b061-415a-9abe-9f23a9e802a0.png">
<img width="450" alt="assertion setup 2" src="https://user-images.githubusercontent.com/7383804/154793730-57da26b3-9408-455a-a2c8-1a406f3a272d.png">
</div>

## Choosing Selectors

Dakka suggests the list of best possible selectors for the elements on the page.

<div align="center">
<img width="560" alt="Choosing Selectors" src="https://user-images.githubusercontent.com/7383804/154788192-b5376c0d-c9f2-4a25-afc2-aad98939aa5c.png">
</div>

<br/>
Selectors are sorted by priority with green, red and yellow icons. First selector is pre-selected by default. Hover over the icon to get the element count on the page by selector.
<br/>

## Delete Events

If generated events contain any entries that aren't required for the test use the Delete button located at the bottom of the event block.

## Exporting

Generated test can be copied to clipboard or downloaded as a file and added to the project.

![Exporting](https://user-images.githubusercontent.com/7383804/154789533-2ed4c538-7f9b-4cbb-86bf-6be11889b87b.gif)

Alternatively, you can open the generated test in the extension's popup by clicking the action icon:

![Test Preview](https://user-images.githubusercontent.com/15819745/171315495-1561eab7-8017-41f4-b227-4ae7e73ccb95.gif)

## Test Case Creation

Dakka allows not only the single test recording and creation, but also the comprehensive test cases setup:

![Test Case Creation](https://user-images.githubusercontent.com/15819745/171320546-5c51adcf-09df-4b6f-8539-52a6c5055b43.gif)


## Contributing

### Content

- `projects/extension/src/background` - service-worker
- `projects/extension/src/devTools` - creating tab for dev panel
- `projects/extension/src/contentScript` - content and injectable scripts. Content has access to inspected DOM page, but is executed in different global context. Injectable is embedded to the document to intercept events.
- `projects/extension/src/panel` - dev tool UI app
- `projects/extension/src/manifest.json` - extension manifest
- `projects/test/integration` - integration tests for projects
- `projects/test/playground` - test playground with pre-configured tools

### Development

Run `npm i` and `npm start` to start development. It will run webpack dev server on the 8080 port. To get the test page run `npm run serve:integration` and use: `http://localhost:8081`

### Testing

Run `npm test` to execute the test suite. To update mocks of generated tests execute `UPDATE_OUT=true npm run test`

### Build details

There are two webpack configs to bundle the extension:

- `webpack.panel.config.js` - builds devTool and panel pages. This config supports HMR.
- `webpack.scripts.config.js`- builds background, content and injection scripts. This part doesn't use HMR cause it leads to the behaviour when the panel app stops receiving chrome.runtime messages from content and background scripts.

It's noticed, that when multiple webpack processes work concurrently, it might cause a stale dev-server port after stopping the processes. To clean up such a process use `kill:stale-dev-server`.

## Using remote devtools

To use React and Redux devtools, start the servers first: `npm run devtools`. In redux-devtools panel open `Settings` and select `use local` option in the `Connection` tab. The hostname should be `localhost`, and the port should be `8000`.

### Building for production

Run to create production build: `npm run build` and `npm run pack` to compress it as zip file.
