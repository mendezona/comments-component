import { type QueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { v7 as uuidv7 } from "uuid";
import { LOCAL_STORAGE_ALL_COMMENTS_KEY } from "~/app/app.constants";
import {
  type CommentForm,
  type CommentObject,
  type CommentObjectInterface,
} from "./Comment.types";

export async function updateCommentsInLocalStorage(
  newCommentsState: CommentObjectInterface[],
) {
  const newCommentsStateToString = JSON.stringify(newCommentsState);
  localStorage.setItem(
    LOCAL_STORAGE_ALL_COMMENTS_KEY,
    newCommentsStateToString,
  );
}

export async function addNewComment(
  newComment: CommentForm,
  currentCommentsState: CommentObjectInterface[],
) {
  try {
    const newCommentWithTimestamp = {
      ...newComment,
      commentId: uuidv7().toString(),
      createdAt: dayjs().toString(),
    };

    if (currentCommentsState) {
      const appendedComments: CommentObjectInterface[] = [
        newCommentWithTimestamp,
        ...currentCommentsState,
      ];
      await updateCommentsInLocalStorage(appendedComments);
    } else {
      const newComments: CommentObjectInterface[] = [newCommentWithTimestamp];
      await updateCommentsInLocalStorage(newComments);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function replyToExistingComment(
  newComment: CommentForm,
  currentCommentsState: CommentObjectInterface[],
): Promise<boolean> {
  for (const comment of currentCommentsState) {
    if (comment.commentId === newComment.parentCommentId) {
      if (!comment.nestedComments) {
        comment.nestedComments = [];
      }
      comment.nestedComments.unshift({
        ...newComment,
        commentId: uuidv7().toString(),
        createdAt: dayjs().toString(),
      });

      await updateCommentsInLocalStorage(currentCommentsState);
      return true;
    }
    if (comment.nestedComments) {
      const result = await replyToExistingComment(
        newComment,
        comment.nestedComments,
      );
      if (result) {
        await updateCommentsInLocalStorage(currentCommentsState);
        return true;
      }
    }
  }
  return false;
}

export async function deleteComment(
  commentId: string,
  queryClient: QueryClient,
) {
  try {
    const currentComments: CommentObject[] | undefined =
      queryClient.getQueryData<CommentObject[]>([
        LOCAL_STORAGE_ALL_COMMENTS_KEY,
      ]);

    if (currentComments) {
      const removeCommentFromCurrentComments: CommentObject[] =
        currentComments.filter((comment) => comment.commentId !== commentId);
      const removeCommentFromCurrentCommentsString: string = JSON.stringify(
        removeCommentFromCurrentComments,
      );
      localStorage.setItem(
        LOCAL_STORAGE_ALL_COMMENTS_KEY,
        removeCommentFromCurrentCommentsString,
      );
    } else {
      console.log("Comment to deletenot found");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
