declare const _default: {};
export default _default;
export type THEME_BUILD_OPTIONS = {
    /**
     * - local theme based config
     */
    config?: {
        js?: {
            replace?: Object | undefined;
            external?: string[] | undefined;
            globals?: Object | undefined;
        } | undefined;
        lighthouse?: {
            threshold?: LIGHTHOUSE_THRESHOLD | undefined;
        } | undefined;
    } | undefined;
    /**
     * - hide task status from showing in console
     */
    hideStatus?: boolean | undefined;
};
export type THEME_HUB_AUTH_CONFIG_OBJECT = {
    /**
     * - auth Type - personalaccesskey
     */
    authType: string;
    portalId: number;
    personalAccessKey: string;
    env: string;
};
export type THEME_HUB_AUTH_CONFIG = {
    portals: Array<THEME_HUB_AUTH_CONFIG_OBJECT>;
};
export type FILE_LIST = {
    /**
     * - dirnet object
     */
    dirnet: Object;
    /**
     * - file name
     */
    name: string;
    /**
     * - file path
     */
    path: string;
    /**
     * - file size
     */
    size: string;
    /**
     * - file dist
     */
    dist: string;
};
export type LIGHTHOUSE_THRESHOLD = {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
};
export type LIGHTHOUSE_SCORE = {
    accessibilityScore: number;
    bestPracticesScore: number;
    performanceScore: number;
    seoScore: number;
    templatePath: string;
    link: string;
};
//# sourceMappingURL=types.d.ts.map