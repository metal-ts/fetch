import { setupServer } from 'msw/node'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { api } from './__mocks__/client'
import {
    type BookModel,
    type BookModelList,
    type BookRequestModel,
} from './__mocks__/model'
import { bookServer } from './__mocks__/server'
import { label } from './utils/test.label'

// ------------------- setup server ------------------- //
const apiServer = setupServer(...bookServer.routes)

beforeAll(() => apiServer.listen({ onUnhandledRequest: 'error' }))
afterAll(() => apiServer.close())
// ---------------------------------------------------- //

describe(label.unit('router api request'), () => {
    const UserPassword = crypto.randomUUID()
    const Auth = `SESSION_${UserPassword}` as const

    const SavedBooks: BookModel[] = []

    it(label.case('[GET] api/auth/login | should get session'), async () => {
        const session = await api.auth.login.GET.query({
            headers: {
                Authorization: `Bearer ${UserPassword}`,
            },
        })

        expect(session).toStrictEqual({
            data: Auth,
        })
    })

    it(label.case('[GET] api/books | should add five book'), async () => {
        const BOOK_NAMES = [
            'The Reality',
            'Fictions',
            'Love',
            'Chemistry',
            'Me and you',
        ] as const
        const BOOK_CATEGORIES = [
            'fiction',
            'non-fiction',
            'romance',
            'science',
            'science',
        ] as const

        const randomBooks: Array<BookRequestModel> = Array.from(
            { length: 5 },
            (_, i) => ({
                name: BOOK_NAMES[i]!,
                category: BOOK_CATEGORIES[i]!,
                price: (i + 1) * 10,
            })
        )
        const newBooks: Array<{
            data: BookModel
        }> = await Promise.all(
            randomBooks.map(async (book) => {
                const res = await api.books.POST.query({
                    headers: {
                        Authorization: `Bearer ${Auth}`,
                    },
                    body: book,
                })
                SavedBooks.push(res!.data)
                return res
            })
        )
        expect(newBooks).toStrictEqual(
            SavedBooks.map((book) => ({ data: book }))
        )
    })

    it(label.case('[GET] api/books | should get all books'), async () => {
        const books: {
            data: BookModelList
        } = await api.books.GET.set_options({
            referrer: 'about:client',
            cache: 'default',
        }).query({
            headers: {
                Authorization: `Bearer ${Auth}`,
            },
        })
        expect(books).toStrictEqual({
            data: SavedBooks,
        })
    })

    it(label.case('[GET] api/books/:id | should get book by id'), async () => {
        const book = await api.books.$id.GET.query({
            headers: {
                Authorization: `Bearer ${Auth}`,
            },
            path: {
                id: SavedBooks[0]!.uuid,
            },
        })

        expect(book).toStrictEqual({
            data: SavedBooks[0],
        })
    })

    it(
        label.case('[PUT] api/books/:id | should update book by id'),
        async () => {
            const targetBook: BookModel = SavedBooks[0]!
            const newBook: BookModel = { ...targetBook, price: 100 }
            const book = await api.books.$id.PUT.query({
                headers: {
                    Authorization: `Bearer ${Auth}`,
                },
                path: {
                    id: targetBook.uuid,
                },
                body: newBook,
            })
            SavedBooks[0] = newBook
            expect(book).toStrictEqual({
                data: newBook,
            })
        }
    )

    it(
        label.case('[DELETE] api/books/:id | should remove book by id'),
        async () => {
            const removeTarget = SavedBooks[0]!
            const book = await api.books.$id.DELETE.query({
                headers: {
                    Authorization: `Bearer ${Auth}`,
                },
                path: {
                    id: removeTarget.uuid,
                },
            })

            SavedBooks.shift()
            expect(book).toStrictEqual({
                data: removeTarget,
            })
        }
    )

    it(
        label.case('[GET] api/category/:name | should get category book list'),
        async () => {
            const category = 'science'
            const books: BookModelList = SavedBooks.filter(
                (book) => book.category === category
            )
            const bookList = await api.category.$name.GET.query({
                headers: {
                    Authorization: `Bearer ${Auth}`,
                },
                path: {
                    name: category,
                },
            })
            expect(bookList).toStrictEqual({
                data: books,
            })
        }
    )

    it(
        label.case('[GET] api/category/:name | should get category book list'),
        async () => {
            const category = 'fiction'
            const books: BookModelList = SavedBooks.filter(
                (book) => book.category === category
            )
            const bookList = await api.category.$name.GET.query({
                headers: {
                    Authorization: `Bearer ${Auth}`,
                    'Accept-Language': 'en-US',
                },
                path: {
                    name: category,
                },
            })
            expect(bookList).toStrictEqual({
                data: books,
            })
        }
    )
})
