import type { ConcreteBoolean, JSON, OmitUnknown } from '../../utils/types'
import { type FetchErrorCode, FetchResponseError } from '../error'
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
    ) {
        this.copy = this.copy.bind(this)

        this.set_options = this.set_options.bind(this)
        this.set_cache = this.set_cache.bind(this)
        this.set_credentials = this.set_credentials.bind(this)
        this.set_redirect = this.set_redirect.bind(this)
        this.set_referrer = this.set_referrer.bind(this)
        this.set_referrer_policy = this.set_referrer_policy.bind(this)
        this.set_integrity = this.set_integrity.bind(this)
        this.set_keepalive = this.set_keepalive.bind(this)
        this.set_window = this.set_window.bind(this)
        this.set_mode = this.set_mode.bind(this)
        this.set_priority = this.set_priority.bind(this)

        this.getRequestURI = this.getRequestURI.bind(this)
        this.createRequest = this.createRequest.bind(this)
        this.query = this.query.bind(this)
    }

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
        return new FetchUnit(newStore, this.$builder)
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

    private getRequestURI(
        pathParams?: $PathParams,
        searchParams?: $SearchParams
    ): string {
        const baseUrl = this.$store.url
        const requestURI = this.$builder.buildSearchParams(
            this.$builder.buildPathParams(
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
        // Generate body
        const body: BodyInit | null = queryOptions?.body
            ? this.getValidBody(this.$builder.bodyValidator(queryOptions?.body))
            : this.$store.body

        // Generate headers
        const headers: Headers = new Headers(
            queryOptions?.headers
                ? {
                      ...this.$store.headers,
                      ...(queryOptions.headers as Record<string, string>),
                  }
                : this.$store.headers
        )

        // Validate headers
        if (this.$builder.isJsonMode && !headers.has('Content-Type')) {
            headers.set('Content-Type', 'application/json')
        }

        // Attaching signals
        const signals: AbortSignal[] = []
        if (queryOptions?.timeout) {
            signals.push(AbortSignal.timeout(queryOptions.timeout))
        }
        if (queryOptions?.signal) {
            if (Array.isArray(queryOptions.signal)) {
                signals.push(...queryOptions.signal)
            } else {
                signals.push(queryOptions.signal)
            }
        }

        // Create request
        const request: Request = new Request(
            this.getRequestURI(queryOptions?.path, queryOptions?.search),
            {
                ...this.$store.options,
                ...queryOptions?.options,
                headers,
                body: body,
                signal: signals.length > 0 ? AbortSignal.any(signals) : null,
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

        const fetcher = (req: Request) => fetch(req)

        let response: Response
        try {
            response = await this.$builder.middleware.execute(request, fetcher)
            if (!response.ok) throw new FetchResponseError(response)

            const processedResponse: $Response =
                await this.$builder.responseHandler(
                    (this.$builder.isJsonMode
                        ? {
                              response,
                              json: () => response.json() as Promise<JSON>,
                          }
                        : { response }) as any
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
