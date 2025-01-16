import { Procedure, ProcedureSet } from '../../utils/procedure'
import type { ConcreteBoolean, JSON } from '../../utils/types'
import { FetchErrorCode, FetchResponseError } from '../error'
import {
    DefaultFetchModeOptions,
    FetchMethod,
    FetchMethodString,
    FetchModeOptionsShape,
    FetchOption,
    FetchPathParamsShape,
    FetchQueryOptions,
    FetchSearchParamsShape,
    FetchUnitRequestHandler,
} from './core.type'
import { FetchOptionStore } from './fetch.option'
import { FetchUnit } from './unit'

export class FetchBuilder<
    $Method extends FetchMethodString,
    $PathParams extends FetchPathParamsShape = unknown,
    $SearchParams extends FetchSearchParamsShape = unknown,
    $Body = unknown,
    $Response = unknown,
    $ModeOptions extends FetchModeOptionsShape = DefaultFetchModeOptions,
    const $BaseUrl extends string = '',
> {
    public copy(
        newStore: FetchOptionStore
    ): FetchBuilder<
        $Method,
        $PathParams,
        $SearchParams,
        $Body,
        $Response,
        $ModeOptions,
        $BaseUrl
    > {
        const copy = new FetchBuilder<
            $Method,
            $PathParams,
            $SearchParams,
            $Body,
            $Response,
            $ModeOptions,
            $BaseUrl
        >()
        copy._store = newStore
        copy.def_fetch_err_handler(this.fetchErrorProcedure.executor)
        copy.def_unknown_err_handler(this.unknownErrorProcedure.executor)
        copy.def_final_handler(this.finallyProcedure.executor)
        copy.def_response(this.responseHandler)
        copy.def_request_handler(this.requestHandler)
        copy.def_searchparams(this.searchParamsValidator)
        copy.def_query_mode(this.isSafeMode ? 'not_throw' : 'throw')
        this.isJsonMode && copy.def_json()

        return copy
    }

    public build(): FetchUnit<
        $Method,
        $PathParams,
        $SearchParams,
        $Body,
        $Response,
        $ModeOptions,
        $BaseUrl
    > {
        return new FetchUnit<
            $Method,
            $PathParams,
            $SearchParams,
            $Body,
            $Response,
            $ModeOptions,
            $BaseUrl
        >(this.$store, this)
    }

    public static Create<
        FetchMethod extends FetchMethodString,
        FetchPathParams extends FetchPathParamsShape = unknown,
        FetchSearchParams extends FetchSearchParamsShape = unknown,
        FetchBody = unknown,
        FetchResponse = unknown,
        FetchModeOptions extends
            FetchModeOptionsShape = DefaultFetchModeOptions,
        const FetchBaseUrl extends string = '',
    >(): FetchBuilder<
        FetchMethod,
        FetchPathParams,
        FetchSearchParams,
        FetchBody,
        FetchResponse,
        FetchModeOptions,
        FetchBaseUrl
    > {
        return new FetchBuilder<
            FetchMethod,
            FetchPathParams,
            FetchSearchParams,
            FetchBody,
            FetchResponse,
            FetchModeOptions,
            FetchBaseUrl
        >()
    }

    private constructor() {
        this._store = new FetchOptionStore()
    }

    private _store: FetchOptionStore
    public get $store(): FetchOptionStore {
        return this._store
    }

    public def_method<const Method extends FetchMethod>(
        method: Method
    ): FetchBuilder<
        Method,
        $PathParams,
        $SearchParams,
        $Body,
        $Response,
        $ModeOptions,
        $BaseUrl
    > {
        this._store.method = method
        return this
    }
    public def_url<const Url extends string>(
        url: Url
    ): FetchBuilder<
        $Method,
        $PathParams,
        $SearchParams,
        $Body,
        $Response,
        $ModeOptions,
        Url
    > {
        this.$store.defaultUrl = url
        return this
    }
    public def_default_cache(cache: FetchOption['cache']) {
        this.$store.defaultCache = cache
        return this
    }
    public def_default_mode(mode: FetchOption['mode']) {
        this.$store.defaultMode = mode
        return this
    }
    public def_default_credentials(credentials: FetchOption['credentials']) {
        this.$store.defaultCredentials = credentials
        return this
    }
    public def_default_redirect(redirect: FetchOption['redirect']) {
        this.$store.defaultRedirect = redirect
        return this
    }
    public def_default_referrer(referrer: FetchOption['referrer']) {
        this.$store.defaultReferrer = referrer
        return this
    }
    public def_default_referrer_policy(
        referrerPolicy: FetchOption['referrerPolicy']
    ) {
        this.$store.defaultReferrerPolicy = referrerPolicy
        return this
    }
    public def_default_integrity(integrity: FetchOption['integrity']) {
        this.$store.defaultIntegrity = integrity
        return this
    }
    public def_default_keepalive(keepalive: FetchOption['keepalive']) {
        this.$store.defaultKeepalive = keepalive
        return this
    }
    public def_default_signal(signal: FetchOption['signal']) {
        this.$store.defaultSignal = signal
        return this
    }
    public def_default_window(window: FetchOption['window']) {
        this.$store.defaultWindow = window
        return this
    }
    public def_default_priority(priority: FetchOption['priority']) {
        this.$store.defaultPriority = priority
        return this
    }

    public searchParamsValidator: (
        searchParams: FetchSearchParamsShape
    ) => $SearchParams = (s) => s as $SearchParams
    public def_searchparams<FetchSearchParamsInjection extends $SearchParams>(
        searchParamsValidator: (
            params: FetchSearchParamsShape
        ) => FetchSearchParamsInjection
    ): FetchBuilder<
        $Method,
        $PathParams,
        FetchSearchParamsInjection,
        $Body,
        $Response,
        $ModeOptions,
        $BaseUrl
    > {
        this.searchParamsValidator = searchParamsValidator
        return this as unknown as FetchBuilder<
            $Method,
            $PathParams,
            FetchSearchParamsInjection,
            $Body,
            $Response,
            $ModeOptions,
            $BaseUrl
        >
    }

    public readonly fetchErrorProcedure: ProcedureSet<{
        error: FetchResponseError
        status?: FetchErrorCode
    }> = new ProcedureSet()
    public def_fetch_err_handler(
        fetchErrorProcedure: Procedure<{
            error: FetchResponseError
            status?: FetchErrorCode
        }>,
        once: boolean = false
    ): FetchBuilder<
        $Method,
        $PathParams,
        $SearchParams,
        $Body,
        $Response,
        $ModeOptions,
        $BaseUrl
    > {
        this.fetchErrorProcedure.use(fetchErrorProcedure, once)
        return this
    }

    public readonly unknownErrorProcedure: ProcedureSet<{
        error: unknown
    }> = new ProcedureSet()
    public def_unknown_err_handler(
        unknownErrorProcedure: Procedure<{
            error: unknown
        }>,
        once: boolean = false
    ): FetchBuilder<
        $Method,
        $PathParams,
        $SearchParams,
        $Body,
        $Response,
        $ModeOptions,
        $BaseUrl
    > {
        this.unknownErrorProcedure.use(unknownErrorProcedure, once)
        return this
    }

    public readonly finallyProcedure: ProcedureSet<
        FetchQueryOptions<$PathParams, $SearchParams, $Body>
    > = new ProcedureSet()
    public def_final_handler(
        finallyHandler: Procedure<
            FetchQueryOptions<$PathParams, $SearchParams, $Body>
        >,
        once: boolean = false
    ): FetchBuilder<
        $Method,
        $PathParams,
        $SearchParams,
        $Body,
        $Response,
        $ModeOptions,
        $BaseUrl
    > {
        this.finallyProcedure.use(finallyHandler, once)
        return this
    }

    public bodyValidator: (body: unknown) => $Body = (s) => s as $Body
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
    public def_body<FetchBodyInjection extends $Body>(
        bodyValidator: (body: unknown) => FetchBodyInjection
    ): FetchBuilder<
        $Method,
        $PathParams,
        $SearchParams,
        FetchBodyInjection,
        $Response,
        $ModeOptions,
        $BaseUrl
    > {
        this.bodyValidator = bodyValidator
        return this as unknown as FetchBuilder<
            $Method,
            $PathParams,
            $SearchParams,
            FetchBodyInjection,
            $Response,
            $ModeOptions,
            $BaseUrl
        >
    }

    public responseHandler: (
        responseArgument: $ModeOptions['isJsonMode'] extends true
            ? {
                  response: Response
                  json: JSON
              }
            : {
                  response: Response
              }
    ) => $Response = (s) => s.response as $Response
    /**
     * @description Define response data
     * @param responseHandler validate response data, return processed response data
     */
    public def_response<FetchResponseInjection extends $Response>(
        responseHandler: (
            responseArgument: $ModeOptions['isJsonMode'] extends true
                ? {
                      response: Response
                      json: JSON
                  }
                : {
                      response: Response
                  }
        ) => FetchResponseInjection
    ): FetchBuilder<
        $Method,
        $PathParams,
        $SearchParams,
        $Body,
        Awaited<FetchResponseInjection>,
        $ModeOptions,
        $BaseUrl
    > {
        this.responseHandler = responseHandler
        return this as unknown as FetchBuilder<
            $Method,
            $PathParams,
            $SearchParams,
            $Body,
            Awaited<FetchResponseInjection>,
            $ModeOptions,
            $BaseUrl
        >
    }

    public requestHandler: FetchUnitRequestHandler<
        $PathParams,
        $SearchParams,
        $Body
    > = (s) => s.request
    /**
     * @description Handle request data
     * @param requestHandler handle request data, return processed request data
     */
    public def_request_handler(
        requestHandler: FetchUnitRequestHandler<
            $PathParams,
            $SearchParams,
            $Body
        >
    ): FetchBuilder<
        $Method,
        $PathParams,
        $SearchParams,
        $Body,
        $Response,
        $ModeOptions,
        $BaseUrl
    > {
        this.requestHandler = requestHandler
        return this
    }

    public isJsonMode: ConcreteBoolean = false
    public def_json(): FetchBuilder<
        $Method,
        $PathParams,
        $SearchParams,
        $Body,
        $Response,
        {
            isJsonMode: true
            isSafeMode: $ModeOptions['isSafeMode']
        },
        $BaseUrl
    > {
        if (this.isJsonMode)
            return this as unknown as FetchBuilder<
                $Method,
                $PathParams,
                $SearchParams,
                $Body,
                $Response,
                {
                    isJsonMode: true
                    isSafeMode: $ModeOptions['isSafeMode']
                },
                $BaseUrl
            >

        this.isJsonMode = true
        return this as unknown as FetchBuilder<
            $Method,
            $PathParams,
            $SearchParams,
            $Body,
            $Response,
            {
                isJsonMode: true
                isSafeMode: $ModeOptions['isSafeMode']
            },
            $BaseUrl
        >
    }

    public isSafeMode: ConcreteBoolean = false
    public def_query_mode<const QueryMode extends 'throw' | 'not_throw'>(
        queryMode: QueryMode
    ): FetchBuilder<
        $Method,
        $PathParams,
        $SearchParams,
        $Body,
        $Response,
        {
            isJsonMode: $ModeOptions['isJsonMode']
            isSafeMode: QueryMode extends 'throw' ? false : true
        },
        $BaseUrl
    > {
        this.isSafeMode = queryMode === 'not_throw'
        return this
    }
}

/**
 * @description Fetch builder shape type
 */
export type FetchBuilderShape = FetchBuilder<
    FetchMethodString,
    any,
    any,
    any,
    any,
    FetchModeOptionsShape,
    string
>

export type DefaultFetchBuilderShape = FetchBuilder<
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

export const unit = FetchBuilder.Create
