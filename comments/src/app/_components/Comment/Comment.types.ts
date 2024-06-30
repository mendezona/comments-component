import { z } from "zod";

export const CommentObjectSchema = z.object({
  author: z.string(),
  commentText: z.string(),
  createdAt: z.string(),
});

export type CommentObject = z.infer<typeof CommentObjectSchema>;

export const CommentFormSchema = z.object({
  author: z.string(),
  commentText: z.string(),
});

export type CommentForm = z.infer<typeof CommentFormSchema>;
