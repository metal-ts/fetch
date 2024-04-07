import { Infer, t } from '@metal-box/type'

const Book = t.object({
    name: t.string,
    price: t.number,
    category: t.string,
    // server data
    publish_date: t.string,
    uuid: t.string,
})

export type BookModel = Infer<typeof Book>

const BookRequest = t.object({
    name: t.string,
    price: t.number,
    category: t.string,
})
export type BookRequestModel = Infer<typeof BookRequest>

const BookList = t.array(Book)
export type BookModelList = Infer<typeof BookList>

const BookQueryBody = t.object({
    name: t.string,
})
export type BookQueryBodyModel = Infer<typeof BookQueryBody>

const Author = t.object({
    name: t.null.array,
    books: BookList,
})

export type AuthorModel = Infer<typeof Author>

const AuthorList = t.array(Author)
export type AuthorListModel = Infer<typeof AuthorList>

export const Model = {
    // books
    book: Book,
    bookList: BookList,
    bookRequest: BookRequest,
    bookQueryBody: BookQueryBody,
    // author
    author: Author,
    authorList: AuthorList,
} as const
