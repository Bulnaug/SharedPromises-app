import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function RequireRoom({ children }: { children: React.ReactNode }) {
  const me = useQuery(api.users.me);
  const navigate = useNavigate();

  useEffect(() => {
    if (me && !me.roomId) {
      navigate("/rooms");
    }
  }, [me, navigate]);

  if (!me) return null; // loading

  return <>{children}</>;
}
