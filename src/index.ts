import { CliCommandApp } from "cli-frw";
import { commitCommand } from "./commands/commitCommand";
import { configUserCommand } from "./commands/configUserCommand";
import { AppError, ErrorHandler } from "./error-handler";

//exeCommand("git config user.name");
const run = async () => {
    ErrorHandler.subscribe((error) => {
        console.error(`\n[${error.VERSION_NAME}]: ${error.message}`);
        if (error instanceof AppError) console.log(`Error ocurred during script execution at:\n${error.lastTrack}\n`);

        process.exit(1);
    });
    await new CliCommandApp([commitCommand, configUserCommand]).start();
};

run();
