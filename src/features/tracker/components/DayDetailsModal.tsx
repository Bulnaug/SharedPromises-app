import dayjs from "dayjs";
import "dayjs/locale/ru";
import "dayjs/locale/de";
import "dayjs/locale/en";
import "dayjs/locale/uk";
import { useTranslation } from "react-i18next";
import { Modal } from "../../../components/ui/Modal";

type Wish = {
  _id: string;
  title: string;
};

type DayDetailsModalProps = {
  date: dayjs.Dayjs;
  doneWishes: Wish[];
  notDoneWishes: Wish[];
  onClose: () => void;
};

export function DayDetailsModal({
  date,
  doneWishes,
  notDoneWishes,
  onClose,
}: DayDetailsModalProps) {
  const { t, i18n } = useTranslation();

  const language = i18n.language.split("-")[0];

  const dayjsLocaleMap: Record<string, string> = {
    ru: "ru",
    de: "de",
    en: "en",
    ua: "uk",
  };

  const currentLocale = dayjsLocaleMap[language] || "ru";
  const hasAny = doneWishes.length > 0 || notDoneWishes.length > 0;

  return (
    <Modal onClose={onClose}>
      <div className="space-y-5 text-slate-900 dark:text-slate-100">
        <h2 className="text-lg font-semibold text-center">
          {date.locale(currentLocale).format("D MMMM YYYY")}
        </h2>

        {!hasAny ? (
          <p className="text-sm text-center text-gray-500 dark:text-slate-400">
            {t("trackerNoActivity")}
          </p>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                {t("done")} ({doneWishes.length})
              </div>

              {doneWishes.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t("nothingDone")}
                </p>
              ) : (
                <ul className="space-y-2">
                  {doneWishes.map((wish) => (
                    <li
                      key={wish._id}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 bg-emerald-50 dark:bg-emerald-500/10"
                    >
                      <span className="text-emerald-500">💚</span>
                      <span className="text-sm text-slate-900 dark:text-slate-100">
                        {wish.title}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-amber-600 dark:text-amber-400">
                {t("notDone")} ({notDoneWishes.length})
              </div>

              {notDoneWishes.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t("everythingDone")}
                </p>
              ) : (
                <ul className="space-y-2">
                  {notDoneWishes.map((wish) => (
                    <li
                      key={wish._id}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 bg-slate-100 dark:bg-slate-700/40"
                    >
                      <span className="text-amber-500">⏳</span>
                      <span className="text-sm text-slate-900 dark:text-slate-100">
                        {wish.title}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="text-sm transition text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            {t("close")}
          </button>
        </div>
      </div>
    </Modal>
  );
}