import { LOCAL_STORAGE_ALL_COMMENTS_KEY } from "~/app/app.constants";
import { type CommentForm } from "../CommentForm/CommentForm.types";
import {
  deleteComment,
  recursiveDeleteComment,
  replyToExistingComment,
  updateCommentsInLocalStorage,
} from "./Comment.helpers";
import { type CommentObjectInterface } from "./Comment.types";

const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem(key: string) {
      return store[key] ?? null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    },
    removeItem(key: string) {
      delete store[key];
    },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

jest.mock("uuid", () => ({
  v7: jest.fn().mockReturnValue("uuidv7-mock"),
}));

jest.mock("dayjs", () => jest.fn().mockReturnValue("dayjs-mock"));

jest.mock("../CommentForm/CommentForm.helpers", () => ({
  capitaliseAllWords: jest.fn().mockImplementation((str: string) => str),
}));

describe("Comment helpers", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("updateCommentsInLocalStorage", () => {
    it("should update comments in localStorage", () => {
      const comments: CommentObjectInterface[] = [
        {
          commentId: "1",
          author: "John Doe",
          commentText: "This is a comment",
          createdAt: "2021-07-16T00:00:00.000Z",
          nestedComments: [],
        },
      ];

      updateCommentsInLocalStorage(comments);
      const storedComments = localStorage.getItem(
        LOCAL_STORAGE_ALL_COMMENTS_KEY,
      );
      expect(storedComments).toEqual(JSON.stringify(comments));
    });
  });

  describe("replyToExistingComment", () => {
    it("should add a nested comment to an existing comment", () => {
      const comments: CommentObjectInterface[] = [
        {
          commentId: "1",
          author: "John Doe",
          commentText: "This is a comment",
          createdAt: "2021-07-16T00:00:00.000Z",
          nestedComments: [],
        },
      ];

      const newComment: CommentForm = {
        parentCommentId: "1",
        author: "Jane Doe",
        commentText: "This is a reply",
      };

      const result = replyToExistingComment(newComment, comments);

      expect(result).toBe(true);
      expect(comments[0]!.nestedComments?.length).toBe(1);
      expect(comments[0]!.nestedComments?.[0]!.author).toBe("Jane Doe");
      expect(comments[0]!.nestedComments?.[0]!.commentText).toBe(
        "This is a reply",
      );
      expect(comments[0]!.nestedComments?.[0]!.commentId).toBe("uuidv7-mock");
      expect(comments[0]!.nestedComments?.[0]!.createdAt).toBe("dayjs-mock");
    });

    it("should return false if the parent comment is not found", () => {
      const comments: CommentObjectInterface[] = [
        {
          commentId: "1",
          author: "John Doe",
          commentText: "This is a comment",
          createdAt: "2021-07-16T00:00:00.000Z",
          nestedComments: [],
        },
      ];

      const newComment: CommentForm = {
        parentCommentId: "2",
        author: "Jane Doe",
        commentText: "This is a reply",
      };

      const result = replyToExistingComment(newComment, comments);

      expect(result).toBe(false);
    });
  });

  describe("deleteComment", () => {
    it("should delete a comment", () => {
      const comments: CommentObjectInterface[] = [
        {
          commentId: "1",
          author: "John Doe",
          commentText: "This is a comment",
          createdAt: "2021-07-16T00:00:00.000Z",
          nestedComments: [],
        },
      ];

      const result = deleteComment("1", comments);

      expect(result).toBe(true);
      expect(comments.length).toBe(0);
    });

    it("should delete a nested comment", () => {
      const comments: CommentObjectInterface[] = [
        {
          commentId: "1",
          author: "John Doe",
          commentText: "This is a comment",
          createdAt: "2021-07-16T00:00:00.000Z",
          nestedComments: [
            {
              commentId: "2",
              author: "Jane Doe",
              commentText: "This is a nested comment",
              createdAt: "2021-07-16T00:00:00.000Z",
              nestedComments: [],
            },
          ],
        },
      ];

      const result = deleteComment("2", comments);

      expect(result).toBe(true);
      expect(comments[0]!.nestedComments?.length).toBe(0);
    });

    it("should return false if the comment to delete is not found", () => {
      const comments: CommentObjectInterface[] = [
        {
          commentId: "1",
          author: "John Doe",
          commentText: "This is a comment",
          createdAt: "2021-07-16T00:00:00.000Z",
          nestedComments: [],
        },
      ];

      const result = deleteComment("2", comments);

      expect(result).toBe(false);
    });
  });

  describe("recursiveDeleteComment", () => {
    it("should recursively delete a comment", () => {
      const comments: CommentObjectInterface[] = [
        {
          commentId: "1",
          author: "John Doe",
          commentText: "This is a comment",
          createdAt: "2021-07-16T00:00:00.000Z",
          nestedComments: [
            {
              commentId: "2",
              author: "Jane Doe",
              commentText: "This is a nested comment",
              createdAt: "2021-07-16T00:00:00.000Z",
              nestedComments: [],
            },
          ],
        },
      ];

      const result = recursiveDeleteComment("2", comments);

      expect(result).toBe(true);
      expect(comments[0]!.nestedComments?.length).toBe(0);
    });

    it("should return false if the comment to delete is not found", () => {
      const comments: CommentObjectInterface[] = [
        {
          commentId: "1",
          author: "John Doe",
          commentText: "This is a comment",
          createdAt: "2021-07-16T00:00:00.000Z",
          nestedComments: [],
        },
      ];

      const result = recursiveDeleteComment("2", comments);

      expect(result).toBe(false);
    });
  });
});
