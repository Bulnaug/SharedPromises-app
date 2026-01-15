export default function WishCard({ wish }: any) {
  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <p>{wish.text}</p>
      <p className="text-sm text-gray-500">{wish.status}</p>
    </div>
  );
}
