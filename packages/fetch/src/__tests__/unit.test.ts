import { Infer, t } from '@metal-box/type'
import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { TypeEqual, expectType } from 'ts-expect'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { f } from '..'
import { FetchPathParamsError, FetchResponseError } from '../core/error'
import { FetchUnit, type InferFetchUnit } from '../core/fetcher/unit'
import { label } from './utils/test.label'

const BASE_URL = 'https://unit-api/v2' as const
const apiServer = setupServer(
    ...[
        http.post(`${BASE_URL}/books/images`, async ({ request }) => {
            const bodyBlob = await request.blob()
            const formData = new FormData()
            formData.append('file', bodyBlob)
            formData.append('name', 'Book')

            return HttpResponse.formData(formData)
        }),

        http.post(`${BASE_URL}/books`, async ({ request }) => {
            const body = await request.json()
            return HttpResponse.json({
                data: body,
                status: 'success',
            })
        }),

        http.get(`${BASE_URL}/books`, () => {
            return HttpResponse.json('Not Found', {
                status: 404,
            })
        }),

        http.get(`${BASE_URL}/books/:id`, ({ params, request }) => {
            const id = params.id
            const searchParams = new URL(request.url).searchParams
            const name = searchParams.get('name')
            const price = searchParams.get('price')
            return HttpResponse.json({
                data: {
                    name,
                    price,
                    id: id,
                },
                status: 'success',
            })
        }),

        http.get('https://unknown.com/', async () => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(HttpResponse.json({}))
                }, 15)
            })
        }),
    ]
)

beforeAll(() => apiServer.listen({ onUnhandledRequest: 'error' }))
afterAll(() => apiServer.close())
afterEach(() => apiServer.resetHandlers())

