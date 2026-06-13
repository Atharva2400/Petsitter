import { Dog, Cake, Weight, Palette } from "lucide-react";

const PetProfileCard = () => (
  <section id="pet-profile" className="py-16 md:py-24 bg-card">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Meet Buddy 🐾</h2>
        <p className="text-muted-foreground">Sample pet profile card</p>
      </div>
      <div className="max-w-lg mx-auto rounded-2xl border bg-background p-8 shadow-card">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-pet-amber/20">
            <Dog className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold">Buddy</h3>
            <p className="text-sm text-muted-foreground">Golden Retriever • Male</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Cake, label: "Age", value: "3 years" },
            { icon: Weight, label: "Weight", value: "30 kg" },
            { icon: Palette, label: "Color", value: "Golden" },
            { icon: Dog, label: "Microchip", value: "#98274610" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <item.icon className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-semibold">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-lg bg-pet-cream p-4">
          <p className="text-sm font-medium mb-1">Personality</p>
          <p className="text-sm text-muted-foreground">Friendly, loves belly rubs, gets excited around other dogs. Scared of thunder — needs comfort during storms.</p>
        </div>
      </div>
    </div>
  </section>
);

export default PetProfileCard;
