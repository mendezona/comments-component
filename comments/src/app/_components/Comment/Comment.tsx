"use client";

import { Button } from "~/components/ui/button";
import ReplyIcon from "../ReplyIcon";
import { type CommentObject } from "./Comment.types";

export default function Comment({
  author,
  commentText,
  createdAt,
}: CommentObject): JSX.Element {
  return (
    <div className="min-w-full">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{author}</h3>
        <time className="text-muted-foreground text-sm">{createdAt}</time>
      </div>
      <p className="text-muted-foreground">{commentText}</p>
      <div className="mt-2 flex items-center space-x-4">
        <Button variant="ghost" size="icon">
          <ReplyIcon className="h-4 w-4" />
          <span className="sr-only">Reply</span>
        </Button>
      </div>
    </div>
  );
}
