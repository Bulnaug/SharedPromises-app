import { useParams } from "react-router-dom";

export default function Dashboard() {
  const { roomId } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        Комната {roomId}
      </h1>
    </div>
  );
}
