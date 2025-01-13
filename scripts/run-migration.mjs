/* eslint-disable no-undef */
/* eslint-disable no-console */
import { exec } from "child_process";

function runMigration() {
    exec("npm run migration:run", (error, stdout, stderr) => {
        if (error) {
            // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, no-console, no-undef
            console.error(`Error execution migrations: ${error}`);
            return;
        }

        if (stderr) {
            // eslint-disable-next-line no-undef
            console.error(`Error output: ${stderr}`);
            return;
        }

        console.log(`Migration output: ${stdout}`);
    });
}

runMigration();
