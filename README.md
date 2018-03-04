# Bento 🍱

[![Build Status](https://travis-ci.org/gladeye/bento.svg?branch=master)](https://travis-ci.org/gladeye/bento) [![dependencies](https://david-dm.org/gladeye/bento.svg?theme=shields.io)](https://david-dm.org/gladeye/bento)

## API

```js
// webpack.config.js
const create = require("@gladeye/bento");

const bento = create({
    homeDir: "./app",
    outputDir: "./public"
});

bento.bundle("main", ["~/main.js"]);

module.exports = bento.export(process.env.NODE_ENV);
```

## License

MIT © [Gladeye](https://gladeye.com)
