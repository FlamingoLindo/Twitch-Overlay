import * as z from "zod";
import { PatchTextBody } from "@/types/api/patch/patchTextBody.dto"; 
import { PatchFileBody } from "@/types/api/patch/patchFileBody.dto"; 

const patchTextBodySchema = z.object({
  type: z.literal("text"),
  x: z.number(),
  y: z.number(),
  fontSize: z.string().trim().min(1, { error: "fontSize is required" }),
}) satisfies z.ZodType<PatchTextBody>;

const patchFileBodySchema = z.object({
  type: z.literal("file"),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
}) satisfies z.ZodType<PatchFileBody>;

const patchItemBodySchema = z.discriminatedUnion("type", [
  patchTextBodySchema,
  patchFileBodySchema,
]);

export { patchItemBodySchema };
