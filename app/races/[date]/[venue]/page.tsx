import { notFound } from "next/navigation";
import RaceVenueView from "@/components/races/RaceVenueView";
import { loadRaceVenue } from "@/lib/raceData";

interface RaceVenuePageProps {
  params: {
    date: string;
    venue: string;
  };
}

export default async function RaceVenuePage({ params }: RaceVenuePageProps) {
  const data = await loadRaceVenue(params.date, params.venue);

  if (!data) {
    notFound();
  }

  return <RaceVenueView date={params.date} data={data} />;
}
