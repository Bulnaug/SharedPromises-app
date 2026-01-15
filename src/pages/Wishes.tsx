import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import AddWish from "../components/AddWish";
import WishCard from "../components/WishCard";

export default function Wishes() {
  const wishes = useQuery(api.wishes.list);

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <AddWish />
      {wishes?.map(w => (
        <WishCard key={w._id} wish={w} />
      ))}
    </div>
  );
}
