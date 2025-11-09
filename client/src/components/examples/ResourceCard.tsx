import ResourceCard from '../ResourceCard'

export default function ResourceCardExample() {
  return (
    <div className="p-8 grid md:grid-cols-3 gap-4 max-w-6xl">
      <ResourceCard
        title="The Conscious Communication Handbook"
        description="A comprehensive guide to transforming conflicts into trust using the Periodic Table framework."
        type="Ebook"
        format="PDF, 120 pages"
        audience="All Levels"
      />
      <ResourceCard
        title="TEAL Team Communication Template"
        description="Ready-to-use Notion workspace for implementing microhabits in your organization."
        type="Notion Kit"
        audience="Startup Founders"
      />
      <ResourceCard
        title="Compassionate Dialogue GPT"
        description="AI assistant trained on NVC principles to help you craft empathetic responses."
        type="GPT Assistant"
        audience="Executive Assistants"
      />
    </div>
  )
}
