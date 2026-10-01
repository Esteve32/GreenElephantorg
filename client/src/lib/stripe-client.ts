import { loadStripe } from '@stripe/stripe-js';
// Missing configuration disables payment instead of crashing the whole app.
export const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;
