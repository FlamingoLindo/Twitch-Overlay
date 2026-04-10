import * as z from "zod";
import { PatchTextBody } from "../dto/patch/patchTextBody";
import { PatchFileBody } from "../dto/patch/patchFileBody";

const patchTextBodySchema = z.object({
  type: z.literal("text"),
  x: z.number(),
  y: z.number(),
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
