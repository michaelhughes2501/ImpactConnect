import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const HOUSE_RULES = [
  "Everyone on the Yard passes a background check before their profile goes live.",
  "Never share your SSN, financial info, or exact address in a Kite.",
  "Meet new Connects in public spots for the first few times.",
  "Tell a friend or family member where you're going and who with.",
  "Report anything that feels off — we look into every report.",
];

export default function SafetyBanner() {
  return (
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4">
      <div className="flex items-start space-x-3">
        <i className="fas fa-shield-alt text-primary text-lg mt-0.5"></i>
        <div>
          <h3 className="font-medium text-dark text-sm">Stay Protected Out Here</h3>
          <p className="text-gray-600 text-xs mt-1">
            Everyone's background checked. Keep your business to yourself and stay alert.
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <button className="text-primary text-xs font-medium mt-1 hover:underline">
                House Rules →
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>House Rules</DialogTitle>
                <DialogDescription>
                  A few things every Connect on the Yard agrees to.
                </DialogDescription>
              </DialogHeader>
              <ul className="space-y-2 text-sm text-gray-700">
                {HOUSE_RULES.map((rule) => (
                  <li key={rule} className="flex items-start space-x-2">
                    <i className="fas fa-check text-success text-xs mt-1"></i>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
