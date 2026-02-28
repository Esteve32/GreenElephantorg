import RetreatCard from '../RetreatCard'
const retreatImageUrl = "/retreat-venue.png";

export default function RetreatCardExample() {
  return (
    <div className="p-8 max-w-sm">
      <RetreatCard
        title="Spring Awakening Retreat"
        season="Spring 2024"
        date="April 15-17, 2024"
        location="Lake Como, Italy"
        capacity="Limited to 12 participants"
        imageUrl={retreatImageUrl}
        description="Join us for a transformative weekend exploring the microhabit methodology for conscious communication in a serene mountain setting."
        price="€1,200"
      />
    </div>
  )
}
