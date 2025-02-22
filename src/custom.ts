import { exec } from "child_process";
import { colorMessage } from "./index.js";

const runCommand = async (command: string): Promise<string> => {
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
  console.log();
  const output = await runCommand("find ./ -type d -maxdepth 1");
  let folders: string | string[] = output.split("\n");
  folders.shift();
  folders = folders.map((folderName) => folderName.replace(".//", ""));
  // let foldersString = folders.join("\n");
  // colorMessage("green", foldersString);
  return folders;
}

export default getOutput;
