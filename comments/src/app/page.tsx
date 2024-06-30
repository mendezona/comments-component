"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CommentsFeed from "./_components/CommentsFeed/CommentsFeed";

const queryClient = new QueryClient();

export default function HomePage() {
  return (
    <main className="bg-background flex min-h-screen flex-col items-start justify-start ">
      <QueryClientProvider client={queryClient}>
        <CommentsFeed />
      </QueryClientProvider>
    </main>
  );
}
