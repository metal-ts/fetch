import { IncludeString } from '../../utils/types'

export type FetchUrl = Parameters<typeof fetch>[0]
export type FetchOption = Required<RequestInit>
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
export type FetchHeader = FetchOption['headers'] & {
    [key in FetchHeaderKeyString]?: string
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

export class FetchOptionStore {
    public get options(): FetchOption {
        return {
            cache: this.cache,
            body: this.body,
            headers: this.headers,
            mode: this.mode,
            credentials: this.credentials,
            redirect: this.redirect,
            referrer: this.referrer,
            referrerPolicy: this.referrerPolicy,
            integrity: this.integrity,
            keepalive: this.keepalive,
            signal: this.signal,
            window: this.window,
            priority: this.priority,
            method: this.method,
        }
    }

    public copy(): FetchOptionStore {
        const copy = new FetchOptionStore()
        copy.url = this.url
        copy.method = this.method
        copy.cache = this.cache
        copy.body = this.body
        copy.headers = this.headers
        copy.mode = this.mode
        copy.credentials = this.credentials
        copy.redirect = this.redirect
        copy.referrer = this.referrer
        copy.referrerPolicy = this.referrerPolicy
        copy.integrity = this.integrity
        copy.keepalive = this.keepalive
        copy.signal = this.signal
        copy.window = this.window
        copy.priority = this.priority
        return copy
    }

    /*
     * URL
     */
    private _url: FetchUrl | null = null
    public defaultUrl: FetchUrl = ''
    public get url(): FetchUrl {
        return this._url ?? this.defaultUrl
    }
    public set url(value: FetchUrl) {
        this._url = value
    }

    /*
     * Method
     */
    private _method: FetchMethod | null = null
    public defaultMethod: FetchMethod = 'GET'
    public get method(): FetchMethod {
        return this._method ?? this.defaultMethod
    }
    public set method(value: FetchMethod) {
        this._method = value
    }

    /*
     * Cache
     */
    private _cache: FetchOption['cache'] | null = null
    public defaultCache: FetchOption['cache'] = 'default'
    public get cache(): FetchOption['cache'] {
        return this._cache ?? this.defaultCache
    }
    public set cache(value: FetchOption['cache']) {
        this._cache = value
    }

    /*
     * Body
     */
    private _body: FetchOption['body'] | null = null
    public defaultBody: FetchOption['body'] = null
    public get body(): FetchOption['body'] {
        return this._body ?? this.defaultBody
    }
    public set body(value: FetchOption['body']) {
        this._body = value
    }

    /*
     * Headers
     *
     * NOTE: The original code merges incoming headers with the existing state.
     *       That logic is preserved here, but we still add a defaultHeaders property.
     */
    private _headers: FetchHeader | null = null
    public defaultHeaders: FetchHeader = {}
    public get headers(): FetchHeader {
        // If _headers is null, return defaultHeaders
        return this._headers ?? this.defaultHeaders
    }
    public set headers(value: FetchHeader) {
        // Merge new headers into the existing ones
        this._headers = {
            ...this.headers,
            ...value,
        } as FetchHeader
    }

    /*
     * Mode
     */
    private _mode: FetchOption['mode'] | null = null
    public defaultMode: FetchOption['mode'] = 'cors'
    public get mode(): FetchOption['mode'] {
        return this._mode ?? this.defaultMode
    }
    public set mode(value: FetchOption['mode']) {
        this._mode = value
    }

    /*
     * Credentials
     */
    private _credentials: FetchOption['credentials'] | null = null
    public defaultCredentials: FetchOption['credentials'] = 'same-origin'
    public get credentials(): FetchOption['credentials'] {
        return this._credentials ?? this.defaultCredentials
    }
    public set credentials(value: FetchOption['credentials']) {
        this._credentials = value
    }

    /*
     * Redirect
     */
    private _redirect: FetchOption['redirect'] | null = null
    public defaultRedirect: FetchOption['redirect'] = 'follow'
    public get redirect(): FetchOption['redirect'] {
        return this._redirect ?? this.defaultRedirect
    }
    public set redirect(value: FetchOption['redirect']) {
        this._redirect = value
    }

    /*
     * Referrer
     */
    private _referrer: FetchOption['referrer'] | null = null
    public defaultReferrer: FetchOption['referrer'] = 'client'
    public get referrer(): FetchOption['referrer'] {
        return this._referrer ?? this.defaultReferrer
    }
    public set referrer(value: FetchOption['referrer']) {
        this._referrer = value
    }

    /*
     * Referrer Policy
     */
    private _referrerPolicy: FetchOption['referrerPolicy'] | null = null
    public defaultReferrerPolicy: FetchOption['referrerPolicy'] =
        'no-referrer-when-downgrade'
    public get referrerPolicy(): FetchOption['referrerPolicy'] {
        return this._referrerPolicy ?? this.defaultReferrerPolicy
    }
    public set referrerPolicy(value: FetchOption['referrerPolicy']) {
        this._referrerPolicy = value
    }

    /*
     * Integrity
     */
    private _integrity: FetchOption['integrity'] | null = null
    public defaultIntegrity: FetchOption['integrity'] = ''
    public get integrity(): FetchOption['integrity'] {
        return this._integrity ?? this.defaultIntegrity
    }
    public set integrity(value: FetchOption['integrity']) {
        this._integrity = value
    }

    /*
     * Keepalive
     */
    private _keepalive: FetchOption['keepalive'] | null = null
    public defaultKeepalive: FetchOption['keepalive'] = false
    public get keepalive(): FetchOption['keepalive'] {
        return this._keepalive ?? this.defaultKeepalive
    }
    public set keepalive(value: FetchOption['keepalive']) {
        this._keepalive = value
    }

    /*
     * Signal
     */
    private _signal: FetchOption['signal'] | null = null
    public defaultSignal: FetchOption['signal'] = null
    public get signal(): FetchOption['signal'] {
        return this._signal ?? this.defaultSignal
    }
    public set signal(value: FetchOption['signal']) {
        this._signal = value
    }

    /*
     * Window
     */
    private _window: FetchOption['window'] | null = null
    public defaultWindow: FetchOption['window'] = null
    public get window(): FetchOption['window'] {
        return this._window ?? this.defaultWindow
    }
    public set window(value: FetchOption['window']) {
        this._window = value
    }

    /*
     * Priority
     */
    private _priority: FetchOption['priority'] | null = null
    public defaultPriority: FetchOption['priority'] = 'auto'
    public get priority(): FetchOption['priority'] {
        return this._priority ?? this.defaultPriority
    }
    public set priority(value: FetchOption['priority']) {
        this._priority = value
    }
}
