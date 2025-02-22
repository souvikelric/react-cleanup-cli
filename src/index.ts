#!/usr/bin/env node
import * as fs from "fs";
import path from "path";
import { exit } from "process";
import chalk from "chalk";
import getOutput from "./custom.js";

type messageColor = "red" | "green" | "magenta";

const currDir = process.cwd();
const args = process.argv.slice(2);
let fullPath = "";

function colorMessage(color: messageColor, message: string) {
  if (color === "green") console.log(chalk.green(message));
  else if (color === "red") console.log(chalk.red(message));
  else if (color === "magenta") console.log(chalk.magenta(message));
}

function checkNode_Modules(dirpath: string) {
  let modulePath = path.resolve(dirpath, "node_modules");
  if (!fs.existsSync(modulePath)) {
    colorMessage("red", "Not a React project");
    colorMessage("red", "Exiting...");
    exit(1);
  } else {
    return;
  }
}

await getOutput();

if (args.length !== 0) {
  let firstArg = args[0];
  fullPath = path.resolve(currDir, firstArg);

  //check if the argument provided is a proper folder path
  if (fs.existsSync(fullPath)) {
    //if true check if node modules folder is present inside
    checkNode_Modules(fullPath);
  } else {
    colorMessage("red", "Folder name provided does not exist");
  }
} else {
  colorMessage("magenta", "No directory provided as argument");
  colorMessage(
    "magenta",
    "Tool will check if current directory is a React project"
  );
  fullPath = currDir;
  checkNode_Modules(fullPath);
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
    const reactExist =
      dependencies?.react !== undefined || devDependencies?.react !== undefined;
    if (!reactExist) {
      colorMessage("red", "Not a React project");
      colorMessage("red", "Exiting...");
      exit(1);
    } else {
      //Verified that this is a react project
      colorMessage("green", "Verified React project");
      // Check if this is a Javascript or TypeScript project
      // By checking the presence of a tsconfig.json in the root folder
      let projectMain;
      if (fs.existsSync(path.resolve(fullPath, "tsconfig.json"))) {
        projectMain = "App.tsx";
      } else {
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
      } else {
        colorMessage("red", "index.css does not exist");
      }
    }
  } catch (err) {
    console.log(err);
    colorMessage("red", "Error while reading json file");
  }
});

//function to delete a specific line from App.jsx or App.tsx
function updateFile(pathOf: string, mainFile: string) {
  let updatedData: string | string[] = [
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
function cleanAppCss(filePath: string) {
  let updatedCss: string | string[] = [
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

function removeImport(pathOf: string, stringToSearch: string) {
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
