var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { exec } from "child_process";
const runCommand = (command) => __awaiter(void 0, void 0, void 0, function* () {
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
});
function getOutput() {
    return __awaiter(this, void 0, void 0, function* () {
        const output = yield runCommand("ls");
        console.log(output);
    });
}
getOutput();
