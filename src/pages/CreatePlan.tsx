import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PetForm, { PetFormData } from "@/components/PetForm";
import CarePlanReport from "@/components/CarePlanReport";
import { recordPlanGenerated } from "@/lib/analytics";
import { useAuth } from "@/context/AuthContext";
import { generateCarePlan, GeminiCarePlan } from "@/lib/geminiService";
import { Loader2, PawPrint } from "lucide-react";

// ── Sample animal data for demonstration ──────────────────────────────────────
const SAMPLE_PET_DATA: PetFormData = {
  petName: "Buddy",
  species: "Dog",
  breed: "Golden Retriever",
  age: "3 years",
  weight: "32 kg",
  gender: "Male",
  color: "Golden / Cream",
  feedingMorning: "1.5 cups premium dry kibble (Royal Canin Golden Retriever) + 1 tsp salmon oil",
  feedingEvening: "1.5 cups premium dry kibble + steamed vegetables (carrots/beans)",
  allergies: "Chicken-based proteins, wheat gluten",
  medications: "Heartgard Plus (heartworm) — 1st of each month\nNexGard (flea & tick) — 1st of each month",
  vetName: "Dr. Sarah Mitchell",
  vetPhone: "(555) 123-4567",
  vetAddress: "Paws & Claws Animal Clinic, 123 Oak Avenue, Springfield",
  emergencyContact: "Alex Johnson (Owner)",
  emergencyPhone: "(555) 987-6543",
  walkSchedule: "Morning walk 30 min at 8:30 AM, evening walk 25 min at 7:00 PM, weekend hike 60 min",
  specialNotes: "Uses front-clip harness only. Friendly with children but excited around other dogs — keep on leash. Loves fetch and swimming.",
  personality: "Friendly, energetic, loves belly rubs and playing fetch. Gets separation anxiety if left alone more than 4 hours.",
  alerts: [
    { title: "Chicken Allergy", description: "No chicken-based kibble, treats, or chews — causes skin rash and digestive upset." },
    { title: "Separation Anxiety", description: "Provide a Kong toy filled with peanut butter when leaving. Do not leave alone more than 4 hours." },
  ],
};

