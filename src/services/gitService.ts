import { exec } from "child_process";
import { ErrorHandler, GitServiceError } from "../error-handler";

export const exeCommand = (command: string) => {
    return new Promise<string>((resolve, reject) => {
        const a = exec(command, (error, stdout, _stderr) => {
            if (error) {
                ErrorHandler.throw(new GitServiceError(stdout, command));
            }
            resolve(stdout);
        });
    });
};

export const getUser = async () => {
    const data = await exeCommand("git config user.name && git config user.email");

    const [name, email] = data.split("\n").map((l) => l.trim());
    return { name, email, toString: () => `${name} <${email}>` };
};
