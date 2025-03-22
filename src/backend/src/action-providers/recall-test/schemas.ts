import { z } from "zod";

export const CreateRecallClientSchema = z.object({
  networkName: z.enum(["testnet", "mainnet"]),
});

export const GetRecallBalanceSchema = z.object({
  address: z.string().optional(),
});

export const StoreRecallDataSchema = z.object({
  key: z.string(),
  value: z.any(),
  options: z
    .object({
      permanent: z.boolean().optional(),
      private: z.boolean().optional(),
    })
    .optional(),
});

export const RetrieveRecallDataSchema = z.object({
  key: z.string(),
});

export const PurchaseRecallCreditSchema = z.object({
  amount: z.string().describe("Amount of ETH to convert to credits (e.g. '1' for 1 ETH)"),
});

export const CreateRecallBucketSchema = z.object({
  name: z.string().optional().describe("Optional name for the bucket"),
});

export const AddObjectToBucketSchema = z.object({
  bucket: z.string().describe("Bucket ID to add the object to"),
  key: z.string().describe("Key/path for the object"),
  content: z.string().describe("Content to store"),
  contentType: z.string().optional().describe("Optional content type (e.g. 'text/plain')"),
});

export const QueryBucketObjectsSchema = z.object({
  bucket: z.string().describe("Bucket ID to query objects from"),
  prefix: z.string().optional().describe("Optional prefix to filter objects by"),
});

export const GetBucketObjectSchema = z.object({
  bucket: z.string().describe("Bucket ID to get the object from"),
  key: z.string().describe("Key/path of the object to retrieve"),
});

export type CreateRecallClientInput = z.infer<typeof CreateRecallClientSchema>;
export type GetRecallBalanceInput = z.infer<typeof GetRecallBalanceSchema>;
export type StoreRecallDataInput = z.infer<typeof StoreRecallDataSchema>;
export type RetrieveRecallDataInput = z.infer<typeof RetrieveRecallDataSchema>;
export type PurchaseRecallCreditInput = z.infer<typeof PurchaseRecallCreditSchema>;
export type CreateRecallBucketInput = z.infer<typeof CreateRecallBucketSchema>;
export type AddObjectToBucketInput = z.infer<typeof AddObjectToBucketSchema>;
export type QueryBucketObjectsInput = z.infer<typeof QueryBucketObjectsSchema>;
export type GetBucketObjectInput = z.infer<typeof GetBucketObjectSchema>; 