const SAMPLE_PLAN: GeminiCarePlan = {
  ...SAMPLE_PET_DATA,
  aiSummary:
    "Buddy is a healthy, energetic 3-year-old Golden Retriever who thrives on routine and physical activity. Given his chicken allergy and current medications, careful attention to diet labels and monthly medication reminders are key priorities. His playful, social personality means he benefits greatly from regular outdoor activity and mental stimulation.",
  aiTips: [
    "Always read ingredient labels on treats and kibble — 'poultry' or 'fowl' on a label may still contain chicken and can trigger Buddy's allergy.",
    "Set two phone alarms on the 1st of each month for Heartgard Plus and NexGard — give them with a small meal to reduce stomach upset.",
    "Golden Retrievers are prone to hip dysplasia; keep Buddy at a healthy weight (30–34 kg) and include joint-supporting omega-3 supplements (salmon oil is already a great start).",
    "Rotate fetch toys with puzzle feeders to keep Buddy mentally engaged and reduce anxiety-driven chewing.",
    "Swim sessions are excellent low-impact exercise for Golden Retrievers and help cool them down in warm weather — ensure clean water sources only.",
  ],
  dailySchedule: [
    { time: "6:30 AM", activity: "Wake-up & Morning Stretch", detail: "Let Buddy out to the garden for toilet. Give a gentle 5-minute play session to energise him for the morning." },
    { time: "8:00 AM", activity: "Morning Feeding", detail: "Serve 1.5 cups Royal Canin Golden Retriever kibble + 1 tsp salmon oil. Ensure fresh water bowl is refilled." },
    { time: "8:30 AM", activity: "Morning Walk", detail: "30-minute brisk walk using front-clip harness. Allow sniff breaks — mental stimulation is as tiring as physical exercise for Golden Retrievers." },
    { time: "12:00 PM", activity: "Midday Check-in", detail: "Refresh water bowl. Offer a Kong toy with peanut butter if leaving Buddy alone. 10-minute interactive play or obedience session." },
    { time: "6:00 PM", activity: "Evening Feeding", detail: "Serve 1.5 cups kibble + steamed carrots or green beans. Do not feed immediately before or after vigorous exercise (bloat risk)." },
    { time: "7:00 PM", activity: "Evening Walk", detail: "25-minute evening walk. Great time for calm heel training. Keep on leash in areas with other dogs." },
    { time: "9:00 PM", activity: "Bedtime Routine", detail: "Brushing session (5 minutes) and settle Buddy in his sleeping area. Provide a chew toy. Ensure area is draught-free." },
  ],
  feedingPlan: {
    morning: "1.5 cups Royal Canin Golden Retriever dry kibble + 1 teaspoon salmon oil for coat health and joint support.",
    midday: "Optional: 2–3 baby carrots or a small piece of apple (no seeds) as a healthy low-calorie snack.",
    evening: "1.5 cups Royal Canin Golden Retriever dry kibble + 2 tablespoons steamed carrots or green beans.",
    snacks: "Baby carrots, blueberries, plain rice cakes, peanut butter (xylitol-free). Avoid chicken-flavoured treats.",
    foodsToAvoid: ["Chicken & poultry products", "Wheat gluten", "Grapes & raisins", "Chocolate", "Onions & garlic", "Macadamia nuts", "Xylitol (artificial sweetener)"],
    hydrationTip: "Golden Retrievers need approximately 800–1000 ml of water daily. Use a stainless-steel bowl and clean it daily. Offer extra water after outdoor exercise or hot weather.",
  },
  medicalPlan: {
    currentMedications: [
      "Heartgard Plus (heartworm prevention) — 1 chewable tablet on the 1st of every month",
      "NexGard (flea & tick prevention) — 1 chewable tablet on the 1st of every month",
    ],
    medicationReminders: [
      "Set a recurring phone calendar event on the 1st of every month labelled 'Buddy's Monthly Meds'.",
      "Give both medications with a small meal to reduce any chance of stomach upset.",
      "Store medications in a cool, dry place away from direct sunlight and out of reach of children.",
    ],
    recommendedVaccinations: ["Rabies (every 1–3 years)", "DHPP — Distemper, Parvovirus, Parainfluenza (every 3 years)", "Bordetella (Kennel Cough, annually)", "Leptospirosis (if exposed to water/wildlife)"],
    healthMonitoring: [
      "Watch for limping, stiffness after rest, or difficulty rising — early signs of hip dysplasia common in Goldens.",
      "Monitor for skin redness, itching, or ear inflammation which may indicate allergic reaction to food.",
      "Check for lumps or swellings monthly — Golden Retrievers have higher rates of certain cancers; early detection is critical.",
      "Watch coat condition — dull or dry fur may indicate nutritional deficiency or thyroid issues.",
    ],
    vetVisitFrequency: "Annual wellness exam recommended for adult dogs. Schedule bi-annual check-ups from age 7+ as senior screening.",
    dentalCare: "Brush teeth 3× per week using dog-safe enzymatic toothpaste. Schedule professional dental cleaning annually or as recommended by Dr. Mitchell.",
    parasitePrevention: "NexGard covers flea, tick, and mite prevention monthly. Heartgard Plus provides heartworm protection. Year-round treatment is recommended in most climates.",
  },
  groomingPlan: {
    brushingFrequency: "Daily during shedding season (spring/autumn); 3–4 times per week otherwise. Use a slicker brush followed by an undercoat rake.",
    bathingFrequency: "Every 4–6 weeks, or after swimming in natural water. Use hypoallergenic dog shampoo to avoid skin irritation.",
    nailTrimming: "Every 3–4 weeks. If you can hear nails clicking on the floor, they're too long. Ask Dr. Mitchell's team to trim if unsure.",
    earCleaning: "Weekly check; clean monthly or after swimming using vet-approved ear solution. Golden Retrievers are prone to ear infections due to floppy ears.",
    extraTips: [
      "Check and clean between paw pads after every walk — debris and grass seeds can become lodged and cause infections.",
      "Pay special attention to feathering (long hair) on legs and belly — mats form quickly here in Golden Retrievers.",
      "Use a de-shedding treatment every 6–8 weeks during high-shed periods to reduce household fur.",
    ],
  },
  behaviouralPlan: {
    trainingTips: [
      "Use positive reinforcement exclusively — Buddy responds well to praise and food rewards. Avoid punishment-based training.",
      "Keep training sessions to 10–15 minutes, 2× daily. Golden Retrievers learn quickly but bore easily with repetition.",
      "Practice 'place' or 'go to mat' command to give Buddy a calm spot when guests arrive, reducing overexcitement.",
    ],
    mentalStimulation: [
      "Rotate puzzle feeders (Kong, LickiMat, snuffle mat) at mealtimes to slow eating and engage problem-solving.",
      "Hide-and-seek games with treats around the house provide excellent mental exercise on rainy days.",
      "Introduce new environments, scents, and experiences monthly — farmers markets, car rides, new parks.",
    ],
    socialisation: [
      "Arrange controlled dog-park visits 2× weekly. Keep Buddy on leash during initial greetings to manage his excitement.",
      "Regular exposure to children, strangers, and different animals — Buddy's friendly nature benefits from positive reinforcement of calm greetings.",
    ],
    anxietyManagement: "For separation anxiety: create a consistent departure routine (Kong with peanut butter + calming music), avoid prolonged goodbyes, and consider a dog camera to monitor. If anxiety worsens, discuss short-term anxiolytic options with Dr. Mitchell.",
  },
  uniqueInsight: "Golden Retrievers have a genetic predisposition to mast cell tumours and lymphoma — in fact, nearly 60% of Golden Retrievers will develop some form of cancer in their lifetime. This makes monthly at-home body checks (running your hands over the entire body feeling for lumps) not just helpful but potentially life-saving. Pairing this with annual vet bloodwork from age 5 significantly improves early-detection rates.",
  uniqueInsightTitle: "Golden Retriever Cancer Risk — What Every Owner Must Know",
  emergencyChecklist: [
    "If Buddy ingests a known allergen (chicken), monitor for hives, vomiting, or facial swelling. Call Dr. Sarah Mitchell immediately: (555) 123-4567.",
    "If Buddy ingests a toxic substance (chocolate, grapes, xylitol), do NOT induce vomiting without vet guidance — call the ASPCA Poison Control: (888) 426-4435.",
    "For injuries, bleeding, or loss of consciousness: wrap in a blanket, keep calm, and rush to nearest 24-hr emergency vet. Keep Dr. Mitchell's address ready: 123 Oak Avenue, Springfield.",
    "Contact emergency owner Alex Johnson: (555) 987-6543. If unreachable, next step is the nearest emergency animal hospital.",
  ],
  generatedAt: new Date().toISOString(),
  model: "sample",
};

