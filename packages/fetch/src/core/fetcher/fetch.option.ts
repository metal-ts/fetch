import type {
    FetchHeader,
    FetchMethod,
    FetchOption,
    FetchUrl,
} from './core.type'

export class FetchOptionStore {
    public get options(): FetchOption {
        return {
            signal: null,
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
            window: this.window,
            priority: this.priority,
            method: this.method,
        }
    }

    public copy(): FetchOptionStore {
        const newStore = new FetchOptionStore()
        Object.assign(newStore, this)
        return newStore
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
    public defaultReferrer: FetchOption['referrer'] = 'about:client'
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
