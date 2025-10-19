import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === CONFIG ===
const ROOT_DATA_DIR = path.resolve(__dirname, "../data");
const JOCKEY_DIR = path.join(ROOT_DATA_DIR, "jockeys");
const SUMMARY_PATH = path.join(JOCKEY_DIR, "summary.json");
const OVERWRITE = true; // true = overwrite same file; false = make *.derived.json

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

  // streak
  let streakType = "losing";
  let streakCount = 0;
  for (let i = races.length - 1; i >= 0; i--) {
    const pos = races[i].finishingPosition;
    if (pos === 1) {
      if (streakType === "losing") {
        streakType = "win";
        streakCount = 1;
      } else if (streakType === "win") streakCount++;
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

// === SUMMARY BUILD ===
function buildSummary(allJockeys) {
  // Criteria: in form if winRate >= 0.2 or placeRate >= 0.4 in recent runs
  const topInFormJockeys = allJockeys
    .filter(
      (j) =>
        j.derived && (j.derived.winRate >= 0.2 || j.derived.placeRate >= 0.4),
    )
    .sort((a, b) => b.derived.placeRate - a.derived.placeRate)
    .slice(0, 10)
    .map((j) => ({
      name: j.name,
      winRate: j.derived.winRate,
      placeRate: j.derived.placeRate,
      recentForm: j.derived.recentForm,
    }));

  // Criteria: due for win if no win in >10 days but has decent placeRate
  const dueForWinJockeys = allJockeys
    .filter(
      (j) =>
        j.derived &&
        j.derived.daysSinceLastWin > 10 &&
        j.derived.placeRate >= 0.2,
    )
    .sort((a, b) => b.derived.daysSinceLastWin - a.derived.daysSinceLastWin)
    .slice(0, 10)
    .map((j) => ({
      name: j.name,
      daysSinceLastWin: j.derived.daysSinceLastWin,
      placeRate: j.derived.placeRate,
      recentForm: j.derived.recentForm,
    }));

  const avgWinRate =
    allJockeys.reduce((sum, j) => sum + (j.derived?.winRate || 0), 0) /
    allJockeys.length;

  const avgPlaceRate =
    allJockeys.reduce((sum, j) => sum + (j.derived?.placeRate || 0), 0) /
    allJockeys.length;

  return {
    dateGenerated: new Date().toISOString(),
    jockeyCount: allJockeys.length,
    averages: {
      winRate: +avgWinRate.toFixed(2),
      placeRate: +avgPlaceRate.toFixed(2),
    },
    topInFormJockeys,
    dueForWinJockeys,
  };
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

  const all = [];

  for (const file of files) {
    const filePath = path.join(JOCKEY_DIR, file);
    try {
      const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
      const enriched = computeDerivedStats(raw);
      all.push(enriched);

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

  // Build and save daily summary
  const summary = buildSummary(all);
  fs.writeFileSync(SUMMARY_PATH, JSON.stringify(summary, null, 2));

  console.log(`\n📊 Summary written to ${SUMMARY_PATH}`);
  console.log("🎯 All jockeys processed successfully!");
}

// Run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  processAllJockeys();
}

export { processAllJockeys };
