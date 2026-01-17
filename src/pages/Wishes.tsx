import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import WishCard from "../components/WishCard";

export default function Wishes({ role }: { role: "author" | "partner" }) {
  const wishes = useQuery(api.wishes.list);

  if (!wishes) return null;

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      {wishes.map(wish => (
        <WishCard
          key={wish._id}
          wish={wish}
          role={role}
        />
      ))}
    </div>
  );
}
