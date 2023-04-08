import fs from "fs";
import { StoreBookRequestBody } from "../interfaces/IStoreBook";
import { PAGES_PATH, IMAGES_PATH, BOOK_STORE_PATH } from "../constants/common";
import fetchImage from "../utils/fetchImage";
import writePage from "../utils/writePage";
import BookDirectoryController from "./BookDirectoryController";

class StoreBookController {
    protected readonly defaultFilePath: string;

    constructor(bookName: string) {
        this.defaultFilePath = `./src/${BOOK_STORE_PATH}/${bookName}`;
        new BookDirectoryController(this.defaultFilePath).init();
    }

    private buildTitlePath(): string {
        return `${this.defaultFilePath}/${PAGES_PATH}/title.txt`;
    }

    private buildFilePath(id: string): string {
        return `${this.defaultFilePath}/${PAGES_PATH}/page_${id}.html`;
    }

    private buildImagePath(alt: string): string {
        return `${this.defaultFilePath}/${IMAGES_PATH}/${alt}.jpg`;
    }

    public async store(reqBody: StoreBookRequestBody): Promise<void> {
        const { id, content, images, bookNameOriginal } = reqBody;
        const filePath: string = this.buildFilePath(id);

        const titlePath = this.buildTitlePath();
        if (!fs.existsSync(titlePath)) {
            fs.writeFileSync(titlePath, bookNameOriginal);
        }

        if (!fs.existsSync(filePath))
            for await (const image of images) {
                const imagePath = this.buildImagePath(image.alt);
                try {
                    await fetchImage(image.src, imagePath);
                } catch (error: any) {
                    console.log(error.message);
                }
            }
        await writePage(filePath, content);
    }
}

export { StoreBookController };
