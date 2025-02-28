#!/usr/bin/env node
import * as fs from "fs";
import path from "path";
import { exit } from "process";
import chalk from "chalk";
import getOutput, { createReactProject } from "./custom.js";
import { select, confirm, input } from "@inquirer/prompts";
import * as fsP from "node:fs/promises";
import welcome from "cli-welcome";

type messageColor = "red" | "green" | "magenta";

const currDir = process.cwd();
let fullPath = "";

export function colorMessage(color: messageColor, message: string) {
  if (color === "green") console.log(chalk.rgb(0, 204, 153)(message));
  else if (color === "red") console.log(chalk.rgb(188, 11, 70)(message));
  else if (color === "magenta") console.log(chalk.rgb(119, 51, 187)(message));
}

type pJson = {
  name: string;
  version: string;
  author: string;
  description: string;
};

function welcomeMessage() {
  welcome({
    title: `react-cleanup-cli`,
    tagLine: `by Souvik Roy`,
    description: "A cli to set up a clean React project",
    version: "0.0.1",
    bgColor: "#6cc24a",
    color: "#000000",
    bold: true,
  });
}

function handleExit() {
  colorMessage("red", "❌ Process was interrupted by user");
  colorMessage("red", "👋 Exiting....");
  process.exit(0);
}

function checkNode_Modules(dirpath: string) {
  let modulePath = path.resolve(dirpath, "node_modules");
  if (!fs.existsSync(modulePath)) {
    colorMessage("red", "Not a React project");
    colorMessage("red", "Exiting...");
    exit(1);
  } else {
    colorMessage("green", "Verified React Project");
    return;
  }
}

process.on("SIGINT", handleExit);

console.clear();
welcomeMessage();

try {
  let reactProjectName;
  const firstCheck = await confirm({
    message:
      "Have you already created the directory in which your React Project will reside?",
  });
  if (firstCheck) {
    try {
      const currDirFolders = await getOutput();
      currDirFolders.unshift(
        "./ (Choose this if you are already in the React Project)"
      );
      const answer = await select({
        message: "Select the directory which your React Project resides",
        choices: currDirFolders.map((cF) => ({
          name: cF,
          value: cF.startsWith("./") ? "./" : cF,
        })),
      });
      if (answer === "./") {
        colorMessage(
          "magenta",
          "Tool will check if current directory is a React project"
        );
        fullPath = currDir;
        reactProjectName = ".";
        // checkNode_Modules(fullPath);
      } else {
        fullPath = answer;
        reactProjectName = path.basename(fullPath);
        // checkNode_Modules(fullPath);
      }
    } catch (err) {
      if (err instanceof Error && err.name === "ExitPromptError") {
        handleExit();
      }

      console.error(err);
    }
  } else {
    reactProjectName = await input({
      message:
        "What will you name your project? (Select . if you want to create it in the current directory?",
      validate: (value) => {
        for (let i of value) {
          if (i.charCodeAt(0) >= 65 && i.charCodeAt(0) <= 90) {
            return "Project Name must be in lower case only";
          }
        }
        return true;
      },
      required: true,
    });
    fullPath = path.join(currDir, reactProjectName);
    console.log(fullPath);
  }

  const isTypeScript = await confirm({
    message: "Do you want it to be a typescript project?",
  });
  let output = await createReactProject(reactProjectName!, isTypeScript);
  if (output !== "success") {
    process.exit(0);
  }
} catch (err) {
  if (err instanceof Error && err.name === "ExitPromptError") {
    handleExit();
  }
  console.log(err);
}
// if (args.length !== 0) {
//   let firstArg = args[0];
//   fullPath = path.resolve(currDir, firstArg);

//   //check if the argument provided is a proper folder path
//   if (fs.existsSync(fullPath)) {
//     //if true check if node modules folder is present inside
//     checkNode_Modules(fullPath);
//   } else {
//     colorMessage("red", "Folder name provided does not exist");
//   }
// } else {

// access package.json file
let htmlTitle: boolean, deleteSvgs: boolean;
try {
  htmlTitle = await confirm({
    message:
      "Do you want to change the title of the site to your project name?",
  });

  deleteSvgs = await confirm({
    message: "Do you want to delete the react and vite svgs ?",
  });
} catch (err) {
  if (err instanceof Error && err.name === "ExitPromptError") {
    handleExit();
  }
  console.log(err);
}

const packageJson = path.resolve(fullPath, "package.json");
fs.readFile(packageJson, (err, file) => {
  if (err) {
    console.log(chalk.redBright(err));
    colorMessage("red", "Error while reading package.json file");
    exit(1);
  }
  try {
    // check if react is par of dependenies or devDependencies
    const jsonData = JSON.parse(file.toString());
    const { dependencies, devDependencies } = jsonData;
    const reactExist =
      dependencies?.react !== undefined || devDependencies?.react !== undefined;
    if (!reactExist) {
      colorMessage(
        "red",
        "Unable to find react as a dependency in package.json"
      );
      colorMessage("red", "Exiting...");
      exit(1);
    } else {
      //Verified that this is a react project
      // colorMessage("green", "Verified React project");
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
      if (htmlTitle) {
        let indexHtmlFile = path.join(fullPath, "index.html");
        let siteTitle = path.basename(fullPath);
        const titleToReplace =
          projectMain === "App.jsx" ? "Vite + React" : "Vite + React + TS";
        changeSiteTitle(indexHtmlFile, "Vite + React", siteTitle);
      }
      if (deleteSvgs) {
        const reactSvgPath = path.join(fullPath, "src/assets", "react.svg");
        const viteSvgPath = path.join(fullPath, "public/vite.svg");
        removeSvgs([reactSvgPath, viteSvgPath]);
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
  colorMessage("magenta", `Files cleaned and project created at ${fullPath}`);
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
function changeSiteTitle(
  pathOf: string,
  stringToSearch: string,
  siteTitle: string
) {
  fs.readFile(pathOf, "utf8", (err, data) => {
    if (err) {
      console.log(err);
      console.log(chalk.red("Error reading file"));
      return;
    }
    let updatedData = data.replace(stringToSearch, siteTitle);
    fs.writeFileSync(pathOf, updatedData, "utf8");
    colorMessage("green", `Site Title changed to ${siteTitle}`);
  });
}

function removeSvgs(pathToFiles: string[]) {
  for (let file of pathToFiles) {
    if (fs.existsSync(file)) {
      fs.rm(file, () => {
        colorMessage("green", `Removed ${path.basename(file)} successfully`);
      });
    } else {
      colorMessage("red", `${file} does not exist`);
    }
  }
}
