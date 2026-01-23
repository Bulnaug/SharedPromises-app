import { SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";
import SelectRole from "./pages/SelectRole";
import Wishes from "./pages/Wishes";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { usePartnerNotifications } from "./hooks/usePartnerNotifications";

export default function App() {
  const me = useQuery(api.users.getMe);

  // Подключаем уведомления партнёра
  usePartnerNotifications();

  return (
    <>
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <SignIn />
        </div>
      </SignedOut>

      <SignedIn>
        {me === undefined && <div>Loading user data...</div>}
        {me === null && <SelectRole />}
        {me && <Wishes role={me.role} />}
      </SignedIn>
    </>
  );
}
