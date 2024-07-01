/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { toast } from "~/components/ui/use-toast";
import { replyToExistingComment } from "../Comment/Comment.helpers";
import CommentForm from "./CommentForm";
import { addNewComment } from "./CommentForm.helpers";

jest.mock("@tanstack/react-query", () => {
  const actualReactQuery = jest.requireActual("@tanstack/react-query");
  return {
    ...actualReactQuery,
    useMutation: jest.fn().mockImplementation((options) => {
      return {
        mutate: jest.fn().mockImplementation(async (data, { onSuccess }) => {
          await options.mutationFn(data);
          await options.onSuccess();
          onSuccess();
        }),
      };
    }),
    useQueryClient: jest.fn().mockReturnValue({
      getQueryData: jest.fn(() => []),
      invalidateQueries: jest.fn(),
    }),
  };
});

jest.mock("~/components/ui/use-toast", () => ({
  toast: jest.fn(),
}));

jest.mock("./CommentForm.helpers", () => ({
  addNewComment: jest.fn(),
}));

jest.mock("../Comment/Comment.helpers", () => ({
  replyToExistingComment: jest.fn(),
}));

const queryClient = new QueryClient();

describe("CommentForm Component", () => {
  const renderComponent = (props = {}) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <CommentForm {...props} />
      </QueryClientProvider>,
    );
  };

  it("should render the form", () => {
    renderComponent();
    expect(
      screen.getByPlaceholderText("Write your name here"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Write your comment here"),
    ).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });
  it("should submit the form and add a new comment", async () => {
    renderComponent();
    fireEvent.change(screen.getByPlaceholderText("Write your name here"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Write your comment here"), {
      target: { value: "This is a test comment" },
    });
    fireEvent.click(screen.getByText("Submit"));
    await waitFor(() => {
      expect(addNewComment).toHaveBeenCalledWith(
        expect.objectContaining({
          author: "John Doe",
          commentText: "This is a test comment",
        }),
        expect.any(Array),
      );
    });
    expect(toast).toHaveBeenCalledWith({
      title: "Comment added successfully",
    });
  });
  it("should submit the form and reply to an existing comment", async () => {
    const parentCommentId = "parent-comment-id";
    renderComponent({ parentCommentId });

    fireEvent.change(screen.getByPlaceholderText("Write your name here"), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Write your comment here"), {
      target: { value: "This is a reply comment" },
    });
    fireEvent.click(screen.getByText("Submit"));
    await waitFor(() => {
      expect(replyToExistingComment).toHaveBeenCalledWith(
        expect.objectContaining({
          author: "Jane Doe",
          commentText: "This is a reply comment",
          parentCommentId,
        }),
        expect.any(Array),
      );
    });
    expect(toast).toHaveBeenCalledWith({
      title: "Comment added successfully",
    });
  });
  it("should call onCancelFunction and reset form on cancel", () => {
    const onCancelFunction = jest.fn();
    renderComponent({ onCancelFunction });
    fireEvent.change(screen.getByPlaceholderText("Write your name here"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Write your comment here"), {
      target: { value: "This is a test comment" },
    });
    fireEvent.click(screen.getByText("Cancel"));
    expect(onCancelFunction).toHaveBeenCalled();
    expect(screen.getByPlaceholderText("Write your name here")).toHaveValue("");
    expect(screen.getByPlaceholderText("Write your comment here")).toHaveValue(
      "",
    );
  });
});
