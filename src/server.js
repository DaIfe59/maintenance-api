import app from "./app.js";
import config from "./config/config.js";
import { getLogger } from "./middlewares/logger.js";

const logger = getLogger();

app.listen(config.port, () => {
  logger.info(
    `Server started on http://localhost:${config.port}`
  );
});