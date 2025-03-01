import { exec } from "child_process";
import * as os from "os";
import { colorMessage } from "./index.js";
import ora from "ora";

const spinner = ora("Installing dependencies");
spinner.color = "magenta";

export const runCommand = async (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        reject(`Error: ${err.message}`);
      } else if (stderr) {
        reject(`stderr: ${stderr}`);
      } else {
        resolve(stdout);
      }
    });
  });
};

async function getOutput(): Promise<string[]> {
  // console.log();
  let output: string;
  if (os.type() === "Windows_NT") {
    output = await runCommand("Get-ChildItem -Directory");
  } else {
    output = await runCommand("find ./ -type d -maxdepth 1");
  }
  let folders: string | string[] = output.split("\n");
  folders.shift();
  folders = folders.map((folderName) => folderName.replace(".//", ""));
  return folders;
}

export async function createReactProject(
  projectName: string,
  isTypeScript: boolean
) {
  let reactTemplate = isTypeScript ? "react-ts" : "react";
  let reactCommand = `npm create vite@latest ${projectName} -- --template ${reactTemplate}`;
  let output = await runCommand(reactCommand);
  console.log(output.split("\n")[5]);
  colorMessage("green", "Project created successfully");
  process.chdir(projectName);
  //colorMessage("magenta", "Installing dependencies...");
  spinner.start();
  await runCommand("npm install");
  spinner.stop();
  colorMessage("green", "Dependencies installed successfully");
  process.chdir("../");
  return "success";
}

export default getOutput;
