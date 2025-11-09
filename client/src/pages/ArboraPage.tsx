import ArboraArticle from "@/components/ArboraArticle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import arboraImageUrl from "@assets/generated_images/Arbora_research_lab_workspace_ca4c4582.png";

//todo: remove mock functionality
const articles = [
  {
    title: "The Neuroscience of Conscious Listening: How Microhabits Reshape Neural Pathways",
    excerpt: "Recent research from our collaboration with cognitive neuroscience labs reveals fascinating insights into how consistent practice of conscious communication literally rewires the brain for empathy and presence.",
    author: "Dr. Elena Virtanen",
    date: "March 15, 2024",
    readTime: "8 min read",
    category: "Research",
    featured: true,
  },
  {
    title: "From Ego to Empathy: A 30-Day Journey",
    excerpt: "Tracking the transformation of communication patterns in TEAL organizations through our microhabit framework.",
    author: "Estève Pannetier",
    date: "March 10, 2024",
    readTime: "5 min read",
    category: "Case Study",
  },
  {
    title: "AI Agents for Compassionate Communication",
    excerpt: "Exploring how we're building AI tools that support rather than replace human connection in conscious dialogue.",
    author: "Dr. Marcus Chen",
    date: "March 8, 2024",
    readTime: "6 min read",
    category: "Technology",
  },
  {
    title: "The Periodic Table: Origins and Evolution",
    excerpt: "How we developed the framework combining NVC principles with design thinking methodology.",
    author: "Estève Pannetier",
    date: "March 1, 2024",
    readTime: "7 min read",
    category: "Framework",
  },
];

export default function ArboraPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-alignment text-white">Research & Insights</Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Arbora Research Lab
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Weekly thought pieces, research findings, and innovation at the intersection of conscious communication and AI
          </p>
        </div>

        <div 
          className="relative rounded-2xl overflow-hidden mb-16 h-64 md:h-96"
          style={{
            backgroundImage: `url(${arboraImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/60 flex items-center">
            <div className="max-w-2xl px-8 md:px-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Join the Research Community
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Contribute to groundbreaking research in conscious communication and receive early access to findings.
              </p>
              <Button 
                className="bg-alignment hover:bg-alignment/90"
                data-testid="button-sign-up-research"
                onClick={() => console.log('Sign up for research')}
              >
                Express Interest
              </Button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {articles.slice(0, 1).map((article) => (
            <ArboraArticle key={article.title} {...article} />
          ))}
          {articles.slice(1, 2).map((article) => (
            <ArboraArticle key={article.title} {...article} />
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {articles.slice(2).map((article) => (
            <ArboraArticle key={article.title} {...article} />
          ))}
        </div>

        <div className="backdrop-blur-sm bg-card/50 border border-white/10 rounded-2xl p-8 md:p-12 mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Research Partners</h2>
              <p className="text-muted-foreground mb-6">
                Arbora collaborates with leading institutions and organizations committed to advancing the science and practice of conscious communication.
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 p-3 rounded-lg backdrop-blur-sm bg-white/5">
                  <div className="w-2 h-2 rounded-full bg-alignment"></div>
                  <span>Helsinki University - Cognitive Neuroscience Lab</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg backdrop-blur-sm bg-white/5">
                  <div className="w-2 h-2 rounded-full bg-alignment"></div>
                  <span>TEAL Organization Network</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg backdrop-blur-sm bg-white/5">
                  <div className="w-2 h-2 rounded-full bg-alignment"></div>
                  <span>Center for Nonviolent Communication</span>
                </div>
              </div>
            </div>

            <Card className="backdrop-blur-sm bg-background/50">
              <CardHeader>
                <CardTitle>Subscribe to Research Updates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Receive weekly insights and early access to research findings.
                </p>
                <div className="space-y-2">
                  <Input 
                    placeholder="Your email address"
                    type="email"
                    className="backdrop-blur-sm bg-white/5"
                    data-testid="input-email-subscribe"
                  />
                  <Button 
                    className="w-full bg-alignment hover:bg-alignment/90"
                    data-testid="button-subscribe"
                    onClick={() => console.log('Subscribe to research updates')}
                  >
                    Subscribe
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  We honor your privacy. Unsubscribe anytime with gratitude.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>Agent Bios</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Meet the diverse team of researchers, practitioners, and AI specialists behind Arbora's innovations.
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>Methodology</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Our research combines qualitative ethnography with quantitative analysis and AI-assisted pattern recognition.
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>Open Data</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              We're committed to transparency. Anonymized datasets and findings are available for academic use.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
