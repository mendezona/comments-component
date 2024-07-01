import { z } from "zod";
import { LOCAL_STORAGE_ALL_COMMENTS_KEY } from "~/app/app.constants";
import {
  CommentObjectSchema,
  type CommentObjectInterface,
} from "../Comment/Comment.types";

export function getCommentsFromLocalStorage(
  localStorageKey: string = LOCAL_STORAGE_ALL_COMMENTS_KEY,
): CommentObjectInterface[] {
  const commentsString: string | null = localStorage.getItem(localStorageKey);
  if (!commentsString) {
    throw new Error("No comments object found in localStorage");
  }
  const CommentSchemaArray = z.array(CommentObjectSchema);
  const comments: CommentObjectInterface[] = CommentSchemaArray.parse(
    JSON.parse(commentsString),
  );
  return comments;
}
