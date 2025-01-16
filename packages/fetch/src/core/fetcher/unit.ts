import type { ConcreteBoolean, JSON, OmitUnknown } from '../../utils/types'
import {
    FetchBodyError,
    type FetchErrorCode,
    FetchPathParamsError,
    FetchResponseError,
    FetchSearchParamsError,
} from '../error'
import type { FetchBuilder } from './builder'
import type {
    DefaultFetchModeOptions,
    FetchMethodString,
    FetchModeOptionsShape,
    FetchOption,
    FetchPathParamsShape,
    FetchQueryOptions,
    FetchQueryOptionsPartial,
    FetchSearchParamsShape,
    FetchUnitOption,
    Param,
} from './core.type'
import type { FetchOptionStore } from './fetch.option'

/**
 * @description Fetch unit
 */
export class FetchUnit<
    $Method extends FetchMethodString,
    $PathParams extends FetchPathParamsShape = unknown,
    $SearchParams extends FetchSearchParamsShape = unknown,
    $Body = unknown,
    $Response = unknown,
    $ModeOptions extends FetchModeOptionsShape = DefaultFetchModeOptions,
    const $BaseUrl extends string = '',
> {
    public constructor(
        public readonly $store: FetchOptionStore,
        private readonly $builder: FetchBuilder<
            $Method,
            $PathParams,
            $SearchParams,
            $Body,
            $Response,
            $ModeOptions,
            $BaseUrl
        >
    ) {}

    public copy(): FetchUnit<
        $Method,
        $PathParams,
        $SearchParams,
        $Body,
        $Response,
        $ModeOptions,
        $BaseUrl
    > {
        const newStore = this.$store.copy()
        return new FetchUnit(newStore, this.$builder.copy(newStore))
    }

    public set_options(
        options: Partial<FetchUnitOption>
    ): FetchUnit<
        $Method,
        $PathParams,
        $SearchParams,
        $Body,
        $Response,
        $ModeOptions,
        $BaseUrl
    > {
        const copyUnit = this.copy()

        options.cache && copyUnit.set_cache(options.cache)
        options.credentials && copyUnit.set_credentials(options.credentials)
        options.integrity && copyUnit.set_integrity(options.integrity)
        options.keepalive && copyUnit.set_keepalive(options.keepalive)
        options.mode && copyUnit.set_mode(options.mode)
        options.priority && copyUnit.set_priority(options.priority)
        options.redirect && copyUnit.set_redirect(options.redirect)
        options.referrer && copyUnit.set_referrer(options.referrer)
        options.referrerPolicy &&
            copyUnit.set_referrer_policy(options.referrerPolicy)
        options.signal && copyUnit.set_signal(options.signal)
        options.window && copyUnit.set_window(options.window)

        return copyUnit
    }

    public set_cache(
        cache: FetchOption['cache']
    ): FetchUnit<
        $Method,
        $PathParams,
        $SearchParams,
        $Body,
        $Response,
        $ModeOptions,
        $BaseUrl
    > {
        const copyUnit = this.copy()
        copyUnit.$store.cache = cache
        return copyUnit
    }
    public set_credentials(
        credentials: FetchOption['credentials']
    ): FetchUnit<
        $Method,
        $PathParams,
        $SearchParams,
        $Body,
        $Response,
        $ModeOptions,
        $BaseUrl
    > {
        const copyUnit = this.copy()
        copyUnit.$store.credentials = credentials
        return copyUnit
    }
    public set_redirect(
        redirect: FetchOption['redirect']
    ): FetchUnit<
        $Method,
        $PathParams,
        $SearchParams,
        $Body,
        $Response,
        $ModeOptions,
        $BaseUrl
    > {
        const copyUnit = this.copy()
        copyUnit.$store.redirect = redirect
        return copyUnit
    }
    public set_referrer(
        referrer: FetchOption['referrer']
    ): FetchUnit<
        $Method,
        $PathParams,
        $SearchParams,
        $Body,
        $Response,
        $ModeOptions,
        $BaseUrl
    > {
        const copyUnit = this.copy()
        copyUnit.$store.referrer = referrer
        return copyUnit
    }
    public set_referrer_policy(
        referrerPolicy: FetchOption['referrerPolicy']
    ): FetchUnit<
        $Method,
        $PathParams,
        $SearchParams,
        $Body,
        $Response,
        $ModeOptions,
        $BaseUrl
    > {
        const copyUnit = this.copy()
        copyUnit.$store.referrerPolicy = referrerPolicy
        return copyUnit
    }
    public set_integrity(
        integrity: FetchOption['integrity']
    ): FetchUnit<
        $Method,
        $PathParams,
        $SearchParams,
        $Body,
        $Response,
        $ModeOptions,
        $BaseUrl
    > {
        const copyUnit = this.copy()
        copyUnit.$store.integrity = integrity
        return copyUnit
    }
    public set_keepalive(
        keepalive: FetchOption['keepalive']
    ): FetchUnit<
        $Method,
        $PathParams,
        $SearchParams,
        $Body,
        $Response,
        $ModeOptions,
        $BaseUrl
    > {
        const copyUnit = this.copy()
        copyUnit.$store.keepalive = keepalive
        return copyUnit
    }
    public set_signal(
        signal: FetchOption['signal']
    ): FetchUnit<
        $Method,
        $PathParams,
        $SearchParams,
        $Body,
        $Response,
        $ModeOptions,
        $BaseUrl
    > {
        const copyUnit = this.copy()
        copyUnit.$store.signal = signal
        return copyUnit
    }
    public set_window(
        window: FetchOption['window']
    ): FetchUnit<
        $Method,
        $PathParams,
        $SearchParams,
        $Body,
        $Response,
        $ModeOptions,
        $BaseUrl
    > {
        const copyUnit = this.copy()
        copyUnit.$store.window = window
        return copyUnit
    }
    public set_mode(
        mode: FetchOption['mode']
    ): FetchUnit<
        $Method,
        $PathParams,
        $SearchParams,
        $Body,
        $Response,
        $ModeOptions,
        $BaseUrl
    > {
        const copyUnit = this.copy()
        copyUnit.$store.mode = mode
        return copyUnit
    }
    public set_priority(
        priority: FetchOption['priority']
    ): FetchUnit<
        $Method,
        $PathParams,
        $SearchParams,
        $Body,
        $Response,
        $ModeOptions,
        $BaseUrl
    > {
        const copyUnit = this.copy()
        copyUnit.$store.priority = priority
        return copyUnit
    }

    private buildPathParams(baseUrl: string, pathParams?: $PathParams): string {
        if (!pathParams) return baseUrl

        try {
            const baseUrlObject: URL = new URL(baseUrl)
            const dynamicParamsProcessedPath: string = baseUrlObject.pathname
                .split('/')
                .filter(Boolean)
                .reduce<Array<string>>((paramList, params) => {
                    const isDynamicParam: boolean = params.startsWith('$')

                    if (params.includes('$') && !isDynamicParam)
                        throw new SyntaxError(
                            `Invalid path params, ${params}\nDynamic Params should be started with $, ex) $id, $name\nCheck your base url: ${baseUrl}`
                        )

                    if (isDynamicParam) {
                        const paramKey: string = params.slice(1)
                        const dynamicParam: Param | undefined = (
                            pathParams as Record<string, Param>
                        )?.[paramKey]

                        if (
                            !dynamicParam ||
                            (typeof dynamicParam !== 'number' &&
                                typeof dynamicParam !== 'string')
                        )
                            return paramList

                        paramList.push(String(dynamicParam))
                        return paramList
                    }

                    paramList.push(params)
                    return paramList
                }, [])
                .join('/')

            baseUrlObject.pathname = dynamicParamsProcessedPath
            return baseUrlObject.toString()
        } catch (e) {
            throw new FetchPathParamsError(baseUrl.toString(), pathParams, e)
        }
    }

    private buildSearchParams(
        baseUrl: string,
        searchParams?: $SearchParams
    ): string {
        if (!searchParams) return baseUrl

        try {
            const validatedSearchParams: Record<string, Param | Array<Param>> =
                this.$builder.searchParamsValidator(searchParams) as Record<
                    string,
                    Param | Array<Param>
                >

            const baseUrlObject: URL = new URL(baseUrl)

            Object.entries(validatedSearchParams).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach((v) => {
                        baseUrlObject.searchParams.append(key, v.toString())
                    })
                } else {
                    baseUrlObject.searchParams.append(key, value.toString())
                }
            })

            return baseUrlObject.toString()
        } catch (e) {
            throw new FetchSearchParamsError(
                baseUrl.toString(),
                searchParams,
                e
            )
        }
    }

    private getRequestURI(
        pathParams?: $PathParams,
        searchParams?: $SearchParams
    ): string {
        const baseUrl = this.$store.url
        const requestURI = this.buildSearchParams(
            this.buildPathParams(
                baseUrl instanceof Request ? baseUrl.url : baseUrl.toString(),
                pathParams
            ),
            searchParams
        )
        return requestURI
    }

    private getValidBody(targetBody: unknown) {
        if (
            targetBody instanceof Blob ||
            targetBody instanceof FormData ||
            targetBody instanceof ArrayBuffer ||
            targetBody instanceof ReadableStream ||
            targetBody instanceof URLSearchParams
        ) {
            return targetBody
        }

        try {
            const serializedJson: string = JSON.stringify(targetBody)
            const isJson: boolean = serializedJson !== '{}'
            if (!isJson) throw new FetchBodyError(targetBody)

            return serializedJson
        } catch (e) {
            throw new SyntaxError(
                `Json serialization failed. Please check your body, ${targetBody}`,
                {
                    cause: [e, targetBody],
                }
            )
        }
    }

    private createRequest(
        queryOptions?: FetchQueryOptionsPartial<
            $PathParams,
            $SearchParams,
            $Body
        >
    ): Request {
        const validatedBody: BodyInit | null = queryOptions?.body
            ? this.getValidBody(this.$builder.bodyValidator(queryOptions?.body))
            : this.$store.body

        const requestHeaders: HeadersInit = queryOptions?.headers
            ? {
                  ...this.$store.headers,
                  ...(queryOptions.headers as Record<string, string>),
              }
            : this.$store.headers

        const request: Request = new Request(
            this.getRequestURI(queryOptions?.path, queryOptions?.search),
            {
                ...this.$store.options,
                ...queryOptions?.options,
                headers: requestHeaders,
                body: validatedBody,
            }
        )

        return this.$builder.requestHandler({
            request,
            queryOptions: queryOptions as FetchQueryOptions<
                $PathParams,
                $SearchParams,
                $Body
            >,
        })
    }

    /**
     * @description Query data
     * @param queryOptions fetch params
     */
    public async query(
        queryOptions?: FetchQueryOptions<$PathParams, $SearchParams, $Body>
    ): Promise<
        $ModeOptions['isSafeMode'] extends true
            ? $Response | undefined
            : $Response
    > {
        const request: Request = this.createRequest(queryOptions)

        let response: Response
        try {
            response = await fetch(request)
            if (!response.ok) throw new FetchResponseError(response)

            const processedResponse: $Response = this.$builder.responseHandler(
                // @ts-ignore
                this.$builder.isJsonMode
                    ? {
                          response,
                          json: (await response.json()) as JSON,
                      }
                    : { response }
            )

            return processedResponse
        } catch (error) {
            if (error instanceof FetchResponseError) {
                this.$builder.fetchErrorProcedure?.executor({
                    error,
                    status: error.response.status as FetchErrorCode,
                })
            } else {
                this.$builder.unknownErrorProcedure?.executor({ error })
            }

            if (!this.$builder.isSafeMode) throw error
        } finally {
            if (queryOptions) {
                this.$builder.finallyProcedure.executor(queryOptions)
            }
        }

        return undefined as $ModeOptions['isSafeMode'] extends true
            ? $Response | undefined
            : $Response
    }
}

/**
 * @description Fetch unit shape type
 */
export type FetchUnitShape = FetchUnit<
    FetchMethodString,
    any,
    any,
    any,
    any,
    FetchModeOptionsShape,
    string
>

export type DefaultFetchUnitShape = FetchUnit<
    string,
    unknown,
    unknown,
    unknown,
    unknown,
    {
        isJsonMode: ConcreteBoolean
        isSafeMode: ConcreteBoolean
    },
    ''
>

/**
 * @description Infer fetch unit's information
 */
export type InferFetchUnit<FetchUnitTarget extends FetchUnitShape> =
    FetchUnitTarget extends FetchUnit<
        infer FetchMethod,
        infer FetchPathParams,
        infer FetchSearchParams,
        infer FetchBody,
        infer FetchResponse,
        infer FetchIsJsonMode,
        infer FetchUrl
    >
        ? OmitUnknown<{
              method: FetchMethod
              url: FetchUrl
              pathParams: FetchPathParams
              searchParams: FetchSearchParams
              body: FetchBody
              response: FetchResponse
              mode: {
                  isJson: FetchIsJsonMode['isJsonMode']
                  isSafeFetch: FetchIsJsonMode['isSafeMode']
              }
          }>
        : never
