import { Router, Request, Response } from "express";
import { StoreBookController } from "../controller/StoreBookController";
import { StoreBookRequestBody } from "../interfaces/IStoreBook";

const storeBookRoute = Router();

storeBookRoute.post("/store-book", async (req: Request<{}, {}, StoreBookRequestBody>, res: Response) => {
    const { bookName } = req.body;
    const storeBookController = new StoreBookController(bookName);
    await storeBookController.store(req.body);
    res.sendStatus(200);
});

export { storeBookRoute };
