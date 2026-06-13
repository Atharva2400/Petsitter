import { UtensilsCrossed, Pill, Stethoscope, Phone, CalendarClock } from "lucide-react";

const features = [
  { icon: UtensilsCrossed, title: "Feeding Schedule", desc: "Detailed meal times, portions, and dietary restrictions.", color: "bg-pet-amber/20 text-primary" },
  { icon: Pill, title: "Medicine Tracker", desc: "Dosage info, timing, and administration instructions.", color: "bg-pet-sage/30 text-accent" },
  { icon: Stethoscope, title: "Vet Information", desc: "Clinic details, vet name, and medical history.", color: "bg-pet-sky/30 text-accent" },
  { icon: Phone, title: "Emergency Contacts", desc: "Quick access to owner, vet, and emergency numbers.", color: "bg-destructive/10 text-destructive" },
  { icon: CalendarClock, title: "Daily Routine", desc: "Walks, play time, naps, and bedtime routines.", color: "bg-pet-blush/30 text-primary" },
];

const FeaturesSection = () => (
  <section className="py-16 md:py-24 bg-card">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Everything Your Sitter Needs</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">All the essential information organized in one beautiful, easy-to-follow layout.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f) => (
          <div key={f.title} className="rounded-xl border bg-background p-6 shadow-card transition hover:shadow-warm hover:-translate-y-1">
            <div className={`inline-flex items-center justify-center h-12 w-12 rounded-lg ${f.color} mb-4`}>
              <f.icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
