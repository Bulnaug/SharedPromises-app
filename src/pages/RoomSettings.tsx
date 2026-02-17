import { useState } from "react";
import { useRoom } from "../hooks/useRoom";

type Props = {
  back: () => void;
};

export const RoomSettingsPage = ({ back }: Props) => {
  const {
    room,
    members,
    currentUserId,
    regenerateInviteLink,
    removeMember,
    leaveRoom,
    deleteRoom,
  } = useRoom();

  const [copied, setCopied] = useState(false);

  if (!room) return null;

  const inviteLink = `${window.location.origin}/join/${room.inviteCode}`;
  const isOwner = room.ownerId === currentUserId;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={styles.wrapper}>
      <button onClick={back} style={styles.backBtn}>
        ← Назад
      </button>

      <h2>Параметры комнаты</h2>

      {/* INVITE BLOCK */}
      <div style={styles.card}>
        <h3>Приглашение</h3>

        <div style={styles.inviteRow}>
          <input
            value={inviteLink}
            readOnly
            style={styles.input}
          />
          <button onClick={handleCopy} style={styles.primaryBtn}>
            {copied ? "Скопировано!" : "Копировать"}
          </button>
        </div>

        {isOwner && (
          <button
            onClick={regenerateInviteLink}
            style={styles.secondaryBtn}
          >
            Перегенерировать ссылку
          </button>
        )}
      </div>

      {/* MEMBERS */}
      <div style={styles.card}>
        <h3>Участники</h3>

        {members.map((member) => {
          const isMe = member._id === currentUserId;

          return (
            <div key={member._id} style={styles.memberRow}>
              <div>
                {member.name}{" "}
                {isMe && <span style={styles.meTag}>(Вы)</span>}
                {member._id === room.ownerId && (
                  <span style={styles.ownerTag}>Owner</span>
                )}
              </div>

              {isOwner && !isMe && (
                <button
                  onClick={() => removeMember(member._id)}
                  style={styles.dangerBtnSmall}
                >
                  Удалить
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* DANGER ZONE */}
      <div style={{ ...styles.card, border: "1px solid #ffcccc" }}>
        <h3 style={{ color: "#d32f2f" }}>Danger Zone</h3>

        {!isOwner && (
          <button onClick={leaveRoom} style={styles.dangerBtn}>
            Покинуть комнату
          </button>
        )}

        {isOwner && (
          <button onClick={deleteRoom} style={styles.dangerBtn}>
            Удалить комнату
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    maxWidth: "700px",
    margin: "40px auto",
    display: "flex",
    flexDirection: "column" as const,
    gap: "24px",
  },

  backBtn: {
    alignSelf: "flex-start",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
  },

  card: {
    padding: "20px",
    borderRadius: "12px",
    background: "#f9f9f9",
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  },

  inviteRow: {
    display: "flex",
    gap: "12px",
  },

  input: {
    flex: 1,
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },

  memberRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid #eee",
  },

  meTag: {
    color: "#888",
    fontSize: "12px",
  },

  ownerTag: {
    marginLeft: "8px",
    fontSize: "12px",
    background: "#e3f2fd",
    padding: "2px 6px",
    borderRadius: "6px",
  },

  primaryBtn: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "none",
    background: "#2e7d32",
    color: "white",
    cursor: "pointer",
  },

  secondaryBtn: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    background: "white",
    cursor: "pointer",
  },

  dangerBtn: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#d32f2f",
    color: "white",
    cursor: "pointer",
  },

  dangerBtnSmall: {
    padding: "6px 10px",
    borderRadius: "6px",
    border: "none",
    background: "#e53935",
    color: "white",
    cursor: "pointer",
  },
};
