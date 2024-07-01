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
