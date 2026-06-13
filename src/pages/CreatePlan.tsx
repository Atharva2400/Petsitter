import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PetForm, { PetFormData } from "@/components/PetForm";
import CarePlanReport from "@/components/CarePlanReport";
import { recordPlanGenerated } from "@/lib/analytics";
import { useAuth } from "@/context/AuthContext";
import { generateCarePlan, GeminiCarePlan } from "@/lib/geminiService";
import { Loader2, PawPrint } from "lucide-react";

const CreatePlan = () => {
  const [planData, setPlanData] = useState<GeminiCarePlan | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  async function handleGenerate(data: PetFormData) {
    setLoading(true);
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
        <CarePlanReport data={planData} onBack={() => setPlanData(null)} />
      ) : (
        <PetForm onGenerate={handleGenerate} />
      )}

      <Footer />
    </div>
  );
};

export default CreatePlan;
