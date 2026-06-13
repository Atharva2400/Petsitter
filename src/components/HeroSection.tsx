import heroPets from "@/assets/hero-pets.jpg";
import { Heart, PawPrint, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="gradient-hero relative overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <PawPrint className="h-4 w-4" />
              Your Pet's Care, Simplified
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              Pet Sitter <span className="text-primary">Instructions</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Everything your pet sitter needs to know — feeding schedules, medicine reminders, vet contacts, and daily routines, all in one place.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/create-plan" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-warm transition hover:opacity-90">
                <FileText className="h-5 w-5" /> Create Care Plan
              </Link>
              <a href="#pet-profile" className="inline-flex items-center gap-2 rounded-lg border-2 border-primary/20 bg-card px-6 py-3 font-semibold text-foreground transition hover:border-primary/40">
                <Heart className="h-5 w-5" /> View Sample
              </a>
            </div>
          </div>
          <div className="relative flex justify-center" style={{ animationDelay: "0.2s" }}>
            <div className="relative rounded-2xl overflow-hidden shadow-warm">
              <img src={heroPets} alt="Happy dog and cat sitting together" width={1280} height={720} className="w-full h-auto rounded-2xl" />
            </div>
            <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-pet-amber/30 animate-bounce-gentle" />
            <div className="absolute -top-4 -right-4 h-12 w-12 rounded-full bg-pet-sage/40 animate-bounce-gentle" style={{ animationDelay: "1s" }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
