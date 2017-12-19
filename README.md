# Bento 🍱

[![Build Status](https://travis-ci.org/gladeye/bento.svg?branch=master)](https://travis-ci.org/gladeye/bento) [![dependencies](https://david-dm.org/gladeye/bento.svg?theme=shields.io)](https://david-dm.org/gladeye/bento)

## API

```js
// webpack.config.js

import Bento from "@gladeye/bento";

const bento = Bento.init({
    homeDir: "app"
    outputDir: "public"
    entry: {
        main: ["app/main.js"]
    }
});

module.exports = bento.export();
```

## License

MIT © [Gladeye](https://gladeye.com)
