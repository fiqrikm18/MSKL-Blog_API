import {config as configureEnv} from "dotenv";
import app from "./app";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User {
      userId: string;
      username: string;
      [key: string]: any;
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
