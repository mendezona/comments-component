"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { LOCAL_STORAGE_ALL_COMMENTS_KEY } from "~/app/app.constants";
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
import { toast } from "~/components/ui/use-toast";
import { replyToExistingComment } from "../Comment/Comment.helpers";
import { type CommentObject } from "../Comment/Comment.types";
import { addNewComment } from "./CommentForm.helpers";
import { CommentFormSchema, type CommentFormProps } from "./CommentForm.types";

export default function CommentForm({
  parentCommentId,
  onCancelFunction,
  onSuccessFunction,
}: CommentFormProps): JSX.Element {
  const queryClient = useQueryClient();

  const updateAllCommentsData = useMutation({
    mutationFn: async (newComment: z.infer<typeof CommentFormSchema>) => {
      const currentCommentsState = queryClient.getQueryData<CommentObject[]>([
        LOCAL_STORAGE_ALL_COMMENTS_KEY,
      ]);
      if (currentCommentsState) {
        const currentCommentsStateShallowCopy = [...currentCommentsState];
        parentCommentId
          ? replyToExistingComment(newComment, currentCommentsStateShallowCopy)
          : addNewComment(newComment, currentCommentsStateShallowCopy);
      } else {
        addNewComment(newComment);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [LOCAL_STORAGE_ALL_COMMENTS_KEY],
      });
      toast({
        title: "Comment added successfully",
      });
    },
  });

  const form = useForm<z.infer<typeof CommentFormSchema>>({
    resolver: zodResolver(CommentFormSchema),
    defaultValues: {
      parentCommentId: parentCommentId,
      author: "",
      commentText: "",
    },
  });

  const onSubmit = (data: z.infer<typeof CommentFormSchema>) => {
    updateAllCommentsData.mutate(data, {
      onSuccess: () => {
        onSuccessFunction?.();
        form.reset();
      },
      onError: (error) => {
        console.error("Error updating comments:", error);
      },
    });
  };

  const onCancel = () => {
    onCancelFunction?.();
    form.reset();
  };

  return (
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
  );
}
