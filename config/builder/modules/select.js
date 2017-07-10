module.exports = function(builder) {
    return function(cases) {
        return cases[builder.options.get("env.value")];
    };
};
