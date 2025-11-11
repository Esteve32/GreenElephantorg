import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { ArrowRight, Heart, Users, Sparkles, CheckCircle2, Loader2, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertRecommendationSubmissionSchema } from "@shared/schema";
import { z } from "zod";

type Stage = "questionnaire" | "calculating" | "results" | "submitted";

const formSchema = insertRecommendationSubmissionSchema
  .omit({ recommendedPath: true, answers: true })
  .extend({
    name: z.string().min(2, "Please enter your full name"),
    email: z.string().email("Please enter a valid email address"),
  });

type FormValues = z.infer<typeof formSchema>;

export default function ChooseYourPathPage() {
  const [stage, setStage] = useState<Stage>("questionnaire");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [recommendedPath, setRecommendedPath] = useState<string | null>(null);
  const { toast } = useToast();
  const shouldReduceMotion = useReducedMotion();

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
      title: "Equinoxe Retreat",
      description: "You're ready for deep transformation in Levi or Aix-en-Provence",
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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      preferredContactTime: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const res = await apiRequest("POST", "/api/recommendations", {
        ...data,
        recommendedPath: recommendedPath!,
        answers: answers,
      });
      
      return await res.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "🙏 We're Honored to Guide Your Journey",
        description: data.message || "You'll hear from us within 24 hours.",
      });
      setStage("submitted");
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Something went wrong",
        description: error.message || "Please try again in a moment.",
        variant: "destructive",
      });
      form.setError("root", {
        type: "server",
        message: error.message || "An unexpected error occurred. Please try again.",
      });
    },
  });

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

    const recommended = Object.entries(pathCounts).reduce((a, b) => 
      a[1] > b[1] ? a : b
    )[0] as string;

    return recommended;
  };

  const handleGetRecommendation = () => {
    if (Object.keys(answers).length === diagnosticQuestions.length) {
      setStage("calculating");
    }
  };

  useEffect(() => {
    if (stage === "calculating") {
      const timer = setTimeout(() => {
        const path = calculatePath();
        setRecommendedPath(path);
        setStage("results");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handleRetake = () => {
    setStage("questionnaire");
    setAnswers({});
    setRecommendedPath(null);
    form.reset();
  };

  const onSubmit = (data: FormValues) => {
    if (!recommendedPath) {
      form.setError("root", {
        type: "validation",
        message: "No recommendation path found. Please retake the assessment.",
      });
      return;
    }
    
    mutation.mutate(data);
  };

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = diagnosticQuestions.length;
  const progressPercentage = (answeredCount / totalQuestions) * 100;

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

        {stage === "questionnaire" && (
          <div className="space-y-8 mb-8">
            <div className="backdrop-blur-sm bg-card/50 border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Your Progress</span>
                <span className="text-sm text-muted-foreground">{answeredCount} of {totalQuestions} completed</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

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
                onClick={handleGetRecommendation}
                disabled={answeredCount !== totalQuestions}
                className="bg-needs hover:bg-needs/90 text-white min-w-[200px]"
                data-testid="button-get-recommendation"
              >
                Get Your Recommendation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {stage === "calculating" && (
          shouldReduceMotion ? (
            <Card className="backdrop-blur-sm bg-gradient-to-br from-needs/20 to-alignment/20 border border-white/20 p-12 text-center">
              <Loader2 className="h-12 w-12 text-needs mx-auto mb-4 animate-spin" />
              <h3 className="text-2xl font-bold mb-2">Analyzing Your Responses</h3>
              <p className="text-muted-foreground">Finding your perfect path...</p>
            </Card>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="backdrop-blur-sm bg-gradient-to-br from-needs/20 to-alignment/20 border border-white/20 p-12 text-center">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  <Sparkles className="h-12 w-12 text-needs mx-auto mb-4" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">Analyzing Your Responses</h3>
                <p className="text-muted-foreground">Finding your perfect path...</p>
              </Card>
            </motion.div>
          )
        )}

        {(stage === "results" || stage === "submitted") && recommendedPath && (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="backdrop-blur-sm bg-gradient-to-br from-needs/20 to-alignment/20 border border-white/20 rounded-2xl p-8 md:p-12 text-center">
                <h2 className="text-3xl font-bold mb-4">
                  We Recommend: {paths[recommendedPath as keyof typeof paths].title}
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  {paths[recommendedPath as keyof typeof paths].description}
                </p>
                <Link href={paths[recommendedPath as keyof typeof paths].href}>
                  <Button
                    size="lg"
                    className="bg-needs hover:bg-needs/90 text-white"
                    data-testid="button-explore-recommendation"
                  >
                    Explore {paths[recommendedPath as keyof typeof paths].title}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            {stage === "results" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="backdrop-blur-sm bg-card/50 border-needs/30">
                  <CardHeader>
                    <CardTitle className="text-2xl text-center">Begin Your Transformation</CardTitle>
                    <p className="text-muted-foreground text-center">
                      Share your details below and we'll reach out within 24 hours
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {form.formState.errors.root && (
                          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-sm text-destructive">
                            {form.formState.errors.root.message}
                          </div>
                        )}
                        
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your name" {...field} data-testid="input-name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="your@email.com" {...field} data-testid="input-email" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="+1 (555) 000-0000" {...field} data-testid="input-phone" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="preferredContactTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preferred Contact Time (Optional)</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-contact-time">
                                    <SelectValue placeholder="Select a time" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="morning">Morning (9am - 12pm)</SelectItem>
                                  <SelectItem value="afternoon">Afternoon (12pm - 5pm)</SelectItem>
                                  <SelectItem value="evening">Evening (5pm - 8pm)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="w-full bg-needs hover:bg-needs/90 text-white"
                          disabled={mutation.isPending}
                          data-testid="button-submit-recommendation"
                        >
                          {mutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              Begin Your Path
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {stage === "submitted" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="backdrop-blur-sm bg-needs/10 border-needs/30">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4 mb-4">
                      <CheckCircle className="h-8 w-8 text-needs flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold">Thank You for Trusting Us</h3>
                        <p className="text-sm text-muted-foreground">
                          We've received your information and will be in touch within 24 hours to discuss your {paths[recommendedPath as keyof typeof paths].title.toLowerCase()} journey.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

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
                onClick={handleRetake}
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
