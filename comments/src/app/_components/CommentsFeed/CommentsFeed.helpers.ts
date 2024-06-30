import { z } from "zod";
import {
  CommentObjectSchema,
  type CommentObject,
} from "../Comment/Comment.types";
import { LOCAL_STORAGE_ALL_COMMENTS_KEY } from "./CommentsFeed.constants";

export async function getCommentsFromLocalStorage(
  localStorageKey: string = LOCAL_STORAGE_ALL_COMMENTS_KEY,
): Promise<CommentObject[]> {
  const commentsString = localStorage.getItem(localStorageKey);
  if (!commentsString) {
    throw new Error("No comments object found in localStorage");
  }
  try {
    const CommentSchemaArray = z.array(CommentObjectSchema);
    const comments = CommentSchemaArray.parse(JSON.parse(commentsString));
    return comments;
  } catch (error) {
    console.error("Error parsing localStorage data:", error);
    throw error;
  }
}
