import PromptCard from '../PromptCard'
import { Toaster } from "@/components/ui/toaster";

export default function PromptCardExample() {
  return (
    <>
      <div className="p-8 space-y-4 max-w-2xl">
        <PromptCard
          title="Empathetic Listening Check-in"
          prompt="Before I respond, I want to make sure I understand your perspective. What I'm hearing is... Is that accurate?"
          lens="needs"
          role="Executive Assistant"
          scenario="Conflict Resolution"
        />
        <PromptCard
          title="Trust Building in Teams"
          prompt="I appreciate your willingness to share this challenge. What support would be most helpful to you right now?"
          lens="dynamics"
          role="Startup Founder"
          scenario="Team Meeting"
        />
      </div>
      <Toaster />
    </>
  )
}
