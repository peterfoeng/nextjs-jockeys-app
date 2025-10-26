import { CheerioCrawler, log } from "crawlee";
import { promises as fs } from "node:fs";
import path from "node:path";
import { toSafeFileName } from "./utility/filename.js";

const DATA_DIR = "data/jockeys";

export async function writeJockeyDataToFile(jockeyData) {
  const {
    jockeyName,
    isApprentice,
    dateISO: raceDate,
    raceVenue,
    state,
    horse,
    trainerName,
    spValue,
    spString,
    weight,
    finishingPosition,
    raceTitle,
    raceDistance,
    raceGradeMatch,
    barrier,
    fieldSize,
    raceNumber,
    trackType,
    trackCondition,
    originalFieldSize,
    scratchedHorses,
    isFemaleJockey,
    claimedWeight,
  } = jockeyData;

  if (!jockeyName || !barrier) {
    console.error("❌ Missing jockey name or barrier:", jockeyData);
    return;
  }

  const filePath = `./data/jockeys/${toSafeFileName(jockeyName)}.json`;
  await fs.mkdir(DATA_DIR, { recursive: true });

  // Try to read existing data if file exists
  let existingData = { stats: [] };
  try {
    const content = await fs.readFile(filePath, "utf-8");
    existingData = JSON.parse(content);
  } catch {
    // File doesn’t exist — continue with default
  }

  const newStat = {
    raceDate,
    raceTitle,
    raceVenue,
    raceState: state,
    raceNumber,
    raceGrade: raceGradeMatch ? raceGradeMatch[1].trim() : "N/A",
    distance: raceDistance,
    horse,
    trainerName,
    spValue,
    spString,
    weight,
    claimedWeight,
    finishingPosition,
    barrier,
    fieldSize,
    trackType,
    trackCondition,
    originalFieldSize,
    scratchedHorses,
  };

  console.log(raceDate, jockeyName, horse, raceTitle);

  // ✅ Find if a matching entry already exists (same horse, date, and race)
  // const existingIndex = (existingData.stats || []).findIndex(
  //   (s) =>
  //     s.horse === horse &&
  //     s.raceDate === raceDate &&
  //     s.raceNumber === raceNumber,
  // );
  const existingIndex = -1;

  if (existingIndex !== -1) {
    // Update existing record
    existingData.stats[existingIndex] = {
      ...existingData.stats[existingIndex],
      ...newStat,
    };
    log.info(
      `🔁 Updated existing entry for ${jockeyName} (${horse}) on ${raceDate}`,
    );
  } else {
    // Add new record
    existingData.stats.push(newStat);
    log.info(`➕ Added new entry for ${jockeyName} (${horse}) on ${raceDate}`);
  }

  const updatedData = {
    name: jockeyName,
    isFemale: isFemaleJockey,
    rank: isApprentice ? "Apprentice" : "",
    location: existingData.location || "",
    age: existingData.age || "",
    stats: existingData.stats,
  };

  await fs.writeFile(filePath, JSON.stringify(updatedData, null, 2));
}

// const getDateIso = (dateStr) => {
//   // Date is Thursday, 16 October 2025
//   const parts = dateStr.split(", ")[1].split(" ");
//   const day = parts[0];
//   const month = parts[1];
//   const year = parts[2];
//   return new Date(`${month} ${day}, ${year}`).toISOString().split("T")[0];
// };

const getDateIso = (dateStr) => {
  if (!dateStr) return null;

  // Fallback-safe parse
  let day, month, year;
  try {
    const clean = dateStr.replace(/\s+/g, " ").trim();
    const parts = clean.includes(",") ? clean.split(", ")[1].split(" ") : clean.split(" ");
    [day, month, year] = parts;
  } catch {
    return null;
  }

  // Parse like before (works with Crawlee)
  const date = new Date(`${month} ${day}, ${year}`);

  if (isNaN(date.getTime())) return null;

  // Adjust to Australia/Sydney calendar day (no UTC drift)
  const partsAU = new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Sydney",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const obj = {};
  for (const p of partsAU) {
    if (p.type === "year" || p.type === "month" || p.type === "day") {
      obj[p.type] = p.value;
    }
  }

  return `${obj.year}-${obj.month}-${obj.day}`; // e.g. 2025-10-16
};

/* ---------------- CRAWLER ---------------- */

const aggregateData = {};

