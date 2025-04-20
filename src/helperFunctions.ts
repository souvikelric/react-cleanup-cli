import chalk from "chalk";
import path from "path";
import { exit } from "process";
import { messageColor } from ".";
import welcome from "cli-welcome";
import * as fs from "fs";
import * as fsP from "node:fs/promises";
import { select, confirm, input } from "@inquirer/prompts";
import { runCommand } from "./custom.js";

export function colorMessage(color: messageColor, message: string) {
  if (color === "green") console.log(chalk.rgb(0, 204, 153)(message));
  else if (color === "red") console.log(chalk.rgb(188, 11, 70)(message));
  else if (color === "magenta") console.log(chalk.rgb(119, 51, 187)(message));
}

export function welcomeMessage() {
  welcome({
    title: `react-cleanup-cli`,
    tagLine: `by Souvik Roy`,
    description: "A cli to set up a clean React project",
    version: "0.0.7",
    bgColor: "#6cc24a",
    color: "#000000",
    bold: true,
  });
}

export function handleExit() {
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

//function to delete a specific line from App.jsx or App.tsx
export async function updateFile(pathOf: string, mainFile: string) {
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
  await fsP.writeFile(pathOf, updatedData, "utf8");
  colorMessage("green", mainFile + " Cleaned");
}

//function to cleanup App.css and add basic reset
export async function cleanAppCss(filePath: string) {
  let updatedCss: string | string[] = [
    "*{",
    "   padding:0;",
    "   margin:0;",
    "   box-sizing:border-box;",
    "}",
  ];
  updatedCss = updatedCss.join("\n");
  await fsP.writeFile(filePath, updatedCss, "utf8");
  colorMessage("green", "App.css file cleaned");
}

export async function removeImport(pathOf: string, stringToSearch: string) {
  try {
    let data = await fsP.readFile(pathOf, "utf8");
    let lines = data.split("\n");
    lines = lines.filter((line) => !line.includes(stringToSearch));
    let updatedData = lines.join("\n");
    await fsP.writeFile(pathOf, updatedData, "utf8");
    colorMessage("green", "index.css import removed from main");
  } catch (err) {
    console.log(err);
    console.log(chalk.red("Error reading file"));
    return;
  }
}
export async function changeSiteTitle(
  pathOf: string,
  stringToSearch: string,
  siteTitle: string
) {
  try {
    let data = await fsP.readFile(pathOf, "utf8");
    let updatedData = data.replace(stringToSearch, siteTitle);
    await fsP.writeFile(pathOf, updatedData, "utf8");
    colorMessage("green", `Site Title changed to ${siteTitle}`);
  } catch (err) {
    console.log(err);
    console.log(chalk.red("Error reading file"));
    return;
  }
}

export async function removeSvgs(pathToFiles: string[]) {
  for (let file of pathToFiles) {
    if (fs.existsSync(file)) {
      await fsP.rm(file);
      colorMessage("green", `Removed ${path.basename(file)} successfully`);
    } else {
      colorMessage("red", `${file} does not exist`);
    }
  }
}

export async function performOperations({
  fullPath,
  confirmAll = false,
  isTypeScript = false,
  htmlTitle = false,
  deleteSvgs = false,
}: {
  fullPath: string;
  confirmAll?: boolean;
  isTypeScript?: boolean;
  htmlTitle?: boolean;
  deleteSvgs?: boolean;
}) {
  const packageJson = path.resolve(fullPath, "package.json");

  try {
    const file = await fsP.readFile(packageJson, "utf-8");
    // check if react is part of dependenies or devDependencies
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

      // Check if this is a Javascript or TypeScript project
      // By checking the presence of a tsconfig.json in the root folder
      let projectMain;
      if (
        fs.existsSync(path.resolve(fullPath, "tsconfig.json")) ||
        isTypeScript
      ) {
        projectMain = "App.tsx";
      } else {
        projectMain = "App.jsx";
      }
      let mainFileName = "main." + projectMain.split(".")[1];
      console.log();

      let mainFilePath = path.join(fullPath, "src", projectMain);
      let appCssPath = path.join(fullPath, "src", "App.css");
      let mainJsxPath = path.join(fullPath, "src", mainFileName);

      await updateFile(mainFilePath, projectMain);
      await cleanAppCss(appCssPath);
      await removeImport(mainJsxPath, "index.css");
      if (fs.existsSync(path.resolve(fullPath, "src", "index.css"))) {
        let pathToremove = path.resolve(fullPath, "src", "index.css");
        await fsP.rm(pathToremove);
        colorMessage("green", "Deleting index.css");
      } else {
        colorMessage("red", "index.css does not exist");
      }
      if (htmlTitle || confirmAll) {
        let indexHtmlFile = path.join(fullPath, "index.html");
        let siteTitle = path.basename(fullPath);
        const titleToReplace =
          projectMain === "App.jsx" ? "Vite + React" : "Vite + React + TS";
        await changeSiteTitle(indexHtmlFile, titleToReplace, siteTitle);
      }
      if (deleteSvgs || confirmAll) {
        const reactSvgPath = path.join(fullPath, "src/assets", "react.svg");
        const viteSvgPath = path.join(fullPath, "public/vite.svg");
        await removeSvgs([reactSvgPath, viteSvgPath]);
      }
    }
    colorMessage("magenta", `Files cleaned and project created at ${fullPath}`);
    console.log();
    let confirmEmptyFolders;
    if (!confirmAll) {
      let emptyFolderString = `There are 2 empty folders: 'assets' and 'public'
Do you want to delete them?`;
      confirmEmptyFolders = await confirm({
        message: emptyFolderString,
      });
    } else {
      confirmEmptyFolders = true;
    }
    if (confirmEmptyFolders || confirmAll) {
      await fsP.rmdir(path.join(fullPath, "public"));
      await fsP.rmdir(path.join(fullPath, "src", "assets"));
      colorMessage("green", "Empty folders 'assets' and 'public' deleted");
    }

    let additionalOptions = await select({
      message: "What do you want to do next?",
      choices: [
        {
          name: "Open Project with VS Code ( You need to have the command code in $path )",
          value: "openCode",
        },
        { name: "Exit", value: "Exit" },
      ],
    });
    if (additionalOptions === "openCode") {
      runCommand(`code ${fullPath}`);
      colorMessage("green", "👋 Exiting..");
      process.exit(0);
    } else {
      colorMessage("green", "👋 Exiting..");
      process.exit(0);
    }
  } catch (err) {
    console.log(err);
    colorMessage("red", "Error while reading json file");
  }
}
