type SpinnerProps = {
  size?: number; // px
  className?: string;
};

export default function Spinner({ size = 32, className = "" }: SpinnerProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        style={{ width: size, height: size }}
        className="
          rounded-full
          border-2
          border-gray-300
          border-t-emerald-500
          animate-spin
        "
      />
    </div>
  );
}