import type { Id } from "../../convex/_generated/dataModel";
import { WishItem } from "./WishItem";

type Wish = {
  _id: Id<"wishes">;
  title: string;
  fulfilled: boolean;
};

export function WishList({ wishes }: { wishes: Wish[] }) {
  if (wishes.length === 0) {
    return <p>No wishes yet ✨</p>;
  }

  return (
    <ul>
      {wishes.map((wish) => (
        <li key={wish._id}>
          <WishItem wish={wish} />
        </li>
      ))}
    </ul>
  );
}
