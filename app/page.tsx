import HomeDashboard from "@/components/home/HomeDashboard";
import { getDashboardSummary, getLatestRaceDate } from "@/lib/raceData";

export default async function HomePage() {
  const date = await getLatestRaceDate();
  if (!date) {
    return <HomeDashboard summary={null} />;
  }

  const summary = await getDashboardSummary(date);

  return <HomeDashboard summary={summary} />;
}
