import { babel, css, postcss, url, sass, file } from "./loaders";
import ExtractTextPlugin from "extract-text-webpack-plugin";

export function mainScript(options) {
    return {
        test: /\.js$/,
        include: [options.get("paths.input")],
        use: [babel(options)]
    };
}

export function mainStyle(options) {
    return {
        test: /\.scss$/,
        include: [options.get("paths.input")],
        use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            publicPath: "../",
            use: [css(options), postcss(options), url(options), sass(options)]
        })
    };
}

export function vendorStyle(options) {
    return {
        test: /\.css$/,
        include: [/node_modules/],
        use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            publicPath: "../",
            use: [css(options)]
        })
    };
}

export function mainMedia(options) {
    return {
        test: /\.(ttf|eot|woff2?|png|jpe?g|gif|svg)$/,
        include: [options.get("paths.input")],
        use: [file(options)]
    };
}

export function vendorMedia(options) {
    const rule = mainMedia(options);
    rule.include = /node_modules/;
    rule.use = [
        file(options, {
            options: {
                name: `vendor/${options.get("filename")}.[ext]`
            }
        })
    ];

    return rule;
}
