import { describe, expect, it } from 'vitest'
import { f } from '..'
import { label } from './utils/test.label'

describe(label.unit('middleware'), () => {
    it(label.case('should execute middleware in order'), async () => {
        const middleware = new f.Middleware()
        const executionOrder: number[] = []

        middleware.use(async (req, next) => {
            executionOrder.push(1)
            const response = await next(req)
            executionOrder.push(6)
            return response
        })

        middleware.use(async (req, next) => {
            executionOrder.push(2)
            const response = await next(req)
            executionOrder.push(5)
            return response
        })

        middleware.use(async (req, next) => {
            executionOrder.push(3)
            const response = await next(req)
            executionOrder.push(4)
            return response
        })

        const mockFetcher = async (req: Request) => new Response('ok')
        await middleware.execute(new Request('https://test.com'), mockFetcher)

        expect(executionOrder).toEqual([1, 2, 3, 4, 5, 6])
    })
})
