interface AddWishPageProps {
  roomId: string;
}

export default function AddWishPage({ roomId }: AddWishPageProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Добавить желание в комнате {roomId}</h1>
      {/* Форма для добавления желания */}
    </div>
  );
}
