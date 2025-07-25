import type {
    FetchPathParamsShape,
    FetchSearchParamsShape,
} from '../fetcher/core.type'

class FetchError extends Error {
    public static formatMessage(
        errorType: string,
        message: string,
        response?: Response
    ): string {
        return response
            ? `\n› ${errorType}: ${message}\n› Response: ${FetchError.formatJson(
                  response
              )}`
            : `\n› ${errorType}: ${message}`
    }

    public static formatJson(json: unknown): string {
        return JSON.stringify(json, null, 2)
    }

    public constructor(
        errorType: string,
        message: string,
        public readonly response?: Response,
        cause?: unknown
    ) {
        super(FetchError.formatMessage(errorType, message, response), {
            cause: cause,
        })
    }
}

export class FetchSearchParamsError extends FetchError {
    public constructor(
        public readonly basePath: string,
        public readonly searchParams: FetchSearchParamsShape,
        cause?: unknown
    ) {
        super(
            'Search Params',
            `${FetchError.formatJson(searchParams)} at ${basePath}`,
            undefined,
            cause
        )
    }
}

export class FetchPathParamsError extends FetchError {
    public constructor(
        public readonly basePath: string,
        public readonly pathParams: FetchPathParamsShape,
        cause?: unknown
    ) {
        super(
            'Path Params',
            `${FetchError.formatJson(pathParams)} at ${basePath}`,
            undefined,
            cause
        )
    }
}

export type FetchErrorCode =
    | 400 // Bad Request
    | 401 // Unauthorized
    | 402 // Payment Required
    | 403 // Forbidden
    | 404 // Not Found
    | 405 // Method Not Allowed
    | 406 // Not Acceptable
    | 407 // Proxy Authentication Required
    | 408 // Request Timeout
    | 409 // Conflict
    | 410 // Gone
    | 411 // Length Required
    | 412 // Precondition Failed
    | 413 // Payload Too Large
    | 414 // URI Too Long
    | 415 // Unsupported Media Type
    | 416 // Range Not Satisfiable
    | 417 // Expectation Failed
    | 418 // I'm a teapot
    | 421 // Misdirected Request
    | 422 // Unprocessable Entity
    | 423 // Locked
    | 424 // Failed Dependency
    | 425 // Too Early
    | 426 // Upgrade Required
    | 428 // Precondition Required
    | 429 // Too Many Requests
    | 431 // Request Header Fields Too Large
    | 451 // Unavailable For Legal Reasons
    | 500 // Internal Server Error
    | 501 // Not Implemented
    | 502 // Bad Gateway
    | 503 // Service Unavailable
    | 504 // Gateway Timeout
    | 505 // HTTP Version Not Supported
    | 506 // Variant Also Negotiates
    | 507 // Insufficient Storage
    | 508 // Loop Detected
    | 510 // Not Extended
    | 511 // Network Authentication Required

export class FetchResponseError extends FetchError {
    private static statusMessage(response: Response): string {
        return `Error Code - ${response.status}\n› ${response.statusText}`
    }

    public status: FetchErrorCode
    public statusMessage: string

    public constructor(public override readonly response: Response) {
        super(
            'Fetch Response',
            FetchResponseError.statusMessage(response),
            response
        )
        this.status = response.status as FetchErrorCode
        this.statusMessage = response.statusText
    }
}
