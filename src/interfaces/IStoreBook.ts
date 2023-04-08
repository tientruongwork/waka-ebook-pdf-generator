export interface BookImage {
    src: string;
    alt: string;
}

export interface StoreBookRequestBody {
    id: string;
    bookName: string;
    bookNameOriginal: string;
    content: string;
    images: BookImage[];
}