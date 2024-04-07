import type { IncludeString } from '../../utils/types'

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

export class FetchBuilder {
    public method: FetchMethodString = ''
    public setMethod(method: FetchBuilder['method']): FetchBuilder {
        this.method = method
        return this
    }
    public url: FetchUrl = ''
    public setUrl(url: FetchUrl): FetchBuilder {
        this.url = url
        return this
    }
    public cache: FetchOption['cache'] = 'default'
    public setCache(cache: FetchBuilder['cache']): FetchBuilder {
        this.cache = cache
        return this
    }
    public body: FetchOption['body'] = null
    public setBody(body: FetchBuilder['body']): FetchBuilder {
        this.body = body
        return this
    }
    public headers: FetchOption['headers'] & {
        [key in FetchHeaderKeyString]?: string
    } = {}
    public setHeaders(headers: FetchBuilder['headers']): FetchBuilder {
        this.headers = headers
        return this
    }
    public credentials: FetchOption['credentials'] = 'same-origin'
    public setCredentials(
        credentials: FetchBuilder['credentials']
    ): FetchBuilder {
        this.credentials = credentials
        return this
    }
    public redirect: FetchOption['redirect'] = 'follow'
    public setRedirect(redirect: FetchBuilder['redirect']): FetchBuilder {
        this.redirect = redirect
        return this
    }
    public referrer: FetchOption['referrer'] = 'client'
    public setReferrer(referrer: FetchBuilder['referrer']): FetchBuilder {
        this.referrer = referrer
        return this
    }
    public referrerPolicy: FetchOption['referrerPolicy'] = 'no-referrer'
    public setReferrerPolicy(
        referrerPolicy: FetchBuilder['referrerPolicy']
    ): FetchBuilder {
        this.referrerPolicy = referrerPolicy
        return this
    }
    public integrity: FetchOption['integrity'] = ''
    public setIntegrity(integrity: FetchBuilder['integrity']): FetchBuilder {
        this.integrity = integrity
        return this
    }
    public keepalive: FetchOption['keepalive'] = false
    public setKeepalive(keepalive: FetchBuilder['keepalive']): FetchBuilder {
        this.keepalive = keepalive
        return this
    }
    public signal: FetchOption['signal'] = null
    public setSignal(signal: FetchBuilder['signal']): FetchBuilder {
        this.signal = signal
        return this
    }
    public window: FetchOption['window'] = null
    public setWindow(window: FetchBuilder['window']): FetchBuilder {
        this.window = window
        return this
    }
    public mode: FetchOption['mode'] = 'cors'
    public setMode(mode: FetchBuilder['mode']): FetchBuilder {
        this.mode = mode
        return this
    }
    public priority: FetchOption['priority'] = 'auto'
    public setPriority(priority: FetchBuilder['priority']): FetchBuilder {
        this.priority = priority
        return this
    }
    public get defaultFetchOption(): FetchOption {
        return {
            headers: this.headers,
            referrerPolicy: this.referrerPolicy,
            credentials: this.credentials,
            integrity: this.integrity,
            keepalive: this.keepalive,
            referrer: this.referrer,
            redirect: this.redirect,
            method: this.method,
            signal: this.signal,
            window: this.window,
            cache: this.cache,
            mode: this.mode,
            body: this.body,
            priority: this.priority,
        }
    }
}
