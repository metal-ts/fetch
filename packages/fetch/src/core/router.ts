import { FetchUnit, FetchUnitShape, InferFetchUnit } from './fetcher'
import {
    type DefaultFetchBuilderShape,
    FetchBuilder,
    type FetchBuilderShape,
} from './fetcher/builder'
import type { FetchMethod, Param } from './fetcher/core.type'

type Structure<T> =
    | {
          [Key in FetchMethod]?: T
      }
    | {
          [Key in string]?: Structure<T>
      }
type BuilderStructure = Structure<FetchBuilderShape>
type UnitStructure = Structure<FetchUnitShape>

class Router<
    const RouterBaseUrl extends string,
    const RouterBuilderStructure extends BuilderStructure,
> {
    public constructor(
        routerBaseUrl: RouterBaseUrl,
        routerStructure: RouterBuilderStructure
    ) {
        this._buildedRouterStructure = this.buildRouterStructure(
            routerStructure,
            routerBaseUrl
        )
    }

    private _buildedRouterStructure: BuildRouterUrlFromStructure<
        RouterBuilderStructure,
        RouterBaseUrl
    >
    public get routerStructure(): BuildRouterUrlFromStructure<
        RouterBuilderStructure,
        RouterBaseUrl
    > {
        return this._buildedRouterStructure
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

    private static isFetchMethod(value: unknown): value is FetchMethod {
        return this.fetchMethodSet.has(value as FetchMethod)
    }

    public static isFetchBuilder(
        unit: unknown
    ): unit is DefaultFetchBuilderShape {
        return unit instanceof FetchBuilder
    }

    private static getUrlPath(baseUrl = '', subPath?: string): string {
        if (!subPath) return baseUrl
        return baseUrl ? `${baseUrl}/${subPath}` : subPath
    }
    private static isRecord(value: unknown): value is Record<string, unknown> {
        return typeof value === 'object' && value !== null
    }

    private buildRouterStructure<T extends Record<string, unknown>>(
        structure: BuilderStructure,
        baseUrl: string = ''
    ): T {
        const result = {} as Record<string, unknown>

        for (const key of Object.keys(structure)) {
            const value = structure[key as keyof typeof structure]

            if (!value) {
                throw new Error(
                    `Router structure should be defined at ${String(key)}.`
                )
            }

            if (Router.isFetchMethod(key) && Router.isFetchBuilder(value)) {
                // 1. URL / Method
                value.def_url(Router.getUrlPath(baseUrl))
                value.def_method(key)
                // 2. Build
                result[key] = value.build()
            } else if (Router.isRecord(value)) {
                result[key] = this.buildRouterStructure(
                    value,
                    Router.getUrlPath(baseUrl, key as string)
                )
            } else {
                throw new Error(
                    `Invalid router structure at key: ${String(key)}`
                )
            }
        }

        return result as T
    }
}

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
    routerTransformer?: <
        TransformedRouterStructure extends RouterBuilderStructure,
    >(
        base: RouterBuilderStructure
    ) => TransformedRouterStructure
 */

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
    router: RouterBuilderStructure
): BuildRouterUrlFromStructure<RouterBuilderStructure, RouterBaseUrl> => {
    const baseRouter = new Router(baseUrl, router).routerStructure
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
              ? RouterBuilderStructure[Key] extends FetchBuilder<
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

export type GetRouterConfig<RouterStructure extends UnitStructure> = {
    [Key in keyof RouterStructure]: Key extends FetchMethod
        ? RouterStructure[Key] extends FetchUnitShape
            ? InferFetchUnit<RouterStructure[Key]>
            : never
        : RouterStructure[Key] extends UnitStructure
          ? GetRouterConfig<RouterStructure[Key]>
          : never
}
