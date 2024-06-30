"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import CommentForm from "../CommentForm/CommentForm";
import ReplyIcon from "../ReplyIcon";
import { type CommentObject } from "./Comment.types";

dayjs.extend(relativeTime);

export default function Comment({
  author,
  commentText,
  createdAt,
}: CommentObject): JSX.Element {
  const [showEditorTextarea, setShowEditorTextarea] = useState<boolean>(false);

  const onCancel = () => {
    setShowEditorTextarea(!showEditorTextarea);
  };

  return (
    <div className="border-primary-100 bg-primary-50 border-3 min-w-full rounded-lg p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{author}</h3>
        <time className="text-muted-foreground text-sm">
          {dayjs(createdAt).fromNow()}
        </time>
      </div>
      <p className="text-muted-foreground">{commentText}</p>
      <div className="container flex flex-col items-end justify-end">
        <Button variant="ghost" size="icon" onClick={() => onCancel()}>
          <ReplyIcon className="h-4 w-4" />
          <span className="sr-only">Reply</span>
        </Button>
      </div>
      {showEditorTextarea && (
        <div className="my-2 flex-col items-end justify-end px-3">
          <CommentForm onCancelFunction={() => onCancel()} />
        </div>
      )}
    </div>
  );
}
