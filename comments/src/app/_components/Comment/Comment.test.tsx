/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { TooltipProvider } from "~/components/ui/tooltip";
import { toast } from "~/components/ui/use-toast";
import Comment from "./Comment";
import { deleteComment } from "./Comment.helpers";
import { type CommentObject } from "./Comment.types";

jest.mock("dayjs", () => {
  const originalDayjs = jest.requireActual("dayjs");
  const mockDayjs = jest.fn(() => ({
    fromNow: jest.fn(() => "a few seconds ago"),
  }));
  return Object.assign(mockDayjs, originalDayjs);
});

jest.mock("@tanstack/react-query", () => {
  const actualReactQuery = jest.requireActual("@tanstack/react-query");
  return {
    ...actualReactQuery,
    useMutation: jest.fn().mockImplementation((options) => {
      return {
        mutate: jest.fn().mockImplementation(async () => {
          await options.mutationFn();
          await options.onSuccess();
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

jest.mock("./Comment.helpers", () => ({
  deleteComment: jest.fn(),
}));

const queryClient = new QueryClient();

describe("Comment Component", () => {
  const comment: CommentObject = {
    commentId: "1",
    author: "John Doe",
    commentText: "This is a test comment",
    createdAt: "2021-07-16T00:00:00.000Z",
    nestedComments: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (props: Partial<CommentObject> = {}) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Comment {...comment} {...props} />
        </TooltipProvider>
      </QueryClientProvider>,
    );
  };

  it("should render the comment", () => {
    renderComponent();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("This is a test comment")).toBeInTheDocument();
    expect(screen.getByText("a few seconds ago")).toBeInTheDocument();
  });

  it("should toggle the reply textarea", () => {
    renderComponent();
    const replyButton = screen.getByRole("button", { name: /reply/i });
    fireEvent.click(replyButton);
    expect(
      screen.getByPlaceholderText("Write your name here"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Write your comment here"),
    ).toBeInTheDocument();
    fireEvent.click(replyButton);
    expect(
      screen.queryByPlaceholderText("Write your name here"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText("Write your comment here"),
    ).not.toBeInTheDocument();
  });
  it("should delete the comment", async () => {
    (deleteComment as jest.Mock).mockReturnValue(true);
    renderComponent();
    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);
    await waitFor(() => {
      expect(deleteComment).toHaveBeenCalledWith("1", []);
      expect(toast).toHaveBeenCalledWith({
        title: "Comment deleted successfully",
      });
    });
  });
  it("should render nested comments", () => {
    const nestedComment: CommentObject = {
      commentId: "2",
      author: "Jane Doe",
      commentText: "This is a nested comment",
      createdAt: "2021-07-16T00:00:00.000Z",
      nestedComments: [],
    };
    renderComponent({ nestedComments: [nestedComment] });
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("This is a nested comment")).toBeInTheDocument();
  });
});
