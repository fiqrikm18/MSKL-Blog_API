import {config as configureEnv} from "dotenv";
import app from "./app";

configureEnv();
const port = process.env.APPLICATION_PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
