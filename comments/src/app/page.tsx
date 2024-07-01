"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "~/components/ui/toaster";
import { TooltipProvider } from "~/components/ui/tooltip";
import CommentsFeed from "./_components/CommentsFeed/CommentsFeed";

const queryClient = new QueryClient();

export default function HomePage() {
  return (
    <main className="bg-background min-h-screen flex-col items-start justify-start">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <CommentsFeed />
        </TooltipProvider>
      </QueryClientProvider>
      <Toaster />
    </main>
  );
}
