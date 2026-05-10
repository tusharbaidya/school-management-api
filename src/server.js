const app = require("./app");
const { testConnection } = require("./config/database");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await testConnection();

  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`   http://localhost:${PORT}\n`);
  });
};

startServer();
