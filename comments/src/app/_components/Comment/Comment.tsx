"use client";

import { TrashIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
import { LOCAL_STORAGE_ALL_COMMENTS_KEY } from "~/app/app.constants";
import { Button } from "~/components/ui/button";
import ReplyIcon from "~/components/ui/icons/replyIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import CommentForm from "../CommentForm/CommentForm";
import { deleteComment } from "./Comment.helpers";
import { type CommentObject } from "./Comment.types";

dayjs.extend(relativeTime);

export default function Comment({
  commentId,
  author,
  commentText,
  createdAt,
}: CommentObject): JSX.Element {
  const queryClient = useQueryClient();
  const [showEditorTextarea, setShowEditorTextarea] = useState<boolean>(false);

  const { mutate } = useMutation({
    mutationFn: async () => {
      await deleteComment(commentId, queryClient);
      await queryClient.invalidateQueries({
        queryKey: [LOCAL_STORAGE_ALL_COMMENTS_KEY],
      });
    },
  });

  const onCancel = () => {
    setShowEditorTextarea(!showEditorTextarea);
  };

  return (
    <div className="border-primary-100 bg-primary-50 border-3 min-w-full rounded-lg p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-medium">{author}</h3>
        <time className="text-muted-foreground text-sm">
          {dayjs(createdAt).fromNow()}
        </time>
      </div>
      <p className="text-muted-foreground">{commentText}</p>
      <div className="container my-4 flex items-end justify-end gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="ghost" size="icon" onClick={() => mutate()}>
                <TrashIcon className="h-4 w-4" />
                <span className="sr-only">Reply</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete comment</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="ghost" size="icon" onClick={() => onCancel()}>
                <ReplyIcon className="h-4 w-4" />
                <span className="sr-only">Reply</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reply to comment</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {showEditorTextarea && (
        <div className="my-2 flex-col items-end justify-end px-3">
          <CommentForm onCancelFunction={() => onCancel()} />
        </div>
      )}
    </div>
  );
}
