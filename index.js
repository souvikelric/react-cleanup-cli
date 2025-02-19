#!/usr/bin/env node
import * as fs from "fs";
import path from "path";
import { exit } from "process";
import chalk from "chalk";

const currDir = process.cwd();
const args = process.argv.slice(2);
let fullPath = "";

function checkNode_Modules(dirpath) {
  let modulePath = path.resolve(dirpath, "node_modules");
  if (!fs.existsSync(modulePath)) {
    console.log(chalk.red("Not a React project"));
    console.log(chalk.red("Exiting..."));
    exit(1);
  } else {
    console.log();
    console.log("Node Modules exist");
  }
}

if (args.length !== 0) {
  let firstArg = args[0];
  fullPath = path.resolve(currDir, firstArg);

  //check if the argument provided is a proper folder path
  if (fs.existsSync(fullPath)) {
    //if true check if node modules folder is present inside
    checkNode_Modules(fullPath);
  } else {
    console.log("Folder name provided does not exist");
  }
} else {
  fullPath = currDir;
  checkNode_Modules(fullPath);
}

// access package.json file

const packageJson = path.resolve(fullPath, "package.json");
fs.readFile(packageJson, (err, file) => {
  if (err) {
    console.log(chalk.redBright(err));
    console.log(chalk.red("Error while reading json file"));
    exit(1);
  }
  try {
    // check if react is par of dependenies or devDependencies
    const jsonData = JSON.parse(file);
    const { dependencies, devDependencies } = jsonData;
    const reactExist =
      dependencies?.react !== undefined || devDependencies?.react !== undefined;
    if (!reactExist) {
      console.log(chalk.red("Not a React project"));
      console.log(chalk.red("Exiting..."));
      exit(1);
    } else {
      //Verified that this is a react project
      console.log(chalk.green("Verified React project"));
      // Check if this is a Javascript or TypeScript project
      // By checking the presence of a tsconfig.json in the root folder
      let projectMain;
      if (fs.existsSync(fullPath, "tsconfig.json")) {
        projectMain = "App.tsx";
      } else {
        projectMain = "App.jsx";
      }
      console.log();
      console.log("Main File is : " + chalk.magenta(projectMain));
      let mainFilePath = path.join(fullPath, "src", projectMain);
      let appCssPath = path.join(fullPath, "src", "App.css");
      let mainJsxPath = path.join(fullPath, "src", "main.jsx");
      console.log(mainFilePath);

      updateFile(mainFilePath, projectMain);
      cleanAppCss(appCssPath);
      removeImport(mainJsxPath, "index.css");
    }
  } catch (err) {
    console.log(err);
    console.log("Error while reading json file");
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
  console.log(chalk.green(mainFile + " Cleaned"));
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
  console.log(chalk.green("App.css file cleaned"));
}

function removeImport(pathOf, stringToSearch) {
  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      console.log(err);
      console.log(chalk.red("Error reading file"));
      return;
    }
  });
}
