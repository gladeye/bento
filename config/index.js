const ConfigBuilder = require("./builder");

module.exports.config = function(options) {
    const blocks = Object.assign({}, options.blocks);
    delete options.blocks;

    return ConfigBuilder.create(options)
        .use(blocks.list, blocks.timeout)
        .build();
};
