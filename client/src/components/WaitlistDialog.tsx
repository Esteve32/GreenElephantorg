import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface WaitlistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  retreatTitle: string;
  retreatType: "provence" | "lapland";
}

export default function WaitlistDialog({ open, onOpenChange, retreatTitle, retreatType }: WaitlistDialogProps) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [motivation, setMotivation] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data: { email: string; name: string; motivation: string; retreatType: string; consentText: string }) => {
      const result = await apiRequest("POST", "/api/waitlist", data);
      return await result.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "You're on the list!",
        description: "We'll reach out when spots open up.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Something went wrong",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!consent) {
      toast({
        title: "Consent required",
        description: "Please agree to be contacted about the retreat",
        variant: "destructive",
      });
      return;
    }

    mutation.mutate({
      email,
      name,
      motivation,
      retreatType,
      consentText: "I consent to be contacted about Equinoxe Retreat availability and updates",
    });
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form after a delay
    setTimeout(() => {
      setName("");
      setEmail("");
      setMotivation("");
      setConsent(false);
      setSubmitted(false);
    }, 300);
  };

  if (submitted) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-needs/20">
              <CheckCircle2 className="h-6 w-6 text-needs" />
            </div>
            <DialogTitle className="text-2xl">You're on the Waitlist!</DialogTitle>
            <DialogDescription className="text-base pt-2">
              We'll email you at <span className="font-medium text-foreground">{email}</span> as soon as spots become available for {retreatTitle}.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={handleClose} className="w-full" data-testid="button-close-waitlist">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Join the Waitlist</DialogTitle>
          <DialogDescription className="text-base pt-2">
            {retreatTitle}
          </DialogDescription>
        </DialogHeader>

        {/* Scarcity Messaging */}
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 space-y-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm text-destructive">Limited Spots Available</p>
              <p className="text-sm text-muted-foreground">
                We limit each retreat to 12-14 participants to ensure deep, personalized transformation. Spots fill quickly.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 ml-7">
            <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Previous retreats filled within 3 weeks of announcement
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
              data-testid="input-waitlist-name"
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
              data-testid="input-waitlist-email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="motivation">What draws you to this retreat? *</Label>
            <Textarea
              id="motivation"
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              placeholder="Share what you hope to transform or discover..."
              className="min-h-[100px] resize-none"
              required
              data-testid="textarea-waitlist-motivation"
            />
            <p className="text-xs text-muted-foreground">
              Minimum 10 characters - help us understand your intention
            </p>
          </div>

          <div className="flex items-start gap-2">
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={(checked) => setConsent(checked as boolean)}
              data-testid="checkbox-waitlist-consent"
            />
            <Label
              htmlFor="consent"
              className="text-sm font-normal leading-relaxed cursor-pointer"
            >
              I consent to be contacted about Equinoxe Retreat availability and updates. You can unsubscribe anytime.
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full bg-needs hover:bg-needs/90"
            disabled={mutation.isPending}
            data-testid="button-submit-waitlist"
          >
            {mutation.isPending ? "Joining..." : "Join Waitlist"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
