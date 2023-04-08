import { StoreBookController } from "./StoreBookController";
import { StoreBookRequestBody } from "../interfaces/IStoreBook";
import writePage from "../utils/writePage";
import fetchImage from "../utils/fetchImage";

jest.mock("../utils/writePage", () => jest.fn());
jest.mock("../utils/fetchImage", () => jest.fn());
jest.mock(
    "./BookDirectoryController",
    () =>
        class {
            init() {}
        },
);

describe("testing StoreBookController", () => {
    const EXAMPLE_BOOK_NAME = "example-book-name";
    const DUMMY_CONTENT = "SOME BOOK CONTENT GOES HERE";

    class TestStoreBookController extends StoreBookController {
        public getDefaultFilePath(): string {
            return this.defaultFilePath;
        }
    }

    it("should create defaultFilePath correctly", () => {
        const testStoreBookController = new TestStoreBookController(EXAMPLE_BOOK_NAME);

        const storedFilePath = testStoreBookController.getDefaultFilePath();
        expect(storedFilePath).toEqual(`./src/books/${EXAMPLE_BOOK_NAME}`);
    });

    it("should execute writePage and fetchImage function based on params", async () => {
        const testStoreBookController = new TestStoreBookController(EXAMPLE_BOOK_NAME);
        const testReqBody: StoreBookRequestBody = {
            id: "1",
            bookName: EXAMPLE_BOOK_NAME,
            content: DUMMY_CONTENT,
            images: [
                {
                    src: "dummy-src-url",
                    alt: "test-image",
                },
            ],
        };
        await testStoreBookController.store(testReqBody);

        const expectedBookPagePath = "./src/books/example-book-name/pages/page_1.html";
        const expectedBookImagePath = "./src/books/example-book-name/images/test-image.jpg";

        expect(writePage).toHaveBeenCalledWith(expectedBookPagePath, testReqBody.content);
        expect(fetchImage).toHaveBeenCalledWith(testReqBody.images[0].src, expectedBookImagePath);
    });
});
