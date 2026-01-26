import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export function WishItem({ wish }: any) {
  const toggle = useMutation(api.wishes.toggleWishFulfilled);

  return (
    <label style={{ display: "block" }}>
      <input
        type="checkbox"
        checked={wish.fulfilled}
        onChange={() =>
          toggle({ wishId: wish._id })
        }
      />
      <span
        style={{
          marginLeft: 8,
          textDecoration: wish.fulfilled
            ? "line-through"
            : "none",
        }}
      >
        {wish.title}
      </span>
    </label>
  );
}
