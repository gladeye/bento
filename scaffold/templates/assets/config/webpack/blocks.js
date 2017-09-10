module.exports = {
    /**
     * ------------------------------------------------------------------------
     * Blocks
     * ------------------------------------------------------------------------
     * Webpack config are constructed by waterfall-ling down to each one of
     * these blocks, thus order matters. Feel free to add you own, each item
     * must be a function which will receive `config, options, utils` as
     * arguments.
     *
     * "list":      List of blocks that will construct webpack config. Check
     *              existing blocks for usage.
     *              Note: Block item can return a Promise
     *
     * "timeout":   Wait time before throwing a timeout error when async block
     *              hasn't been resolved or rejected.
     *
     */
    blocks: {
        timeout: 3000,
        list: [
            require("@gladeye/bento/config/dst/blocks/ports"),
            require("@gladeye/bento/config/dst/blocks/name"),
            require("@gladeye/bento/config/dst/blocks/manifest"),
            require("@gladeye/bento/config/dst/blocks/base"),
            require("@gladeye/bento/config/dst/blocks/script"),
            require("@gladeye/bento/config/dst/blocks/style"),
            require("@gladeye/bento/config/dst/blocks/media"),
            require("@gladeye/bento/config/dst/blocks/plugins"),
            require("@gladeye/bento/config/dst/blocks/devServer"),
            require("@gladeye/bento/config/dst/blocks/backEnd")
        ]
    }
};
