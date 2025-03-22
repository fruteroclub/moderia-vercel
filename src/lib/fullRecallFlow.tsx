import { parseEther } from "viem";
import { createRecallClient } from "./recallClient";

export async function fullRecallFlow() {
  const client = createRecallClient();
  const bucketManager = client.bucketManager();

  const {
    result: { bucket },
  } = await bucketManager.create();
  console.log("🪣 Bucket created:", bucket);

  const key = "hello/world";
  const content = Buffer.from("hello world");

  const file = new File([content], "file.txt", {
    type: "text/plain",
  });

  const { meta: addMeta } = await bucketManager.add(bucket, key, file);
  console.log("📤 Object added at:", addMeta?.tx?.transactionHash);

  const {
    result: { objects },
  } = await bucketManager.query(bucket, { prefix: "hello/" });
  console.log("📁 Objects:", objects);

  const { result: object } = await bucketManager.get(bucket, key);
  const contents = Buffer.from(object).toString("utf-8");
  console.log("📄 Contents:", contents);
}
