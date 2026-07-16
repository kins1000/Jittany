import { ScrollText } from "lucide-react";

export default function GameRules({ rules }) {
  if (!rules) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <ScrollText className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>No rules have been added for this game yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <ScrollText className="w-5 h-5 text-accent" />
        <h3 className="font-display font-bold text-lg">Rules</h3>
      </div>

        <div className="whitespace-pre-line text-muted-foreground">
            {rules}
        </div>

    </div>
  );
}