import { CheerioCrawler, log } from "crawlee";
import fs from "node:fs/promises";
import path from "node:path";
import { normalizeTitle } from "./utility/filename.js";

const DATA_DIR = "data/races";

/* ---------- UTILITIES ---------- */

const toFilePath = (raceDate, raceVenue) =>
  path.join(
    DATA_DIR,
    raceDate,
    `${raceVenue.toLowerCase().replace(/\s+/g, "-")}.json`,
  );

const getDateIso = (dateStr) => {
  // Example: "Thursday, 16 October 2025"
  const parts = dateStr.split(", ")[1].split(" ");
  const [day, month, year] = parts;

  // Create date object in local AU timezone
  const date = new Date(`${month} ${day}, ${year} 00:00:00 GMT+1000`); // +1000 for Sydney/AEST

  // Format using AU locale to ensure no UTC shift
  const formatted = new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Sydney",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

  // Convert DD/MM/YYYY -> YYYY-MM-DD
  const [d, m, y] = formatted.split("/");
  return `${y}-${m}-${d}`;
};

/* ---------- CRAWLER ---------- */

const crawler = new CheerioCrawler({
  async requestHandler({ request, $, enqueueLinks }) {
    const title = $("title").text().trim();
    log.info(`📄 ${request.url} → ${title}`);

    // Enqueue modified links (Form → Acceptances)
    const modifiedLinks = $('a[href*="/Form.aspx"], a[href*="/Results.aspx"]')
      .map((_, el) => {
        const href = $(el).attr("href");
        if (!href) return null;
        try {
          const url = new URL(href, request.loadedUrl);
          url.pathname = url.pathname.replace(
            "/Form.aspx",
            "/Acceptances.aspx",
          );
          url.pathname = url.pathname.replace(
            "/Results.aspx",
            "/Acceptances.aspx",
          );
          return url.toString();
        } catch {
          return null;
        }
      })
      .get()
      .filter(Boolean);
    // .slice(0, 1); // limit to 1 for testing

    await enqueueLinks({ urls: modifiedLinks, label: "ACCEPTANCES" });
    log.info("🔗 Enqueued (testing):", modifiedLinks);

    // Only process Acceptance pages
    if (!request.url.includes("Acceptances.aspx")) return;
    let raceState = request.url.includes("VIC") ? "VIC" : "NSW";
    if (request.url.includes("QLD")) raceState = "QLD";
    if (request.url.includes("SA")) raceState = "SA";
    if (request.url.includes("WA")) raceState = "WA";
    if (request.url.includes("TAS")) raceState = "TAS";
    if (request.url.includes("NT")) raceState = "NT";
    if (request.url.includes("ACT")) raceState = "ACT";

    log.info("⚙️ Processing race results...");
    const raceDateRaw = $(".race-venue-date").text().trim();
    const raceDate = getDateIso(raceDateRaw);
    const venueHeader = $(".race-venue h2").text().trim();

    console.log(`Processing ${raceDate} - ${venueHeader} (${raceState})`);

    // Extract general info
    const [raceVenueRaw] = venueHeader.split(": ");
    const [raceVenue, locationRaw] = raceVenueRaw
      .split(",")
      .map((s) => s.trim());
    const location = locationRaw || "";
    const clubName = $("h1, .header h1").first().text().trim() || raceVenue;

    const raceTitles = $("table.race-title");
    const raceStrips = $("table.race-strip-fields");
    const races = [];

    for (const [i, raceTable] of raceTitles.toArray().entries()) {
      const raceTitle = $(raceTable).find("th span:first-child").text().trim();
      const runnerRows = $(raceStrips[i]).find(
        "tr.EvenRow:not(.Scratched), tr.OddRow:not(.Scratched)",
      );
      const raceSummary = $(raceTable).html() || "";

      const raceGradeRegex =
        /<br>\s*((?:BenchMark|Class|Group|Maiden|Handicap)[^<]+)<br>/i;
      const raceSummaryRegex =
        /<b>Track Type:<\/b>\s*([\w\s]+?)\s*<b>Track Condition:<\/b>\s*([\w\s\d]+)/i;

      const raceGradeMatch = raceSummary.match(raceGradeRegex);
      const match = raceSummary.match(raceSummaryRegex);
      const trackType = match ? match[1].trim() : "Unknown";
      const trackCondition = match ? match[2].trim() : "Unknown";

      const cleanRaceTitle =
        raceTitle
          .replace(`Race ${i + 1} - `, "")
          .split("PM ")[1]
          ?.split("(")[0]
          ?.trim() || raceTitle;

      const raceObj = {
        title: normalizeTitle(cleanRaceTitle),
        grade: raceGradeMatch ? raceGradeMatch[1].trim() : "N/A",
        trackType,
        state: raceState,
        trackCondition,
        distance: Number(
          raceTitle.split("(")[1]?.split("METRES)")[0]?.trim() || "",
        ),
        runners: [],
        originalFieldSize: runnerRows.length,
        scratched: 0,
      };

      for (const el of runnerRows.toArray()) {
        const jockeyCell = $(el).find("td.jockey");
        const jockeyName = jockeyCell.text().split("(")[0].trim();
        const claimedWeight = Number(
          jockeyCell
            .text()
            .split("(")[1]
            ?.split("/")[0]
            ?.replace("a", "")
            .trim() || 0,
        );
        const horse = $(el).find("td.horse a").text().trim();
        const trainer = $(el).find("td.trainer").text().trim();
        const barrier = $(el).find("td.barrier").text().trim();
        const weight = $(el)
          .find("td.weight")
          .text()
          .trim()
          .replace("kg", "")
          .trim();

        raceObj.runners.push({
          horse,
          jockey: jockeyName,
          claimedWeight,
          trainer,
          barrier,
          weight,
          sp: 0,
          spValue: "0",
        });
      }

      races.push(raceObj);
    }

    // 🗂️ Construct final structured JSON
    const venueData = {
      venueInfo: {
        name: raceVenue,
        location,
        clubName,
        date: raceDate,
        sourceUrl: request.url,
      },
      races,
    };

    // ✍️ Write file
    const filePath = toFilePath(raceDate, raceVenue);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(venueData, null, 2));
    log.info(`📦 Saved ${filePath}`);
  },

  failedRequestHandler({ request }) {
    log.warning(`⚠️ Failed twice: ${request.url}`);
  },
});

/* ---------- RUN ---------- */

(async () => {
  await crawler.run(["https://racingaustralia.horse/"]);
  log.info("🏁 Crawl complete.");
})();
