/**
 * Gemini AI Service
 *
 * Integrates with Google Gemini API (gemini-1.5-flash) to generate a rich,
 * personalised pet care plan based on the owner-provided pet profile.
 *
 * The plan includes:
 *   - AI summary
 *   - Detailed daily schedule (6 time slots)
 *   - Feeding & nutrition advice
 *   - Medical & medication guidance
 *   - Health monitoring tips
 *   - Grooming recommendations
 *   - Behavioural & mental-stimulation tips
 *   - Unique AI-generated insight specific to the breed/species
 *   - Emergency action checklist
 */

import { PetFormData } from "@/components/PetForm";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DailyScheduleSlot {
  time: string;       // e.g. "7:00 AM"
  activity: string;   // short label
  detail: string;     // full instruction
}

export interface FeedingPlan {
  morning: string;
  midday?: string;
  evening: string;
  snacks: string;
  foodsToAvoid: string[];
  hydrationTip: string;
}

export interface MedicalPlan {
  currentMedications: string[];
  medicationReminders: string[];
  recommendedVaccinations: string[];
  healthMonitoring: string[];
  vetVisitFrequency: string;
  dentalCare: string;
  parasitePrevention: string;
}

export interface GroomingPlan {
  brushingFrequency: string;
  bathingFrequency: string;
  nailTrimming: string;
  earCleaning: string;
  extraTips: string[];
}

export interface BehaviouralPlan {
  trainingTips: string[];
  mentalStimulation: string[];
  socialisation: string[];
  anxietyManagement?: string;
}

export interface GeminiCarePlan extends PetFormData {
  // Core AI fields
  aiSummary: string;
  aiTips: string[];

  // Rich sections
  dailySchedule: DailyScheduleSlot[];
  feedingPlan: FeedingPlan;
  medicalPlan: MedicalPlan;
  groomingPlan: GroomingPlan;
  behaviouralPlan: BehaviouralPlan;

  // Unique AI insight
  uniqueInsight: string;
  uniqueInsightTitle: string;

  // Emergency
  emergencyChecklist: string[];

  // Metadata
  generatedAt: string;
  model: string;
}

// ---------------------------------------------------------------------------
// Prompt builder
// ---------------------------------------------------------------------------

function buildPrompt(data: PetFormData): string {
  const alertsText = data.alerts.length > 0
    ? data.alerts.map(a => `  - ${a.title}: ${a.description}`).join("\n")
    : "  None";

  return `
You are an expert veterinary care assistant and animal behaviourist specialising in personalised pet care plans.

A pet owner has provided the following profile. Your task is to generate a comprehensive, actionable, and genuinely helpful care plan that a pet-sitter or owner can follow every day.

── PET PROFILE ──────────────────────────────────────────────────────────
Name            : ${data.petName}
Species         : ${data.species}
Breed           : ${data.breed || "Unknown"}
Age             : ${data.age || "Unknown"}
Weight          : ${data.weight || "Unknown"}
Gender          : ${data.gender}
Color/Markings  : ${data.color || "Not specified"}
Personality     : ${data.personality || "Not described"}

Feeding
  Morning       : ${data.feedingMorning || "Not specified"}
  Evening       : ${data.feedingEvening || "Not specified"}
  Allergies     : ${data.allergies || "None known"}
  Medications   : ${data.medications || "None"}

Daily Routine
  Walks/Exercise: ${data.walkSchedule || "Not specified"}
  Special Notes : ${data.specialNotes || "None"}

Vet & Emergency
  Vet           : ${data.vetName || "Not provided"} — ${data.vetPhone || ""}
  Vet Address   : ${data.vetAddress || "Not provided"}
  Emergency     : ${data.emergencyContact || "Not provided"} — ${data.emergencyPhone || ""}

Important Alerts:
${alertsText}
─────────────────────────────────────────────────────────────────────────

Generate ALL sections of the JSON below. Be specific to the species, breed, age, and weight provided. Do NOT give generic advice — tailor everything to THIS pet's profile.

Respond ONLY with valid JSON matching this exact schema (no markdown, no extra text):
{
  "aiSummary": "<2–3 sentence warm professional summary about this specific pet's care needs>",
  "aiTips": [
    "<tip 1 — specific to breed/species/age>",
    "<tip 2 — specific to allergies or medications if present, else a breed-specific tip>",
    "<tip 3>",
    "<tip 4>",
    "<tip 5>"
  ],
  "dailySchedule": [
    { "time": "6:30 AM", "activity": "Wake-up & Morning Stretch", "detail": "<detailed instruction>" },
    { "time": "8:00 AM", "activity": "Morning Feeding", "detail": "<exact feeding instruction based on profile>" },
    { "time": "9:00 AM", "activity": "Morning Walk / Exercise", "detail": "<exercise instruction based on breed & walkSchedule>" },
    { "time": "12:00 PM", "activity": "Midday Check-in", "detail": "<midday care instruction>" },
    { "time": "6:00 PM", "activity": "Evening Feeding", "detail": "<exact evening feeding instruction>" },
    { "time": "7:30 PM", "activity": "Evening Walk & Wind Down", "detail": "<evening routine>" },
    { "time": "9:00 PM", "activity": "Bedtime Routine", "detail": "<bedtime care>" }
  ],
  "feedingPlan": {
    "morning": "<morning meal details with exact portions if provided>",
    "midday": "<midday snack if appropriate for species/age, else omit>",
    "evening": "<evening meal details>",
    "snacks": "<safe treat recommendations specific to species and allergies>",
    "foodsToAvoid": ["<food 1>", "<food 2>", "<food 3>"],
    "hydrationTip": "<specific hydration advice for this species/breed/age>"
  },
  "medicalPlan": {
    "currentMedications": ["<medication from profile with exact schedule>"],
    "medicationReminders": ["<practical reminder tip for each medication>"],
    "recommendedVaccinations": ["<core vaccine 1 for this species>", "<core vaccine 2>", "<optional vaccine if relevant>"],
    "healthMonitoring": ["<sign to watch for specific to breed 1>", "<sign 2>", "<sign 3>"],
    "vetVisitFrequency": "<recommendation based on age — e.g. adult dogs: 1× per year>",
    "dentalCare": "<dental hygiene recommendation for this species>",
    "parasitePrevention": "<flea, tick, heartworm etc. recommendation for this species>"
  },
  "groomingPlan": {
    "brushingFrequency": "<based on coat type and breed>",
    "bathingFrequency": "<based on species and activity level>",
    "nailTrimming": "<frequency and tip>",
    "earCleaning": "<frequency and method>",
    "extraTips": ["<grooming tip 1 specific to breed>", "<grooming tip 2>"]
  },
  "behaviouralPlan": {
    "trainingTips": ["<tip 1 tailored to age and personality>", "<tip 2>", "<tip 3>"],
    "mentalStimulation": ["<activity 1 specific to species>", "<activity 2>", "<activity 3>"],
    "socialisation": ["<socialisation advice 1>", "<advice 2>"],
    "anxietyManagement": "<advice if personality or alerts suggest fear/anxiety, else omit>"
  },
  "uniqueInsight": "<A fascinating, genuinely useful fact or tip specific to this exact breed and age combination that most owners don't know. Make it practical and specific.>",
  "uniqueInsightTitle": "<A short punchy title for the unique insight, e.g. 'Golden Retriever Joint Health Secret'>",
  "emergencyChecklist": [
    "<emergency action 1 — e.g. what to do if pet ingests allergen>",
    "<emergency action 2>",
    "<emergency action 3 — include vet name/phone from profile if provided>",
    "<emergency action 4>"
  ]
}
`.trim();
}

