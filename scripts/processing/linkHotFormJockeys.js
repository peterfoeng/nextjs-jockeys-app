import fs from "fs";
import path from "path";

const ROOT = path.resolve("data");
const JOCKEY_DIR = path.join(ROOT, "jockeys");
const RACES_DIR = path.join(ROOT, "races");
const PROCESSED_DIR = path.join(ROOT, "processed");

const MAX_RESULTS = 100;

/* --------------------------- HELPERS --------------------------- */

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function loadAllJockeys() {
  const jockeyFiles = fs.readdirSync(JOCKEY_DIR).filter(f => f.endsWith(".json"));
  const map = {};
  for (const file of jockeyFiles) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(JOCKEY_DIR, file), "utf8"));
      map[data.name.toLowerCase()] = data;
    } catch (err) {
      console.warn("⚠️ Failed to parse jockey file:", file, err.message);
    }
  }
  return map;
}

function loadRaceFilesByDate() {
  const result = {};
  const dateFolders = fs.readdirSync(RACES_DIR).filter(d => {
    const p = path.join(RACES_DIR, d);
    return fs.statSync(p).isDirectory();
  });

  for (const dateFolder of dateFolders) {
    const datePath = path.join(RACES_DIR, dateFolder);
    const venueFiles = fs.readdirSync(datePath).filter(f => f.endsWith(".json"));
    result[dateFolder] = venueFiles.map(v => path.join(datePath, v));
  }

  return result;
}

/* --------------------------- CORE LOGIC --------------------------- */

function processHotForm() {
  const jockeyMap = loadAllJockeys();
  const racesByDate = loadRaceFilesByDate();

  console.log(`🔥 Found ${Object.keys(jockeyMap).length} jockey profiles`);
  console.log(`📅 Found ${Object.keys(racesByDate).length} race dates\n`);

  const globalResults = [];

  for (const [date, raceFiles] of Object.entries(racesByDate)) {
    const jockeyRides = {};

    for (const racePath of raceFiles) {
      let raceData;
      try {
        raceData = JSON.parse(fs.readFileSync(racePath, "utf8"));
      } catch (err) {
        console.warn("⚠️ Failed to parse race file:", racePath, err.message);
        continue;
      }

      const venueName =
        raceData.venue ||
        raceData.venueInfo?.name ||
        raceData.raceVenue ||
        path.basename(racePath).replace(".json", "");
      const races = raceData.races || [];

      for (const race of races) {
        for (const horse of race.horses || race.runners || []) {
          const jockeyName = horse.jockey?.toLowerCase();
          if (!jockeyName || !jockeyMap[jockeyName]) continue;

          const jockey = jockeyMap[jockeyName];
          const odds = horse.spValue ?? horse.sp ?? null;

          if (!jockeyRides[jockey.name]) {
            jockeyRides[jockey.name] = {
              jockeyName: jockey.name,
              winRate: jockey.derived?.winRate ?? 0,
              placeRate: jockey.derived?.placeRate ?? 0,
              daysSinceLastWin: jockey.derived?.daysSinceLastWin ?? null,
              streak: jockey.derived?.currentStreak ?? null,
              rides: []
            };
          }

          jockeyRides[jockey.name].rides.push({
            date,
            venue: venueName,
            raceTitle: race.raceTitle || race.title,
            horse: horse.horseName || horse.name || horse.horse,
            odds
          });
        }
      }
    }

    const hotForm = Object.values(jockeyRides)
      .filter(j => {
        const inFormByRate = j.winRate >= 0.2 || j.placeRate >= 0.5;
        const recentWin = j.daysSinceLastWin !== null && j.daysSinceLastWin <= 7;
        const streaking = j.streak?.type === "win" && j.streak.count >= 2;
        return (inFormByRate || recentWin || streaking) && j.rides.length > 0;
      })
      .map(j => {
        const bestOdds = Math.min(
          ...j.rides.map(r => (typeof r.odds === "number" ? r.odds : Infinity))
        );
        return { ...j, bestOdds };
      })
      .sort((a, b) => {
        // Rank: best odds → higher win rate → more rides
        if (a.bestOdds !== b.bestOdds) return a.bestOdds - b.bestOdds;
        if (b.winRate !== a.winRate) return b.winRate - a.winRate;
        return b.rides.length - a.rides.length;
      })
      .slice(0, MAX_RESULTS);

    const dateDir = path.join(PROCESSED_DIR, date);
    ensureDir(dateDir);
    const dateOutput = path.join(dateDir, "hotForm.json");
    fs.writeFileSync(dateOutput, JSON.stringify(hotForm, null, 2));

    console.log(`✅ ${date}: ${hotForm.length} in-form jockeys → ${dateOutput}`);

    globalResults.push(...hotForm.map(j => ({ ...j, raceDate: date })));
  }

  const combined = globalResults
    .sort((a, b) => {
      if (a.raceDate !== b.raceDate) return a.raceDate.localeCompare(b.raceDate);
      if (a.bestOdds !== b.bestOdds) return a.bestOdds - b.bestOdds;
      return b.winRate - a.winRate;
    })
    .slice(0, MAX_RESULTS);

  ensureDir(PROCESSED_DIR);
  const allOutput = path.join(PROCESSED_DIR, "hotFormAll.json");
  fs.writeFileSync(allOutput, JSON.stringify(combined, null, 2));
  console.log(`\n🔥 Global Top ${MAX_RESULTS} hot-form jockeys → ${allOutput}`);
}

/* --------------------------- RUN --------------------------- */

processHotForm();