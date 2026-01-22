import { SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";
import Wishes from "./pages/Wishes";
import SelectRole from "./pages/SelectRole";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { usePartnerNotifications } from "./hooks/usePartnerNotifications";

export default function App() {
  const me = useQuery(api.users.getMe);

  // подключаем слушатель уведомлений
  usePartnerNotifications();

  return (
    <>
      <SignedOut>
        <SignIn />
      </SignedOut>

      <SignedIn>
        {me === undefined && null /* loading */}
        {me === null && <SelectRole />}
        {me && <Wishes role={me.role} />}
      </SignedIn>
    </>
  );
}
