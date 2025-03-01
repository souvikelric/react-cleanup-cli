export declare const runCommand: (command: string) => Promise<string>;
declare function getOutput(): Promise<string[]>;
export declare function createReactProject(projectName: string, isTypeScript: boolean): Promise<string>;
export default getOutput;
