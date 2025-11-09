import CoachingPackage from '../CoachingPackage'

export default function CoachingPackageExample() {
  return (
    <div className="p-8 grid md:grid-cols-2 gap-6 max-w-4xl">
      <CoachingPackage
        title="Foundation"
        type="1:1"
        sessions={4}
        duration="4 weeks"
        price="€800"
        features={[
          "Personalized communication assessment",
          "Custom microhabit development plan",
          "Weekly 60-minute sessions",
          "Email support between sessions",
        ]}
      />
      <CoachingPackage
        title="Team Transformation"
        type="Team"
        sessions={8}
        duration="2 months"
        price="€3,200"
        features={[
          "Team communication audit",
          "Collective microhabit workshops",
          "Bi-weekly 90-minute sessions",
          "Arbora research collaboration access",
          "Ongoing Slack support channel",
        ]}
        highlighted
      />
    </div>
  )
}
