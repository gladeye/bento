# Bento 🍱

[![Build Status](https://travis-ci.org/gladeye/bento.svg?branch=master)](https://travis-ci.org/gladeye/bento)[![dependencies](https://david-dm.org/gladeye/bento.svg?theme=shields.io)](https://david-dm.org/gladeye/bento)

Bento is an opinionated *webpack* starter kit that comes loaded with:

- [Browsersync](https://www.browsersync.io/)
- ES6 Javascript and SASS w/ [Webpack 3](https://webpack.js.org)
- Out-of-the-box (hah!) support for Single-page Application (SPA)
- Seamless integration with back-end server
- Interactive scaffolding w/ [Yeoman](http://yeoman.io/)
- Sensible front-end [folder structure](#folder-structure)

## Pre-made boilerplates

Looking for some pre-made Bento boilerplates? There are a few of them:

- [React Bento](https://github.com/gladeye/react-bento)
- [Plain Bento](https://github.com/gladeye/plain-bento)
- [Wordpress Bento](https://github.com/gladeye/blueprint)


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

Bento main feature, packed will all the modern belts and whistles:

- HMR w/ [Webpack Dev Server](https://github.com/webpack/webpack-dev-server)
- ES6 Javascript w/ [preset-env](https://github.com/babel/babel-preset-env)
- SASS w/ [PostCSS Autoprefixer](https://github.com/postcss/autoprefixer)
- CSS extraction on build
- Vendor code splitting
- Long-term caching

It comes with two different flavours:

- Single-page Application ([docs](./example/single-page-app/webpack.config.js))
- Server-side Application ([docs](./example/server-side-app/webpack.config.js))

## License

MIT © [Gladeye](https://gladeye.com)
