import { z } from "zod";

export interface CommentFormProps {
  parentCommentId?: string;
  onCancelFunction?: () => void;
  onSuccessFunction?: () => void;
}

export const CommentFormSchema = z.object({
  parentCommentId: z.string().optional(),
  author: z.string().min(1, { message: "Author is required" }),
  commentText: z.string().min(1, { message: "Comment text is required" }),
});

export type CommentForm = z.infer<typeof CommentFormSchema>;
