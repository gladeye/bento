export interface EnvSelectOptions {
    [env: string]: any;
}

export function selector(env?: string): () => any {
    return function(choice: EnvSelectOptions = {}) {
        return choice[env]
            ? choice[env]
            : choice.default ? choice.default : null;
    };
}
