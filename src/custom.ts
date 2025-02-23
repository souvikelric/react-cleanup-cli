import { exec } from "child_process";
import * as os from "os";

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

export default getOutput;
