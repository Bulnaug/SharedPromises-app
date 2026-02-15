type Props = {
  text: string;
};

export function FeedbackToast({ text }: Props) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-4 py-2 rounded-full shadow-lg">
      {text}
    </div>
  );
}
