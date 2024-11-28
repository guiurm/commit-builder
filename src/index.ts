import { confirm, question, select } from "askly";

import { CliCommandApp, genCommand } from "cli-frw";

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
                if (!commitTypes.includes(n)) throw new Error("Invalid type");
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
    if (!type)
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
                    { name: "♻️  refactor", value: "refactor", description: "Reestructuración del código para mejorar su calidad o rendimiento, sin cambiar su comportamiento." },
                    { name: "🧪 test", value: "test", description: "Añadir o modificar pruebas (unitarias, de integración) para mejorar la cobertura del código." },
                    { name: "🧹 chore", value: "chore", description: "Tareas de mantenimiento, configuración o administración, que no afectan la funcionalidad del proyecto." },
                    { name: "⏪ revert", value: "revert", description: "Deshacer cambios realizados en un commit anterior." },
                    { name: "⚒️  wip", value: "wip", description: "Trabajo en progreso, commit incompleto que refleja cambios aún en desarrollo." },
                    { name: "🏗️  build", value: "build", description: "Cambios relacionados con la construcción del proyecto, como dependencias, compilación o configuración." },
                ],
                message: "Select type: ",
            })
        ).value;

    if (!title) title = await question({ message: "Title: " });
    if (!body) body = await question({ message: "Body: " });
    let target = await question({ message: "Target: " });
    target = target ? `(${target})` : target;

    console.log("\nIs this correct?");

    console.log("type: ", type);
    console.log("title: ", title);
    console.log("body: ", body);

    if (await confirm("Is this correct?")) {
        console.log("\nCommitting...");
        console.log(`git commit -m "${type}${target}: ${title}\n\n${body}"`);
    } else {
        console.log("\nAborting...");
        process.exit(1);
    }
});

new CliCommandApp([commitCommand]).start();
