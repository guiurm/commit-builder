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
export const setUser = async (name: string, email: string) => await exeCommand(`git config user.name "${name}" && git config user.email "${email}"`);

// Función para procesar los archivos listados con un prefijo
const processFiles = (data: string) => {
    const files = { added: [] as string[], modified: [] as string[], deleted: [] as string[] };

    data.split("\n")
        .map((line) => line.trim()) // Limpiar cada línea
        .forEach((line) => {
            const status = line.charAt(0); // Primer carácter (A, M, D)
            const file = line.slice(2).trim(); // El nombre del archivo después del espacio

            if (status === "A")
                files.added.push(file); // Archivos añadidos
            else if (status === "M")
                files.modified.push(file); // Archivos modificados
            else if (status === "D") files.deleted.push(file); // Archivos eliminados
        });

    return files;
};

// Obtener los archivos staged (preparados para commit)
export const listStagedFiles = async () => {
    const data = await exeCommand("git diff --name-status --staged");
    return processFiles(data);
};

// Obtener los archivos unstaged (modificados pero no preparados)
export const listUnstagedFiles = async () => {
    const data = await exeCommand("git diff --name-status");
    return processFiles(data);
};

// Obtener los archivos untracked (no seguidos por Git)
export const listUntrackedFiles = async () => {
    const data = await exeCommand("git ls-files --others --exclude-standard");

    // Devuelve los archivos sin procesar (simplemente los divide por líneas)
    return data.split("\n").map((line) => line.trim());
};
