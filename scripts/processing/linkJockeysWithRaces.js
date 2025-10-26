import fs from "fs";
import path from "path";

const ROOT = path.resolve("data");
const JOCKEY_DIR = path.join(ROOT, "jockeys");
const RACES_DIR = path.join(ROOT, "races");
const PROCESSED_DIR = path.join(ROOT, "processed");

const MAX_RESULTS = 100; // per-date + global

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
  if (!fs.existsSync(RACES_DIR)) {
    console.error("❌ Races folder not found:", RACES_DIR);
    process.exit(1);
  }

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

function processRaces() {
  const jockeyMap = loadAllJockeys();
  const racesByDate = loadRaceFilesByDate();

  console.log(`🔍 Found ${Object.keys(jockeyMap).length} jockey profiles`);
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

          console.log(`  - ${jockey.name} riding "${horse.horseName || horse.name || horse.horse}" in ${race.raceTitle || race.title}`);

          if (!jockeyRides[jockey.name]) {
            jockeyRides[jockey.name] = {
              jockeyName: jockey.name,
              daysSinceLastWin: jockey.derived?.daysSinceLastWin ?? null,
              placeRate: jockey.derived?.placeRate ?? 0,
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

    const dueForWin = Object.values(jockeyRides)
      .filter(j => j.daysSinceLastWin > 10 && j.rides.length > 0)
      .map(j => {
        const bestOdds = Math.min(
          ...j.rides.map(r => (typeof r.odds === "number" ? r.odds : Infinity))
        );
        return { ...j, bestOdds };
      })
      .sort((a, b) => {
        if (b.rides.length !== a.rides.length) return b.rides.length - a.rides.length;
        if (a.bestOdds !== b.bestOdds) return a.bestOdds - b.bestOdds;
        return b.daysSinceLastWin - a.daysSinceLastWin;
      })
      .slice(0, MAX_RESULTS);

    // Write per-date file
    const dateDir = path.join(PROCESSED_DIR, date);
    ensureDir(dateDir);
    const dateOutput = path.join(dateDir, "dueForWin.json");
    fs.writeFileSync(dateOutput, JSON.stringify(dueForWin, null, 2));

    console.log(`✅ ${date}: ${dueForWin.length} due-for-win jockeys → ${dateOutput}`);

    globalResults.push(
      ...dueForWin.map(j => ({ ...j, raceDate: date }))
    );
  }

  // Combine all dates into one big file
  const combined = globalResults
    .sort((a, b) => {
      if (a.raceDate !== b.raceDate) return a.raceDate.localeCompare(b.raceDate);
      if (b.rides.length !== a.rides.length) return b.rides.length - a.rides.length;
      return a.bestOdds - b.bestOdds;
    })
    .slice(0, MAX_RESULTS);

  ensureDir(PROCESSED_DIR);
  const allOutput = path.join(PROCESSED_DIR, "dueForWinAll.json");
  fs.writeFileSync(allOutput, JSON.stringify(combined, null, 2));
  console.log(`\n📊 Global Top ${MAX_RESULTS} across all dates → ${allOutput}`);
}

/* --------------------------- RUN --------------------------- */

processRaces();