import type {
    ConcreteBoolean,
    IncludeString,
    OmitNever,
} from '../../utils/types'

type BaseFetchOption = Required<RequestInit>

export type FetchUrl = Parameters<typeof fetch>[0]
export type FetchMethod =
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'PATCH'
    | 'CONNECT'
    | 'HEAD'
    | 'OPTIONS'
    | 'TRACE'
export type FetchHeader = BaseFetchOption['headers'] & {
    [key in FetchHeaderKeyString]?: string
}
export type FetchOption = Omit<BaseFetchOption, 'headers'> & {
    headers: FetchHeader
}

export type FetchMethodString = FetchMethod | IncludeString

type FetchHeaderKey =
    | 'Accept'
    | 'Accept-CH'
    | 'Accept-CH-Lifetime'
    | 'Accept-Charset'
    | 'Accept-Encoding'
    | 'Accept-Language'
    | 'Accept-Patch'
    | 'Accept-Post'
    | 'Accept-Ranges'
    | 'Access-Control-Allow-Credentials'
    | 'Access-Control-Allow-Headers'
    | 'Access-Control-Allow-Methods'
    | 'Access-Control-Allow-Origin'
    | 'Access-Control-Expose-Headers'
    | 'Access-Control-Max-Age'
    | 'Access-Control-Request-Headers'
    | 'Access-Control-Request-Method'
    | 'Age'
    | 'Allow'
    | 'Alt-Svc'
    | 'Alt-Used'
    | 'Authorization'
    | 'Cache-Control'
    | 'Clear-Site-Data'
    | 'Connection'
    | 'Content-DPR'
    | 'Content-Disposition'
    | 'Content-Encoding'
    | 'Content-Language'
    | 'Content-Length'
    | 'Content-Location'
    | 'Content-Range'
    | 'Content-Security-Policy'
    | 'Content-Security-Policy-Report-Only'
    | 'Content-Type'
    | 'Cookie'
    | 'Critical-CH'
    | 'Cross-Origin-Embedder-Policy'
    | 'Cross-Origin-Opener-Policy'
    | 'Cross-Origin-Resource-Policy'
    | 'DNT'
    | 'DPR'
    | 'Date'
    | 'Device-Memory'
    | 'Digest'
    | 'Downlink'
    | 'ECT'
    | 'ETag'
    | 'Early-Data'
    | 'Expect'
    | 'Expect-CT'
    | 'Expires'
    | 'Forwarded'
    | 'From'
    | 'Host'
    | 'If-Match'
    | 'If-Modified-Since'
    | 'If-None-Match'
    | 'If-Range'
    | 'If-Unmodified-Since'
    | 'Keep-Alive'
    | 'Large-Allocation'
    | 'Last-Modified'
    | 'Link'
    | 'Location'
    | 'Max-Forwards'
    | 'NEL'
    | 'Origin'
    | 'Origin-Agent-Cluster'
    | 'Permissions-Policy'
    | 'Pragma'
    | 'Proxy-Authenticate'
    | 'Proxy-Authorization'
    | 'RTT'
    | 'Range'
    | 'Referer'
    | 'Referrer-Policy'
    | 'Retry-After'
    | 'Save-Data'
    | 'Sec-CH-Prefers-Color-Scheme'
    | 'Sec-CH-Prefers-Reduced-Motion'
    | 'Sec-CH-Prefers-Reduced-Transparency'
    | 'Sec-CH-UA'
    | 'Sec-CH-UA-Arch'
    | 'Sec-CH-UA-Bitness'
    | 'Sec-CH-UA-Full-Version'
    | 'Sec-CH-UA-Full-Version-List'
    | 'Sec-CH-UA-Mobile'
    | 'Sec-CH-UA-Model'
    | 'Sec-CH-UA-Platform'
    | 'Sec-CH-UA-Platform-Version'
    | 'Sec-Fetch-Dest'
    | 'Sec-Fetch-Mode'
    | 'Sec-Fetch-Site'
    | 'Sec-Fetch-User'
    | 'Sec-GPC'
    | 'Sec-Purpose'
    | 'Sec-WebSocket-Accept'
    | 'Server'
    | 'Server-Timing'
    | 'Service-Worker-Navigation-Preload'
    | 'Set-Cookie'
    | 'Set-Login'
    | 'SourceMap'
    | 'Strict-Transport-Security'
    | 'Supports-Loading-Mode'
    | 'TE'
    | 'Timing-Allow-Origin'
    | 'Tk'
    | 'Trailer'
    | 'Transfer-Encoding'
    | 'Upgrade'
    | 'Upgrade-Insecure-Requests'
    | 'User-Agent'
    | 'Vary'
    | 'Via'
    | 'Viewport-Width'
    | 'WWW-Authenticate'
    | 'Want-Digest'
    | 'Warning'
    | 'Width'
    | 'X-Content-Type-Options'
    | 'X-DNS-Prefetch-Control'
    | 'X-Forwarded-For'
    | 'X-Forwarded-Host'
    | 'X-Forwarded-Proto'
    | 'X-Frame-Options'
    | 'X-XSS-Protection'
type FetchHeaderKeyString = FetchHeaderKey | IncludeString

type Param = string | number
type FetchSearchParamsShape = Record<string, Param | Array<Param>> | unknown
type FetchPathParamsShape = Record<string, Param> | unknown
type FetchModeOptionsShape = {
    isJsonMode: ConcreteBoolean
    isSafeMode: ConcreteBoolean
}
type DefaultFetchModeOptions = {
    isJsonMode: false
    isSafeMode: false
}

type FetchUnitOption = Omit<
    FetchOption,
    'body' | 'method' | 'headers' | 'signal'
>
type FetchQueryOptions<FetchPathParams, FetchSearchParams, FetchBody> =
    OmitNever<{
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
        headers?: FetchHeader
        /**
         * @description Fetch option
         */
        options?: Partial<FetchUnitOption>
        /**
         * @description Timeout for request
         * @example 1000 = `1000ms`
         */
        timeout?: number
        /**
         * @description `AbortSignal` for request
         */
        signal?: AbortSignal | AbortSignal[]
    }

interface FetchQueryOptionsPartial<
    FetchPathParams,
    FetchSearchParams,
    FetchBody,
> {
    path?: FetchPathParams
    search?: FetchSearchParams
    body?: FetchBody
    options?: Partial<FetchUnitOption>
    headers?: FetchHeader
    timeout?: number
    signal?: AbortSignal | AbortSignal[]
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

export type {
    FetchUnitOption,
    FetchQueryOptions,
    FetchQueryOptionsPartial,
    FetchUnitRequestHandler,
    Param,
    FetchSearchParamsShape,
    FetchPathParamsShape,
    FetchModeOptionsShape,
    DefaultFetchModeOptions,
}
