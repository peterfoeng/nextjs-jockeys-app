import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === CONFIG ===
const JOCKEY_DIR = path.resolve("data/jockeys");
// ⬆️ since data/ is at root next to this script
const OVERWRITE = true; // true = overwrite same file, false = make *.derived.json

// === HELPERS ===
function toDate(d) {
  return new Date(d);
}

function computeDerivedStats(jockey) {
  const today = new Date();
  const races = (jockey.stats || [])
    .filter((r) => r.finishingPosition != null)
    .sort((a, b) => new Date(a.raceDate) - new Date(b.raceDate));

  const totalRides = races.length;
  const totalWins = races.filter((r) => r.finishingPosition === 1).length;
  const totalPlaces = races.filter((r) => r.finishingPosition <= 3).length;

  const winRate = totalRides ? totalWins / totalRides : 0;
  const placeRate = totalRides ? totalPlaces / totalRides : 0;

  const lastWin = races
    .filter((r) => r.finishingPosition === 1)
    .sort((a, b) => new Date(b.raceDate) - new Date(a.raceDate))[0];

  const daysSinceLastWin = lastWin
    ? Math.floor((today - toDate(lastWin.raceDate)) / (1000 * 60 * 60 * 24))
    : null;

  const recentForm = races
    .slice(-5)
    .map((r) =>
      r.finishingPosition && r.finishingPosition <= 9
        ? r.finishingPosition
        : "X",
    )
    .join("-");

  // streak logic
  let streakType = "losing";
  let streakCount = 0;
  for (let i = races.length - 1; i >= 0; i--) {
    const pos = races[i].finishingPosition;
    if (pos === 1) {
      if (streakType === "losing") {
        streakType = "win";
        streakCount = 1;
      } else if (streakType === "win") {
        streakCount++;
      }
    } else {
      if (streakType === "losing") streakCount++;
      else break;
    }
  }

  jockey.derived = {
    totalRides,
    totalWins,
    totalPlaces,
    winRate: +winRate.toFixed(2),
    placeRate: +placeRate.toFixed(2),
    daysSinceLastWin,
    recentForm,
    currentStreak: { type: streakType, count: streakCount },
  };

  return jockey;
}

// === MAIN ===
function processAllJockeys() {
  if (!fs.existsSync(JOCKEY_DIR)) {
    console.error("❌ Directory not found:", JOCKEY_DIR);
    process.exit(1);
  }

  const files = fs.readdirSync(JOCKEY_DIR).filter((f) => f.endsWith(".json"));
  if (!files.length) {
    console.log("⚠️  No JSON files found in", JOCKEY_DIR);
    return;
  }

  console.log(`🔍 Found ${files.length} jockey files...\n`);

  for (const file of files) {
    const filePath = path.join(JOCKEY_DIR, file);
    try {
      const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
      const enriched = computeDerivedStats(raw);

      const outputPath = OVERWRITE
        ? filePath
        : filePath.replace(".json", ".derived.json");

      fs.writeFileSync(outputPath, JSON.stringify(enriched, null, 2));
      console.log(
        `✅ Processed ${file}${OVERWRITE ? "" : " → " + path.basename(outputPath)}`,
      );
    } catch (err) {
      console.error(`❌ Error processing ${file}:`, err.message);
    }
  }

  console.log("\n🎯 All jockeys processed successfully!");
}

// Run when called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  processAllJockeys();
}

export { processAllJockeys };
