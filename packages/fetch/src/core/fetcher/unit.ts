/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Procedure, ProcedureSet } from '../../utils/procedure'
import type {
    ConcreteBoolean,
    JsonType,
    OmitUnknown,
    OptionalAndNeverAtUnknown,
} from '../../utils/types'
import {
    FetchBodyError,
    type FetchErrorCode,
    FetchPathParamsError,
    FetchResponseError,
    FetchSearchParamsError,
} from '../error'
import {
    FetchBuilder,
    type FetchMethodString as FetchMethodShape,
} from './builder'

interface FetchUnitOption
    extends Omit<RequestInit, 'body' | 'method' | 'headers'> {}

type FetchQueryOptions<FetchPathParams, FetchSearchParams, FetchBody> =
    OptionalAndNeverAtUnknown<{
        /**
         * @description Path params
         */
        path: FetchPathParams
        /**
         * @description Search params
         */
        search: FetchSearchParams
        /**
         * @description Body data
         */
        body: FetchBody
    }> & {
        /**
         * @description Fetch headers
         */
        headers?: FetchBuilder['headers']
        /**
         * @description Fetch option
         */
        option?: FetchUnitOption
    }

interface FetchQueryOptionsPartial<
    FetchPathParams,
    FetchSearchParams,
    FetchBody,
> {
    path?: FetchPathParams
    search?: FetchSearchParams
    body?: FetchBody
    option?: FetchUnitOption
    headers?: FetchBuilder['headers']
}

type FetchUnitRequestHandler<FetchPathParams, FetchSearchParams, FetchBody> =
    (requestArgs: {
        request: Request
        queryOptions: FetchQueryOptions<
            FetchPathParams,
            FetchSearchParams,
            FetchBody
        >
    }) => Request

export type Param = string | number
export type FetchSearchParamsShape = Record<string, Param | Param[]> | unknown
export type FetchPathParamsShape = Record<string, Param> | unknown
export type FetchModeOptionsShape = {
    isJsonMode: ConcreteBoolean
    isSafeMode: ConcreteBoolean
}
type DefaultFetchModeOptions = {
    isJsonMode: false
    isSafeMode: false
}

//TODO: do not return this, instead, return instance with config updated.
//TODO: Replace each set_kinda method into pure functions that returns updated config with existing config injected.
/**
 * @description Fetch unit
 */
export class FetchUnit<
    FetchMethod extends FetchMethodShape,
    FetchPathParams extends FetchPathParamsShape = unknown,
    FetchSearchParams extends FetchSearchParamsShape = unknown,
    FetchBody = unknown,
    FetchResponse = unknown,
    FetchModeOptions extends FetchModeOptionsShape = DefaultFetchModeOptions,
    FetchBaseUrl extends string = '',
