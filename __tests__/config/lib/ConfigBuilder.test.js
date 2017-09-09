import ConfigBuilder from "~/lib/ConfigBuilder";

describe("ConfigBuilder", () => {
    describe(".build()", () => {
        it("runs through block by block", () => {
            const block1 = jest.fn(config => {
                    config.foo = "foo";
                    return config;
                }),
                block2 = jest.fn(config => {
                    config.baz = "baz";
                    return config;
                }),
                block3 = jest.fn(config => {
                    return new Promise(resolve => {
                        config.promise = true;
                        resolve(config);
                    });
                });

            const builder = ConfigBuilder.create({
                blocks: {
                    list: [block1, block2, block3]
                }
            });

            return builder.build().then(config => {
                expect(block1.mock.calls.length).toBe(1);
                expect(block2.mock.calls.length).toBe(1);

                expect(config).toMatchObject({
                    foo: "foo",
                    baz: "baz",
                    promise: true
                });
            });
        });

        it("throws error if async block takes too long", () => {
            const block = jest.fn(config => {
                return new Promise((resolve, reject) => {
                    setTimeout(resolve, 4000);
                });
            });

            const builder = ConfigBuilder.create({
                blocks: {
                    list: [block]
                }
            });

            expect(builder.build()).rejects.toMatch("Timeout");

        it("throws error if a block doesn't return anything", () => {
            const block = jest.fn(() => {});

            const builder = ConfigBuilder.create({
                blocks: {
                    list: [block]
                }
            });

            return builder.build().catch(e => {
                expect(e.message).toMatch(/\[InvalidValueError\]/);
            });
        });
    });
});
