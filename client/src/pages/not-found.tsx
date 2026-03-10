import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <>
      <SEO
        title="Page Not Found | GreenElephant"
        description="This page does not exist. Return to GreenElephant to explore conscious communication tools, coaching, and assessments."
        noIndex={true}
      />
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a]">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2 items-center">
              <AlertCircle className="h-8 w-8 text-red-500 shrink-0" />
              <h1 className="text-2xl font-bold">404 — Page Not Found</h1>
            </div>
            <p className="mt-2 text-sm text-muted-foreground mb-6">
              This page doesn't exist or has moved.
            </p>
            <Link href="/" className="text-sm text-teal-400 hover:underline">
              ← Back to GreenElephant
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
