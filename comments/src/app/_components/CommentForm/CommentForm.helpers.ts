import dayjs from "dayjs";
import { v7 as uuidv7 } from "uuid";
import { updateCommentsInLocalStorage } from "../Comment/Comment.helpers";
import { type CommentObjectInterface } from "../Comment/Comment.types";
import { type CommentForm } from "./CommentForm.types";

export function addNewComment(
  newComment: CommentForm,
  currentCommentsState: CommentObjectInterface[],
) {
  const newCommentWithTimestamp: CommentObjectInterface = {
    ...newComment,
    author: capitaliseAllWords(newComment.author),
    commentId: uuidv7().toString(),
    createdAt: dayjs().toString(),
  };

  if (currentCommentsState) {
    const appendedComments: CommentObjectInterface[] = [
      newCommentWithTimestamp,
      ...currentCommentsState,
    ];
    updateCommentsInLocalStorage(appendedComments);
  } else {
    const newComments: CommentObjectInterface[] = [newCommentWithTimestamp];
    updateCommentsInLocalStorage(newComments);
  }
}

export function capitaliseAllWords(str: string): string {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
