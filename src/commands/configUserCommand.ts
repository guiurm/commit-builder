import { confirm, question } from "askly";
import { genCommand } from "cli-frw";
import { getUser } from "../services/gitService";

const configUserCommand = genCommand(
    "config-user",
    [
        {
            name: "name",
            optionType: "string",
            flag: "-n",
            alias: ["--name"],
            required: false,
        },
        {
            name: "email",
            optionType: "string",
            flag: "-e",
            alias: ["--email"],
            required: false,
        },
    ] as const,
    [] as const
);
configUserCommand.action(async (_, { name, email }, argsP) => {
    if (!name) name = await question({ message: "User name: " });
    if (!email) email = await question({ message: "User email: " });

    console.log("\nIs this correct?");

    console.log("name: ", name);
    console.log("email: ", email);

    if (await confirm("Is this correct?")) {
        console.log("\Updating user configuration...");
        // await exeCommand(`git config user.name "${name}" && git config user.email "${email}"`);
        const data = await getUser();
        console.log(data);
    } else {
        console.log("\nAborting...");
        process.exit(1);
    }
});

export { configUserCommand };
