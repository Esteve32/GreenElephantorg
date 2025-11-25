import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Mail, MessageSquare, Sparkles, Users, FileText, LogOut, Ticket, Plus, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Contact {
  id: string;
  email: string;
  name: string | null;
  consentGiven: string;
  consentText: string;
  consentedAt: string;
  source: string;
  createdAt: string;
}

interface WaitlistEntry {
  id: string;
  contactId: string;
  motivation: string;
  retreatType: string | null;
  createdAt: string;
}

interface NewsletterSubscription {
  id: string;
  contactId: string;
  createdAt: string;
}

interface SignalsQuizResult {
  id: string;
  contactId: string | null;
  score: string;
  answers: Record<string, any>;
  createdAt: string;
}

interface RecommendationSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  preferredContactTime: string | null;
  recommendedPath: string;
  answers: Record<string, any>;
  createdAt: string;
}

interface SatellitescanPurchase {
  id: string;
  customerEmail: string;
  customerName: string | null;
  amount: string;
  stripePaymentIntentId: string;
  status: string;
  typeformCompleted: string;
  dashboardSent: string;
  remindersCount: string;
  createdAt: string;
}

interface Coupon {
  id: string;
  code: string;
  discountAmount: string;
  category: string;
  isActive: string;
  maxUses: string | null;
  usedCount: string;
  createdAt: string;
}

