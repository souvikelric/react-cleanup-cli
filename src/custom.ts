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

async function getOutput() {
  console.log();
  const output = await runCommand("ls");
  colorMessage("green", output);
}

export default getOutput;
