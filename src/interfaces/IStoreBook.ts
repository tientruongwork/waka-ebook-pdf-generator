export interface BookImage {
    src: string,
    alt: string
}

export interface StoreBookRequestBody {
    id: string
    bookName: string
    content: string
    images: BookImage[]
}