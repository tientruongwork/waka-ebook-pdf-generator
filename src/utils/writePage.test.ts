import writePage from "./writePage";
import fs from "fs";

jest.mock("fs", () => ({
    writeFile: jest.fn(),
}));

describe("testing writePage", () => {
    const DUMMY_PATH = "dummy-path";
    const DUMMY_CONTENT = "dummy-content";
    it("should execute fs.writeFile with corrects path and content", async () => {
        await writePage(DUMMY_PATH, DUMMY_CONTENT);

        expect(fs.writeFile).toHaveBeenCalledWith(DUMMY_PATH, DUMMY_CONTENT, expect.any(Function));
    });

    it("should throw error when writeFile callback with an Error", async () => {
        // @ts-ignore
        jest.spyOn(fs, "writeFile").mockImplementation((_, __, callback) => {
            callback(new Error("test-write-file-error"));
        });
        const throwErrorFunction = async () => {
            await writePage(DUMMY_PATH, DUMMY_CONTENT);
        };

        await expect(throwErrorFunction()).rejects.toThrow("test-write-file-error");
    });
});
