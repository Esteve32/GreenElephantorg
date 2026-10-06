import PromptCard from '../PromptCard'
import { Toaster } from "@/components/ui/toaster";

export default function PromptCardExample() {
  return (
    <>
      <div className="p-8 space-y-4 max-w-2xl">
        <PromptCard
          name="Empathetic Listening Check-in"
          template="Before I respond, I want to make sure I understand your perspective. What I'm hearing is... Is that accurate?"
          lens="needs"
          role="EA Executive Assistant"
          code="example-listening"
          type="Quick Template"
          howToUse="Adapt this example to the conversation, then review it before sharing."
        />
        <PromptCard
          name="Trust Building in Teams"
          template="I appreciate your willingness to share this challenge. What support would be most helpful to you right now?"
          lens="dynamics"
          role="Strategic Innovation Expert"
          code="example-trust"
          type="Quick Template"
          howToUse="Adapt this example to the conversation, then review it before sharing."
        />
      </div>
      <Toaster />
    </>
  )
}
