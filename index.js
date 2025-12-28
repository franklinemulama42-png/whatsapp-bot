import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";
import Pino from "pino";

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");

  const sock = makeWASocket({
    logger: Pino({ level: "silent" }),
    auth: state
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text;

    const from = msg.key.remoteJid;

    if (text?.toLowerCase() === "hi") {
      await sock.sendMessage(from, {
        text: "Hello 👋 I am your WhatsApp bot"
      });
    }

    if (text?.toLowerCase() === "menu") {
      await sock.sendMessage(from, {
        text: "1️⃣ About\n2️⃣ Help\n3️⃣ Contact"
      });
    }
  });
}

startBot();
