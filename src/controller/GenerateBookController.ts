import fs from "fs";
import path from "path";
import ejs from "ejs";
import sortPages from "../utils/sortPages";
import { BOOK_HEADER_HTML_PATH, BOOK_BODY_HTML_PATH, BOOK_STORE_PATH, PAGES_PATH, IMAGES_PATH } from "../constants/common";

class GenerateBookController {
    protected sortedBooksName: string[] = [];

    private bookName: string = "";
    private bookPagesPath: string = "";
    private bookImagesPath: string = "";
    private publicBookImagesPath: string = "";
    private publicBookPagesPath: string = "";

    constructor() {}

    public initBookName(bookName: string): GenerateBookController {
        this.bookName = bookName;
        this.init();
        return this;
    }

    private init() {
        const baseBookPath = path.join(__dirname, BOOK_STORE_PATH, this.bookName);
        const basePublicPath = path.join(__dirname, "../generated");

        this.bookPagesPath = `${baseBookPath}/${PAGES_PATH}`;
        this.bookImagesPath = `${baseBookPath}/${IMAGES_PATH}`;
        this.publicBookPagesPath = `${basePublicPath}/${PAGES_PATH}`;
        this.publicBookImagesPath = `${basePublicPath}/${IMAGES_PATH}`;
    }

    public generate() {
        console.log(this.bookPagesPath)
        if (!fs.existsSync(this.bookPagesPath)) {
            throw new Error("Not found");
        }
        const files = fs.readdirSync(this.bookPagesPath);
        const booksName = files.filter((file) => !fs.lstatSync(path.join(this.bookPagesPath, file)).isDirectory());
        this.sortedBooksName = sortPages(booksName);
        this.generateHTMLContent();
        this.copyBookImages();
    }

    private getBookBodyContent(): string {
        let bookBodyData = "";
        for (const bookName of this.sortedBooksName) {
            const bookContentPath = path.join(this.bookPagesPath, bookName);
            const data = fs.readFileSync(bookContentPath, "utf-8");
            bookBodyData += data;
        }
        return bookBodyData;
    }

    private getTemplate(templatePath: string): string {
        return fs.readFileSync(path.join(__dirname, templatePath), "utf-8");
    }

    private generateHTMLContent() {
        const bookHeaderTemplate = this.getTemplate(BOOK_HEADER_HTML_PATH);
        const bookBodyTemplate = this.getTemplate(BOOK_BODY_HTML_PATH);

        const bookBodyContent = this.getBookBodyContent();

        const bookHeader = ejs.render(bookHeaderTemplate, { bookName: this.bookName });
        const bookBody = ejs.render(bookBodyTemplate, { divContent: bookBodyContent });
        if (!fs.existsSync(this.publicBookPagesPath)) {
            fs.mkdirSync(this.publicBookPagesPath, { recursive: true });
        }
        fs.writeFileSync(`${this.publicBookPagesPath}/index.html`, bookHeader + bookBody);
    }

    private copyBookImages() {
        const files = fs.readdirSync(this.bookImagesPath);
        const booksImages = files.filter((file) => !fs.lstatSync(path.join(this.bookImagesPath, file)).isDirectory());
        for (const bookImage of booksImages) {
            if (!fs.existsSync(this.publicBookImagesPath)) {
                fs.mkdirSync(this.publicBookImagesPath, { recursive: true });
            }
            fs.copyFileSync(`${this.bookImagesPath}/${bookImage}`, `${this.publicBookImagesPath}/${bookImage}`);
        }
    }

    public getAvailableBooks() {
        const booksPath = path.join(__dirname, BOOK_STORE_PATH);
        const files = fs.readdirSync(booksPath);
        return files.filter((file) => fs.statSync(`${booksPath}/${file}`).isDirectory());
    }
}

export { GenerateBookController };
