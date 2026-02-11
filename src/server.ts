import { config } from "./config/config";
import app from "./app";

const port = config.port;

if (config.node_env !== "production") {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
