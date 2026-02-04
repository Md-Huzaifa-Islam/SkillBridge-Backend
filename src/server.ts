import { config } from "./config/config";
import { app } from "./app";

const port = config.port;

app.listen(port, () => {
  console.log(`
╔════════════════════════════════════════╗
║   🎓 SkillBridge Backend Server 🎓    ║
╠════════════════════════════════════════╣
║  Server running on port: ${port}        ║
║  Environment: ${config.node_env || "development"}               ║
║  Ready to connect tutors & students!  ║
╚════════════════════════════════════════╝
  `);
});
