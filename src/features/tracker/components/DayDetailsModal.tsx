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
  wishes: Wish[];
  onClose: () => void;
};

export function DayDetailsModal({
  date,
  wishes,
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

  return (
    <Modal onClose={onClose}>
      <div className="space-y-4 text-slate-900 dark:text-slate-100">
        <h2 className="text-lg font-semibold text-center">
          {date.locale(currentLocale).format("D MMMM YYYY")}
        </h2>

        {wishes.length === 0 ? (
          <p className="text-sm text-center text-gray-500 dark:text-slate-400">
            {t("trackerNoActivity")}
          </p>
        ) : (
          <ul className="space-y-2">
            {wishes.map((wish) => (
              <li
                key={wish._id}
                className="
                  flex items-center gap-2
                  rounded-lg px-3 py-2
                  bg-gray-100
                  dark:bg-slate-700/40
                "
              >
                <span className="text-emerald-500">💚</span>
                <span className="text-sm text-slate-900 dark:text-slate-100">
                  {wish.title}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="
              text-sm transition
              text-gray-500 hover:text-gray-700
              dark:text-slate-400 dark:hover:text-slate-200
            "
          >
            {t("close")}
          </button>
        </div>
      </div>
    </Modal>
  );
}