const CreatePlan = () => {
  const [planData, setPlanData] = useState<GeminiCarePlan | null>(null);
  const [isSample, setIsSample] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  async function handleGenerate(data: PetFormData) {
    setLoading(true);
    setIsSample(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    try {
      const plan = await generateCarePlan(data);
      recordPlanGenerated(user?.id);
      setPlanData(plan);
    } catch (err) {
      console.error("Failed to generate care plan:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleSamplePreview() {
    setIsSample(true);
    setPlanData(SAMPLE_PLAN);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 py-24">
          <div className="relative">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
              <PawPrint className="h-10 w-10 text-primary" />
            </div>
            <Loader2 className="absolute -top-1 -right-1 h-7 w-7 text-primary animate-spin" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-extrabold">Generating AI Care Plan…</h2>
            <p className="text-muted-foreground max-w-xs mx-auto">
              Our AI is analysing your pet's profile and crafting personalised medical, feeding, and daily schedule recommendations.
            </p>
          </div>
          <div className="flex gap-1.5">
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className="h-2 w-2 rounded-full bg-primary animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      ) : planData ? (
        <CarePlanReport
          data={planData}
          isSample={isSample}
          onBack={() => { setPlanData(null); setIsSample(false); }}
        />
      ) : (
        <PetForm onGenerate={handleGenerate} onSamplePreview={handleSamplePreview} />
      )}

      <Footer />
    </div>
  );
};

export default CreatePlan;
