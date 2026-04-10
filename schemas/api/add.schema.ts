import * as z from "zod";
import { CreateTextBody } from "@/types/api/add/createTextBody.dto"; 
import { CreateFileBody } from "@/types/api/add/createFileBody.dto"; 

const createTextBodySchema = z.object({
  type: z.literal("text"),
  x: z.number(),
  y: z.number(),
  text: z.string().trim().min(1, { error: "text is required" }),
}) satisfies z.ZodType<CreateTextBody>;

const createFileBodySchema = z.object({
  type: z.literal("file"),
  x: z.number(),
  y: z.number(),
  path: z.string().trim().min(1, { error: "path is required" }),
  width: z.number(),
  height: z.number(),
}) satisfies z.ZodType<CreateFileBody>;

const createItemBodySchema = z.discriminatedUnion("type", [
  createTextBodySchema,
  createFileBodySchema,
]);

export { createItemBodySchema };
