import {config as configureEnv} from "dotenv";
import app from "./app";

declare global {
  namespace Express {
    interface User {
      id: string;
      // add other user properties if needed
    }
    interface Request {
      user?: User;
    }
  }
}

configureEnv();
const port = process.env.APPLICATION_PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
