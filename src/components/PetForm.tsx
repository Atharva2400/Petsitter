import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PawPrint, Plus, Trash2 } from "lucide-react";

export interface PetFormData {
  petName: string;
  species: string;
  breed: string;
  age: string;
  weight: string;
  gender: string;
  color: string;
  feedingMorning: string;
  feedingEvening: string;
  allergies: string;
  medications: string;
  vetName: string;
  vetPhone: string;
  vetAddress: string;
  emergencyContact: string;
  emergencyPhone: string;
  walkSchedule: string;
  specialNotes: string;
  personality: string;
  alerts: { title: string; description: string }[];
}

const initialData: PetFormData = {
  petName: "",
  species: "Dog",
  breed: "",
  age: "",
  weight: "",
  gender: "Male",
  color: "",
  feedingMorning: "",
  feedingEvening: "",
  allergies: "",
  medications: "",
  vetName: "",
  vetPhone: "",
  vetAddress: "",
  emergencyContact: "",
  emergencyPhone: "",
  walkSchedule: "",
  specialNotes: "",
  personality: "",
  alerts: [],
};

interface PetFormProps {
  onGenerate: (data: PetFormData) => void;
}

const PetForm = ({ onGenerate }: PetFormProps) => {
  const [data, setData] = useState<PetFormData>(initialData);

  const set = (field: keyof PetFormData, value: string) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const addAlert = () =>
    setData((prev) => ({
      ...prev,
      alerts: [...prev.alerts, { title: "", description: "" }],
    }));

  const removeAlert = (i: number) =>
    setData((prev) => ({
      ...prev,
      alerts: prev.alerts.filter((_, idx) => idx !== i),
    }));

  const updateAlert = (i: number, field: "title" | "description", val: string) =>
    setData((prev) => ({
      ...prev,
      alerts: prev.alerts.map((a, idx) => (idx === i ? { ...a, [field]: val } : a)),
    }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(data);
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary mb-4">
            <PawPrint className="h-4 w-4" /> Create Your Plan
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
            Fill Your Pet's Details
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Enter your pet's information and we'll generate a complete care plan you can download as PDF.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
          {/* Basic Info */}
          <div className="rounded-xl border bg-card p-6 shadow-card space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">🐾 Basic Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="petName">Pet Name *</Label>
                <Input id="petName" required value={data.petName} onChange={(e) => set("petName", e.target.value)} placeholder="e.g. Buddy" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="species">Species</Label>
                <select id="species" value={data.species} onChange={(e) => set("species", e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option>Dog</option><option>Cat</option><option>Bird</option><option>Rabbit</option><option>Fish</option><option>Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="breed">Breed</Label>
                <Input id="breed" value={data.breed} onChange={(e) => set("breed", e.target.value)} placeholder="e.g. Golden Retriever" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input id="age" value={data.age} onChange={(e) => set("age", e.target.value)} placeholder="e.g. 3 years" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight</Label>
                <Input id="weight" value={data.weight} onChange={(e) => set("weight", e.target.value)} placeholder="e.g. 30 kg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <select id="gender" value={data.gender} onChange={(e) => set("gender", e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option>Male</option><option>Female</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color/Markings</Label>
                <Input id="color" value={data.color} onChange={(e) => set("color", e.target.value)} placeholder="e.g. Golden" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="personality">Personality</Label>
                <Textarea id="personality" value={data.personality} onChange={(e) => set("personality", e.target.value)} placeholder="e.g. Friendly, loves belly rubs..." />
              </div>
            </div>
          </div>

          {/* Feeding & Medication */}
          <div className="rounded-xl border bg-card p-6 shadow-card space-y-4">
            <h3 className="text-lg font-bold">🍖 Feeding & Medication</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="feedingMorning">Morning Feeding</Label>
                <Input id="feedingMorning" value={data.feedingMorning} onChange={(e) => set("feedingMorning", e.target.value)} placeholder="e.g. 1 cup kibble + wet food" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="feedingEvening">Evening Feeding</Label>
                <Input id="feedingEvening" value={data.feedingEvening} onChange={(e) => set("feedingEvening", e.target.value)} placeholder="e.g. 1 cup dry kibble" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="allergies">Allergies / Foods to Avoid</Label>
                <Textarea id="allergies" value={data.allergies} onChange={(e) => set("allergies", e.target.value)} placeholder="e.g. No chocolate, grapes, onions..." />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="medications">Medications</Label>
                <Textarea id="medications" value={data.medications} onChange={(e) => set("medications", e.target.value)} placeholder="e.g. Heartworm pill - 1st of every month..." />
              </div>
            </div>
          </div>

          {/* Daily Routine */}
          <div className="rounded-xl border bg-card p-6 shadow-card space-y-4">
            <h3 className="text-lg font-bold">🕐 Daily Routine</h3>
            <div className="space-y-2">
              <Label htmlFor="walkSchedule">Walk / Exercise Schedule</Label>
              <Textarea id="walkSchedule" value={data.walkSchedule} onChange={(e) => set("walkSchedule", e.target.value)} placeholder="e.g. Morning walk 30 min at 9 AM, evening walk 20 min at 7:30 PM..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialNotes">Special Notes</Label>
              <Textarea id="specialNotes" value={data.specialNotes} onChange={(e) => set("specialNotes", e.target.value)} placeholder="e.g. Uses front-clip harness, no off-leash near roads..." />
            </div>
          </div>

          {/* Vet & Emergency */}
          <div className="rounded-xl border bg-card p-6 shadow-card space-y-4">
            <h3 className="text-lg font-bold">🏥 Vet & Emergency Contacts</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vetName">Vet Name</Label>
                <Input id="vetName" value={data.vetName} onChange={(e) => set("vetName", e.target.value)} placeholder="e.g. Dr. Sarah Mitchell" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vetPhone">Vet Phone</Label>
                <Input id="vetPhone" value={data.vetPhone} onChange={(e) => set("vetPhone", e.target.value)} placeholder="e.g. (555) 123-4567" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="vetAddress">Vet Address</Label>
                <Input id="vetAddress" value={data.vetAddress} onChange={(e) => set("vetAddress", e.target.value)} placeholder="e.g. Paws & Claws Clinic, 123 Oak Ave" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                <Input id="emergencyContact" value={data.emergencyContact} onChange={(e) => set("emergencyContact", e.target.value)} placeholder="e.g. Alex (Owner)" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                <Input id="emergencyPhone" value={data.emergencyPhone} onChange={(e) => set("emergencyPhone", e.target.value)} placeholder="e.g. (555) 987-6543" />
              </div>
            </div>
          </div>

          {/* Alerts */}
          <div className="rounded-xl border bg-card p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">⚠️ Important Alerts</h3>
              <Button type="button" variant="outline" size="sm" onClick={addAlert}>
                <Plus className="h-4 w-4 mr-1" /> Add Alert
              </Button>
            </div>
            {data.alerts.length === 0 && (
              <p className="text-sm text-muted-foreground">No alerts added yet. Click "Add Alert" for things like allergies, fears, etc.</p>
            )}
            {data.alerts.map((alert, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="flex-1 grid sm:grid-cols-2 gap-3">
                  <Input placeholder="Alert title" value={alert.title} onChange={(e) => updateAlert(i, "title", e.target.value)} />
                  <Input placeholder="Description" value={alert.description} onChange={(e) => updateAlert(i, "description", e.target.value)} />
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => removeAlert(i)} className="text-destructive shrink-0">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button type="submit" size="lg" className="px-10 text-base font-bold">
              <PawPrint className="h-5 w-5 mr-2" /> Generate Care Plan
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default PetForm;
