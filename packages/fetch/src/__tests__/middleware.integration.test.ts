import { describe, expect, it, vi } from 'vitest'
import { f } from '..'

describe('Middleware Integration', () => {
    it('should run middleware and modify request headers', async () => {
        const TOKEN = 'token'
        const middleware = new f.Middleware()

        middleware.use(async (req, next) => {
            req.headers.set('Authorization', TOKEN)
            return next(req)
        })

        const fetchBuilder = f
            .builder()
            .def_method('GET')
            .def_url('https://api.com')
            .def_middleware(middleware.procedures[0]!)

        const fetchUnit = fetchBuilder.build()

        const mockFetch = vi
            .spyOn(global, 'fetch')
            .mockImplementation(async (req) => {
                if (req instanceof Request) {
                    expect(req.headers.get('Authorization')).toBe(TOKEN)
                } else {
                    throw new Error('Expected a Request object')
                }
                return new Response('OK', { status: 200 })
            })

        await fetchUnit.query()

        expect(mockFetch).toHaveBeenCalledOnce()
        mockFetch.mockRestore()
    })

    it('should run middleware and modify the response', async () => {
        const middleware = new f.Middleware()

        middleware.use(async (req, next) => {
            const response = await next(req)
            response.headers.set('X-Middleware-Handled', 'true')
            return response
        })

        const fetchUnit = f
            .builder()
            .def_method('GET')
            .def_url('https://api.com')
            .def_middleware(middleware.procedures[0]!)
            .def_response(async ({ response }) => {
                expect(response.headers.get('X-Middleware-Handled')).toBe(
                    'true'
                )
                return response.text()
            })
            .build()

        const mockFetch = vi
            .spyOn(global, 'fetch')
            .mockImplementation(async () => new Response('OK'))

        await fetchUnit.query()
        expect(mockFetch).toHaveBeenCalledOnce()
        mockFetch.mockRestore()
    })
})
