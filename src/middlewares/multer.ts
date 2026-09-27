import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const imageDirectory = path.join(currentDirectory, "..", "..", "public", "image");

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, imageDirectory);
    },
    filename: (_req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname;

        cb(null, uniqueName);
    },
});

const upload = multer({ storage });
export default upload;
