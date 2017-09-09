import ConfigBuilder from "~/lib/ConfigBuilder";

export function config(options) {
    return ConfigBuilder.create(options).build();
}
