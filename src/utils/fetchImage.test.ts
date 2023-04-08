import fetchImage from "./fetchImage";
import axios from "axios";
import fs from "fs";

jest.mock("axios", () => ({
    get: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
}));

jest.mock("fs", () => ({
    writeFile: jest.fn(),
}));

describe("testing fetchImage", () => {
    const DUMMY_PATH = "dummy-path";
    const DUMMY_BUFFER = "dummy-buffer";

    beforeAll(() => {
        Object.assign(Buffer, { from: jest.fn().mockReturnValue("dummy-buffer") });
    });

    it("should write image to corrects path", async () => {
        const AXIOS_URL = "test-url";

        await fetchImage(AXIOS_URL, DUMMY_PATH);

        expect(axios.get).toHaveBeenCalledWith(AXIOS_URL, { responseType: "arraybuffer" });
        expect(fs.writeFile).toHaveBeenCalledWith(DUMMY_PATH, DUMMY_BUFFER, expect.any(Function));
    });

    it("should throw error when writeFile callback with an Error", async () => {
        const AXIOS_URL = "test-url";
        const WRITE_FILE_CALLBACK_ERROR = "test-write-file-error";

        // @ts-ignore
        jest.spyOn(fs, "writeFile").mockImplementation((_, __, callback) => {
            callback(new Error(WRITE_FILE_CALLBACK_ERROR));
        });

        const throwErrorFunction = async () => {
            await fetchImage(AXIOS_URL, DUMMY_PATH);
        };

        await expect(throwErrorFunction()).rejects.toThrow(WRITE_FILE_CALLBACK_ERROR);
    });
});
