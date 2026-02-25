type Props = {
  text: string;
};

export function FeedbackToast({ text }: Props) {
  return (
    <div
      className="
        fixed bottom-6 left-1/2 -translate-x-1/2
        px-4 py-2 rounded-full text-xs font-medium
        shadow-lg backdrop-blur
        border
        bg-slate-900/90 text-white border-slate-800
        dark:bg-slate-800/80 dark:text-slate-100 dark:border-slate-700
        ring-1 ring-white/10 dark:ring-slate-600/40
        animate-fade-in
      "
    >
      {text}
    </div>
  );
}