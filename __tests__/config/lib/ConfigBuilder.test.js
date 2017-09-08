import ConfigBuilder from "~/lib/ConfigBuilder";

describe("ConfigBuilder", () => {
    describe(".build()", () => {
        it("runs through block by block", () => {
            const block1 = jest.fn(config => {
                    config.foo = "foo";
                }),
                block2 = jest.fn(config => {
                    config.baz = "baz";
                }),
                block3 = jest.fn(config => {
                    return new Promise(resolve => {
                        config.promise = true;
                        resolve();
                    });
                });

            const builder = ConfigBuilder.create({
                blocks: {
                    list: [block1, block2, block3]
                }
            });

            builder
                .build()
                .then(config => {
                    expect(block1.mock.calls.length).toBe(1);
                    expect(block2.mock.calls.length).toBe(1);

                    expect(config).toMatchObject({
                        foo: "foo",
                        baz: "baz",
                        promise: true
                    });
                })
                .catch(e => {
                    console.error(e);
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
        });
    });
});
