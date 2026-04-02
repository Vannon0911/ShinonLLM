import { randomUUID } from "node:crypto";
import { ChatShell } from "../components/chat/ChatShell";

export default function Page() {
  return (
    <ChatShell
      sessionId={randomUUID()}
      conversationId={randomUUID()}
    />
  );
}
