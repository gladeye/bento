export function instantiate(Cls, args?: any[]): any {
    args.unshift(Cls);
    const C = Cls.bind.apply(Cls, args);
    return new C();
}

interface SelectorOptions {
    [key: string]: any;
}

export function selector(env: string | void): (choice: SelectorOptions) => any {
    return function(choice: SelectorOptions = {}) {
        return env && choice[env]
            ? choice[env]
            : choice.default ? choice.default : null;
    };
}