// ---------------------------------------------------------------------------
// Fallback — used only when API key is unavailable
// ---------------------------------------------------------------------------

function buildFallbackPlan(data: PetFormData): GeminiCarePlan {
  const name = data.petName || "Your pet";
  const species = data.species?.toLowerCase() || "dog";

  return {
    ...data,
    aiSummary: `${name} is a ${data.breed || species} who benefits from a consistent daily routine. Based on the provided profile, a structured feeding, exercise, and medical schedule will help ${name} thrive. This care plan has been generated based on the information you provided.`,
    aiTips: [
      `Maintain consistent meal times every day for ${name} to support digestive health and reduce anxiety.`,
      data.allergies ? `Always check ingredient labels — ${name} has known sensitivities to: ${data.allergies}.` : `Rotate protein sources every few months to help prevent food sensitivities from developing.`,
      data.medications ? `Set a daily phone reminder for ${name}'s medication: ${data.medications.split("\n")[0]}.` : `Discuss monthly parasite prevention options with your vet.`,
      `Schedule regular vet check-ups based on ${name}'s age — more frequently for seniors over 7 years.`,
      `Provide mental stimulation daily through interactive toys, training, or puzzle feeders.`,
    ],
    dailySchedule: [
      { time: "7:00 AM", activity: "Morning Feeding", detail: data.feedingMorning || `Offer ${name} their morning meal with fresh water.` },
      { time: "9:00 AM", activity: "Morning Walk", detail: data.walkSchedule || `Take ${name} for a 20–30 minute walk.` },
      { time: "12:00 PM", activity: "Midday Check-in", detail: `Check ${name}'s water bowl and provide a small treat if appropriate.` },
      { time: "6:00 PM", activity: "Evening Feeding", detail: data.feedingEvening || `Offer ${name} their evening meal.` },
      { time: "7:30 PM", activity: "Evening Walk", detail: `Evening walk to help ${name} wind down before bedtime.` },
      { time: "9:00 PM", activity: "Bedtime", detail: `Ensure ${name} has a comfortable sleeping spot away from draughts.` },
    ],
    feedingPlan: {
      morning: data.feedingMorning || "Morning meal — consult vet for appropriate portion size.",
      evening: data.feedingEvening || "Evening meal — consult vet for appropriate portion size.",
      snacks: "Species-appropriate treats in moderation.",
      foodsToAvoid: data.allergies ? data.allergies.split(",").map(a => a.trim()) : ["Chocolate", "Grapes/Raisins", "Onions/Garlic"],
      hydrationTip: `Ensure ${name} always has access to fresh, clean water. Change the water bowl daily.`,
    },
    medicalPlan: {
      currentMedications: data.medications ? [data.medications] : ["No medications listed."],
      medicationReminders: data.medications ? [`Set a recurring phone alarm for: ${data.medications}`] : ["Discuss preventative medication with your vet."],
      recommendedVaccinations: species === "dog" ? ["Rabies", "DHPP (Distemper, Parvovirus)", "Bordetella"] : species === "cat" ? ["Rabies", "FVRCP", "FeLV"] : ["Consult an avian/exotic vet for species-specific vaccines."],
      healthMonitoring: [`Monitor ${name}'s appetite, water intake, and energy levels daily.`, "Check for unusual lumps, skin issues, or changes in coat condition weekly.", "Weigh monthly and compare to vet's ideal weight range."],
      vetVisitFrequency: "Annual check-up recommended; bi-annual for pets over 7 years.",
      dentalCare: "Brush teeth 2–3× per week using pet-safe toothpaste.",
      parasitePrevention: "Apply monthly flea/tick prevention. Discuss heartworm prevention with vet.",
    },
    groomingPlan: {
      brushingFrequency: "2–3 times per week.",
      bathingFrequency: "Every 4–6 weeks or as needed.",
      nailTrimming: "Every 3–4 weeks.",
      earCleaning: "Monthly, or as advised by vet.",
      extraTips: ["Check between paw pads for debris after walks.", "Use a damp cloth to clean around eyes weekly."],
    },
    behaviouralPlan: {
      trainingTips: [`Use positive reinforcement with ${name} — reward good behaviour immediately.`, "Keep training sessions short (5–10 minutes) and consistent.", "Be patient and consistent with commands."],
      mentalStimulation: ["Rotate toys weekly to maintain novelty and engagement.", "Use puzzle feeders at mealtimes.", "Practice obedience commands for 10 minutes daily."],
      socialisation: ["Arrange regular playdates or visits to dog-friendly areas.", "Expose gradually to new environments, sounds, and people."],
    },
    uniqueInsight: `${data.breed || species} pets are known for forming very strong bonds with their primary caretaker. Creating a predictable routine is the single most effective way to reduce stress and build trust with ${name}.`,
    uniqueInsightTitle: `The Power of Routine for ${data.breed || species}s`,
    emergencyChecklist: [
      `If ${name} ingests a toxic substance, call your vet immediately: ${data.vetPhone || "your local emergency vet"}.`,
      "Note the time and quantity of what was ingested before calling.",
      data.vetName ? `Primary vet: ${data.vetName} — ${data.vetPhone || ""}` : "Locate your nearest 24-hour emergency vet.",
      data.emergencyContact ? `Contact emergency person: ${data.emergencyContact} at ${data.emergencyPhone || "their number"}.` : "Have an emergency contact list prepared.",
    ],
    generatedAt: new Date().toISOString(),
    model: "fallback",
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * generateCarePlan
 *
 * Sends the pet profile to the Gemini API and returns a rich, AI-generated
 * care plan. Falls back gracefully to locally derived content if the API
 * key is unavailable.
 *
 * @param data  - Validated pet form data collected from the user.
 * @returns     - A fully populated GeminiCarePlan.
 */
export async function generateCarePlan(data: PetFormData): Promise<GeminiCarePlan> {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  const GEMINI_MODEL = "gemini-1.5-flash";

  // ── No API key: use rich fallback ─────────────────────────────────────────
  if (!GEMINI_API_KEY) {
    console.warn("⚠️  VITE_GEMINI_API_KEY not set — using local fallback plan.");
    await new Promise(r => setTimeout(r, 1800 + Math.random() * 800));
    return buildFallbackPlan(data);
  }

  // ── Call Gemini REST API ───────────────────────────────────────────────────
  const prompt = buildPrompt(data);

  console.group("🤖 Gemini API — generateCarePlan");
  console.log("Model:", GEMINI_MODEL);
  console.log("Prompt:\n", prompt);
  console.groupEnd();

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
      responseMimeType: "application/json",
    },
  };

  let raw: string;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API error ${res.status}: ${errText}`);
    }
    const json = await res.json();
    raw = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  } catch (err) {
    console.error("Gemini API call failed — using fallback:", err);
    return buildFallbackPlan(data);
  }

  // ── Parse JSON response ────────────────────────────────────────────────────
  let aiFields: Partial<GeminiCarePlan>;
  try {
    // Strip potential markdown fences
    const cleaned = raw.replace(/^```json\n?/, "").replace(/```$/, "").trim();
    aiFields = JSON.parse(cleaned);
  } catch {
    console.error("Could not parse Gemini JSON — using fallback:", raw);
    return buildFallbackPlan(data);
  }

  const plan: GeminiCarePlan = {
    ...buildFallbackPlan(data),  // safe defaults
    ...aiFields,                  // override with AI content
    ...data,                      // always preserve original form data
    generatedAt: new Date().toISOString(),
    model: GEMINI_MODEL,
  };

  console.log("✅ Gemini plan received:", plan);
  return plan;
}