describe('FetchUnit', () => {
    it(label.case('should CREATE a new instance'), () => {
        const fetchUnit = f.builder().build()
        expect(fetchUnit).toBeInstanceOf(FetchUnit)
    })

    it(label.case('should SET fetch error procedure'), () => {
        const fetchUnit = f.builder()
        const result = fetchUnit.def_fetch_err_handler(({ error, status }) => {
            // eslint-disable-next-line no-console
            console.error(error, status)
        })

        expect(fetchUnit).not.toBe(result)
        expect(fetchUnit.fetchErrorProcedure.procedures).toHaveLength(0)
        expect(result.fetchErrorProcedure.procedures).toHaveLength(1)
    })

    it(label.case('should SET unknown error procedure'), () => {
        const fetchUnit = f.builder()
        const result = fetchUnit.def_unknown_err_handler(({ error }) => {
            // eslint-disable-next-line no-console
            console.error(error)
        })

        expect(fetchUnit).not.toBe(result)
        expect(fetchUnit.unknownErrorProcedure.procedures).toHaveLength(0)
        expect(result.unknownErrorProcedure.procedures).toHaveLength(1)
    })

    it(label.case('should SET finally procedure'), () => {
        const fetchUnit = f.builder()
        const result = fetchUnit.def_final_handler((info) => {
            // eslint-disable-next-line no-console
            console.log('FETCH_INFO', info)
        })

        expect(fetchUnit).not.toBe(result)
        expect(fetchUnit.finallyProcedure.procedures).toHaveLength(0)
        expect(result.finallyProcedure.procedures).toHaveLength(1)
    })

    it(label.case('should SET request procedure'), () => {
        const fetchUnit = f.builder()
        const result = fetchUnit.def_request_handler(({ request }) => {
            request.headers.set('Authorization', 'Bearer token')
            return request
        })

        expect(fetchUnit).not.toBe(result)
    })

    it(label.case('should SET json mode for automatic parsing'), () => {
        const fetchUnit = f.builder()
        const result = fetchUnit.def_json().build()

        type InjectedFetchUnit = FetchUnit<
            string,
            unknown,
            unknown,
            unknown,
            unknown,
            {
                isJsonMode: true
                isSafeMode: false
            },
            ''
        >
        expectType<InjectedFetchUnit>(result)
    })

    it(label.case('should SET credentials'), () => {
        const fetchUnit = f.builder()
        const credentials = 'same-origin'
        const result = fetchUnit.def_default_credentials(credentials)

        expect(fetchUnit).not.toBe(result)
        expect(result.$store.defaultCredentials).toBe(credentials)
    })

    it(label.case('should SET redirect'), () => {
        const fetchUnit = f.builder()
        const redirect = 'follow'
        const result = fetchUnit.def_default_redirect(redirect)

        expect(fetchUnit).not.toBe(result)
        expect(result.$store.defaultRedirect).toBe(redirect)
    })

    it(label.case('should SET referrer'), () => {
        const fetchUnit = f.builder()
        const referrer = 'client'
        const result = fetchUnit.def_default_referrer(referrer)

        expect(fetchUnit).not.toBe(result)
        expect(result.$store.defaultReferrer).toBe(referrer)
    })

    it(label.case('should SET referrer policy'), () => {
        const fetchUnit = f.builder()
        const referrerPolicy = 'no-referrer'
        const result = fetchUnit.def_default_referrer_policy(referrerPolicy)

        expect(fetchUnit).not.toBe(result)
        expect(result.$store.defaultReferrerPolicy).toBe(referrerPolicy)
    })

    it(label.case('should SET integrity'), () => {
        const fetchUnit = f.builder()
        const integrity = 'sha256-abcde'
        const result = fetchUnit.def_default_integrity(integrity)

        expect(fetchUnit).not.toBe(result)
        expect(result.$store.defaultIntegrity).toBe(integrity)
    })

    it(label.case('should SET keepalive'), () => {
        const fetchUnit = f.builder()
        const keepalive = true
        const result = fetchUnit.def_default_keepalive(keepalive)

        expect(fetchUnit).not.toBe(result)
        expect(result.$store.defaultKeepalive).toBe(keepalive)
    })

    it(label.case('should SET window'), () => {
        const fetchUnit = f.builder()
        const window = null
        const result = fetchUnit.def_default_window(window)

        expect(fetchUnit).not.toBe(result)
        expect(result.$store.defaultWindow).toBe(window)
    })

    it(label.case('should SET mode'), () => {
        const fetchUnit = f.builder()
        const mode = 'cors'
        const result = fetchUnit.def_default_mode(mode)

        expect(fetchUnit).not.toBe(result)
        expect(result.$store.defaultMode).toBe(mode)
    })

    it(label.case('should SET cache'), () => {
        const fetchUnit = f.builder()
        const cache = 'default'
        const result = fetchUnit.def_default_cache(cache)

        expect(fetchUnit).not.toBe(result)
        expect(result.$store.defaultCache).toBe(cache)
    })

    it(label.case('should SET safe mode'), () => {
        const fetchUnit = f.builder()
        const result = fetchUnit.def_query_mode('not_throw').build()

        type InjectedFetchUnit = FetchUnit<
            string,
            unknown,
            unknown,
            unknown,
            unknown,
            {
                isJsonMode: false
                isSafeMode: true
            },
            ''
        >
        expectType<InjectedFetchUnit>(result)
    })

    it(label.case('should DEFINE search params shape'), () => {
        const fetchUnit = f.builder()
        const SearchParams = t
            .object({
                name: t.string,
                category: t.string,
            })
            .transform((e) => ({
                name: e.name,
                category: e.category,
                text_length: e.name.length + e.category.length,
            }))

        const result = fetchUnit.def_searchparams(SearchParams.parse).build()

        type InjectedFetchUnit = FetchUnit<
            string,
            unknown,
            Infer<typeof SearchParams>,
            unknown,
            unknown,
            {
                isJsonMode: false
                isSafeMode: false
            },
            ''
        >
        expectType<InjectedFetchUnit>(result)
    })

    it(label.case('should DEFINE body shape'), () => {
        const fetchUnit = f.builder()
        const BookRequest = t.object({
            name: t.string,
            category: t.string,
            price: t.number,
        })

        const result = fetchUnit.def_body(BookRequest.parse).build()

        type InjectedFetchUnit = FetchUnit<
            string,
            unknown,
            unknown,
            Infer<typeof BookRequest>,
            unknown,
            {
                isJsonMode: false
                isSafeMode: false
            },
            ''
        >
        expectType<InjectedFetchUnit>(result)
    })

    it(label.case('should DEFINE search params'), async () => {
        const SearchParams = t.object({
            name: t.string,
            price: t.number,
        })

        const BookResponse = t
            .object({
                data: t.object({
                    name: t.string,
                    price: t.string,
                    id: t.string,
                }),
                status: t.literal('success'),
            })
            .transform((e) => ({
                ...e,
                data: {
                    ...e.data,
                    id: Number(e.data.id),
                    price: Number(e.data.price),
                },
            }))

        const postDynamicUnit = f
            .builder()
            .def_method('GET')
            // DYNAMIC path params: $id
            .def_url(`${BASE_URL}/books/$id`)
            .def_query_mode('throw')
            .def_default_referrer('about:client')
            .def_json()
            .def_searchparams(SearchParams.parse)
            .def_response(async ({ json }) => BookResponse.parse(await json()))
            .build()

        const searchParams = {
            name: 'Harry Potter',
            price: 10,
        }
        const searchId = 123
        const apiResponse = await postDynamicUnit.query({
            search: searchParams,

            //@ts-ignore
            path: {
                id: searchId,
            },
        })
        expect(apiResponse).toStrictEqual({
            data: {
                ...searchParams,
                id: searchId,
            },
            status: 'success',
        })
    })

    it(
        label.case('should DEFINE response shape [json mode - activated]'),
        () => {
            const fetchUnit = f.builder().def_json()

            const Product = t.object({
                name: t.string,
                price: t.number,
            })
            const result = fetchUnit
                .def_response(({ json }) => Product.parse(json))
                .build()

            type InjectedFetchUnit = FetchUnit<
                string,
                unknown,
                unknown,
                unknown,
                Infer<typeof Product>,
                {
                    isJsonMode: true
                    isSafeMode: false
                },
                ''
            >

            expectType<InjectedFetchUnit>(result)
        }
    )

    it(
        label.case('should DEFINE response shape [json mode - deactivated]'),
        async () => {
            const fetchUnit = f.builder().def_json()

            const Product = t.object({
                name: t.string,
                price: t.number,
            })
            const result = fetchUnit
                .def_response(async ({ json }) => {
                    // Manual parsing for json response
                    const product = Product.parse(await json())
                    return product
                })
                .build()

            type InjectedFetchUnit = FetchUnit<
                string,
                unknown,
                unknown,
                unknown,
                Infer<typeof Product>,
                {
                    isJsonMode: true
                    isSafeMode: false
                },
                ''
            >

            expectType<InjectedFetchUnit>(result)
        }
    )

    it(label.case('should QUERY json with [strict mode]'), async () => {
        const Body = t.object({
            name: t.string,
            category: t.string,
            price: t.number,
        })
        const ApiResponse = t.object({
            data: Body,
            status: t.union(t.literal('success'), t.literal('error')),
            'message?': t.string,
        })
        const postUnit = f
            .builder()
            .def_query_mode('throw')
            .def_method('POST')
            .def_default_referrer('about:client')
            .def_url(`${BASE_URL}/books`)
            .def_json()
            .def_body(Body.parse)
            .def_response(async ({ json }) => ApiResponse.parse(await json()))
            .build()

        type PostUnit = FetchUnit<
            'POST',
            unknown,
            unknown,
            Infer<typeof Body>,
            Infer<typeof ApiResponse>,
            {
                isJsonMode: true
                isSafeMode: false
            },
            'https://unit-api/v2/books'
        >
        expectType<PostUnit>(postUnit)
        expectType<
            TypeEqual<
                InferFetchUnit<typeof postUnit>,
                {
                    method: 'POST'
                    url: 'https://unit-api/v2/books'
                    body: Infer<typeof Body>
                    response: Infer<typeof ApiResponse>
                    mode: {
                        isJson: true
                        isSafeFetch: false
                    }
                }
            >
        >(true)

        const body = {
            name: 'Book',
            category: 'Fiction',
            price: 100,
        }
        const apiResponse = await postUnit.query({
            body,
        })
        expect(apiResponse).toStrictEqual({
            data: body,
            status: 'success',
        })
    })

    it(label.case('should QUERY formData with [strict mode]'), async () => {
        const BlobShape = t.custom<'Blob', Blob>(
            'Blob',
            (e) => e instanceof Blob
        )

        const toJson = async (e: FormData) => {
            const title = t.string.parse(e.get('name'))
            const file = e.get('file')
            const text = await BlobShape.parse(file).text()
            return {
                name: title,
                file: text,
            }
        }

        const FormDataShape = t
            .custom<
                'FormData',
                FormData
            >('FormData', (e) => e instanceof FormData)
            .transform(toJson)

        const fetchUnit = f
            .builder()
            .def_query_mode('throw')
            .def_method('POST')
            .def_default_referrer('about:client')
            .def_url(`${BASE_URL}/books/images`)
            .def_body(BlobShape.parse)
            .def_response(async ({ response }) =>
                FormDataShape.parse(await response.formData())
            )
            .build()

        const passingBodyBlob = new Blob(['Hello, World!'], {
            type: 'text/plain',
        })
        const apiResponse = await fetchUnit.query({
            body: passingBodyBlob,
        })

        const expectedFormData = new FormData()
        expectedFormData.append('name', 'Book')
        expectedFormData.append('file', passingBodyBlob)
        const res = await toJson(expectedFormData)

        expect(apiResponse).toStrictEqual(res)
    })

    it(label.case('should HANDLE fetch error & handled once'), async () => {
        let isFetchErrorHandled = false
        let errorStatusCode: number | undefined

        const fetchUnit = f
            .builder()
            .def_query_mode('throw')
            .def_method('GET')
            .def_default_referrer('about:client')
            .def_url(`${BASE_URL}/books`)
            .def_json()
            .def_fetch_err_handler(() => {
                isFetchErrorHandled = true
            }, true)
            .def_fetch_err_handler(({ status }) => {
                errorStatusCode = status
            })
            .build()

        try {
            await fetchUnit.query()
        } catch (error) {
            expect(error).toBeInstanceOf(FetchResponseError)
            if (error instanceof FetchResponseError) {
                expect(error.status).toBe(errorStatusCode)
                expect(error.statusMessage).toBe('Not Found')
            }
            expect(isFetchErrorHandled).toBe(true)
            isFetchErrorHandled = false
        }

        try {
            await fetchUnit.query()
        } catch (error) {
            expect(error).toBeInstanceOf(FetchResponseError)
            if (error instanceof FetchResponseError) {
                expect(error.status).toBe(errorStatusCode)
                expect(error.statusMessage).toBe('Not Found')
            }
            expect(isFetchErrorHandled).toBe(false)
        }
    })

    it(label.case('should HANDLE unknown error & handled once'), async () => {
        let errorHandled = false

        const fetchUnit = f
            .builder()
            .def_query_mode('throw')
            .def_method('GET')
            .def_default_referrer('about:client')
            .def_url('https://unknown.com')
            .def_json()
            .def_unknown_err_handler(() => {
                // ERROR_HANDLED should be called only once
                errorHandled = true
            }, true)
            .def_unknown_err_handler(() => {
                // LOGGER should be called every time
                // eslint-disable-next-line no-console
                console.log('ERROR_HANDLED', errorHandled)
            })
            .build()

        await fetchUnit.query()
        expect(errorHandled).toBe(false)
    })

    it(label.case('should ABORT request with timeout'), async () => {
        const fetchUnit = f.builder().def_url('https://unknown.com').build()
        await expect(fetchUnit.query({ timeout: 1 })).rejects.toThrowError(
            'The operation was aborted due to timeout'
        )
    })

    it(label.case('should ABORT request with single signal'), async () => {
        const fetchUnit = f.builder().def_url('https://unknown.com').build()
        const controller = new AbortController()
        setTimeout(() => controller.abort(), 1)
        await expect(
            fetchUnit.query({ signal: controller.signal })
        ).rejects.toThrowError('This operation was aborted')
    })

    it(label.case('should ABORT request with multiple signals'), async () => {
        const fetchUnit = f.builder().def_url('https://unknown.com').build()
        const controller1 = new AbortController()
        const controller2 = new AbortController()
        setTimeout(() => controller1.abort(), 1)
        await expect(
            fetchUnit.query({
                signal: [controller1.signal, controller2.signal],
            })
        ).rejects.toThrowError('This operation was aborted')
    })

    it(label.case('should ABORT request with timeout and signal'), async () => {
        const fetchUnit = f.builder().def_url('https://unknown.com').build()
        const controller = new AbortController()
        await expect(
            fetchUnit.query({ timeout: 1, signal: controller.signal })
        ).rejects.toThrowError('The operation was aborted due to timeout')
    })

    it(
        label.case(
            'should HANDLE path param error on invalid dynamic path param structure'
        ),
        () => {
            try {
                f.builder().def_url(`${BASE_URL}/books/_$id`).build()
            } catch (e) {
                expect(e).toBeInstanceOf(FetchPathParamsError)
            }
        }
    )
})
