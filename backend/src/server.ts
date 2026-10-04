import { db } from "./common/database/index.js";
import { app } from "./app.js";
const port = process.env.PORT || 3000;

await db.connect(process.env.MONGO_URI!, {
  dbName: process.env.MONGO_DB_NAME!,
});

app.listen(port, () => {
  console.log(`La aplicación está corriendo en http://localhost:${port}`);
});
