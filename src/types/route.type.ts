export type RouteType = {
    route: string,
    title: string | null,
    template: string | null,
    styles: string | null,
    sidebar: boolean,
    load(): void
}