#!/usr/bin/env node
import * as fs from "fs";
import path from "path";
import { exit } from "process";
import getOutput, { createReactProject, runCommand } from "./custom.js";
import { select, confirm, input } from "@inquirer/prompts";
import * as fsP from "node:fs/promises";
import {
  colorMessage,
  handleExit,
  welcomeMessage,
  performOperations,
} from "./helperFunctions.js";

export type messageColor = "red" | "green" | "magenta";

const currDir = process.cwd();
let fullPath = "";

//getting passed arguments if any
let args = process.argv.slice(2);

process.on("SIGINT", handleExit);

console.clear();
welcomeMessage();

let nameFromArgs;
if (args.length > 0) {
  nameFromArgs = args[0];
  fullPath = path.join(currDir, nameFromArgs);
  console.log(fullPath);
  let isTypeScript;
  if (args.length > 1) {
    if (
      args[1] === "--typescript" &&
      (args[2] === "true" || args[2] === "false")
    ) {
      isTypeScript = Boolean(args[2]);
    } else {
      colorMessage("red", "Unidentified flag or option provided");
      colorMessage("red", "❌ Exiting");
      process.exit(1);
    }
  } else {
    isTypeScript = false;
  }

  colorMessage("green", "✅ Creating a Project with the provided options");
  let output = await createReactProject(nameFromArgs!, isTypeScript);
  if (output !== "success") {
    colorMessage("red", "An unexpected error occured. Try again later");
    process.exit(0);
  }
  performOperations({ fullPath, confirmAll: true });
} else {
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

  let htmlTitle: boolean = false,
    deleteSvgs: boolean = false;
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

  performOperations({ fullPath, htmlTitle, deleteSvgs });
}
