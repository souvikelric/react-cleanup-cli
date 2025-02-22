import { exec } from "child_process";
const runCommand = async (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if (err) {
                reject(`Error: ${err.message}`);
            }
            else if (stderr) {
                reject(`stderr: ${stderr}`);
            }
            else {
                resolve(stdout);
            }
        });
    });
};
async function getOutput() {
    const output = await runCommand("ls");
    console.log(output);
}
export default getOutput;