export default function AdminSubmissionsPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Check authentication status on mount
  const { data: authStatus, isLoading: authLoading } = useQuery<{ isAuthenticated: boolean }>({
    queryKey: ['/api/admin/check'],
  });

  useEffect(() => {
    // Only redirect if auth check is complete and user is not authenticated
    if (!authLoading && authStatus && !authStatus.isAuthenticated) {
      setLocation("/admin/login");
    }
  }, [authLoading, authStatus, setLocation]);

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin">
            <Sparkles className="h-8 w-8 mx-auto" />
          </div>
          <p className="text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated
  if (!authStatus?.isAuthenticated) {
    return null;
  }

  const { data: waitlistData, isLoading: waitlistLoading } = useQuery<WaitlistEntry[]>({
    queryKey: ['/api/admin/waitlist'],
    enabled: authStatus?.isAuthenticated === true,
  });

  const { data: newsletterData, isLoading: newsletterLoading } = useQuery<NewsletterSubscription[]>({
    queryKey: ['/api/admin/newsletter'],
    enabled: authStatus?.isAuthenticated === true,
  });

  const { data: quizData, isLoading: quizLoading } = useQuery<SignalsQuizResult[]>({
    queryKey: ['/api/admin/quiz'],
    enabled: authStatus?.isAuthenticated === true,
  });

  const { data: recommendationData, isLoading: recommendationLoading } = useQuery<RecommendationSubmission[]>({
    queryKey: ['/api/admin/recommendations'],
    enabled: authStatus?.isAuthenticated === true,
  });

  const { data: contactsData, isLoading: contactsLoading } = useQuery<Contact[]>({
    queryKey: ['/api/admin/contacts'],
    enabled: authStatus?.isAuthenticated === true,
  });

  const { data: satellitescanData, isLoading: satellitescanLoading } = useQuery<SatellitescanPurchase[]>({
    queryKey: ['/api/admin/satellitescan'],
    enabled: authStatus?.isAuthenticated === true,
  });

  const { data: couponsData, isLoading: couponsLoading, refetch: refetchCoupons } = useQuery<Coupon[]>({
    queryKey: ['/api/admin/coupons'],
    enabled: authStatus?.isAuthenticated === true,
  });

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/admin/logout", {});
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      setLocation("/admin/login");
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not log out",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy 'at' HH:mm");
    } catch {
      return dateString;
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const code = (form.elements.namedItem('code') as HTMLInputElement)?.value;
    const discountAmount = (form.elements.namedItem('discountAmount') as HTMLInputElement)?.value;
    const category = (form.elements.namedItem('category') as HTMLSelectElement)?.value;
    const maxUses = (form.elements.namedItem('maxUses') as HTMLInputElement)?.value;

    try {
      await apiRequest("POST", "/api/admin/coupons", {
        code: code.toUpperCase(),
        discountAmount: parseFloat(discountAmount),
        category,
        maxUses: maxUses ? parseInt(maxUses) : null
      });
      toast({ title: "Coupon created!", description: `${code.toUpperCase()} saved` });
      form.reset();
      refetchCoupons();
    } catch (error) {
      toast({ title: "Error", description: "Could not create coupon", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-between max-w-3xl mx-auto mb-6">
            <div className="flex-1" />
            <Badge className="bg-needs text-white">Admin Dashboard</Badge>
            <div className="flex-1 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                data-testid="button-admin-logout"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-archivo">
            Form Submissions
          </h1>
          <p className="text-muted-foreground">
            All form submissions are stored in your PostgreSQL database
          </p>
        </div>

        <Tabs defaultValue="coupons" className="space-y-8">
          <TabsList className="grid w-full grid-cols-7 mb-8">
            <TabsTrigger value="coupons" data-testid="tab-coupons">
              <Ticket className="h-4 w-4 mr-2" />
              Coupons ({couponsData?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="satellitescan" data-testid="tab-satellitescan">
              <Sparkles className="h-4 w-4 mr-2" />
              Satellitescan ({satellitescanData?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="waitlist" data-testid="tab-waitlist">
              <Users className="h-4 w-4 mr-2" />
              Waitlist ({waitlistData?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="newsletter" data-testid="tab-newsletter">
              <Mail className="h-4 w-4 mr-2" />
              Newsletter ({newsletterData?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="quiz" data-testid="tab-quiz">
              <Sparkles className="h-4 w-4 mr-2" />
              Quiz ({quizData?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="recommendations" data-testid="tab-recommendations">
              <FileText className="h-4 w-4 mr-2" />
              Recommendations ({recommendationData?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="contacts" data-testid="tab-contacts">
              <MessageSquare className="h-4 w-4 mr-2" />
              All Contacts ({contactsData?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="coupons" className="space-y-6">
            <Card className="backdrop-blur-sm bg-card/50 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="h-5 w-5" />
                  Create New Coupon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateCoupon} className="space-y-4 max-w-md">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Coupon Code</label>
                    <Input name="code" placeholder="e.g., STUDENT50" required data-testid="input-coupon-code" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Discount Amount (€)</label>
                    <Input name="discountAmount" type="number" placeholder="29.99" step="0.01" required data-testid="input-discount-amount" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Category</label>
                    <select name="category" className="w-full px-3 py-2 rounded-md bg-background/50 border border-white/10" required data-testid="select-category">
                      <option value="student">Student</option>
                      <option value="startup">Startup</option>
                      <option value="social_enterprise">Social Enterprise</option>
                      <option value="unemployed">Unemployed</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Max Uses (Leave blank for unlimited)</label>
                    <Input name="maxUses" type="number" placeholder="100" data-testid="input-max-uses" />
                  </div>
                  <Button type="submit" className="w-full bg-alignment text-white" data-testid="button-create-coupon">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Coupon
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-card/50 border-white/10">
              <CardHeader>
                <CardTitle>All Coupons</CardTitle>
              </CardHeader>
              <CardContent>
                {couponsLoading && <p className="text-muted-foreground">Loading...</p>}
                {!couponsLoading && (!couponsData || couponsData.length === 0) && (
                  <p className="text-muted-foreground">No coupons yet. Create one to get started!</p>
                )}
                {!couponsLoading && couponsData && couponsData.length > 0 && (
                  <div className="space-y-3">
                    {couponsData.map((coupon) => (
                      <div key={coupon.id} className="p-4 rounded-lg bg-background/50 border border-white/10 flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="font-semibold text-lg">{coupon.code}</p>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>€{coupon.discountAmount} discount</span>
                            <span className="capitalize">{coupon.category}</span>
                            <span>{coupon.usedCount} of {coupon.maxUses || '∞'} uses</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{formatDate(coupon.createdAt)}</p>
                        </div>
                        <Badge className={coupon.isActive === 'true' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}>
                          {coupon.isActive === 'true' ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="satellitescan" className="space-y-6">
            <Card className="backdrop-blur-sm bg-card/50 border-white/10">
              <CardHeader>
                <CardTitle>Satellitescan Purchases</CardTitle>
              </CardHeader>
              <CardContent>
                {satellitescanLoading && <p className="text-muted-foreground">Loading...</p>}
                {!satellitescanLoading && (!satellitescanData || satellitescanData.length === 0) && (
                  <p className="text-muted-foreground">No satellitescan purchases yet.</p>
                )}
                {!satellitescanLoading && satellitescanData && satellitescanData.length > 0 && (
                  <div className="space-y-4">
                    {satellitescanData.map((purchase) => (
                      <div key={purchase.id} className="p-6 rounded-lg bg-background/50 border border-white/10 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <p className="font-semibold text-lg">{purchase.customerName || "No name provided"}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <Mail className="h-3 w-3" />
                              <a href={`mailto:${purchase.customerEmail}`} className="hover:underline">
                                {purchase.customerEmail}
                              </a>
                            </p>
                          </div>
                          <Badge className="bg-alignment text-white">
                            €{purchase.amount}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className={`h-4 w-4 ${purchase.typeformCompleted === 'true' ? 'text-green-500' : 'text-muted-foreground'}`} />
                            <span className="text-sm">
                              Typeform: {purchase.typeformCompleted === 'true' ? 'Done' : 'Pending'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className={`h-4 w-4 ${purchase.dashboardSent === 'true' ? 'text-green-500' : 'text-muted-foreground'}`} />
                            <span className="text-sm">
                              Dashboard: {purchase.dashboardSent === 'true' ? 'Sent' : 'Pending'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              Reminders: {purchase.remindersCount}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {purchase.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/10">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(purchase.createdAt)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Payment ID: {purchase.stripePaymentIntentId.substring(0, 20)}...
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="waitlist" className="space-y-6">
            <Card className="backdrop-blur-sm bg-card/50 border-white/10">
              <CardHeader>
                <CardTitle>Retreat Waitlist Entries</CardTitle>
              </CardHeader>
              <CardContent>
                {waitlistLoading && <p className="text-muted-foreground">Loading...</p>}
                {!waitlistLoading && (!waitlistData || waitlistData.length === 0) && (
                  <p className="text-muted-foreground">No waitlist entries yet.</p>
                )}
                {!waitlistLoading && waitlistData && waitlistData.length > 0 && (
                  <div className="space-y-4">
                    {waitlistData.map((entry) => {
                      const contact = contactsData?.find(c => c.id === entry.contactId);
                      return (
                        <div key={entry.id} className="p-4 rounded-lg bg-background/50 border border-white/10">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-semibold">{contact?.name || "No name"}</p>
                              <p className="text-sm text-muted-foreground">{contact?.email || "No email"}</p>
                            </div>
                            <Badge variant="outline" className="ml-2">
                              {entry.retreatType || "Any retreat"}
                            </Badge>
                          </div>
                          <p className="text-sm mb-2">{entry.motivation}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(entry.createdAt)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="newsletter" className="space-y-6">
            <Card className="backdrop-blur-sm bg-card/50 border-white/10">
              <CardHeader>
                <CardTitle>Newsletter Subscriptions</CardTitle>
              </CardHeader>
              <CardContent>
                {newsletterLoading && <p className="text-muted-foreground">Loading...</p>}
                {!newsletterLoading && (!newsletterData || newsletterData.length === 0) && (
                  <p className="text-muted-foreground">No newsletter subscribers yet.</p>
                )}
                {!newsletterLoading && newsletterData && newsletterData.length > 0 && (
                  <div className="space-y-4">
                    {newsletterData.map((subscription) => {
                      const contact = contactsData?.find(c => c.id === subscription.contactId);
                      return (
                        <div key={subscription.id} className="p-4 rounded-lg bg-background/50 border border-white/10">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold">{contact?.name || "No name"}</p>
                              <p className="text-sm text-muted-foreground">{contact?.email || "No email"}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                            <Calendar className="h-3 w-3" />
                            {formatDate(subscription.createdAt)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quiz" className="space-y-6">
            <Card className="backdrop-blur-sm bg-card/50 border-white/10">
              <CardHeader>
                <CardTitle>Signals Quiz Results</CardTitle>
              </CardHeader>
              <CardContent>
                {quizLoading && <p className="text-muted-foreground">Loading...</p>}
                {!quizLoading && (!quizData || quizData.length === 0) && (
                  <p className="text-muted-foreground">No quiz results yet.</p>
                )}
                {!quizLoading && quizData && quizData.length > 0 && (
                  <div className="space-y-4">
                    {quizData.map((result) => {
                      const contact = result.contactId ? contactsData?.find(c => c.id === result.contactId) : null;
                      return (
                        <div key={result.id} className="p-4 rounded-lg bg-background/50 border border-white/10">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-semibold">{contact?.name || "Anonymous"}</p>
                              {contact && <p className="text-sm text-muted-foreground">{contact.email}</p>}
                            </div>
                            <Badge className="ml-2 bg-needs text-white">
                              Score: {result.score}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(result.createdAt)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <Card className="backdrop-blur-sm bg-card/50 border-white/10">
              <CardHeader>
                <CardTitle>Path Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                {recommendationLoading && <p className="text-muted-foreground">Loading...</p>}
                {!recommendationLoading && (!recommendationData || recommendationData.length === 0) && (
                  <p className="text-muted-foreground">No recommendations yet.</p>
                )}
                {!recommendationLoading && recommendationData && recommendationData.length > 0 && (
                  <div className="space-y-4">
                    {recommendationData.map((rec) => (
                      <div key={rec.id} className="p-4 rounded-lg bg-background/50 border border-white/10">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold">{rec.name}</p>
                            <p className="text-sm text-muted-foreground">{rec.email}</p>
                            {rec.phone && <p className="text-sm text-muted-foreground">{rec.phone}</p>}
                          </div>
                          <Badge variant="outline" className="ml-2">
                            {rec.recommendedPath}
                          </Badge>
                        </div>
                        {rec.preferredContactTime && (
                          <p className="text-sm mb-2">Preferred time: {rec.preferredContactTime}</p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(rec.createdAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            <Card className="backdrop-blur-sm bg-card/50 border-white/10">
              <CardHeader>
                <CardTitle>All Contacts (GDPR-Compliant)</CardTitle>
              </CardHeader>
              <CardContent>
                {contactsLoading && <p className="text-muted-foreground">Loading...</p>}
                {!contactsLoading && (!contactsData || contactsData.length === 0) && (
                  <p className="text-muted-foreground">No contacts yet.</p>
                )}
                {!contactsLoading && contactsData && contactsData.length > 0 && (
                  <div className="space-y-4">
                    {contactsData.map((contact) => (
                      <div key={contact.id} className="p-4 rounded-lg bg-background/50 border border-white/10">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold">{contact.name || "No name"}</p>
                            <p className="text-sm text-muted-foreground">{contact.email}</p>
                          </div>
                          <Badge variant="outline" className="ml-2">
                            {contact.source}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Consent: {contact.consentText}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(contact.createdAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
