import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, Heart, Users, Sparkles, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function ChooseYourPathPage() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const diagnosticQuestions = [
    {
      id: 1,
      question: "What's your primary goal with conscious communication?",
      options: [
        { value: "deep-transformation", label: "Deep personal transformation", path: "retreat" },
        { value: "ongoing-support", label: "Ongoing support and accountability", path: "coaching" },
        { value: "organizational-change", label: "Transform my entire organization", path: "consulting" },
      ],
    },
    {
      id: 2,
      question: "How much time can you dedicate?",
      options: [
        { value: "intensive", label: "I want an intensive immersive experience", path: "retreat" },
        { value: "weekly", label: "Weekly sessions over several months", path: "coaching" },
        { value: "strategic", label: "Strategic partnership over 6-12 months", path: "consulting" },
      ],
    },
    {
      id: 3,
      question: "What's your budget range?",
      options: [
        { value: "retreat-budget", label: "€2,500 - €6,000", path: "retreat" },
        { value: "coaching-budget", label: "€500 - €2,000 per month", path: "coaching" },
        { value: "consulting-budget", label: "€15,000+", path: "consulting" },
      ],
    },
  ];

  const paths = {
    retreat: {
      title: "Immersive Retreat",
      description: "You're ready for deep transformation in a supportive community setting",
      href: "/retreats",
      icon: Heart,
      color: "needs",
    },
    coaching: {
      title: "Personal Coaching",
      description: "You need ongoing guidance and accountability for sustainable change",
      href: "/coaching",
      icon: Users,
      color: "alignment",
    },
    consulting: {
      title: "Organizational Consulting",
      description: "You're leading transformation at the organizational level",
      href: "/consulting",
      icon: Sparkles,
      color: "flow",
    },
  };

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const calculatePath = () => {
    const pathCounts: Record<string, number> = { retreat: 0, coaching: 0, consulting: 0 };
    
    diagnosticQuestions.forEach((q) => {
      const answer = answers[q.id];
      if (answer) {
        const option = q.options.find((opt) => opt.value === answer);
        if (option) {
          pathCounts[option.path]++;
        }
      }
    });

    const recommendedPath = Object.entries(pathCounts).reduce((a, b) => 
      a[1] > b[1] ? a : b
    )[0] as keyof typeof paths;

    return recommendedPath;
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length === diagnosticQuestions.length) {
      setShowResults(true);
    }
  };

  const recommendedPath = showResults ? calculatePath() : null;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-flow text-white">Diagnostic Assessment</Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'Archivo, sans-serif' }}>
            Choose Your Path
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Answer a few questions to discover which offering aligns best with your journey toward conscious communication
          </p>
        </div>

        {!showResults ? (
          <div className="space-y-8 mb-8">
            {diagnosticQuestions.map((q, index) => (
              <Card key={q.id} className="backdrop-blur-sm bg-card/50 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-needs/20 text-needs text-sm font-bold">
                      {index + 1}
                    </span>
                    {q.question}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {q.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(q.id, option.value)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        answers[q.id] === option.value
                          ? 'border-needs bg-needs/10'
                          : 'border-white/10 hover-elevate'
                      }`}
                      data-testid={`option-${option.value}`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option.label}</span>
                        {answers[q.id] === option.value && (
                          <CheckCircle2 className="h-5 w-5 text-needs" />
                        )}
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            ))}

            <div className="text-center pt-8">
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={Object.keys(answers).length !== diagnosticQuestions.length}
                className="bg-needs hover:bg-needs/90 text-white min-w-[200px]"
                data-testid="button-get-recommendation"
              >
                Get Your Recommendation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="backdrop-blur-sm bg-gradient-to-br from-needs/20 to-alignment/20 border border-white/20 rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">
                We Recommend: {recommendedPath && paths[recommendedPath].title}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {recommendedPath && paths[recommendedPath].description}
              </p>
              {recommendedPath && (
                <Link href={paths[recommendedPath].href}>
                  <Button
                    size="lg"
                    className="bg-needs hover:bg-needs/90 text-white"
                    data-testid="button-explore-recommendation"
                  >
                    Explore {paths[recommendedPath].title}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(paths).map(([key, path]) => {
                const Icon = path.icon;
                const isRecommended = recommendedPath === key;
                return (
                  <Card 
                    key={key} 
                    className={`backdrop-blur-sm bg-card/50 ${
                      isRecommended ? 'border-needs border-2' : 'border-white/10'
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-3">
                        <Icon className={`h-8 w-8 text-${path.color}`} />
                        {isRecommended && (
                          <Badge className="bg-needs text-white">Recommended</Badge>
                        )}
                      </div>
                      <CardTitle>{path.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{path.description}</p>
                      <Link href={path.href}>
                        <Button 
                          variant={isRecommended ? "default" : "outline"}
                          className={`w-full ${isRecommended ? 'bg-needs hover:bg-needs/90 text-white' : ''}`}
                          data-testid={`button-view-${key}`}
                        >
                          Learn More
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="text-center pt-8">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowResults(false);
                  setAnswers({});
                }}
                data-testid="button-retake-assessment"
              >
                Retake Assessment
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
