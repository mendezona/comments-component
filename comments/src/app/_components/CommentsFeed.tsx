export default function CommentsFeed({
  children,
}: React.PropsWithChildren): JSX.Element {
  return (
    <div className="mx-auto flex min-w-[761px] max-w-[761px] flex-col items-start py-10">
      {children}
    </div>
  );
}
