import dayjs from "dayjs";
import { v7 as uuidv7 } from "uuid";
import { LOCAL_STORAGE_ALL_COMMENTS_KEY } from "~/app/app.constants";
import { type CommentForm, type CommentObjectInterface } from "./Comment.types";

export async function updateCommentsInLocalStorage(
  newCommentsState: CommentObjectInterface[],
) {
  try {
    const newCommentsStateToString = JSON.stringify(newCommentsState);
    localStorage.setItem(
      LOCAL_STORAGE_ALL_COMMENTS_KEY,
      newCommentsStateToString,
    );
  } catch (error) {
    console.error("Error:", error);
  }
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

// export async function deleteComment(
//   commentId: string,
//   currentCommentsState: CommentObjectInterface[],
// ): Promise<boolean> {
//   if (currentCommentsState) {
//     for (let i = 0; i < currentCommentsState.length; i++) {
//       if (currentCommentsState[i]!.commentId === commentId) {
//         currentCommentsState.splice(i, 1);
//         await updateCommentsInLocalStorage(currentCommentsState);
//         return true;
//       }
//       if (currentCommentsState[i]!.nestedComments) {
//         const result = await deleteComment(
//           commentId,
//           currentCommentsState[i]!.nestedComments!,
//         );
//         if (result) {
//           await updateCommentsInLocalStorage(currentCommentsState);
//           return true;
//         }
//       }
//     }
//   }
//   return false;
// }

export async function deleteComment(
  commentId: string,
  currentCommentsState: CommentObjectInterface[],
): Promise<boolean> {
  const isDeleted = recursiveDeleteComment(commentId, currentCommentsState);
  if (isDeleted) {
    await updateCommentsInLocalStorage(currentCommentsState);
    return true;
  } else {
    console.log("Comment to delete not found");
    return false;
  }
}

function recursiveDeleteComment(
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
        const result = recursiveDeleteComment(
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
