import { Link, useLocation } from "wouter";
import { SEO } from "@/components/SEO";
import { pageMetadata } from "@shared/page-metadata";

// No webinar data requests, signup forms or provider calls while parked.
export default function ParkedWebinarsPage() {
  const [location] = useLocation();
  return (
    <section className="mx-auto max-w-2xl px-6 py-28">
      <SEO {...pageMetadata(location)} />
      <h1 className="mb-5 text-3xl font-bold">Webinars are currently paused</h1>
      <p className="mb-8 text-lg">There are no webinar registrations available here at the moment.</p>
      <Link href="/" className="underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
        Return to Green Elephant
      </Link>
    </section>
  );
}
