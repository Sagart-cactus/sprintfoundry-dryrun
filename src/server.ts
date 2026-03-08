import { createApp } from "./app";

const port = Number.parseInt(process.env.PORT ?? "3000", 10);
const app = createApp();

app.listen(port, () => {
  // eslint-disable-next-line no-console
  process.stdout.write(`Task API listening on port ${port}\n`);
});
