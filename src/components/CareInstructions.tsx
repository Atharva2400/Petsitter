import { UtensilsCrossed, Pill, Droplets, Scissors } from "lucide-react";

const sections = [
  {
    icon: UtensilsCrossed,
    title: "Feeding",
    color: "border-l-primary",
    items: [
      "Morning (7:30 AM): 1 cup dry kibble + 2 tbsp wet food",
      "Evening (6:00 PM): 1 cup dry kibble",
      "Fresh water refilled twice daily",
      "NO chocolate, grapes, onions, or garlic",
      "Treats: max 3 small biscuits per day",
    ],
  },
  {
    icon: Pill,
    title: "Medication",
    color: "border-l-accent",
    items: [
      "Heartworm pill — 1st of every month (with food)",
      "Joint supplement — 1 chew every morning",
      "Allergy eye drops — 2 drops each eye if red/itchy",
    ],
  },
  {
    icon: Droplets,
    title: "Grooming",
    color: "border-l-secondary",
    items: [
      "Brush coat every 2 days",
      "Wipe paws after walks",
      "Clean ears weekly with provided solution",
    ],
  },
  {
    icon: Scissors,
    title: "Special Notes",
    color: "border-l-pet-amber",
    items: [
      "Buddy pulls on leash — use front-clip harness",
      "Loves the park on Oak Street (2 blocks east)",
      "Absolutely NO off-leash near roads",
    ],
  },
];

const CareInstructions = () => (
  <section id="instructions" className="py-16 md:py-24">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Care Instructions</h2>
        <p className="text-muted-foreground max-w-md mx-auto">Detailed guidelines to keep Buddy happy and healthy.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {sections.map((s) => (
          <div key={s.title} className={`rounded-xl border border-l-4 ${s.color} bg-card p-6 shadow-card`}>
            <div className="flex items-center gap-3 mb-4">
              <s.icon className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-bold">{s.title}</h3>
            </div>
            <ul className="space-y-2">
              {s.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/50 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default CareInstructions;
