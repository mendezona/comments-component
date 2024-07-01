import { updateCommentsInLocalStorage } from "../Comment/Comment.helpers";
import { type CommentObjectInterface } from "../Comment/Comment.types";
import { addNewComment, capitaliseAllWords } from "./CommentForm.helpers";
import { type CommentForm } from "./CommentForm.types";

jest.mock("../Comment/Comment.helpers", () => ({
  updateCommentsInLocalStorage: jest.fn(),
}));

jest.mock("uuid", () => ({
  v7: jest.fn().mockReturnValue("test-uuid"),
}));

jest.mock("dayjs", () => () => ({
  toString: jest.fn().mockReturnValue("2023-07-01T00:00:00Z"),
}));

describe("CommentForm helpers", () => {
  describe("addNewComment", () => {
    const newComment: CommentForm = {
      author: "john doe",
      commentText: "This is a new comment",
    };
    it("should add a new comment with timestamp to an existing comments state", () => {
      const currentCommentsState: CommentObjectInterface[] = [
        {
          author: "Existing Author",
          commentText: "Existing comment",
          commentId: "existing-comment-id",
          createdAt: "2023-06-30T00:00:00Z",
        },
      ];
      addNewComment(newComment, currentCommentsState);
      expect(updateCommentsInLocalStorage).toHaveBeenCalledWith([
        {
          ...newComment,
          author: "John Doe",
          commentId: "test-uuid",
          createdAt: "2023-07-01T00:00:00Z",
        },
        ...currentCommentsState,
      ]);
    });
    it("should add a new comment with timestamp when no current comments state is provided", () => {
      addNewComment(newComment);
      expect(updateCommentsInLocalStorage).toHaveBeenCalledWith([
        {
          ...newComment,
          author: "John Doe",
          commentId: "test-uuid",
          createdAt: "2023-07-01T00:00:00Z",
        },
      ]);
    });
  });
  describe("capitaliseAllWords", () => {
    it("should capitalise all words in a string", () => {
      const input = "john doe";
      const expectedOutput = "John Doe";
      expect(capitaliseAllWords(input)).toBe(expectedOutput);
    });
    it("should handle empty strings", () => {
      const input = "";
      const expectedOutput = "";
      expect(capitaliseAllWords(input)).toBe(expectedOutput);
    });
    it("should handle strings with multiple spaces", () => {
      const input = "john   doe";
      const expectedOutput = "John   Doe";
      expect(capitaliseAllWords(input)).toBe(expectedOutput);
    });
    it("should handle strings with mixed casing", () => {
      const input = "jOhN DoE";
      const expectedOutput = "John Doe";
      expect(capitaliseAllWords(input)).toBe(expectedOutput);
    });
  });
});
