import { MetalSchemaShape, t } from '@metal-box/type'
import { type GetRouterConfig, f } from '../..'
import { BASE_URL } from './constant'
import { Model } from './model'

const ApiResponse = <DataSchema extends MetalSchemaShape>(data: DataSchema) =>
    t.object({
        data,
    })

export const api = f.router(BASE_URL, {
    auth: {
        login: {
            GET: f
                .builder()
                .def_json()
                .def_default_referrer('about:client')
                .def_response(async ({ json }) =>
                    ApiResponse(t.union(t.string, t.undefined)).parse(
                        await json()
                    )
                ),
        },
    },
    books: {
        GET: f
            .builder()
            .def_json()
            .def_default_referrer('about:client')
            .def_response(async ({ json }) =>
                ApiResponse(Model.bookList).parse(await json())
            ),
        POST: f
            .builder()
            .def_json()
            .def_default_referrer('about:client')
            .def_body(Model.bookRequest.parse)
            .def_response(async ({ json }) => {
                const parsed = ApiResponse(Model.book).parse(await json())
                return parsed
            }),
        $id: {
            GET: f
                .builder()
                .def_json()
                .def_default_referrer('about:client')
                .def_response(async ({ json }) => {
                    return ApiResponse(Model.book).parse(await json())
                }),
            PUT: f
                .builder()
                .def_json()
                .def_default_referrer('about:client')
                .def_body(Model.bookRequest.parse)
                .def_response(async ({ json }) =>
                    ApiResponse(Model.book).parse(await json())
                ),
            DELETE: f
                .builder()
                .def_json()
                .def_default_referrer('about:client')
                .def_response(async ({ json }) =>
                    ApiResponse(Model.book).parse(await json())
                ),
        },
    },
    category: {
        $name: {
            GET: f
                .builder()
                .def_json()
                .def_default_referrer('about:client')
                .def_response(async ({ json }) => {
                    return ApiResponse(Model.bookList).parse(await json())
                }),
        },
    },
})

export type BookApi = GetRouterConfig<typeof api>
