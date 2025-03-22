import { parseEther } from "viem";
import { createRecallClient } from "./recallClient";

export async function fullRecallFlow() {
  const client = createRecallClient();

  // Purchase credit
  const creditManager = client.creditManager();
  const { meta: creditMeta } = await creditManager.buy(parseEther("1"));
  console.log("✅ Credit purchased at:", creditMeta?.tx?.transactionHash);

  // Create a bucket
  const bucketManager = client.bucketManager();
  const {
    result: { bucket },
  } = await bucketManager.create();
  console.log("🪣 Bucket created:", bucket);

  // Add an object to a bucket
  const key = "hello/world";
  const content = new TextEncoder().encode("hello world");
  const file = new File([content], "file.txt", {
    type: "text/plain",
  });

  const { meta: addMeta } = await bucketManager.add(bucket, key, file);
  console.log("📤 Object added at:", addMeta?.tx?.transactionHash);

  // Query objects
  const prefix = "hello/";
  const {
    result: { objects },
  } = await bucketManager.query(bucket, { prefix });
  console.log("📁 Objects:", objects);

  // Get an object
  const { result: object } = await bucketManager.get(bucket, key);
  const contents = new TextDecoder().decode(object);
  console.log("📄 Contents:", contents);
}
