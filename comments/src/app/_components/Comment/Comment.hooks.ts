import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { LOCAL_STORAGE_ALL_COMMENTS_KEY } from "../CommentsFeed/CommentsFeed.constants";
import addNewComment from "./Comment.helpers";
import { CommentFormSchema } from "./Comment.types";

export default function useCommentLogic() {
  const queryClient = useQueryClient();
  const [showEditorTextarea, setShowEditorTextarea] = useState<boolean>(false);

  const form = useForm<z.infer<typeof CommentFormSchema>>({
    resolver: zodResolver(CommentFormSchema),
    defaultValues: {
      author: "",
      commentText: "",
    },
  });

  const updateAllCommentsData = useMutation({
    mutationFn: async (data: z.infer<typeof CommentFormSchema>) => {
      await addNewComment(data, queryClient);
      await queryClient.invalidateQueries({
        queryKey: [LOCAL_STORAGE_ALL_COMMENTS_KEY],
      });
    },
  });

  const onSubmit = (data: z.infer<typeof CommentFormSchema>) => {
    updateAllCommentsData.mutate(data, {
      onSuccess: () => {
        form.reset();
      },
      onError: (error) => {
        console.error("Error updating comments:", error);
      },
    });
  };

  const onCancel = () => {
    setShowEditorTextarea(!showEditorTextarea);
    form.reset();
  };

  return {
    showEditorTextarea,
    form,
    onSubmit,
    onCancel,
  };
}
