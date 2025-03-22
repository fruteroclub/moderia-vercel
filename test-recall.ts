// test-recall.ts
import { fullRecallFlow } from "./src/lib/recallActions";
import { env } from "process";

fullRecallFlow().then(() => {
  console.log("✅ Flow completed");
}).catch(console.error);
