![metal-fetch-banner](./assets/metal-fetch.png)

## Overview

> **metal-fetch** is a declarative fetch api library for typescript inspired by `trpc`.
>
> Currently, it's still in development, so it's not recommended for production use.

1. Define api using `f.router` function

```ts
const api = f.router(BASE_URL, REST_API_STRUCTURE)
```

2. Define rest api structure

`REST_API_STRUCTURE` is the declarative REST api structure.

For example there is an api structure like this:

> Book api
>
> - `BASE_URL` : `/api/v1`
> - `BASE_URL/books` : `GET`
> - `BASE_URL/books` : `POST`
> - `BASE_URL/books/:id` : `GET`
> - `BASE_URL/books/:id` : `PUT`
> - `BASE_URL/books/:id` : `DELETE`
> - `BASE_URL/category/:name` : `GET`

then we can define the api like this:

```ts
export const api = f.router(BASE_URL, {
    auth: {
        login: {
            GET: f
                // create fetch unit
                .unit()
                // json mode
                .def_json()
                // default referrer
                .def_default_referrer('about:client')
                // response parser
                .def_response(({ json }) =>
                    t.union(t.string, t.undefined).parse(json)
                ),
        },
    },
    books: {
        GET: f
            .unit()
            .def_json()
            .def_default_referrer('about:client')
            .def_response(({ json }) => Model.bookList.parse(json)),
        POST: f
            .unit()
            .def_json()
            .def_default_referrer('about:client')
            .def_body(Model.bookRequest.parse)
            .def_response(({ json }) => Model.book.parse(json)),
        // /books/:id, dynamic path using $ prefix
        $id: {
            GET: f
                .unit()
                .def_json()
                .def_default_referrer('about:client')
                .def_response(async ({ json }) => Model.book.parse(json)),
            PUT: f
                .unit()
                .def_json()
                .def_default_referrer('about:client')
                .def_body(Model.bookRequest.parse)
                .def_response(({ json }) => Model.book.parse(json)),
            DELETE: f
                .unit()
                .def_json()
                .def_default_referrer('about:client')
                .def_response(({ json }) => Model.book.parse(json)),
        },
    },
    category: {
        // /category/:name, dynamic path using $ prefix
        $name: {
            GET: f
                .unit()
                .def_json()
                .def_default_referrer('about:client')
                .def_response(({ json }) => Model.bookList.parse(json)),
        },
    },
})
```

> Note: parser library is your choice, you can use `io-ts`, `zod`, `joi`, etc.

After define the api, we can get the router config type using `f.GetRouterConfig` type

- Export the router config type
    ```ts
    export type BookApi = f.GetRouterConfig<typeof api>
    ```
- Use the router config type

    ```ts
    import { BookApi } from './api'

    type Books = BookApi['books']['GET']['response']

    /**
    >> Books = Model.bookList
    
    predefined models:
        Model.bookList = t.array(Model.book)
        Model.book = t.type({ id: t.number, title: t.string, author: t.string })
    
    >> typescript type:
    
    type Books = Array<{ id: number, title: string, author: string }>
     */
    ```

3. Use the api

**Middleware support for the router will be available soon.**

```ts
const books = await api.books.GET.query({
    headers: {
        Authorization: `Bearer ${Auth}`,
    },
})

const removed = await api.books.$id.DELETE.query({
    headers: {
        Authorization: `Bearer ${Auth}`,
    },
    path: {
        id: removeTarget.uuid,
    },
})
```

This is native `fetch` wrapper, so you can integrate with any state management library like `redux`, `mobx`, `react-query`, etc.

## Roadmap

- [x] Declarative `fetch` api
- [ ] Middleware support
- [ ] Plugin support (e.g. retry, cache, etc)
- [ ] `OpenAPI` spec based auto generation support
- [ ] Documentation

## License

MIT
