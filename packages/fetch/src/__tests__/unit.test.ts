import { Infer, t } from '@metal-box/type'
import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { TypeEqual, expectType } from 'ts-expect'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
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

        http.get<{
            id: string
        }>(`${BASE_URL}/books/:id`, ({ params, request }) => {
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
    ]
)

beforeAll(() => apiServer.listen({ onUnhandledRequest: 'error' }))
afterAll(() => apiServer.close())
afterEach(() => apiServer.resetHandlers())

describe('FetchUnit', () => {
    it(label.case('should CREATE a new instance'), () => {
        const fetchUnit = FetchUnit.Create()
        expect(fetchUnit).toBeInstanceOf(FetchUnit)
    })

    it(label.case('should SET fetch error procedure'), () => {
        const fetchUnit = FetchUnit.Create()
        const result = fetchUnit
            .handle_fetch_error(({ error, status }) => {
                // eslint-disable-next-line no-console
                console.error(error, status)
            })
            .handle_fetch_error(({ error, status }) => {
                // eslint-disable-next-line no-console
                console.error(error, status)
            })

        expect(fetchUnit).toBe(result)
    })

    it(label.case('should SET unknown error procedure'), () => {
        const fetchUnit = FetchUnit.Create()
        const result = fetchUnit
            .handle_unknown_error(({ error }) => {
                // eslint-disable-next-line no-console
                console.error(error)
            })
            .handle_unknown_error(({ error }) => {
                // eslint-disable-next-line no-console
                console.error(error)
            })
        expect(fetchUnit).toBe(result)
    })

    it(label.case('should SET finally procedure'), () => {
        const fetchUnit = FetchUnit.Create()
        const result = fetchUnit
            .handle_finally(({ headers }) => {
                // eslint-disable-next-line no-console
                console.log('HEADERS', headers)
            })
            .handle_finally((info) => {
                // eslint-disable-next-line no-console
                console.log('FETCH_INFO', info)
            })
        expect(fetchUnit).toBe(result)
    })

    it(label.case('should SET request procedure'), () => {
        const fetchUnit = FetchUnit.Create()
        const result = fetchUnit
            .handle_request(({ request, queryOptions }) => {
                // eslint-disable-next-line no-console
                console.log('REQUEST', request, queryOptions)
                return request
            })
            .handle_request(({ request }) => {
                request.headers.set('Authorization', 'Bearer token')
                return request
            })

        expect(fetchUnit).toBe(result)
    })

    it(label.case('should SET json mode for automatic parsing'), () => {
        const fetchUnit = FetchUnit.Create()
        const result = fetchUnit.set_json()
        expect(fetchUnit).toBe(result)

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

    it(label.case('should SET body'), () => {
        const fetchUnit = FetchUnit.Create()
        const body = {
            name: 'Book',
            category: 'Fiction',
            price: 100,
        }
        const result = fetchUnit.set_body(body)
        expect(fetchUnit).toBe(result)
    })

    it(label.case('should SET headers'), () => {
        const fetchUnit = FetchUnit.Create()
        const headers = {
            'Content-Type': 'application/json',
        }
        const result = fetchUnit.set_headers(headers)
        expect(fetchUnit).toBe(result)
    })

    it(label.case('should SET credentials'), () => {
        const fetchUnit = FetchUnit.Create()
        const credentials = 'same-origin'
        const result = fetchUnit.set_credentials(credentials)
        expect(fetchUnit).toBe(result)
    })

    it(label.case('should SET redirect'), () => {
        const fetchUnit = FetchUnit.Create()
        const redirect = 'follow'
        const result = fetchUnit.set_redirect(redirect)
        expect(fetchUnit).toBe(result)
    })

    it(label.case('should SET referrer'), () => {
        const fetchUnit = FetchUnit.Create()
        const referrer = 'client'
        const result = fetchUnit.set_referrer(referrer)
        expect(fetchUnit).toBe(result)
    })

    it(label.case('should SET referrer policy'), () => {
        const fetchUnit = FetchUnit.Create()
        const referrerPolicy = 'no-referrer'
        const result = fetchUnit.set_referrer_policy(referrerPolicy)
        expect(fetchUnit).toBe(result)
    })

    it(label.case('should SET integrity'), () => {
        const fetchUnit = FetchUnit.Create()
        const integrity = 'sha256-abcde'
        const result = fetchUnit.set_integrity(integrity)
        expect(fetchUnit).toBe(result)
    })

    it(label.case('should SET keepalive'), () => {
        const fetchUnit = FetchUnit.Create()
        const keepalive = true
        const result = fetchUnit.set_keepalive(keepalive)
        expect(fetchUnit).toBe(result)
    })

    it(label.case('should SET signal'), () => {
        const fetchUnit = FetchUnit.Create()
        const controller = new AbortController()
        const result = fetchUnit.set_signal(controller.signal)
        expect(fetchUnit).toBe(result)
    })

    it(label.case('should SET window'), () => {
        const fetchUnit = FetchUnit.Create()
        const window = null
        const result = fetchUnit.set_window(window)
        expect(fetchUnit).toBe(result)
    })

    it(label.case('should SET mode'), () => {
        const fetchUnit = FetchUnit.Create()
        const mode = 'cors'
        const result = fetchUnit.set_mode(mode)
        expect(fetchUnit).toBe(result)
    })

    it(label.case('should SET cache'), () => {
        const fetchUnit = FetchUnit.Create()
        const cache = 'default'
        const result = fetchUnit.set_cache(cache)
        expect(fetchUnit).toBe(result)
    })

    it(label.case('should SET safe mode'), () => {
        const fetchUnit = FetchUnit.Create()
        const result = fetchUnit.set_query_mode('not_throw')
        expect(fetchUnit).toBe(result)

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
        const fetchUnit = FetchUnit.Create()
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

        const result = fetchUnit.def_searchparams(SearchParams.parse)
        expect(fetchUnit).toBe(result)

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
        const fetchUnit = FetchUnit.Create()
        const BookRequest = t.object({
            name: t.string,
            category: t.string,
            price: t.number,
        })

        const result = fetchUnit.def_body(BookRequest.parse)
        expect(fetchUnit).toBe(result)

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

        const postDynamicUnit = FetchUnit.Create()
            .set_method('GET')
            // DYNAMIC path params: $id
            .set_url(`${BASE_URL}/books/$id`)
            .set_query_mode('throw')
            .set_referrer('about:client')
            .set_json()
            .def_searchparams(SearchParams.parse)
            .def_response(({ json }) => BookResponse.parse(json))

        const searchParams = {
            name: 'Harry Potter',
            price: 10,
        }
        const searchId = 123
        const apiResponse = await postDynamicUnit.query({
            search: searchParams,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
            const fetchUnit = FetchUnit.Create().set_json()

            const Product = t.object({
                name: t.string,
                price: t.number,
            })
            const result = fetchUnit.def_response(({ json }) =>
                Product.parse(json)
            )

            expect(fetchUnit).toBe(result)
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
            const fetchUnit = FetchUnit.Create()

            const Product = t.object({
                name: t.string,
                price: t.number,
            })
            const result = fetchUnit.def_response(async ({ response }) => {
                // Manual parsing for json response
                const json = await response.json()
                const product = Product.parse(json)
                return product
            })

            expect(fetchUnit).toBe(result)
            type InjectedFetchUnit = FetchUnit<
                string,
                unknown,
                unknown,
                unknown,
                Infer<typeof Product>,
                {
                    isJsonMode: false
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
        const postUnit = FetchUnit.Create()
            .set_query_mode('throw')
            .set_method('POST')
            .set_referrer('about:client')
            .set_url(`${BASE_URL}/books`)
            .set_json()

            .def_body(Body.parse)
            .def_response(({ json }) => ApiResponse.parse(json))

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

        const fetchUnit = FetchUnit.Create()
            .set_query_mode('throw')
            .set_method('POST')
            .set_referrer('about:client')
            .set_url(`${BASE_URL}/books/images`)
            .def_body(BlobShape.parse)
            .def_response(async ({ response }) =>
                FormDataShape.parse(await response.formData())
            )

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

        const fetchUnit = FetchUnit.Create()
            .set_query_mode('throw')
            .set_method('GET')
            .set_referrer('about:client')
            .set_url(`${BASE_URL}/books`)
            .set_json()
            .handle_fetch_error(() => {
                isFetchErrorHandled = true
            }, true)
            .handle_fetch_error(({ status }) => {
                errorStatusCode = status
            })

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

        const fetchUnit = FetchUnit.Create()
            .set_query_mode('throw')
            .set_method('GET')
            .set_referrer('about:client')
            .set_url('https://unknown.com')
            .set_json()
            .handle_unknown_error(() => {
                // ERROR_HANDLED should be called only once
                errorHandled = true
            }, true)
            .handle_unknown_error(() => {
                // LOGGER should be called every time
                // eslint-disable-next-line no-console
                console.log('ERROR_HANDLED', errorHandled)
            })

        try {
            await fetchUnit.query()
        } catch (error) {
            expect(errorHandled).toBe(true)
            expect(error).toBeInstanceOf(Error)
            errorHandled = false
        }

        try {
            await fetchUnit.query()
        } catch (error) {
            expect(errorHandled).toBe(false)
            expect(error).toBeInstanceOf(Error)
        }

        fetchUnit.set_query_mode('not_throw')

        const thisWillNotThrowError = await fetchUnit.query()
        expect(thisWillNotThrowError).toBeUndefined()
    })

    it(
        label.case(
            'should HANDLE path param error on invalid dynamic path param structure'
        ),
        () => {
            try {
                FetchUnit.Create().set_url(`${BASE_URL}/books/_$id`)
            } catch (e) {
                expect(e).toBeInstanceOf(FetchPathParamsError)
            }
        }
    )
})
