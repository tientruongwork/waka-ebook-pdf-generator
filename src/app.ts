import express, { Express } from "express";
import bodyParser from "body-parser";
import path from "path";
import { storeBookRoute } from "./routes/storeBookRoute";
import { generateBookRoute } from "./routes/generateBookRoute";

const app: Express = express();
const PORT = process.env.PORT || 5000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "templates"));
app.use("/generated", express.static("generated/"));

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use(storeBookRoute);
app.use(generateBookRoute);

app.listen(PORT, () => {
    console.log(`Application running on port ${PORT}`);
});
