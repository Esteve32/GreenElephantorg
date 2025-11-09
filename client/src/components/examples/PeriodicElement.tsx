import PeriodicElement from '../PeriodicElement'

export default function PeriodicElementExample() {
  return (
    <div className="flex gap-4 p-8 flex-wrap">
      <PeriodicElement 
        symbol="Li"
        name="Listening"
        number={1}
        lens="needs"
        description="The foundation of conscious communication - truly hearing and understanding others without judgment."
        learningUrl="https://example.com/listening"
      />
      <PeriodicElement 
        symbol="Em"
        name="Empathy"
        number={2}
        lens="alignment"
        description="Connecting with others' emotions and experiences with compassion."
      />
      <PeriodicElement 
        symbol="Tr"
        name="Trust"
        number={3}
        lens="dynamics"
        description="Building reliable relationships through consistent authentic communication."
      />
    </div>
  )
}
