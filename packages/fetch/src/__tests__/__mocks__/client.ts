import { MetalSchemaShape, t } from '@metal-box/type'
import * as f from '../../index'
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
                .unit()
                .def_json()
                .def_default_referrer('about:client')
                .def_response(({ json }) =>
                    ApiResponse(t.union(t.string, t.undefined)).parse(json)
                ),
        },
    },
    books: {
        GET: f
            .unit()
            .def_json()
            .def_default_referrer('about:client')
            .def_response(({ json }) =>
                ApiResponse(Model.bookList).parse(json)
            ),
        POST: f
            .unit()
            .def_json()
            .def_default_referrer('about:client')
            .def_body(Model.bookRequest.parse)
            .def_response(({ json }) => {
                const parsed = ApiResponse(Model.book).parse(json)
                return parsed
            }),
        $id: {
            GET: f
                .unit()
                .def_json()
                .def_default_referrer('about:client')
                .def_response(async ({ json }) => {
                    return ApiResponse(Model.book).parse(json)
                }),
            PUT: f
                .unit()
                .def_json()
                .def_default_referrer('about:client')
                .def_body(Model.bookRequest.parse)
                .def_response(({ json }) =>
                    ApiResponse(Model.book).parse(json)
                ),
            DELETE: f
                .unit()
                .def_json()
                .def_default_referrer('about:client')
                .def_response(({ json }) =>
                    ApiResponse(Model.book).parse(json)
                ),
        },
    },
    category: {
        $name: {
            GET: f
                .unit()
                .def_json()
                .def_default_referrer('about:client')
                .def_response(({ json }) => {
                    return ApiResponse(Model.bookList).parse(json)
                }),
        },
    },
})

export type BookApi = f.GetRouterConfig<typeof api>
