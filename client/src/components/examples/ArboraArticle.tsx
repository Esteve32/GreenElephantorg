import ArboraArticle from '../ArboraArticle'

export default function ArboraArticleExample() {
  return (
    <div className="p-8 space-y-4 max-w-4xl">
      <ArboraArticle
        title="The Neuroscience of Conscious Listening: How Microhabits Reshape Neural Pathways"
        excerpt="Recent research from our collaboration with cognitive neuroscience labs reveals fascinating insights into how consistent practice of conscious communication literally rewires the brain..."
        author="Dr. Elena Virtanen"
        date="March 15, 2024"
        readTime="8 min read"
        category="Research"
        featured
      />
      <div className="grid md:grid-cols-2 gap-4">
        <ArboraArticle
          title="From Ego to Empathy: A 30-Day Journey"
          excerpt="Tracking the transformation of communication patterns in TEAL organizations through our microhabit framework."
          author="Estève Pannetier"
          date="March 10, 2024"
          readTime="5 min read"
          category="Case Study"
        />
        <ArboraArticle
          title="AI Agents for Compassionate Communication"
          excerpt="Exploring how we're building AI tools that support rather than replace human connection in conscious dialogue."
          author="Dr. Marcus Chen"
          date="March 8, 2024"
          readTime="6 min read"
          category="Technology"
        />
      </div>
    </div>
  )
}
