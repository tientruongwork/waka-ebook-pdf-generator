import fs from "fs";

const writePage = async (filePath: string, content: string) => {
    await fs.writeFile(filePath, content, (err) => {
        if (err) {
            throw new Error(err.message);
        }
    });
};

export default writePage;