import { Sun, Sunrise, Sunset, Moon } from "lucide-react";

const routine = [
  { time: "7:00 AM", icon: Sunrise, label: "Wake Up", desc: "Let Buddy out in the backyard. Fresh water.", bg: "bg-pet-amber/10" },
  { time: "7:30 AM", icon: Sunrise, label: "Breakfast", desc: "1 cup kibble + 2 tbsp wet food. Joint supplement.", bg: "bg-pet-cream" },
  { time: "9:00 AM", icon: Sun, label: "Morning Walk", desc: "30-min walk. Use front-clip harness. Bring bags.", bg: "bg-pet-sage/20" },
  { time: "12:00 PM", icon: Sun, label: "Midday Check", desc: "Quick potty break. Refill water. Optional play.", bg: "bg-pet-sky/20" },
  { time: "3:00 PM", icon: Sun, label: "Afternoon Play", desc: "Fetch in yard or puzzle toy indoors (15–20 min).", bg: "bg-pet-blush/30" },
  { time: "6:00 PM", icon: Sunset, label: "Dinner", desc: "1 cup dry kibble. Refill water.", bg: "bg-pet-amber/10" },
  { time: "7:30 PM", icon: Sunset, label: "Evening Walk", desc: "20-min walk around the block. Reflective leash.", bg: "bg-pet-sage/20" },
  { time: "9:30 PM", icon: Moon, label: "Bedtime", desc: "Last potty break. Buddy sleeps in crate in bedroom.", bg: "bg-pet-sky/15" },
];

const DailyRoutine = () => (
  <section className="py-16 md:py-24">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Daily Routine</h2>
        <p className="text-muted-foreground max-w-md mx-auto">Buddy's typical day, from sunrise to bedtime.</p>
      </div>
      <div className="max-w-2xl mx-auto space-y-0">
        {routine.map((r, i) => (
          <div key={r.time} className="flex gap-4">
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                <r.icon className="h-5 w-5" />
              </div>
              {i < routine.length - 1 && <div className="w-0.5 flex-1 bg-border" />}
            </div>
            {/* Content */}
            <div className={`rounded-lg ${r.bg} p-4 mb-3 flex-1`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-primary">{r.time}</span>
                <span className="text-sm font-bold">{r.label}</span>
              </div>
              <p className="text-sm text-muted-foreground">{r.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default DailyRoutine;
