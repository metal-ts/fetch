import { t } from '@metal-box/type'
import { describe, expect, it, vi } from 'vitest'
import { f } from '..'
import { FetchBuilder } from '../core/fetcher'
import { FetchUnit } from '../core/fetcher/unit'

describe('FetchBuilder', () => {
    it('should create a new FetchBuilder instance', () => {
        const b = f.builder()
        expect(b).toBeInstanceOf(FetchBuilder)
    })

    it('should set the method', () => {
        const b = f.builder().def_method('POST')
        expect(b.$store.method).toBe('POST')
    })

    it('should set the base URL', () => {
        const url = 'https://api.test.com'
        const b = f.builder().def_url(url)
        expect(b.$store.defaultUrl).toBe(url)
    })

    it('should set json mode', () => {
        const b = f.builder().def_json()
        expect(b.isJsonMode).toBe(true)
    })

    it('should build a FetchUnit', () => {
        const unit = f.builder().build()
        expect(unit).toBeInstanceOf(FetchUnit)
    })

    it('should define a body validator', () => {
        const bodySchema = t.object({ name: t.string })
        const b = f.builder().def_body(bodySchema.parse)
        const testBody = { name: 'test' }
        expect(b.bodyValidator(testBody)).toEqual(testBody)
        expect(() => b.bodyValidator({ name: 123 })).toThrow()
    })

    it('should be immutable', () => {
        const originalBuilder = f
            .builder()
            .def_method('GET')
            .def_url('https://a.com')
        const modifiedBuilder = originalBuilder.def_method('POST')

        expect(originalBuilder.$store.method).toBe('GET')
        expect(modifiedBuilder.$store.method).toBe('POST')
        expect(originalBuilder.$store.defaultUrl).toBe('https://a.com')
        expect(modifiedBuilder.$store.defaultUrl).toBe('https://a.com')
    })

    it('should handle request handler modification', async () => {
        const fetchUnit = f
            .builder()
            .def_url('https://api.com')
            .def_request_handler(({ request }) => {
                if (request instanceof Request) {
                    request.headers.set('X-Test', 'true')
                }
                return request
            })
            .build()

        const mockFetch = vi
            .spyOn(global, 'fetch')
            .mockImplementation(async (req) => {
                if (req instanceof Request) {
                    expect(req.headers.get('X-Test')).toBe('true')
                } else {
                    throw new Error('Expected a Request object')
                }
                return new Response('OK')
            })

        await fetchUnit.query()
        expect(mockFetch).toHaveBeenCalledOnce()
        mockFetch.mockRestore()
    })
})
