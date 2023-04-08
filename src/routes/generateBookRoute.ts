import { Router, Request, Response } from "express";
import { GenerateBookController } from "../controller/GenerateBookController";
import { GENERATED_BOOKS_URL } from "../constants/common";
import { GenerateBookRequestBody } from "../interfaces/IGenerateBook";

const generateBookRoute = Router();

generateBookRoute.get("/generate-book", async (req: Request<{}, {}, {}, GenerateBookRequestBody>, res: Response) => {
    const { bookName } = req.query;

    const generateBookController = new GenerateBookController();

    if (!bookName) {
        const bookList = generateBookController.getAvailableBooks();
        res.render("generate-book-response", { bookList: bookList });
    } else {
        try {
            generateBookController.initBookName(bookName as string).generate();
            res.redirect(GENERATED_BOOKS_URL);
        } catch (err) {
            res.sendStatus(404);
        }
    }
});

export { generateBookRoute };
