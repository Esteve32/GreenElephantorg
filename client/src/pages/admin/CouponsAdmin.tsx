import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { AdminTooltip } from "@/components/AdminTooltip";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {
  ArrowLeft,
  Loader2,
  Ticket,
  Plus,
  Trash2,
  ToggleLeft,
  Download,
  ShoppingCart,
  DollarSign,
} from "lucide-react";

interface Coupon {
  id: number;
  code: string;
  discountAmount: string;
  category: string;
  isActive: string;
  maxUses: number | null;
  usedCount: number;
  createdAt: string;
}

export default function CouponsAdmin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: couponsData, isLoading: couponsLoading, refetch: refetchCoupons } = useQuery<Coupon[]>({
    queryKey: ['/api/admin/coupons'],
  });

  const { data: pricingMode, refetch: refetchPricingMode } = useQuery<{ mode: string }>({
    queryKey: ['/api/admin/pricing-mode'],
  });

  const [pricingToggling, setPricingToggling] = useState(false);

  const handleTogglePricingMode = async () => {
    const newMode = pricingMode?.mode === "subscription" ? "single" : "subscription";
    setPricingToggling(true);
    try {
      await apiRequest("PUT", "/api/admin/pricing-mode", { mode: newMode });
      await refetchPricingMode();
      toast({
        title: newMode === "subscription" ? "Subscription mode enabled" : "Single-buy mode enabled",
        description: newMode === "subscription"
          ? "Shop page now shows subscription plans with single-buy options."
          : "Shop page now shows one-time purchase only.",
      });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Could not update pricing mode", variant: "destructive" });
    } finally {
      setPricingToggling(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
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

  const handleSeedTestCoupons = async () => {
    if (!confirm("This will create 5 test coupons for each product (100% off). Continue?")) return;
    try {
      const response = await apiRequest("POST", "/api/admin/coupons/seed-test", {});
      const data = await response.json();
      toast({ title: "Test coupons seeded!", description: data.message });
      refetchCoupons();
    } catch (error: any) {
      toast({ title: "Error", description: "Could not seed test coupons", variant: "destructive" });
    }
  };

  const handleToggleCouponActive = async (coupon: Coupon) => {
    try {
      await apiRequest("PUT", `/api/admin/coupons/${coupon.code}`, {
        isActive: coupon.isActive === "true" ? "false" : "true"
      });
      toast({ title: coupon.isActive === "true" ? "Coupon deactivated" : "Coupon activated" });
      refetchCoupons();
    } catch (error) {
      toast({ title: "Error", description: "Could not update coupon", variant: "destructive" });
    }
  };

  const handleDeleteCoupon = async (code: string) => {
    if (!confirm(`Are you sure you want to delete coupon ${code}?`)) return;
    try {
      await apiRequest("DELETE", `/api/admin/coupons/${code}`, {});
      toast({ title: "Coupon deleted" });
      refetchCoupons();
    } catch (error) {
      toast({ title: "Error", description: "Could not delete coupon", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0C14] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => setLocation("/admin/submissions")} data-testid="button-back">
            <ArrowLeft className="h-5 w-5" />
          </Button></TooltipTrigger><TooltipContent>Back to Admin Hub</TooltipContent></Tooltip>
          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Ticket className="h-6 w-6 text-flow" />
              Coupons & Pricing
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Manage discount codes and choose your pricing model.</p>
          </div>
          <AdminTooltip
            what="Create discount coupons for special audiences and toggle between single-buy vs subscription pricing."
            how="Create coupons below. Use the pricing toggle to switch between one-time purchase and subscription model across the shop."
            debug={[
              { label: "GET /api/admin/coupons", href: "/api/admin/coupons" },
              { label: "GET /api/admin/pricing-mode", href: "/api/admin/pricing-mode" },
            ]}
          />
        </div>

        <div className="space-y-6">
          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-flow" />
                Pricing Model
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Choose how the Satellite Scan is sold on the public site.
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-4 p-4 rounded-md border border-white/10 bg-white/[0.03]">
                <div className="space-y-1">
                  <p className="font-medium">
                    {pricingMode?.mode === "subscription" ? "Subscription + Single-Buy" : "Single-Buy Only"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {pricingMode?.mode === "subscription"
                      ? "Shop shows monthly/annual subscription plans alongside one-time purchase options."
                      : "Shop shows one-time purchase at fixed price (no recurring billing)."}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-muted-foreground">Single</span>
                  <Switch
                    checked={pricingMode?.mode === "subscription"}
                    onCheckedChange={handleTogglePricingMode}
                    disabled={pricingToggling}
                    data-testid="switch-pricing-mode"
                  />
                  <span className="text-xs text-muted-foreground">Sub</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-flow/10 border-flow/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-flow">
                <Download className="h-5 w-5" />
                Quick Start: Seed Test Coupons
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Create 100% off coupons for testing each product payment flow.
              </p>
            </CardHeader>
            <CardContent>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleSeedTestCoupons} className="bg-flow text-white" data-testid="button-seed-test-coupons">
                    <Plus className="h-4 w-4 mr-2" />
                    Seed 5 Test Coupons
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Create 100%-off test coupons for scan, session, journey, subscription, and coaching products</TooltipContent>
              </Tooltip>
            </CardContent>
          </Card>

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
                  <label className="text-sm font-medium mb-1 block">Discount Amount</label>
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
                <Button type="submit" className="w-full bg-flow text-white" data-testid="button-create-coupon">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Coupon
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                All Coupons
                {couponsData && couponsData.length > 0 && (
                  <Badge variant="secondary" className="ml-2">{couponsData.length}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {couponsLoading && <p className="text-muted-foreground">Loading...</p>}
              {!couponsLoading && (!couponsData || couponsData.length === 0) && (
                <p className="text-muted-foreground">No coupons yet. Create one or seed test coupons to get started!</p>
              )}
              {!couponsLoading && couponsData && couponsData.length > 0 && (
                <div className="space-y-3">
                  {couponsData.map((coupon) => (
                    <div key={coupon.id} className="p-4 rounded-lg bg-background/50 border border-white/10 flex items-start justify-between gap-4 flex-wrap">
                      <div className="space-y-1 flex-1 min-w-0">
                        <p className="font-semibold text-lg">{coupon.code}</p>
                        <div className="flex gap-4 text-sm text-muted-foreground flex-wrap">
                          <span>{coupon.discountAmount} discount</span>
                          <span className="capitalize">{coupon.category}</span>
                          <span>{coupon.usedCount} of {coupon.maxUses || '\u221e'} uses</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{formatDate(coupon.createdAt)}</p>
                      </div>
                      <div className="flex gap-2 items-center flex-shrink-0">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant={coupon.isActive === 'true' ? 'default' : 'secondary'}
                              onClick={() => handleToggleCouponActive(coupon)}
                              data-testid={`button-toggle-coupon-${coupon.code}`}
                            >
                              <ToggleLeft className="h-4 w-4 mr-1" />
                              {coupon.isActive === 'true' ? 'Active' : 'Inactive'}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{coupon.isActive === 'true' ? 'Deactivate this coupon' : 'Reactivate this coupon'}</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteCoupon(coupon.code)}
                              data-testid={`button-delete-coupon-${coupon.code}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Permanently delete this coupon</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
