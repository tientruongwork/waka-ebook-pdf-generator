import BookDirectoryController from "./BookDirectoryController";
import { PAGES_PATH, IMAGES_PATH } from "../constants/common";
import fs from "fs";

jest.mock("fs", () => ({
    ...jest.requireActual("fs"),
    mkdirSync: jest.fn(),
}));

jest.mock("../utils/writePage", () => jest.fn());
jest.mock("../utils/fetchImage", () => jest.fn());

describe("Testing BookDirectoryController", () => {
    class TestBookDirectoryController extends BookDirectoryController {
        public getBookDirectory() {
            return this.bookDirectory;
        }

        public getBookPageDirectory() {
            return this.bookPageDirectory;
        }

        public getBookImageDirectory() {
            return this.bookImageDirectory;
        }
    }

    it("should set directory correctly if init function executed ", () => {
        const testBookDirectoryController = new TestBookDirectoryController("example-path");
        testBookDirectoryController.init();
        expect(testBookDirectoryController.getBookPageDirectory()).toEqual(`example-path/${PAGES_PATH}`);
        expect(testBookDirectoryController.getBookImageDirectory()).toEqual(`example-path/${IMAGES_PATH}`);
    });

    it("should NOT set directory correctly if init function is NOT executed ", () => {
        const testBookDirectoryController = new TestBookDirectoryController("example-path");

        expect(testBookDirectoryController.getBookPageDirectory()).toEqual("");
        expect(testBookDirectoryController.getBookImageDirectory()).toEqual("");
    });

    it("should create directory when its not existed", () => {
        // @ts-ignore
        jest.spyOn(fs, "existsSync").mockReturnValue(false);
        const testBookDirectoryController = new TestBookDirectoryController("example-path");
        testBookDirectoryController.init();

        expect(fs.mkdirSync).toHaveBeenCalledWith(testBookDirectoryController.getBookDirectory());
        expect(fs.mkdirSync).toHaveBeenCalledWith(testBookDirectoryController.getBookPageDirectory());
        expect(fs.mkdirSync).toHaveBeenCalledWith(testBookDirectoryController.getBookImageDirectory());
    });

    it("should NOT create directory when its existed", () => {
        // @ts-ignore
        jest.spyOn(fs, "existsSync").mockReturnValue(true);
        const testBookDirectoryController = new TestBookDirectoryController("example-path");
        testBookDirectoryController.init();

        expect(fs.mkdirSync).not.toHaveBeenCalled();
    });
});
