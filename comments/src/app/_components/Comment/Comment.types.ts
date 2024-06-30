import { z } from "zod";

export const CommentObjectSchema = z.object({
  commentId: z.string(),
  author: z.string(),
  commentText: z.string(),
  createdAt: z.string(),
});

export type CommentObject = z.infer<typeof CommentObjectSchema>;

export const CommentFormSchema = z.object({
  author: z.string().min(1, { message: "Author is required" }),
  commentText: z.string().min(1, { message: "Comment text is required" }),
});

export type CommentForm = z.infer<typeof CommentFormSchema>;
