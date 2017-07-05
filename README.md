# Bento 🍱

Bento is an opinionated *webpack* starter kit that comes loaded with:

- [Browsersync](https://www.browsersync.io/)
- Hot Module Reload w/ [Webpack Dev Server](https://github.com/webpack/webpack-dev-server)
- Auto-generate `index.html` for Single-page Application (SPA)
- Seamless integration with back-end server for Server-side Application (SSA)
- ES6 Javascript w/ [preset-env](https://github.com/babel/babel-preset-env)
- SASS w/ [PostCSS Autoprefixer](https://github.com/postcss/autoprefixer)
- Vendor code splitting
- Long-term caching
- Sane front-end [folder structure](./example) scaffolding

## Usage

Install:

```bash
yarn add @gladeye/bento --dev
```

Run the interactive scaffolding (make sure you have [yeoman](http://yeoman.io/) installed)

```
yo ./node_modules/@gladeye/bento/scaffold
```

Update your **package.json** with these settings:

```json
"scripts": {
    "start:webpack": "webpack-dev-server --config ./webpack.config.js",
    "build:webpack": "NODE_ENV=production webpack --config ./webpack.config.js"
}
```

Then simply do:

```bash
# start webpack-dev-server
yarn start:webpack

# or build for production
yarn build:webpack
```

### Webpack Config
