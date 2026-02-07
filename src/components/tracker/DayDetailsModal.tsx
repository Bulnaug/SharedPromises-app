import dayjs from "dayjs";
import "dayjs/locale/ru";
import { Modal } from "../ui/Modal";

dayjs.locale("ru");

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
  return (
    <Modal onClose={onClose}>
      <div className="space-y-4">
        {/* Дата */}
        <h2 className="text-lg font-semibold text-center">
          {date.format("D MMMM YYYY")}
        </h2>

        {/* Контент */}
        {wishes.length === 0 ? (
          <p className="text-sm text-gray-500 text-center">
            В этот день никто ничего не сделал
          </p>
        ) : (
          <ul className="space-y-2">
            {wishes.map((wish) => (
              <li
                key={wish._id}
                className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2"
              >
                <span className="text-green-500">💚</span>
                <span className="text-sm">{wish.title}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Подвал */}
        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700 transition"
          >
            Закрыть
          </button>
        </div>
      </div>
    </Modal>
  );
}
