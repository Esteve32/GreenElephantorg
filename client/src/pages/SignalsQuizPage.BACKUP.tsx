import { useState } from "react";
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
    const tier = getScoreTier(score);
    const shareText = `I just assessed my communication patterns using GreenElephant's Early Warning System. My drift score: ${score}/100 (${tier.label}). Ready to transform your conflicts into trust? Take the assessment: ${window.location.origin}/signals`;

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
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-destructive text-white">Early Warning System</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Archivo, sans-serif' }}>
              Communication Drift Assessment
            </h1>
            <p className="text-lg text-muted-foreground">
              {currentQuestion + 1} of {QUIZ_QUESTIONS.length} completed
            </p>
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
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
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
          <h2 className="text-3xl font-bold mb-4">Analyzing Your Patterns...</h2>
          <p className="text-muted-foreground">
            Calculating your communication drift score
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
    const avgScore = averageData?.averageScore ?? averageScore ?? 50;

    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className={`mb-4 bg-${tier.color} text-white`}>{tier.label}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Archivo, sans-serif' }}>
              Your Drift Score: {score}/100
            </h1>
            <p className="text-lg text-muted-foreground">
              Community Average: {Math.round(avgScore)}/100
            </p>
          </div>

          <Card className={`backdrop-blur-sm bg-${tier.color}/10 border border-${tier.color}/20 mb-8`}>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <TierIcon className={`h-12 w-12 text-${tier.color}`} />
                <div>
                  <CardTitle className="text-2xl">{tier.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg">{tier.description}</p>
              <div>
                <p className="font-semibold mb-3">Next Steps:</p>
                <ul className="space-y-2">
                  {tier.guidance.map((item, idx) => (
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
                <CardTitle>Your Top Risk Lenses</CardTitle>
                <p className="text-sm text-muted-foreground">
                  These areas show the highest drift signals
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
                  Retake Assessment
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
            <Link href="/choose-your-path">
              <Button variant="outline" size="lg" data-testid="button-choose-path">
                Explore Coaching & Retreats
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