> {
    public static Create<
        FetchMethod extends FetchMethodShape,
        FetchPathParams extends FetchPathParamsShape = unknown,
        FetchSearchParams extends FetchSearchParamsShape = unknown,
        FetchBody = unknown,
        FetchResponse = unknown,
        FetchModeOptions extends
            FetchModeOptionsShape = DefaultFetchModeOptions,
        const FetchUrl extends string = '',
    >(
        fetchUrl?: FetchUrl
    ): FetchUnit<
        FetchMethod,
        FetchPathParams,
        FetchSearchParams,
        FetchBody,
        FetchResponse,
        FetchModeOptions,
        FetchUrl
    > {
        const fetchBuilder = new FetchBuilder()
        fetchUrl && fetchBuilder.setUrl(fetchUrl)
        return new FetchUnit<
            FetchMethod,
            FetchPathParams,
            FetchSearchParams,
            FetchBody,
            FetchResponse,
            FetchModeOptions,
            FetchUrl
        >(fetchBuilder)
    }
    private constructor(private readonly $builder: FetchBuilder) {}

    private isJsonMode: ConcreteBoolean = false

    private readonly fetchErrorProcedure: ProcedureSet<{
        error: FetchResponseError
        status?: FetchErrorCode
    }> = new ProcedureSet()
    public handle_fetch_error(
        fetchErrorProcedure: Procedure<{
            error: FetchResponseError
            status?: FetchErrorCode
        }>,
        once: boolean = false
    ): FetchUnit<
        FetchMethod,
        FetchPathParams,
        FetchSearchParams,
        FetchBody,
        FetchResponse,
        FetchModeOptions,
        FetchBaseUrl
    > {
        this.fetchErrorProcedure.use(fetchErrorProcedure, once)
        return this
    }

    private readonly unknownErrorProcedure: ProcedureSet<{
        error: unknown
    }> = new ProcedureSet()
    public handle_unknown_error(
        unknownErrorProcedure: Procedure<{
            error: unknown
        }>,
        once: boolean = false
    ): FetchUnit<
        FetchMethod,
        FetchPathParams,
        FetchSearchParams,
        FetchBody,
        FetchResponse,
        FetchModeOptions,
        FetchBaseUrl
    > {
        this.unknownErrorProcedure.use(unknownErrorProcedure, once)
        return this
    }

    private readonly finallyProcedure: ProcedureSet<
        FetchQueryOptions<FetchPathParams, FetchSearchParams, FetchBody>
    > = new ProcedureSet()
    public handle_finally(
        finallyHandler: Procedure<
            FetchQueryOptions<FetchPathParams, FetchSearchParams, FetchBody>
        >,
        once: boolean = false
    ): FetchUnit<
        FetchMethod,
        FetchPathParams,
        FetchSearchParams,
        FetchBody,
        FetchResponse,
        FetchModeOptions,
        FetchBaseUrl
    > {
        this.finallyProcedure.use(finallyHandler, once)
        return this
    }

    private searchParamsValidator: (
        searchParams: FetchSearchParamsShape
    ) => FetchSearchParams = (s) => s as FetchSearchParams
    public def_searchparams<
        FetchSearchParamsInjection extends FetchSearchParams,
    >(
        searchParamsValidator: (
            params: FetchSearchParamsShape
        ) => FetchSearchParamsInjection
    ): FetchUnit<
        FetchMethod,
        FetchPathParams,
        FetchSearchParamsInjection,
        FetchBody,
        FetchResponse,
        FetchModeOptions,
        FetchBaseUrl
    > {
        this.searchParamsValidator = searchParamsValidator
        return this as unknown as FetchUnit<
            FetchMethod,
            FetchPathParams,
            FetchSearchParamsInjection,
            FetchBody,
            FetchResponse,
            FetchModeOptions,
            FetchBaseUrl
        >
    }

    private bodyValidator: (body: unknown) => FetchBody = (s) => s as FetchBody
    /**
     * @description Validate body data using any schema validation library
     * @param bodyValidator validate body data, return parsed body data
     * @example
     * ```ts
     * // Example using zod
     * import { z } from "zod"
     *
     * const BodyZod = z.object({ name: z.string() })
     * const fetchUnit = f.unit().def_body(BodyZod.parse)
     *
     * // Example using metal-box/type
     * import { t } from "@metal-box/type"
     *
     * const BodyMetal = t.object({ name: t.string })
     * const fetchUnit2 = f.unit().def_body(BodyMetal.parse)
     * ```
     */
    public def_body<FetchBodyInjection extends FetchBody>(
        bodyValidator: (body: unknown) => FetchBodyInjection
    ): FetchUnit<
        FetchMethod,
        FetchPathParams,
        FetchSearchParams,
        FetchBodyInjection,
        FetchResponse,
        FetchModeOptions,
        FetchBaseUrl
    > {
        this.bodyValidator = bodyValidator
        return this as unknown as FetchUnit<
            FetchMethod,
            FetchPathParams,
            FetchSearchParams,
            FetchBodyInjection,
            FetchResponse,
            FetchModeOptions,
            FetchBaseUrl
        >
    }

    private responseHandler: (
        responseArgument: FetchModeOptions['isJsonMode'] extends true
            ? {
                  response: Response
                  json: JsonType
              }
            : {
                  response: Response
              }
    ) => FetchResponse = (s) => s.response as FetchResponse
    /**
     * @description Define response data
     * @param responseHandler validate response data, return processed response data
     */
    public def_response<FetchResponseInjection extends FetchResponse>(
        responseHandler: (
            responseArgument: FetchModeOptions['isJsonMode'] extends true
                ? {
                      response: Response
                      json: JsonType
                  }
                : {
                      response: Response
                  }
        ) => FetchResponseInjection
    ): FetchUnit<
        FetchMethod,
        FetchPathParams,
        FetchSearchParams,
        FetchBody,
        Awaited<FetchResponseInjection>,
        FetchModeOptions,
        FetchBaseUrl
    > {
        this.responseHandler = responseHandler
        return this as unknown as FetchUnit<
            FetchMethod,
            FetchPathParams,
            FetchSearchParams,
            FetchBody,
            Awaited<FetchResponseInjection>,
            FetchModeOptions,
            FetchBaseUrl
        >
    }

    private requestHandler: FetchUnitRequestHandler<
        FetchPathParams,
        FetchSearchParams,
        FetchBody
    > = (s) => s.request
    /**
     * @description Handle request data
     * @param requestHandler handle request data, return processed request data
     */
    public handle_request(
        requestHandler: FetchUnitRequestHandler<
            FetchPathParams,
            FetchSearchParams,
            FetchBody
        >
    ): FetchUnit<
        FetchMethod,
        FetchPathParams,
        FetchSearchParams,
        FetchBody,
        FetchResponse,
        FetchModeOptions,
        FetchBaseUrl
    > {
        this.requestHandler = requestHandler
        return this
    }

    private buildPathParams(
        baseUrl: string,
        pathParams?: FetchPathParams
    ): string {
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
        searchParams?: FetchSearchParams
    ): string {
        if (!searchParams) return baseUrl

        try {
            const validatedSearchParams: Record<string, Param | Param[]> =
                this.searchParamsValidator(searchParams) as Record<
                    string,
                    Param | Param[]
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
        pathParams?: FetchPathParams,
        searchParams?: FetchSearchParams
    ): string {
        const baseUrl = this.$builder.url
        const requestURI = this.buildSearchParams(
            this.buildPathParams(
                baseUrl instanceof Request ? baseUrl.url : baseUrl.toString(),
                pathParams
            ),
            searchParams
        )
        return requestURI
    }

    private getValidBody(targetBody: unknown): FetchBuilder['body'] {
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

    private setupJsonMode(): void {
        if (!this.isJsonMode) return

        this.set_headers({
            'Content-Type': 'application/json',
        })
    }

    private createRequest(
        queryOptions?: FetchQueryOptionsPartial<
            FetchPathParams,
            FetchSearchParams,
            FetchBody
        >
    ): Request {
        this.setupJsonMode()

        const validatedBody: FetchBuilder['body'] = queryOptions?.body
            ? this.getValidBody(this.bodyValidator(queryOptions?.body))
            : this.$builder.body

        const requestHeaders: HeadersInit = queryOptions?.headers
            ? {
                  ...this.$builder.headers,
                  ...(queryOptions.headers as Record<string, string>),
              }
            : this.$builder.headers

        const request: Request = new Request(
            this.getRequestURI(queryOptions?.path, queryOptions?.search),
            {
                ...this.$builder.defaultFetchOption,
                ...queryOptions?.option,
                headers: requestHeaders,
                body: validatedBody,
            }
        )

        return this.requestHandler({
            request,
            queryOptions: queryOptions as FetchQueryOptions<
                FetchPathParams,
                FetchSearchParams,
                FetchBody
            >,
        })
    }

    /**
     * @description Query data
     * @param queryOptions fetch params, {@link FetchSearchParams} type
     * @param option fetch option, {@link FetchUnitOption}
     */
    public async query(
        queryOptions?: FetchQueryOptions<
            FetchPathParams,
            FetchSearchParams,
            FetchBody
        >
    ): Promise<
        FetchModeOptions['isSafeMode'] extends true
            ? FetchResponse | undefined
            : FetchResponse
    > {
        const request: Request = this.createRequest(queryOptions)
        let response: Response

        try {
            response = await fetch(request)

            if (!response.ok) throw new FetchResponseError(response)

            if (this.responseHandler) {
                const processedResponse: FetchResponse =
                    await this.responseHandler(
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        this.isJsonMode
                            ? {
                                  response,
                                  json: (await response.json()) as JsonType,
                              }
                            : { response }
                    )
                return processedResponse
            }

            return response as FetchResponse
        } catch (error) {
            if (error instanceof FetchResponseError) {
                this.fetchErrorProcedure?.executor({
                    error,
                    status: error.response.status as FetchErrorCode,
                })
            } else {
                this.unknownErrorProcedure?.executor({ error })
            }

            if (!this.isSafeMode) throw error
        } finally {
            this.finallyProcedure.executor(
                queryOptions as FetchQueryOptions<
                    FetchPathParams,
                    FetchSearchParams,
                    FetchBody
                >
            )
        }

        return undefined as FetchModeOptions['isSafeMode'] extends true
            ? FetchResponse | undefined
            : FetchResponse
    }

    public set_cache(
        cache: FetchBuilder['cache']
    ): FetchUnit<
        FetchMethod,
        FetchPathParams,
        FetchSearchParams,
        FetchBody,
        FetchResponse,
        FetchModeOptions,
        FetchBaseUrl
    > {
        this.$builder.setCache(cache)
        return this
    }
    public set_body(
        body: FetchBody
    ): FetchUnit<
        FetchMethod,
        FetchPathParams,
        FetchSearchParams,
        FetchBody,
        FetchResponse,
        FetchModeOptions,
        FetchBaseUrl
    > {
        const parsedBody: FetchBuilder['body'] = this.getValidBody(body)
        this.$builder.setBody(parsedBody)
        return this
    }
    public set_method<const FetchMethodInjection extends FetchMethodShape>(
        method: FetchMethodInjection
    ): FetchUnit<
        FetchMethodInjection,
        FetchPathParams,
        FetchSearchParams,
        FetchBody,
        FetchResponse,
        FetchModeOptions,
        FetchBaseUrl
    > {
        this.$builder.setMethod(method)
        return this
    }
    public set_url<const FetchBaseUrlInjection extends string>(
        baseUrl: FetchBaseUrl extends '' ? FetchBaseUrlInjection : never
    ): FetchUnit<
        FetchMethod,
        FetchPathParams,
        FetchSearchParams,
        FetchBody,
        FetchResponse,
        FetchModeOptions,
        FetchBaseUrlInjection
    > {
        this.$builder.setUrl(baseUrl)
        return this
    }

    private isSafeMode: ConcreteBoolean = false
    public set_query_mode<const QueryMode extends 'throw' | 'not_throw'>(
        queryMode: QueryMode
    ): FetchUnit<
        FetchMethod,
        FetchPathParams,
        FetchSearchParams,
        FetchBody,
        FetchResponse,
        {
            isJsonMode: FetchModeOptions['isJsonMode']
            isSafeMode: QueryMode extends 'throw' ? false : true
        },
        FetchBaseUrl
    > {
        this.isSafeMode = queryMode === 'not_throw'
        return this
    }

    public set_json(): FetchUnit<
        FetchMethod,
        FetchPathParams,
        FetchSearchParams,
        FetchBody,
        FetchResponse,
        {
            isJsonMode: true
            isSafeMode: FetchModeOptions['isSafeMode']
        },
        FetchBaseUrl
    > {
        this.isJsonMode = true
        return this as unknown as FetchUnit<
            FetchMethod,
            FetchPathParams,
            FetchSearchParams,
            FetchBody,
            FetchResponse,
            {
                isJsonMode: true
                isSafeMode: FetchModeOptions['isSafeMode']
            },
            FetchBaseUrl
        >
    }

    public set_headers(
        headers: FetchBuilder['headers']
    ): FetchUnit<
        FetchMethod,
        FetchPathParams,
        FetchSearchParams,
        FetchBody,
        FetchResponse,
        FetchModeOptions,
        FetchBaseUrl
    > {
        this.$builder.setHeaders(headers)
        return this
    }
    public set_credentials(
        credentials: FetchBuilder['credentials']
    ): FetchUnit<
        FetchMethod,
        FetchPathParams,
        FetchSearchParams,
        FetchBody,
        FetchResponse,
        FetchModeOptions,
        FetchBaseUrl
    > {
        this.$builder.setCredentials(credentials)
        return this
    }
    public set_redirect(
        redirect: FetchBuilder['redirect']
    ): FetchUnit<
        FetchMethod,
        FetchPathParams,
        FetchSearchParams,
        FetchBody,
        FetchResponse,
        FetchModeOptions,
        FetchBaseUrl
    > {
        this.$builder.setRedirect(redirect)
        return this
    }
    public set_referrer(
        referrer: FetchBuilder['referrer']
    ): FetchUnit<
        FetchMethod,
        FetchPathParams,
        FetchSearchParams,
        FetchBody,
        FetchResponse,
        FetchModeOptions,
        FetchBaseUrl
    > {
        this.$builder.setReferrer(referrer)
        return this
    }
    public set_referrer_policy(
        referrerPolicy: FetchBuilder['referrerPolicy']
    ): FetchUnit<
        FetchMethod,
        FetchPathParams,
        FetchSearchParams,
        FetchBody,
        FetchResponse,
        FetchModeOptions,
        FetchBaseUrl
    > {
        this.$builder.setReferrerPolicy(referrerPolicy)
        return this
    }
    public set_integrity(
        integrity: FetchBuilder['integrity']
    ): FetchUnit<
        FetchMethod,
        FetchPathParams,
        FetchSearchParams,
        FetchBody,
        FetchResponse,
        FetchModeOptions,
        FetchBaseUrl
    > {
        this.$builder.setIntegrity(integrity)
        return this
    }
    public set_keepalive(
        keepalive: FetchBuilder['keepalive']
    ): FetchUnit<
        FetchMethod,
        FetchPathParams,
        FetchSearchParams,
        FetchBody,
        FetchResponse,
        FetchModeOptions,
        FetchBaseUrl
    > {
        this.$builder.setKeepalive(keepalive)
        return this
    }
    public set_signal(
        signal: FetchBuilder['signal']
    ): FetchUnit<
        FetchMethod,
        FetchPathParams,
        FetchSearchParams,
        FetchBody,
        FetchResponse,
        FetchModeOptions,
        FetchBaseUrl
    > {
        this.$builder.setSignal(signal)
        return this
    }
    public set_window(
        window: FetchBuilder['window']
    ): FetchUnit<
        FetchMethod,
        FetchPathParams,
        FetchSearchParams,
        FetchBody,
        FetchResponse,
        FetchModeOptions,
        FetchBaseUrl
    > {
        this.$builder.setWindow(window)
        return this
    }
    public set_mode(
        mode: FetchBuilder['mode']
    ): FetchUnit<
        FetchMethod,
        FetchPathParams,
        FetchSearchParams,
        FetchBody,
        FetchResponse,
        FetchModeOptions,
        FetchBaseUrl
    > {
        this.$builder.setMode(mode)
        return this
    }
}

/**
 * @description Create fetch unit instance
 * @example
 * ```ts
 * const fetchUnit = f.unit()
 * ```
 */
export const unit = FetchUnit.Create

/**
 * @description Fetch unit shape type
 */
export type FetchUnitShape = FetchUnit<
    FetchMethodShape,
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
