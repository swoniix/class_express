// import path from "node:path"  // модуль для роботи зі шляхами
// import {getContent, writeToFile} from "./funcs.js"
// const FILE_TO_PATH = path.join('logs', 'logs.txt');
import * as fs from "node:fs/promises";
import path from "node:path";
import FileWorker from "./funcs.js";
const FOLDER_NAME = './logs';
try {
    // mkdir - створює нову директорію, якщо вона не існує
    await fs.mkdir(FOLDER_NAME, { recursive: true });
    console.log(`Folder ${FOLDER_NAME} is created or already exists!`);
}
catch (error) {
    console.log("Error creating folder: ", error);
}
const FILE_TO_PATH = path.join(FOLDER_NAME, 'logs.txt');
FileWorker.path = FILE_TO_PATH;
let content = await FileWorker.getContent();
await FileWorker.writeToFile(FILE_TO_PATH, content);
content = (await FileWorker.readFile(FILE_TO_PATH))?.toString('utf-8');
console.log(`Content from file: ${content} \n`);
// access - перевіряє доступність файлу або директорії
