"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const port = Number.parseInt(process.env.PORT ?? "3000", 10);
const app = (0, app_1.createApp)();
app.listen(port, () => {
    // eslint-disable-next-line no-console
    process.stdout.write(`Task API listening on port ${port}\n`);
});
