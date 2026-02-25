import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";

export default function Landing() {

  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="text-xl font-semibold text-gray-900">
        Shared<span className="text-green-500">Promises</span>
      </div>

      <SignInButton mode="modal">
        <button className="
              block
              rounded-xl
              px-4
              py-2.5
              bg-green-500
              text-white
              text-sm
              font-medium
              text-center
              hover:bg-green-600
              transition
            ">
          {t("sigin")}
        </button>
      </SignInButton>

      <SignUpButton mode="modal">
        <button className="
              block
              rounded-xl
              px-4
              py-2.5
              border
              border-green-500
              text-green-500
              text-sm
              font-medium
              text-center
              hover:bg-gray-50
              transition
            ">
          {t("signup")}
        </button>
      </SignUpButton>
    </div>
  );
}
