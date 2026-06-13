import { Stethoscope, Phone, MapPin, Clock } from "lucide-react";

const VetEmergencySection = () => (
  <section className="py-16 md:py-24 bg-card">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Vet & Emergency Contacts</h2>
        <p className="text-muted-foreground">Keep these numbers handy at all times.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <div className="rounded-xl border bg-background p-6 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Stethoscope className="h-5 w-5 text-accent" />
            </div>
            <h3 className="text-lg font-bold">Primary Vet</h3>
          </div>
          <div className="space-y-3 text-sm">
            <p className="font-semibold">Dr. Sarah Mitchell</p>
            <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /> Paws & Claws Clinic, 123 Oak Ave</div>
            <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" /> (555) 123-4567</div>
            <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4" /> Mon–Sat, 8 AM – 6 PM</div>
          </div>
        </div>
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <Phone className="h-5 w-5 text-destructive" />
            </div>
            <h3 className="text-lg font-bold">Emergency Contacts</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Pet Owner (Alex)</span><span className="font-semibold">(555) 987-6543</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Emergency Vet (24h)</span><span className="font-semibold">(555) 911-PETS</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Poison Control</span><span className="font-semibold">(888) 426-4435</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Neighbor (backup key)</span><span className="font-semibold">(555) 222-3344</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default VetEmergencySection;
