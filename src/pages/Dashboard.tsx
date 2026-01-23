import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import WishCard from "../components/WishCard";
import type { Doc } from "../../convex/_generated/dataModel";

type Wish = Doc<"wishes">;

export default function Dashboard() {
  const me = useQuery(api.users.getMe);
  const wishes = useQuery(api.wishes.list);

  if (!me) return <div>Loading...</div>;

  // Разделяем желания по ролям
  const authorWishes = wishes?.filter(w => w.createdByRole === "author") || [];
  const partnerWishes = wishes?.filter(w => w.createdByRole === "partner") || [];

  return (
    <div className="flex gap-4 p-4 max-w-7xl mx-auto">
      {/* Левая колонка — автор */}
      <div className="flex-1 space-y-4">
        <h2 className="text-xl font-bold mb-2">Авторские желания</h2>
        {authorWishes.length === 0 && <div className="text-gray-500">Пока нет желаний</div>}
        {authorWishes.map((wish) => (
          <WishCard key={wish._id} wish={wish} role={me.role} />
        ))}
      </div>

      {/* Правая колонка — партнёр */}
      <div className="flex-1 space-y-4">
        <h2 className="text-xl font-bold mb-2">Желания партнёра</h2>
        {partnerWishes.length === 0 && <div className="text-gray-500">Пока нет желаний</div>}
        {partnerWishes.map((wish) => (
          <WishCard key={wish._id} wish={wish} role={me.role === "author" ? "partner" : "author"} />
        ))}
      </div>
    </div>
  );
}
