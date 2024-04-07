import { HttpResponse, http } from 'msw'
import { BASE_URL } from './constant'
import { type BookModel, BookRequestModel, Model } from './model'

type UUID = string
type DB_COLLECTION = Map<UUID, BookModel>

class BookDatabase {
    private readonly db: DB_COLLECTION = new Map()

    private get iterableDb(): Array<[UUID, BookModel]> {
        return Array.from(this.db.entries())
    }
    private constructor() {}
    private static instance: BookDatabase
    public static create(): BookDatabase {
        return (this.instance ??= new BookDatabase())
    }

    // REST @GET category/:name
    public getCategoryBookList(categoryName: string): BookModel[] {
        return this.iterableDb.reduce((acc, [, book]) => {
            if (book.category === categoryName) acc.push(book)
            return acc
        }, [] as BookModel[])
    }

    // REST @GET books
    public getAllBooks(): BookModel[] {
        return this.iterableDb.map(([, book]) => book)
    }

    // REST @POST books
    public addBook(bookId: UUID, book: BookRequestModel): BookModel {
        const newBook: BookModel = {
            ...book,
            uuid: bookId,
            publish_date: new Date().toDateString(),
        }
        this.db.set(bookId, newBook)
        return newBook
    }

    // REST @GET books/:id
    public getBookById(id: UUID): BookModel | undefined {
        return this.db.get(id)
    }

    // REST @REMOVE books/:id
    public removeBook(id: UUID): BookModel | undefined {
        const target = this.db.get(id)
        return this.db.delete(id) ? target : undefined
    }

    // REST @PUT books/:id
    public updateBook(id: UUID, book: BookModel): BookModel {
        const originalBook = this.db.get(id)
        const updatedBook = { ...originalBook, ...book }
        this.db.set(id, updatedBook)
        return book
    }
}

class BookServer {
    private readonly db: BookDatabase = BookDatabase.create()
    private readonly userSession: Set<UUID> = new Set()
    private constructor() {}

    private static instance: BookServer
    public static create(): BookServer {
        return (this.instance ??= new BookServer())
    }
    private createSessionFromId(id: string): UUID {
        return `SESSION_${id}`
    }
    private createUUID(): UUID {
        return crypto.randomUUID()
    }

    public login(id: string): UUID {
        const session = this.createSessionFromId(id)
        this.userSession.add(session)
        return session
    }

    private isInvalidSession(id: string): boolean {
        return !this.userSession.has(id)
    }

    public authorize(header: Headers):
        | {
              success: false
          }
        | {
              success: true
              id: UUID
          } {
        const id = header.get('Authorization')?.split(' ')[1]
        if (!id) return { success: false }
        return this.isInvalidSession(id)
            ? {
                  success: false,
              }
            : {
                  success: true,
                  id,
              }
    }

    public getBookById(bookId: UUID): BookModel | undefined {
        return this.db.getBookById(bookId)
    }
    public addBook(
        book: Omit<BookModel, 'uuid' | 'publish_date'>
    ): BookModel | undefined {
        return this.db.addBook(this.createUUID(), book)
    }
    public updateBook(bookId: UUID, book: BookModel): BookModel | undefined {
        return this.db.updateBook(bookId, book)
    }
    public getAllBooks(): BookModel[] | undefined {
        return this.db.getAllBooks()
    }
    public getCategoryBookList(categoryName: string): BookModel[] | undefined {
        return this.db.getCategoryBookList(categoryName)
    }
    public removeBook(bookId: UUID): BookModel | undefined {
        return this.db.removeBook(bookId)
    }

    public processData<T>(
        header: Headers,
        data: (authId: UUID) => T,
        skipAuth: boolean = false
    ): HttpResponse {
        if (skipAuth) {
            return HttpResponse.json(
                {
                    data: data(''),
                },
                {
                    status: 200,
                }
            )
        }

        const auth = this.authorize(header)
        if (!auth.success)
            return HttpResponse.json(
                {
                    data: undefined,
                },
                {
                    status: 401,
                }
            )

        const dataRes = data(auth.id)
        return HttpResponse.json(
            {
                data: dataRes,
            },
            {
                status: 200,
            }
        )
    }
}

const server = BookServer.create()

export const bookServer = {
    routes: [
        http.get(`${BASE_URL}/books`, ({ request }) => {
            return server.processData(request.headers, () =>
                server.getAllBooks()
            )
        }),
        http.post(`${BASE_URL}/books`, async ({ request }) => {
            const body = await request.json()
            const newBook = Model.bookRequest.parse(body)

            return server.processData(request.headers, () => {
                const res = server.addBook(newBook)
                return res
            })
        }),

        http.get<{
            id: string
        }>(`${BASE_URL}/books/:id`, ({ request, params }) => {
            return server.processData(request.headers, () =>
                server.getBookById(params.id)
            )
        }),
        http.put<{
            id: string
        }>(`${BASE_URL}/books/:id`, async ({ request, params }) => {
            const book = Model.book.parse(await request.json())
            return server.processData(request.headers, () =>
                server.updateBook(params.id, book)
            )
        }),
        http.delete<{
            id: string
        }>(`${BASE_URL}/books/:id`, ({ request, params }) => {
            return server.processData(request.headers, () =>
                server.removeBook(params.id)
            )
        }),

        http.get<{
            name: string
        }>(`${BASE_URL}/category/:name`, ({ request, params }) => {
            return server.processData(request.headers, () =>
                server.getCategoryBookList(params.name)
            )
        }),

        http.get(`${BASE_URL}/auth/login`, ({ request }) => {
            return server.processData(
                request.headers,
                () => {
                    const id = request.headers
                        .get('Authorization')
                        ?.split(' ')[1]
                    if (!id) return undefined

                    return server.login(id)
                },
                true
            )
        }),
    ],
} as const
