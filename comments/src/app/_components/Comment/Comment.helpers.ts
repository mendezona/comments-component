import dayjs from "dayjs";
import { v7 as uuidv7 } from "uuid";
import { LOCAL_STORAGE_ALL_COMMENTS_KEY } from "~/app/app.constants";
import { capitaliseAllWords } from "../CommentForm/CommentForm.helpers";
import { type CommentForm } from "../CommentForm/CommentForm.types";
import { type CommentObjectInterface } from "./Comment.types";

export function updateCommentsInLocalStorage(
  newCommentsState: CommentObjectInterface[],
) {
  const newCommentsStateToString: string = JSON.stringify(newCommentsState);
  console.log("Storing comments:", newCommentsStateToString);
  localStorage.setItem(
    LOCAL_STORAGE_ALL_COMMENTS_KEY,
    newCommentsStateToString,
  );
  console.log("Comments successfully stored in localStorage.");
  console.log("attempt in sessionStorage too");
  sessionStorage.setItem(
    LOCAL_STORAGE_ALL_COMMENTS_KEY,
    newCommentsStateToString,
  );
}

export function replyToExistingComment(
  newComment: CommentForm,
  currentCommentsState: CommentObjectInterface[],
): boolean {
  for (const comment of currentCommentsState) {
    if (comment.commentId === newComment.parentCommentId) {
      if (!comment.nestedComments) {
        comment.nestedComments = [];
      }
      comment.nestedComments.unshift({
        ...newComment,
        author: capitaliseAllWords(newComment.author),
        commentId: uuidv7().toString(),
        createdAt: dayjs().toString(),
      });
      updateCommentsInLocalStorage(currentCommentsState);
      return true;
    }
    if (comment.nestedComments) {
      const result: boolean = replyToExistingComment(
        newComment,
        comment.nestedComments,
      );
      if (result) {
        updateCommentsInLocalStorage(currentCommentsState);
        return true;
      }
    }
  }
  return false;
}

export function deleteComment(
  commentId: string,
  currentCommentsState: CommentObjectInterface[],
): boolean {
  const isDeleted: boolean = recursiveDeleteComment(
    commentId,
    currentCommentsState,
  );
  if (isDeleted) {
    updateCommentsInLocalStorage(currentCommentsState);
    return true;
  } else {
    console.log("Comment to delete not found");
    return false;
  }
}

export function recursiveDeleteComment(
  commentId: string,
  currentCommentsState: CommentObjectInterface[],
): boolean {
  if (currentCommentsState) {
    for (let i = 0; i < currentCommentsState.length; i++) {
      if (currentCommentsState[i]!.commentId === commentId) {
        currentCommentsState.splice(i, 1);
        return true;
      }
      if (currentCommentsState[i]!.nestedComments) {
        const result: boolean = recursiveDeleteComment(
          commentId,
          currentCommentsState[i]!.nestedComments!,
        );
        if (result) {
          return true;
        }
      }
    }
  }
  return false;
}
