import { Procedure } from './procedure'

interface MiddlewareHandler<Req, Res> {
    req: Req
    res: Res
    next: (middlewareNext?: { req?: Req; res?: Res }) => void
}

interface MiddlewareProcedure<Req, Res> {
    req: Req
    res: Res
    next?: MiddlewareNext<Req, Res>
}

type MiddlewareNext<Req, Res> = (
    nextArgument: MiddlewareProcedure<Req, Res>
) => void

export class Middleware<Request, Response> {
    private procedure: MiddlewareNext<Request, Response> | undefined

    public use(
        middleware: Array<Procedure<MiddlewareHandler<Request, Response>>>
    ): void {
        this.procedure = ({
            req: baseReq,
            res: baseRes,
        }: MiddlewareProcedure<Request, Response>) => {
            let procedurePointer = 0

            const next: MiddlewareHandler<Request, Response>['next'] = (
                nextArgs
            ) => {
                procedurePointer++
                middleware[procedurePointer]?.({
                    req: nextArgs?.req ?? baseReq,
                    res: nextArgs?.res ?? baseRes,
                    next,
                })
            }

            middleware[0]?.({
                req: baseReq,
                res: baseRes,
                next,
            })
        }
    }

    public execute(req: Request, res: Response): void {
        this.procedure?.({
            req,
            res,
        })
    }
}
