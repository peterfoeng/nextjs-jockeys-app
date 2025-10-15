import { CheerioCrawler, log } from "crawlee";
import * as fs from "node:fs";

export function writeJockeyDataToFile(jockeyData) {
  if (!jockeyData.jockeyName) {
    console.error("Jockey name is missing in the data:", jockeyData);
    return;
  }

  const filePath = `data/jockeys/${jockeyData.jockeyName.toLowerCase().replace(/\s+/g, "-")}.json`;
  const jockeyRank = ""; // You can set this value based on your logic
  const jockeyLocation = ""; // You can set this value based on your logic
  const jockeyAge = ""; // You can set this value based on your logic
  let stats = []; // You can populate this object based on your logic
  let existingData = {};

  const salutation = jockeyData.isFemale
    ? jockeyData.jockeyName.startsWith("Ms")
      ? "Ms"
      : jockeyData.jockeyName.startsWith("Miss")
        ? "Miss"
        : "Mrs"
    : jockeyData.jockeyName.startsWith("Mr")
      ? "Mr"
      : "";

  // Check if the file exists and read existing data
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    existingData = JSON.parse(fileContent);
    stats = existingData.stats || [];

    // Append new stats
    stats.push({
      raceDate: jockeyData.raceDate,
      raceVenue: jockeyData.raceVenue,
      horse: jockeyData.horse,
      trainerName: jockeyData.trainerName,
      sp: jockeyData.sp,
      weight: jockeyData.weight,
      finishingPosition: jockeyData.finishingPosition,
      raceTitle: jockeyData.raceTitle,
    });

    // Write updated data back to the file
    fs.writeFileSync(
      filePath,
      JSON.stringify(
        {
          name: jockeyData.jockeyName,
          rank: jockeyData.isApprentice ? "Apprentice" : "",
          location: jockeyLocation,
          age: jockeyAge,
          stats: stats,
          gender: jockeyData.isFemale ? "Female" : "Male",
          salutation,
        },
        null,
        2,
      ),
    );
  } else {
    // If the file doesn't exist, create it with an empty array
    fs.writeFileSync(
      filePath,
      JSON.stringify(
        {
          name: jockeyData.jockeyName,
          rank: jockeyRank,
          location: jockeyData.location,
          age: jockeyAge,
          gender: jockeyData.isFemale ? "Female" : "Male",
          salutation,
          stats: [
            {
              raceDate: jockeyData.raceDate,
              raceVenue: jockeyData.raceVenue,
              horse: jockeyData.horse,
              trainerName: jockeyData.trainerName,
              sp: jockeyData.sp,
              weight: jockeyData.weight,
              finishingPosition: jockeyData.finishingPosition,
              raceTitle: jockeyData.raceTitle,
            },
          ],
        },
        null,
        2,
      ),
    );
  }
}

// The main aggregation object
const aggregateData = {};

const crawler = new CheerioCrawler({
  async requestHandler({ request, $, body, enqueueLinks }) {
    const title = $("title").text();

    console.log(`Title of ${request.url}: ${title}`);

    // ✅ enqueue more city links
    await enqueueLinks({
      selector: 'a[href*="/Results.aspx"]:not([href*="Trial"])',
    });

    if (request.url.includes("Results.aspx")) {
      console.log("Processing race results page...");
      const raceDate = $(".race-venue-date").text().trim();
      const raceVenue = $(".race-venue h2")
        .text()
        .trim()
        .split("\r\n")[0]
        .trim();
      const tableRaceData = $("table.race-title");
      const tableRunnerData = $("table.race-strip-fields");
      const raceLength = tableRaceData.length;
      console.log(`Race Date: ${raceDate}, Race Venue: ${raceVenue}`);

      for (let i = 0; i < raceLength; i++) {
        const raceTitle = tableRaceData
          .eq(i)
          .find("th span:first-child")
          .text()
          .trim();
        console.log(`Race Title [${i + 1}]: ${raceTitle}`);

        const runnerRows = tableRunnerData
          .eq(i)
          .find("tr.EvenRow:not(.scratched), tr.OddRow:not(.scratched)");
        runnerRows.each((index, element) => {
          const horse = $(element).find("td.horse").text().trim();
          const jockeyName = $(element)
            .find("td.jockey")
            .text()
            .trim()
            .split("(")[0]
            .trim();
          const jockeyCode =
            $(element)
              .find("td.jockey a")
              .attr("href")
              ?.split("jockeycode=")[1]
              ?.split("&")[0]
              .trim() || "";
          console.log(`Jockey Code: ${jockeyCode}`);
          console.log(`Jockey Name: ${jockeyName}`);
          console.log(`Horse: ${horse}`);
          const isApprentice =
            $(element).find("td.jockey .apprentice-claim").length > 0;
          if (isApprentice) {
            console.log(`Jockey ${jockeyName} is an apprentice.`);
          }
          const trainerName = $(element).find("td.trainer").text().trim();
          const sp = $(element).find("td:last-child").text().trim();
          const weight = $(element).find("td:nth-child(9)").text().trim();
          const finishingPosition = index + 1;
          const isFemale =
            jockeyName.startsWith("Ms") ||
            jockeyName.startsWith("Miss") ||
            jockeyName.startsWith("Mrs");

          // Here you can store or process the extracted data as needed

          const jockeyData = {
            raceDate,
            raceVenue,
            jockeyName,
            jockeyCode,
            horse,
            trainerName,
            sp,
            weight,
            finishingPosition,
            raceTitle,
            isApprentice,
            isFemale,
            location: "WA", // You can set this based on the state page being processed
          };
          writeJockeyDataToFile(jockeyData);
        });
      }
    }

    // Push the data to the aggregation object
    // aggregateData[request.url] = { title };
  },
  failedRequestHandler({ request }) {
    log.debug(`Request ${request.url} failed twice.`);
  },
});

// Start the crawl as before
// await crawler.run(["https://racingaustralia.horse/"]);
await crawler.run([
  "https://racingaustralia.horse/FreeFields/Calendar_Results.aspx?State=WA",
]);

log.debug("Crawler finished.");

// At the end of the crawl, write aggregateData to disk
fs.writeFileSync("tracks.json", JSON.stringify(aggregateData, null, 2));
console.log("Data written to tracks.json");
