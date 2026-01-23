import { SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";
import SelectRole from "./pages/SelectRole";
function App() {
  return (
    <>
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <SignIn />
        </div>
      </SignedOut>
      
      <SignedIn>
        <SelectRole />
      </SignedIn>
    </>
  );
}

export default App;