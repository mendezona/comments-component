"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import ReplyIcon from "../ReplyIcon";
import useCommentLogic from "./Comment.hooks";
import { type CommentObject } from "./Comment.types";

dayjs.extend(relativeTime);

export default function Comment({
  author,
  commentText,
  createdAt,
}: CommentObject): JSX.Element {
  const { showEditorTextarea, form, onSubmit, onCancel } = useCommentLogic();

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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="min-w-full">
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Write your name here"
                        className="mb-2 min-w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="commentText"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Write your comment here"
                        className="min-w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mb-2 mt-2 flex w-full justify-end gap-2">
                <Button
                  className="max-w-min"
                  type="button"
                  variant="outline"
                  onClick={() => onCancel()}
                >
                  Cancel
                </Button>
                <Button type="submit" className="max-w-min">
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}
