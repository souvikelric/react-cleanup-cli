#!/usr/bin/env node
import * as fs from "fs";
import path from "path";
import { exit } from "process";
import chalk from "chalk";
import getOutput from "./custom.js";
import { select } from "@inquirer/prompts";
const currDir = process.cwd();
const args = process.argv.slice(2);
let fullPath = "";
export function colorMessage(color, message) {
    if (color === "green")
        console.log(chalk.rgb(0, 204, 153)(message));
    else if (color === "red")
        console.log(chalk.rgb(188, 11, 70)(message));
    else if (color === "magenta")
        console.log(chalk.rgb(119, 51, 187)(message));
}
function checkNode_Modules(dirpath) {
    let modulePath = path.resolve(dirpath, "node_modules");
    if (!fs.existsSync(modulePath)) {
        colorMessage("red", "Not a React project");
        colorMessage("red", "Exiting...");
        exit(1);
    }
    else {
        return;
    }
}
const currDirFolders = await getOutput();
currDirFolders.unshift("./ (Choose this if you are already in the React Project)");
if (args.length !== 0) {
    let firstArg = args[0];
    fullPath = path.resolve(currDir, firstArg);
    //check if the argument provided is a proper folder path
    if (fs.existsSync(fullPath)) {
        //if true check if node modules folder is present inside
        checkNode_Modules(fullPath);
    }
    else {
        colorMessage("red", "Folder name provided does not exist");
    }
}
else {
    const answer = await select({
        message: "Select the directory which your React Project resides",
        choices: currDirFolders.map((cF) => ({
            name: cF,
            value: "./",
        })),
    });
    if (answer === "./") {
        colorMessage("magenta", "Tool will check if current directory is a React project");
        fullPath = currDir;
        checkNode_Modules(fullPath);
    }
    else {
        fullPath = answer;
        checkNode_Modules(fullPath);
    }
}
// access package.json file
const packageJson = path.resolve(fullPath, "package.json");
fs.readFile(packageJson, (err, file) => {
    if (err) {
        console.log(chalk.redBright(err));
        colorMessage("red", "Error while reading json file");
        exit(1);
    }
    try {
        // check if react is par of dependenies or devDependencies
        const jsonData = JSON.parse(file.toString());
        const { dependencies, devDependencies } = jsonData;
        const reactExist = (dependencies === null || dependencies === void 0 ? void 0 : dependencies.react) !== undefined || (devDependencies === null || devDependencies === void 0 ? void 0 : devDependencies.react) !== undefined;
        if (!reactExist) {
            colorMessage("red", "Not a React project");
            colorMessage("red", "Exiting...");
            exit(1);
        }
        else {
            //Verified that this is a react project
            colorMessage("green", "Verified React project");
            // Check if this is a Javascript or TypeScript project
            // By checking the presence of a tsconfig.json in the root folder
            let projectMain;
            if (fs.existsSync(path.resolve(fullPath, "tsconfig.json"))) {
                projectMain = "App.tsx";
            }
            else {
                projectMain = "App.jsx";
            }
            let mainFileName = "main." + projectMain.split(".")[1];
            console.log();
            // console.log("Main File is : " + chalk.magenta(projectMain));
            let mainFilePath = path.join(fullPath, "src", projectMain);
            let appCssPath = path.join(fullPath, "src", "App.css");
            let mainJsxPath = path.join(fullPath, "src", mainFileName);
            // console.log(mainFilePath);
            updateFile(mainFilePath, projectMain);
            cleanAppCss(appCssPath);
            removeImport(mainJsxPath, "index.css");
            if (fs.existsSync(path.resolve(fullPath, "src", "index.css"))) {
                let pathToremove = path.resolve(fullPath, "src", "index.css");
                fs.rm(pathToremove, () => {
                    colorMessage("green", "Deleting index.css");
                });
            }
            else {
                colorMessage("red", "index.css does not exist");
            }
        }
    }
    catch (err) {
        console.log(err);
        colorMessage("red", "Error while reading json file");
    }
});
//function to delete a specific line from App.jsx or App.tsx
function updateFile(pathOf, mainFile) {
    let updatedData = [
        "import './App.css'",
        "function App() {",
        "  return (",
        "    <>",
        "      <h1>Vite + React</h1>",
        "    </>",
        "  )",
        "}",
        "export default App",
    ];
    updatedData = updatedData.join("\n");
    fs.writeFileSync(pathOf, updatedData, "utf8");
    colorMessage("green", mainFile + " Cleaned");
}
//function to cleanup App.css and add basic reset
function cleanAppCss(filePath) {
    let updatedCss = [
        "*{",
        "   padding:0;",
        "   margin:0;",
        "   box-sizing:border-box;",
        "}",
    ];
    updatedCss = updatedCss.join("\n");
    fs.writeFileSync(filePath, updatedCss, "utf8");
    colorMessage("green", "App.css file cleaned");
}
function removeImport(pathOf, stringToSearch) {
    fs.readFile(pathOf, "utf8", (err, data) => {
        if (err) {
            console.log(err);
            console.log(chalk.red("Error reading file"));
            return;
        }
        let lines = data.split("\n");
        lines = lines.filter((line) => !line.includes(stringToSearch));
        let updatedData = lines.join("\n");
        fs.writeFileSync(pathOf, updatedData, "utf8");
        colorMessage("green", "index.css import removed from main");
    });
}
