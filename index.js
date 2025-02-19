#!/usr/bin/env node
import * as fs from "fs";
import path from "path";
import { exit } from "process";
const currDir = process.cwd();
const args = process.argv.slice(2);
let fullPath = "";

function checkNode_Modules(dirpath) {
  let modulePath = path.resolve(dirpath, "node_modules");
  if (!fs.existsSync(modulePath)) {
    console.log("Node Modules folder does not exist");
    exit(1);
  } else {
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
    console.log(err);
    console.log("Error while reading json file");
    exit(1);
  }
  try {
    const jsonData = JSON.parse(file);
    const { dependencies, devDependencies } = jsonData;
    const reactExist =
      dependencies.react !== undefined || devDependencies.react !== undefined;
    console.log(reactExist);
    // check if react is par of dependenies or devDependencies
  } catch (err) {
    console.log(err);
    console.log("Error while reading json file");
  }
});