const crawler = new CheerioCrawler({
  async requestHandler({ request, $, enqueueLinks }) {
    const title = $("title").text().trim();
    console.log(`📄 ${request.url} → ${title}`);

    await enqueueLinks({ selector: 'a[href*="/Results.aspx"]' });

    if (!request.url.includes("Results.aspx")) return;

    console.log("⚙️ Processing race results...");
    const raceDate = $(".race-venue-date").text().trim();
    const raceVenueStr = $(".race-venue h2").text().trim();
    const raceVenue = raceVenueStr.split(": ")[0].trim().split(", ")[0].trim();
    const raceTitles = $("table.race-title");
    const raceStrips = $("table.race-strip-fields");
    const state = request.url.includes("VIC")
      ? "VIC"
      : request.url.includes("NSW")
      ? "NSW"
      : request.url.includes("QLD")
      ? "QLD"
      : request.url.includes("SA")
      ? "SA"
      : request.url.includes("WA")
      ? "WA"
      : request.url.includes("TAS")
      ? "TAS"
      : request.url.includes("NT")
      ? "NT"
      : request.url.includes("ACT")
      ? "ACT"
      : "";

    console.log(`race venue: ${raceVenue}`);

    for (const [i, raceTable] of raceTitles.toArray().entries()) {
      const raceTitle = $(raceTable).find("th span:first-child").text().trim();
      const runnerRows = $(raceStrips[i]).find(
        "tr.EvenRow:not(.Scratched), tr.OddRow:not(.Scratched)",
      );
      const runnerRowsScratched = $(raceStrips[i]).find(
        "tr.EvenRow.Scratched, tr.OddRow.Scratched",
      );
      const raceSummary = $(raceTable).html() || "";
      const raceSummaryRegex =
        /<b>Track Type:<\/b>\s*([\w\s]+?)\s*<b>Track Condition:<\/b>\s*([\w\s\d]+)/i;
      // const raceGradeRegex = /<br>\s*([^<]+)<br>/i;
      const raceGradeRegex =
        /<br>\s*((?:BenchMark|Class|Group|Maiden|Handicap)[^<]+)<br>/i;
      const raceGradeMatch = raceSummary.match(raceGradeRegex);
      const match = raceSummary.match(raceSummaryRegex);
      const trackType = match ? match[1].trim() : "Unknown";
      const trackCondition = match ? match[2].trim() : "Unknown";

      console.log(`🏇 Race ${i + 1}: ${raceTitle}`);

      for (const [index, el] of runnerRows.toArray().entries()) {
        const jockeyCell = $(el).find("td.jockey");
        const jockeyName = jockeyCell.text().split("(")[0].trim();
        const claimedWeight = Number(
          jockeyCell
            .text()
            .split("(")[1]
            ?.split("/")[0]
            .replace("a", "")
            .trim() || null,
        );
        const isFemaleJockey = /Ms\.|Miss|Mrs\./i.test(jockeyName);
        const isApprentice = jockeyCell.find(".apprentice-claim").length > 0;
        const raceNum = `Race ${i + 1} - `;
        const cleanRaceTitle =
          raceTitle
            .replace(raceNum, "")
            .split("PM ")[1]
            ?.split("(")[0]
            ?.trim() || raceTitle;

        const jockeyData = {
          dateISO: getDateIso(raceDate),
          raceVenue,
          state,
          raceTitle: cleanRaceTitle,
          raceGradeMatch,
          horse: $(el).find("td.horse").text().trim(),
          jockeyName,
          jockeyCode:
            jockeyCell
              .find("a")
              .attr("href")
              ?.split("jockeycode=")[1]
              ?.split("&")[0] || "",
          isApprentice,
          trainerName: $(el).find("td.trainer").text().trim(),
          spString: $(el).find("td:last-child").text().trim(), // $10
          spValue:
            Number(
              $(el)
                .find("td:last-child")
                .text()
                .trim()
                .replace("$", "")
                .replace("SP", "")
                .replace("F", "")
                .trim(),
            ) || null, // 10
          weight:
            Number(
              $(el).find("td:nth-child(9)").text().trim().split("kg")[0] ||
                null,
            ) - claimedWeight,
          claimedWeight: claimedWeight || null,
          finishingPosition: index + 1,
          finishingMargin: $(el).find("td:nth-child(7)").text().trim(),
          barrier: Number($(el).find("td:nth-child(8)").text().trim()) || null,
          fieldSize: runnerRows.length,
          originalFieldSize: runnerRows.length + runnerRowsScratched.length,
          scratchedHorses: runnerRowsScratched.length,
          raceNumber: i + 1,
          raceDistance: Number(
            raceTitle.split("(")[1]?.split("METRES)")[0]?.trim() || "",
          ),
          trackType,
          trackCondition,
          isFemaleJockey,
        };

        await writeJockeyDataToFile(jockeyData);
      }
    }
  },

  failedRequestHandler({ request }) {
    log.warning(`⚠️ Failed twice: ${request.url}`);
  },
});

await crawler.run([
  "https://racingaustralia.horse/FreeFields/Calendar_Results.aspx?State=WA",
  // "https://racingaustralia.horse/FreeFields/Calendar_Results.aspx?State=VIC",
  // "https://racingaustralia.horse/FreeFields/Calendar_Results.aspx?State=NSW",
  // "https://racingaustralia.horse/FreeFields/Calendar_Results.aspx?State=SA",
  // "https://racingaustralia.horse/FreeFields/Calendar_Results.aspx?State=TAS",
  // "https://racingaustralia.horse/FreeFields/Calendar_Results.aspx?State=ACT",
  // "https://racingaustralia.horse/FreeFields/Calendar_Results.aspx?State=NSW",
]);

log.info("🏁 Crawl complete.");
await fs.writeFile("tracks.json", JSON.stringify(aggregateData, null, 2));
console.log("💾 Saved: tracks.json");
