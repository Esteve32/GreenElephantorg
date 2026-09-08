import PromptCard from '../PromptCard'
import { Toaster } from "@/components/ui/toaster";

export default function PromptCardExample() {
  return (
    <>
      <div className="p-8 space-y-4 max-w-2xl">
        <PromptCard
          code="PROMPT-001"
          name="Empathetic Listening Check-in"
          type="Quick Template"
          template="Before I respond, I want to make sure I understand your perspective. What I'm hearing is... Is that accurate?"
          howToUse="Use this template during conflict resolution to check your understanding before responding."
          lens="needs"
          role="Executive Assistant"
        />
        <PromptCard
          code="PROMPT-002"
          name="Trust Building in Teams"
          type="Quick Template"
          template="I appreciate your willingness to share this challenge. What support would be most helpful to you right now?"
          howToUse="Use this template in a team meeting to invite a clear request for support."
          lens="dynamics"
          role="Startup Founder"
        />
      </div>
      <Toaster />
    </>
  )
}
