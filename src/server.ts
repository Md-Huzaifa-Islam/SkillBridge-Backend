import { config } from "./config/config";
import { app } from "./app";

const port = config.port;

// Only start server if not in production (Vercel handles this)
if (config.node_env !== "production") {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

// Export for Vercel
export default app;
