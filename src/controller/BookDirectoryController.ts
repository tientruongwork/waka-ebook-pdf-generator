import fs from "fs";
import { PAGES_PATH, IMAGES_PATH } from "../constants/common";

class BookDirectoryController {
    protected bookPageDirectory: string = "";
    protected bookImageDirectory: string = "";

    constructor(protected bookDirectory: string) {}

    public init(): void {
        this.setBookPageDirectory();
        this.setBookImageDirectory();

        this.createDirectoryIfNotExists(this.bookDirectory);
        this.createDirectoryIfNotExists(this.bookPageDirectory);
        this.createDirectoryIfNotExists(this.bookImageDirectory);
    }

    private createDirectoryIfNotExists(path: string): void {
        if (!fs.existsSync(path)) fs.mkdirSync(path);
    }

    private setBookPageDirectory(): void {
        this.bookPageDirectory = `${this.bookDirectory}/${PAGES_PATH}`;
    }

    private setBookImageDirectory(): void {
        this.bookImageDirectory = `${this.bookDirectory}/${IMAGES_PATH}`;
    }
}

export default BookDirectoryController;