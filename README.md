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
- Interactive scaffolding w/ [Yeoman](http://yeoman.io/)
- Sensible front-end [folder structure](#folder-structure)

## Usage

Install:

```bash
yarn add @gladeye/bento --dev
```

Run the interactive scaffolding (make sure you have [Yeoman](http://yeoman.io/) installed)

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

Then simply:

```bash
# start webpack-dev-server
yarn start:webpack

# or build for production
yarn build:webpack
```

### Folder structure

Bento comes with a sensible, uncomplicated folder structure. It also ensures that webpack works seamlessly between `serve` mode and `build` mode

```
./
├── fonts
├── images
├── media
├── scripts
│   └── main.js
└── styles
    └── main.scss
```

### Webpack Config

Coming soon

## License

MIT
