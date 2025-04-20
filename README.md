# Clean React CLI Tool

Ever wanted a tool that creates a React project for you with all the clutter removed?
Vite is a great bundling tool that sets up a React Project quickly.
But for those of us who don't want any of the boilerplate css or jsx or to remove the svgs it has to be done manually.

Well, this tool is exactly what you need!
One command, a few preferences with some interactivity and you are done.
You will have a cleaned up React JS/TS project setup for you without all the extra boilerplate.

Hope you have fun !

This command-line interface (CLI) tool helps you quickly create a React project using [Vite](https://vitejs.dev/), a fast build tool and development server. It provides an interactive experience to customize your project setup by:

1. Allowing you to choose whether to include TypeScript or not.
2. Offering an interactive prompt to clean up your newly created React project based on your preferences.

This CLI is built using TypeScript to provide type safety and improved development experience.

# 📦 Features

- 🧼 Cleans up your freshly scaffolded React project
- 💡 Supports both JavaScript and TypeScript
- 🧙 Interactive terminal experience (with fallback to CLI args)
- 🧹 Removes boilerplate SVGs and default content
- 🎯 Optional tweaks like updating the HTML title
- ⚡ Super smooth DX with colored logs and helpful prompts

## Installation

### Prerequisites

Before you can use the CLI, ensure that you have the following installed:

- **Node.js**: You need Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).
- **npm**: npm comes bundled with Node.js. If you already have Node.js, you should have npm as well.

### Install the CLI Globally

To use the CLI globally, you can install it using npm (or yarn):

```bash
sudo npm install -g vite-react-cli

```

Or run directly via:

```bash
npx react-cleanup-cli
```

### Run the CLI

Run the CLI from anywhere in your system in your terminal or cmd using the command

🛠️ Usage

👉 CLI (Non-interactive mode)

```console
react-cleanup-cli my-awesome-app --typescript true
```

1. my-awesome-app: Folder name where the project will be created.
2. --typescript true: Whether the project should use TypeScript (true or false).

This will:

1. Create a Vite-powered React project (with or without TypeScript)
2. Remove SVGs and default boilerplate
3. Change the HTML title to the project name
4. 🎉 You're ready to code!

OR

```bash
cleanReact

```

🤖 Interactive Mode
Just run:

```console
react-cleanup-cli
```

## And follow the prompts like:

- 📁 Do you already have a project directory?
- 🧾 Do you want to change the HTML title?
- 🧼 Want to remove default React/Vite SVGs?
- 🟦 JavaScript or TypeScript?

## ✨ What It Does

✅ Initializes a Vite + React app

- 🧹 Cleans App.js(x) / App.ts(x)
- 🎨 Resets App.css
- 🗑 Deletes Vite/React default SVGs
- 🧼 Cleans main.jsx/tsx of unnecessary imports
- 🏷️ Optionally updates <title> in index.html

## 🔍 Behind the Scenes

1. Uses @inquirer/prompts for beautiful interactive flows.
2. Validates input (no uppercase in project name).
3. Confirms file existence (checks for node_modules, etc.).
4. Uses chalk for clean, colored CLI messages.

### Changes

#### in version 0.0.8

Added command line args which takes all options as yes
Example provided above
