import { ClipboardList, Share2, CheckCircle } from "lucide-react";

const steps = [
  { icon: ClipboardList, step: "1", title: "Fill In Details", desc: "Add your pet's info, feeding schedule, and medical needs." },
  { icon: Share2, step: "2", title: "Share With Sitter", desc: "Send the link or print the instructions for your pet sitter." },
  { icon: CheckCircle, step: "3", title: "Peace of Mind", desc: "Your sitter has everything they need. Enjoy your time away!" },
];

const HowItWorksSection = () => (
  <section className="py-16 md:py-24">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-3">How It Works</h2>
        <p className="text-muted-foreground max-w-md mx-auto">Three simple steps to organized pet care.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {steps.map((s, i) => (
          <div key={s.title} className="text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <s.icon className="h-8 w-8" />
            </div>
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">{s.step}</div>
            <h3 className="text-xl font-bold">{s.title}</h3>
            <p className="text-sm text-muted-foreground">{s.desc}</p>
            {i < steps.length - 1 && <div className="hidden md:block absolute" />}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
