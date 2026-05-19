import "dotenv/config";
import { StreamChat } from "stream-chat";

const STREAM_API_KEY = process.env.STREAM_API_KEY;
const STREAM_API_SECRET = process.env.STREAM_API_SECRET;

const SUPPORT_USER_ID = "support";
const CHANNELS = [
  { id: "futures", name: "期货交流" },
  { id: "forex", name: "外汇交流" },
  { id: "crypto", name: "加密交流" },
  { id: "announcements", name: "官方公告" },
];

async function main() {
  if (!STREAM_API_KEY || !STREAM_API_SECRET) {
    console.error("缺少 STREAM_API_KEY / STREAM_API_SECRET");
    process.exit(1);
  }
  const client = StreamChat.getInstance(STREAM_API_KEY, STREAM_API_SECRET);

  console.log("→ upsert support user…");
  await client.upsertUser({
    id: SUPPORT_USER_ID,
    name: "Prophub 官方客服",
    role: "admin",
    ...({ official: true } as Record<string, unknown>),
  });

  for (const ch of CHANNELS) {
    console.log(`→ ensure channel #${ch.id}…`);
    const channel = client.channel("livestream", ch.id, {
      name: ch.name,
      created_by_id: SUPPORT_USER_ID,
      official: true,
    } as Record<string, unknown>);
    try {
      await channel.create();
      console.log(`   created ${ch.id}`);
    } catch (err) {
      const msg = (err as Error)?.message ?? "";
      if (/already exists|duplicate/i.test(msg)) {
        console.log(`   exists  ${ch.id}`);
      } else {
        console.warn(`   warn    ${ch.id}: ${msg}`);
      }
    }
  }

  console.log("✔ done");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
