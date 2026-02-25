import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";
import { PageContainer } from "../layouts/PageContainer";

export default function Landing() {
  const { t } = useTranslation();

  return (
    <PageContainer maxWidth="xl">
    <div
      className="
        min-h-dvh flex items-center justify-center px-6
        bg-gradient-to-b from-white to-gray-50
        dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-800
      "
    >
      <div className="w-full max-w-md space-y-8 text-center">
        
        {/* Logo */}
        <div className="space-y-2">
          <div className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Shared<span className="text-emerald-500">Promises</span>
          </div>
        </div>

        {/* Card */}
        <div
          className="
            rounded-2xl p-6 space-y-4
            bg-white border border-gray-100 shadow-sm
            dark:bg-slate-800/60 dark:border-slate-700/60 dark:shadow-none
          "
        >

          <div className="space-y-3 pt-2">
            <SignInButton mode="modal">
              <button
                className="
                  w-full rounded-xl px-4 py-2.5
                  bg-emerald-500 text-white text-sm font-medium
                  hover:bg-emerald-600 transition
                  dark:hover:bg-emerald-400
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-emerald-400/60
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-white
                  dark:focus-visible:ring-offset-slate-900
                "
              >
                {t("signin") ?? "Sign in"}
              </button>
            </SignInButton>

            <SignUpButton mode="modal">
              <button
                className="
                  w-full rounded-xl px-4 py-2.5 text-sm font-medium
                  border border-emerald-500 text-emerald-600
                  hover:bg-emerald-50 transition
                  dark:border-emerald-400 dark:text-emerald-300
                  dark:hover:bg-emerald-500/10
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-emerald-400/60
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-white
                  dark:focus-visible:ring-offset-slate-900
                "
              >
                {t("signup") ?? "Create account"}
              </button>
            </SignUpButton>
          </div>
        </div>

        {/* Footer tiny text */}
        <div className="text-xs text-slate-400 dark:text-slate-500">
          © {new Date().getFullYear()} SharedPromises
        </div>
      </div>
    </div>
    </PageContainer>
  );
}