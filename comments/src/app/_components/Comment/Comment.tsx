"use client";

import { AccordionItem } from "@radix-ui/react-accordion";
import { TrashIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
import { LOCAL_STORAGE_ALL_COMMENTS_KEY } from "~/app/app.constants";
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import ReplyIcon from "~/components/ui/icons/replyIcon";
import {
  Tooltip,
  TooltipContent,
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
  nestedComments,
}: CommentObject): JSX.Element {
  const queryClient = useQueryClient();
  const [showEditorTextarea, setShowEditorTextarea] = useState<boolean>(false);

  const { mutate } = useMutation({
    mutationFn: async () => {
      const currentCommentsState =
        queryClient.getQueryData<CommentObject[]>([
          LOCAL_STORAGE_ALL_COMMENTS_KEY,
        ]) ?? [];
      const currentCommentsStateShallowCopy = [...currentCommentsState];
      await deleteComment(commentId, currentCommentsStateShallowCopy);
      await queryClient.invalidateQueries({
        queryKey: [LOCAL_STORAGE_ALL_COMMENTS_KEY],
      });
      setShowEditorTextarea(false);
    },
  });

  return (
    <Accordion
      type="multiple"
      defaultValue={["comment"]}
      className="mb-2 w-full"
    >
      <Card className="px-2">
        <AccordionItem value="comment" className="w-full">
          <div className="flex-start flex w-full ">
            <AccordionTrigger className="w-3 pt-0" />
            <div className="border-primary-100 bg-primary-50 border-3 min-w-full rounded-lg p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-medium">{author}</h3>
                <time className="text-muted-foreground text-sm">
                  {dayjs(createdAt).fromNow()}
                </time>
              </div>
            </div>
          </div>
          <AccordionContent className="w-full">
            <div className="w-full pl-7">
              <p className="text-muted-foreground">{commentText}</p>
              <div className="container mt-4 flex items-end justify-end gap-2">
                <div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => mutate()}
                      >
                        <TrashIcon className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete comment</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setShowEditorTextarea(!showEditorTextarea)
                        }
                      >
                        <ReplyIcon className="h-4 w-4" />
                        <span className="sr-only">Reply</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reply to comment</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
            {showEditorTextarea && (
              <div className="mt-2 flex-col items-end justify-end px-3">
                <CommentForm
                  parentCommentId={commentId}
                  onCancelFunction={() => setShowEditorTextarea(false)}
                  onSuccessFunction={() => setShowEditorTextarea(false)}
                />
              </div>
            )}
            <div className="mt-5">
              {nestedComments &&
                nestedComments.length > 0 &&
                nestedComments.map((comment: CommentObject) => (
                  <Comment
                    key={comment.commentId}
                    commentId={comment.commentId}
                    author={comment.author}
                    commentText={comment.commentText}
                    createdAt={comment.createdAt}
                    nestedComments={comment.nestedComments}
                  />
                ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Card>
    </Accordion>
  );
}
