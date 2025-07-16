export type NextFunction = (request: Request) => Promise<Response>
export type MiddlewareFunction = (
    request: Request,
    next: NextFunction
) => Promise<Response>

export class Middleware {
    public readonly procedures: Array<MiddlewareFunction> = []

    public copy(): Middleware {
        const newMiddleware = new Middleware()
        newMiddleware.use(this.procedures)
        return newMiddleware
    }

    /**
     * Use middleware
     * @param middleware Target registration middleware
     */
    public use(
        middleware: MiddlewareFunction | Array<MiddlewareFunction>
    ): void {
        if (Array.isArray(middleware)) {
            this.procedures.push(...middleware)
        } else {
            this.procedures.push(middleware)
        }
    }

    public execute(
        initialRequest: Request,
        fetcher: (request: Request) => Promise<Response>
    ): Promise<Response> {
        const chain = this.procedures.reduceRight<NextFunction>(
            (next, middleware) => (request) => middleware(request, next),
            fetcher
        )
        return chain(initialRequest)
    }
}
