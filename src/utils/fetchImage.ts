import axios from "axios";
import fs from "fs";

const fetchImage = async (url: string, imagePath: string) => {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data);
    await fs.writeFile(imagePath, buffer, (err) => {
        if (err) {
            throw new Error(err.message);
        }
    });
};

export default fetchImage;
