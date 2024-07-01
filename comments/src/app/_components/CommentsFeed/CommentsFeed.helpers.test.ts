import "@testing-library/jest-dom";
import { LOCAL_STORAGE_ALL_COMMENTS_KEY } from "~/app/app.constants";
import type { CommentObjectInterface } from "../Comment/Comment.types";
import { getCommentsFromLocalStorage } from "./CommentsFeed.helpers";

const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

describe("getCommentsFromLocalStorage", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("should throw an error if no comments are found in localStorage", () => {
    expect(() => getCommentsFromLocalStorage()).toThrow(
      "No comments object found in localStorage",
    );
  });
  it("should return parsed comments from localStorage", () => {
    const comments: CommentObjectInterface[] = [
      {
        commentId: "1",
        author: "Author 1",
        commentText: "Comment 1",
        createdAt: "2023-07-01T00:00:00Z",
        nestedComments: [],
      },
      {
        commentId: "2",
        author: "Author 2",
        commentText: "Comment 2",
        createdAt: "2023-07-01T01:00:00Z",
        nestedComments: [],
      },
    ];

    localStorage.setItem(
      LOCAL_STORAGE_ALL_COMMENTS_KEY,
      JSON.stringify(comments),
    );
    const result = getCommentsFromLocalStorage();
    expect(result).toEqual(comments);
  });
  it("should use the provided localStorageKey to retrieve comments", () => {
    const customKey = "CUSTOM_COMMENTS_KEY";
    const comments: CommentObjectInterface[] = [
      {
        commentId: "1",
        author: "Author 1",
        commentText: "Comment 1",
        createdAt: "2023-07-01T00:00:00Z",
        nestedComments: [],
      },
    ];
    localStorage.setItem(customKey, JSON.stringify(comments));
    const result = getCommentsFromLocalStorage(customKey);
    expect(result).toEqual(comments);
  });
});
