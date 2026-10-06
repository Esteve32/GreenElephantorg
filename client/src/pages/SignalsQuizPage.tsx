import './homepage.css';
import './signals-check.css';
import { PAGE_METADATA } from "@shared/page-metadata";
import { useState } from "react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertTriangle, ArrowRight, CheckCircle2, Copy, RefreshCw, Linkedin, Share2 } from "lucide-react";
import { SiX } from "react-icons/si";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import {
  QUIZ_QUESTIONS,
  calculateScore,
  getScoreTier,
  getTopRiskLenses,
  type QuizQuestion,
} from "@/data/signalsQuiz";

type QuizStage = "questionnaire" | "processing" | "results";

export default function SignalsQuizPage() {
  const { toast } = useToast();
  const prefersReducedMotion = useReducedMotion();
  const [stage, setStage] = useState<QuizStage>("questionnaire");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [score, setScore] = useState(0);
  const [averageScore, setAverageScore] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);

  // Fetch average score
  const { data: averageData } = useQuery<{ averageScore: number }>({
    queryKey: ["/api/signals-quiz/average"],
    enabled: stage === "results",
  });

  // Submit quiz mutation
  const submitMutation = useMutation({
    mutationFn: async (data: { score: number; answers: Record<string, number>; email?: string; name?: string; consentText?: string }) => {
      const res = await apiRequest("POST", "/api/signals-quiz", data);
      return await res.json();
    },
    onSuccess: (data) => {
      setAverageScore(data.result.averageScore);
    },
  });

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate score and submit
      const calculatedScore = calculateScore(answers);
      setScore(calculatedScore);
      
      // Move to processing stage
      setStage("processing");
      
      // Submit to backend (without email initially)
      submitMutation.mutate({
        score: calculatedScore,
        answers: answers,
      });

      // After animation, show results
      setTimeout(() => {
        setStage("results");
      }, prefersReducedMotion ? 500 : 2500);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!consent) {
      toast({
        title: "Consent required",
        description: "Please agree to receive follow-up guidance",
        variant: "destructive",
      });
      return;
    }

    // Submit with email
    submitMutation.mutate({
      score,
      answers: answers,
      email,
      name,
      consentText: "I consent to receive personalized guidance based on my quiz results",
    });

    toast({
      title: "Thank you!",
      description: "We'll send personalized guidance to your inbox",
    });

    setShowEmailForm(false);
  };

  const handleShare = (platform: "linkedin" | "twitter" | "copy") => {
    const shareText = `I tried GreenElephant’s six-question communication drift check. It helps you reflect on everyday conversations and choose one clearer response. Try it: ${window.location.origin}/signals`;

    if (platform === "linkedin") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin + "/signals")}`, "_blank");
    } else if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank");
    } else if (platform === "copy") {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied to clipboard!",
        description: "Share your results with others",
      });
    }
  };

  const handleRetake = () => {
    setStage("questionnaire");
    setCurrentQuestion(0);
    setAnswers({});
    setScore(0);
    setEmail("");
    setName("");
    setConsent(false);
    setShowEmailForm(false);
  };

  // Questionnaire Stage
  if (stage === "questionnaire") {
    const question = QUIZ_QUESTIONS[currentQuestion];
    const Icon = question.icon;
    const progress = ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100;
    const isAnswered = answers[question.id] !== undefined;

    return (
      <div className="ge-site signals-check min-h-screen pt-24 pb-16">
        <SEO
        {...PAGE_METADATA["/signals"]}
        />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-needs/10 text-needs border-needs/30">Everyday communication · Free reflection</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Communication drift check.
            </h1>
            {currentQuestion === 0 && <p className="signals-intro">Drift is the gap between what you mean and how you communicate. Notice one habit, then choose a clearer response.</p>}
            {currentQuestion === 0 && <div className="signals-context-grid" aria-label="Where this can help">
              <div><h2>With yourself</h2><p>What do I need? What am I assuming?</p></div>
              <div><h2>With people</h2><p>Did I say it clearly? Did we understand each other?</p></div>
              <div><h2>With AI</h2><p>Did I explain my goal and tone? Does the answer fit?</p></div>
            </div>}
            {currentQuestion === 0 && <p className="signals-reading-note">Six questions about everyday conversations. Use one insight with people, yourself or AI. A reflection aid, not a diagnosis or prompting test.</p>}
            <p className="text-lg text-muted-foreground" aria-live="polite">Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}</p>
          </div>

          <div className="mb-8">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-needs transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Icon className={`h-8 w-8 text-${question.lensColor}`} />
                <Badge variant="outline">{question.lens} Lens</Badge>
              </div>
              <CardTitle className="text-2xl">{question.question}</CardTitle>
              <p className="text-sm text-muted-foreground pt-2">{question.context}</p>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={answers[question.id]?.toString() || ""}
                onValueChange={(value) => handleAnswer(question.id, parseInt(value))}
              >
                <div className="space-y-3">
                  {question.options.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-3 rounded-lg border border-white/10 p-4 hover-elevate cursor-pointer"
                      onClick={() => handleAnswer(question.id, option.value)}
                    >
                      <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                      <Label
                        htmlFor={`option-${option.value}`}
                        className="flex-1 cursor-pointer text-sm"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>

              {currentQuestion === QUIZ_QUESTIONS.length - 1 && <p className="signals-reading-note">“See Results” sends your answers to GreenElephant, where they are stored and used for a comparison average. Email is optional.</p>}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestion === 0}
                  data-testid="button-quiz-previous"
                >
                  Previous
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!isAnswered}
                  className="bg-needs hover:bg-needs/90"
                  data-testid="button-quiz-next"
                >
                  {currentQuestion === QUIZ_QUESTIONS.length - 1 ? "See Results" : "Next"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Processing Stage
  if (stage === "processing") {
    return (
      <div className="ge-site signals-check min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={prefersReducedMotion ? {} : {
              scale: [1, 1.1, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2.5,
              repeat: 0,
              ease: "easeInOut",
            }}
          >
            <AlertTriangle className="h-24 w-24 text-needs mx-auto mb-6" />
          </motion.div>
          <h2 className="text-3xl font-bold mb-4">Preparing your reflection…</h2>
          <p className="text-muted-foreground">
            Summarising the answers you chose
          </p>
        </div>
      </div>
    );
  }

  // Results Stage
  if (stage === "results") {
    const tier = getScoreTier(score);
    const TierIcon = tier.icon;
    const topRisks = getTopRiskLenses(answers);
    const avgScore = averageData?.averageScore ?? averageScore;
    const reflection = score <= 35 ? {title: 'Keep a useful habit.', text: 'Your responses point to fewer of these drift patterns today. Pick one habit to keep practising.'} : score <= 70 ? {title: 'Choose one small adjustment.', text: 'Your responses describe a mix of patterns. Start with one conversation where a clearer request could help.'} : {title: 'Pause and explore one pattern.', text: 'You selected more of these drift patterns. Choose one situation to reflect on, with support if useful.'};

    return (
      <div className="ge-site signals-check min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className={`mb-4 bg-${tier.color} text-white`}>Your answers today</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your reflection score: {score}/100
            </h1>
            <p className="text-lg text-muted-foreground">
              {avgScore === null ? "Comparison average unavailable" : `Comparison average: ${Math.round(avgScore)}/100`}
            </p>
          </div>

          <Card className={`backdrop-blur-sm bg-${tier.color}/10 border border-${tier.color}/20 mb-8`}>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <TierIcon className={`h-12 w-12 text-${tier.color}`} />
                <div>
                  <CardTitle className="text-2xl">{reflection.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg">{reflection.text}</p>
              <p className="signals-reading-note">This score summarises your responses. It does not objectively measure your communication, predict performance or assess your AI skills.</p>
              <div>
                <p className="font-semibold mb-3">Next Steps:</p>
                <ul className="space-y-2">
                  {['Name what you wanted to communicate.', 'Check one assumption with the other person.', 'For an AI draft, state your goal and tone, then check the answer.'].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className={`h-5 w-5 text-${tier.color} flex-shrink-0 mt-0.5`} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {topRisks.length > 0 && (
            <Card className="backdrop-blur-sm bg-card/50 border-white/10 mb-8">
              <CardHeader>
                <CardTitle>Two perspectives to explore</CardTitle>
                <p className="text-sm text-muted-foreground">
                  These reflect the answers you selected. They are starting points for reflection.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topRisks.map((risk, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="font-medium">{risk.lens}</span>
                      <Badge className={`bg-${risk.color}/20 text-${risk.color} border border-${risk.color}/30`}>
                        {risk.score}/100
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {!showEmailForm ? (
            <div className="space-y-4">
              <Card className="backdrop-blur-sm bg-needs/10 border border-needs/20">
                <CardContent className="pt-6">
                  <p className="text-center mb-4">
                    Want personalized guidance based on your results?
                  </p>
                  <Button
                    onClick={() => setShowEmailForm(true)}
                    className="w-full bg-needs hover:bg-needs/90"
                    data-testid="button-get-guidance"
                  >
                    Get Personalized Follow-Up
                  </Button>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => handleShare("linkedin")}
                  variant="outline"
                  className="flex-1"
                  data-testid="button-share-linkedin"
                >
                  <Linkedin className="mr-2 h-5 w-5" />
                  Share on LinkedIn
                </Button>
                <Button
                  onClick={() => handleShare("twitter")}
                  variant="outline"
                  className="flex-1"
                  data-testid="button-share-twitter"
                >
                  <SiX className="mr-2 h-5 w-5" />
                  Share on X
                </Button>
                <Button
                  onClick={() => handleShare("copy")}
                  variant="outline"
                  className="flex-1"
                  data-testid="button-share-copy"
                >
                  <Copy className="mr-2 h-5 w-5" />
                  Copy Link
                </Button>
              </div>

              <div className="text-center">
                <Button
                  onClick={handleRetake}
                  variant="ghost"
                  data-testid="button-retake-quiz"
                >
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Reflect again
                </Button>
              </div>
            </div>
          ) : (
            <Card className="backdrop-blur-sm bg-card/50 border-white/10">
              <CardHeader>
                <CardTitle>Get Your Personalized Action Plan</CardTitle>
                <p className="text-sm text-muted-foreground">
                  We'll send targeted micro-habits based on your top risk lenses
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      required
                      data-testid="input-quiz-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      data-testid="input-quiz-email"
                    />
                  </div>
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="consent"
                      checked={consent}
                      onCheckedChange={(checked) => setConsent(checked === true)}
                      data-testid="checkbox-quiz-consent"
                    />
                    <Label htmlFor="consent" className="text-sm cursor-pointer">
                      I consent to receive personalized guidance based on my quiz results
                    </Label>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowEmailForm(false)}
                      className="flex-1"
                    >
                      Skip
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-needs hover:bg-needs/90"
                      disabled={submitMutation.isPending}
                      data-testid="button-submit-email"
                    >
                      {submitMutation.isPending ? "Submitting..." : "Send Me Guidance"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="mt-8 text-center">
            <Link href="/scan">
              <Button variant="outline" size="lg" data-testid="button-choose-path">
                Explore the Satellite Scan — €99.95
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
