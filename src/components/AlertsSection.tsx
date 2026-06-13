import { AlertTriangle, ShieldAlert, ThermometerSun } from "lucide-react";

const alerts = [
  {
    icon: AlertTriangle,
    title: "Food Allergies",
    desc: "Buddy is allergic to chicken-based treats. Only use beef or fish treats from the bag on the counter.",
    type: "warning" as const,
  },
  {
    icon: ShieldAlert,
    title: "Thunder Anxiety",
    desc: "During storms, Buddy hides under the bed. Play calming music and give him the anxiety wrap from the closet.",
    type: "destructive" as const,
  },
  {
    icon: ThermometerSun,
    title: "Heat Sensitivity",
    desc: "Don't walk Buddy between 12–3 PM in summer. Check pavement temp with your hand before walks.",
    type: "warning" as const,
  },
];

const styles = {
  warning: "border-warning/40 bg-warning/5",
  destructive: "border-destructive/40 bg-destructive/5",
};

const iconStyles = {
  warning: "bg-warning/15 text-warning",
  destructive: "bg-destructive/15 text-destructive",
};

const AlertsSection = () => (
  <section className="py-16 md:py-24 bg-card">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-3">⚠️ Important Alerts</h2>
        <p className="text-muted-foreground">Things to watch out for.</p>
      </div>
      <div className="max-w-2xl mx-auto space-y-4">
        {alerts.map((a) => (
          <div key={a.title} className={`flex items-start gap-4 rounded-xl border ${styles[a.type]} p-5`}>
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg shrink-0 ${iconStyles[a.type]}`}>
              <a.icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold mb-1">{a.title}</h3>
              <p className="text-sm text-muted-foreground">{a.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AlertsSection;
