import initApp from "./src/app";
import config from "./src/config";

const app = initApp();

app.listen(config.port, () => {
  console.log(`Server started on ${config.port}`);
});
