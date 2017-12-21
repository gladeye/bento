export function instantiate(Cls, args?: any[]): any {
    args.unshift(Cls);
    const C = Cls.bind.apply(Cls, args);
    return new C();
}
