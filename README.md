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

## Features

- **Create React Projects with Vite**: Create a new React project with just a single command.
- **Interactive Prompts**: Choose whether to include TypeScript in your project.
- **Cleanup Options**: After project creation, decide which files and configurations to clean up for a leaner project setup.
- **TypeScript-Based**: The CLI itself is developed using TypeScript to provide better tooling and type checking.

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

### Run the CLI

Run the CLI from anywhere in your system in your terminal or cmd using the command

cleanReact

```bash
cleanReact

```

### Changes

Added type declarations in dist folder
Added option to start up project in VS Code
