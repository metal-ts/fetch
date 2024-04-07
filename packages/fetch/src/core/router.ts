import type { FetchMethod, FetchMethodString } from './fetcher/builder'
import {
    DefaultFetchUnitShape,
    FetchUnit,
    type FetchUnitShape,
    type InferFetchUnit,
    type Param,
} from './fetcher/unit'

export type BuilderStructure =
    | {
          [Key in FetchMethod]?: FetchUnitShape
      }
    | {
          [Key in string]?: BuilderStructure
      }

class Router<
    const RouterBaseUrl extends string,
    const RouterStructure extends BuilderStructure,
> {
    public constructor(
        routerBaseUrl: RouterBaseUrl,
        public readonly routerStructure: RouterStructure
    ) {
        this.buildUrlStructure(routerStructure, routerBaseUrl)
        this.buildFetchMethod(routerStructure)
    }

    private static fetchMethodSet = new Set<FetchMethod>([
        'CONNECT',
        'DELETE',
        'GET',
        'HEAD',
        'OPTIONS',
        'PATCH',
        'POST',
        'PUT',
        'TRACE',
    ])

    private static isFetchMethod(
        value: unknown
    ): value is FetchMethodString[number] {
        return this.fetchMethodSet.has(value as FetchMethod)
    }

    public static isFetchUnit(unit: unknown): unit is DefaultFetchUnitShape {
        return unit instanceof FetchUnit
    }

    private buildFetchMethod(structure: BuilderStructure): void {
        const $structure = Object.entries(structure)

        $structure.forEach(([key, value]) => {
            if (!value)
                throw new Error(`Router structure should be defined at ${key}.`)

            if (Router.isFetchUnit(value) && Router.isFetchMethod(key)) {
                value.set_method(key)
                return
            }

            return this.buildFetchMethod(value)
        })
    }

    private buildUrlStructure(
        structure: BuilderStructure,
        baseUrl?: string
    ): void {
        const PATH_DIVIDER = '/' as const
        const getUrl = (url?: string, subPath?: string) => {
            const urlPath: string = url || ''
            return subPath
                ? `${urlPath}${PATH_DIVIDER}${subPath}`
                : `${urlPath}`
        }

        const $structure = Object.entries(structure)

        $structure.forEach(([key, value]) => {
            if (!value)
                throw new Error(`Router structure should be defined at ${key}.`)

            if (Router.isFetchUnit(value) && Router.isFetchMethod(key)) {
                value.set_url(getUrl(baseUrl))
                return
            }

            return this.buildUrlStructure(value, getUrl(baseUrl, key))
        })
    }
}

/**
 * @description Define RESTful API structure with `router`
 * @param baseUrl Represents the base_url of the api
 * @param router RESTful API structure
 * @example
 * ```md
 * 1. BASE_URL : 'https://api/v1/example.com'
 *
 * 2. REST_API_STRUCTURE
 *  › auth     : 'BASE_URL/auth'
 *  › login    : 'BASE_URL/auth/login'
 *  › books    : 'BASE_URL/books'
 *  › book     : 'BASE_URL/books/:id'
 *
 * 3. DEFINE_ROUTER
 * ```
 *
 * ```ts
 * import * as f from "@metal-box/fetch"
 *
 * export const api = f.router(BASE_URL, {
 *      auth: {
 *          login: {
 *              GET: f.unit()
 *          },
 *      },
 *      books: {
 *          GET: f.unit()
 *          POST: f.unit()
 *          // Dynamic path parameter via $ symbol
 *          $id: {
 *              GET: f.unit()
 *              PUT: f.unit()
 *              DELETE: f.unit()
 *          },
 *     },
 * })
 * ```
 *
 * ```md
 *
 * 4. GET_ROUTER_CONFIG
 * ```
 * ```ts
 * export type Api = f.GetRouterConfig<typeof api>
 *
 * ```
 */
export const router = <
    const RouterBaseUrl extends string,
    const RouterBuilderStructure extends BuilderStructure,
>(
    baseUrl: RouterBaseUrl,
    router: RouterBuilderStructure,
    //TODO: Add transformer for router
    /**
     * @example
     * ```ts
     *
     * const ex =
     * {
     *      api: {
     *           "auth-login": {
     *              GET: f.unit()
     *           }
     *      }
     * }
     *
     * const transformed =
     * {
     *      api: {
     *          auth: { // auth-login -> auth, we need to change that for convenience!
     *            GET: f.unit()
     *      }
     * }
     * ```
     */
    routerTransformer?: <TransformedRouterStructure extends BuilderStructure>(
        base: RouterBuilderStructure
    ) => TransformedRouterStructure
): BuildRouterUrlFromStructure<RouterBuilderStructure, RouterBaseUrl> => {
    const transformedRouter = routerTransformer
        ? routerTransformer(router)
        : router
    const baseRouter = new Router<
        RouterBaseUrl,
        BuildRouterUrlFromStructure<RouterBuilderStructure, RouterBaseUrl>
    >(
        baseUrl,
        transformedRouter as BuildRouterUrlFromStructure<
            RouterBuilderStructure,
            RouterBaseUrl
        >
    ).routerStructure

    return baseRouter
}

export type IsDynamicPath<Path extends string> = Path extends `$${string}`
    ? true
    : false
export type GetDynamicPath<Path extends string> =
    Path extends `$${infer DynamicPath}` ? DynamicPath : never

type BuildRouterUrlFromStructure<
    RouterBuilderStructure,
    BaseUrl extends string = '',
    PathParamsList extends ReadonlyArray<string> = [],
> = RouterBuilderStructure extends BuilderStructure
    ? {
          [Key in keyof RouterBuilderStructure]: Key extends FetchMethod
              ? RouterBuilderStructure[Key] extends FetchUnit<
                    string,
                    unknown,
                    infer SearchParams,
                    infer Body,
                    infer Response,
                    infer IsJsonMode,
                    string
                >
                  ? FetchUnit<
                        Key,
                        PathParamsList[number] extends []
                            ? unknown
                            : {
                                  [CollectedPathParamsList in PathParamsList[number]]: Param
                              },
                        SearchParams,
                        Body,
                        Response,
                        IsJsonMode,
                        BaseUrl
                    >
                  : never
              : Key extends string
                ? IsDynamicPath<Key> extends true
                    ? BuildRouterUrlFromStructure<
                          RouterBuilderStructure[Key],
                          `${BaseUrl}/${string}`,
                          readonly [...PathParamsList, GetDynamicPath<Key>]
                      >
                    : BuildRouterUrlFromStructure<
                          RouterBuilderStructure[Key],
                          `${BaseUrl}/${Key}`,
                          PathParamsList
                      >
                : never
      }
    : never

export type GetRouterConfig<RouterStructure extends BuilderStructure> = {
    [Key in keyof RouterStructure]: Key extends FetchMethod
        ? RouterStructure[Key] extends FetchUnitShape
            ? InferFetchUnit<RouterStructure[Key]>
            : never
        : RouterStructure[Key] extends BuilderStructure
          ? GetRouterConfig<RouterStructure[Key]>
          : never
}
