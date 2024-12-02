import { confirm, question, select } from "askly";
import { genCommand } from "cli-frw";
import { AppError, ErrorHandler, ExternalServiceError } from "../error-handler";
import { exeCommand, getUser } from "../services/gitService";

const commitTypes = ["feat", "fix", "docs", "style", "refactor", "test", "chore", "revert", "wip", "build"] as const;
const commitCommand = genCommand(
    "commit",
    [
        {
            name: "type",
            optionType: "string",
            flag: "-t",
            alias: ["--type"],
            defaultValue: "wip",
            required: false,

            customValidator: (n) => {
                if (!commitTypes.includes(n)) ErrorHandler.throw(new AppError("Invalid type of commit"));
                return n;
            },
        },
        {
            name: "title",
            optionType: "string",
            flag: "-m",
            alias: ["--title"],

            required: false,
        },
        {
            name: "body",
            optionType: "string",
            flag: "-b",
            alias: ["--message"],

            required: false,
        },
    ] as const,
    [] as const
);

commitCommand.action(async (_, { body, title, type }, argsP) => {
    let target = "";
    if (!type)
        try {
            type = (
                await select({
                    choices: [
                        { name: "🚀 feat", value: "feat", description: "Agregar una nueva funcionalidad o característica al proyecto." },
                        { name: "🐛 fix", value: "fix", description: "Corregir un error o bug en el código." },
                        { name: "📚 docs", value: "docs", description: "Actualizar o modificar la documentación del proyecto (README, comentarios, etc.)." },
                        {
                            name: "🎨 style",
                            value: "style",
                            description: "Cambios en el formato o estilo del código, sin afectar la funcionalidad (por ejemplo, espaciado, sangrías, nombres de variables).",
                        },
                        {
                            name: "♻️  refactor",
                            value: "refactor",
                            description: "Reestructuración del código para mejorar su calidad o rendimiento, sin cambiar su comportamiento.",
                        },
                        { name: "🧪 test", value: "test", description: "Añadir o modificar pruebas (unitarias, de integración) para mejorar la cobertura del código." },
                        { name: "🧹 chore", value: "chore", description: "Tareas de mantenimiento, configuración o administración, que no afectan la funcionalidad del proyecto." },
                        { name: "⏪ revert", value: "revert", description: "Deshacer cambios realizados en un commit anterior." },
                        { name: "⚒️  wip", value: "wip", description: "Trabajo en progreso, commit incompleto que refleja cambios aún en desarrollo." },
                        {
                            name: "🏗️  build",
                            value: "build",
                            description: "Cambios relacionados con la construcción del proyecto, como dependencias, compilación o configuración.",
                        },
                    ],
                    message: "Select type: ",
                })
            ).value;

            if (!title) title = await question({ message: "Title: " });
            if (!body) body = await question({ message: "Body: " });
            target = await question({ message: "Target: " });
        } catch (error) {
            ErrorHandler.throw(new ExternalServiceError("Error obtaining commit info bia cly", "askly"));
        }

    target = target ? `(${target})` : target;

    const user = await getUser();
    console.log("\nauthor: ", user.toString());

    console.log("type: ", type);
    console.log("title: ", title);
    console.log("body: ", body);

    if (await confirm("Is this correct?")) {
        console.log("\nCommitting...");
        const result = await exeCommand(`git commit -m "${type}${target}: ${title}\n\n${body}"`);
        console.log("result:");
        console.log(result);
    } else {
        console.log("\nAborting...");
        process.exit(1);
    }
});

export { commitCommand };
