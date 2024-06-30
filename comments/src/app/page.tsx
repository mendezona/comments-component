import Comment from "./_components/Comment/Comment";
import { type CommentObject } from "./_components/Comment/Comment.types";
import CommentsFeed from "./_components/CommentsFeed";

export default function HomePage() {
  const comment = {
    author: "John Doe",
    commentText: "This is a comment",
    createdAt: "2023-01-01",
  } as CommentObject;

  return (
    <main className="bg-background flex min-h-screen flex-col items-start justify-start">
      <CommentsFeed>
        <Comment
          author={comment.author}
          commentText={comment.commentText}
          createdAt={comment.createdAt}
        />
      </CommentsFeed>
    </main>
  );
}
