import JockeyList from "@/components/jockeys/JockeyList";
import { getJockeySummariesForDate, getLatestRaceDate } from "@/lib/raceData";

export default async function JockeysPage() {
  const date = await getLatestRaceDate();

  if (!date) {
    return <JockeyList date={null} summaries={[]} />;
  }

  const summaries = await getJockeySummariesForDate(date);

  return <JockeyList date={date} summaries={summaries} />;
}
