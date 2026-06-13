"""
generate_plan.py
================
Backend script for Snuggle Steward — Pet Care Plan Generator.

Uses the Google Gemini API (gemini-1.5-flash) to analyse a pet's profile
and return a fully structured, AI-generated care plan in JSON format,
covering:
  - AI summary & top care tips
  - Detailed daily schedule (7 time slots)
  - Feeding & nutrition plan (with foods to avoid, hydration tips)
  - Medical & health plan (medications, vaccinations, monitoring, dental)
  - Grooming schedule
  - Behavioural & mental-stimulation plan
  - Unique breed/species-specific AI insight
  - Emergency action checklist

Requirements:
    pip install google-generativeai python-dotenv

Usage:
    python generate_plan.py

Environment Variables (set in .env file):
    GEMINI_API_KEY=<your-google-gemini-api-key>
"""

import os
import json
import textwrap
from datetime import datetime

# ---------------------------------------------------------------------------
# Load environment variables from .env file
# ---------------------------------------------------------------------------
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # dotenv is optional; you can also export GEMINI_API_KEY directly

# ---------------------------------------------------------------------------
# Gemini SDK
# ---------------------------------------------------------------------------
try:
    import google.generativeai as genai
except ImportError:
    raise SystemExit(
        "\n google-generativeai is not installed.\n"
        "Run:  pip install google-generativeai\n"
    )

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL   = "gemini-1.5-flash"

if not GEMINI_API_KEY:
    raise SystemExit(
        "\n[ERROR] GEMINI_API_KEY is not set.\n"
        "Create a .env file in this directory with:\n"
        "  GEMINI_API_KEY=your_api_key_here\n"
        "Or export it as an environment variable.\n"
    )

genai.configure(api_key=GEMINI_API_KEY)

# ---------------------------------------------------------------------------
# Pet Profile — edit this to match the sitter's input
# ---------------------------------------------------------------------------

PET_PROFILE = {
    "petName":          "Buddy",
    "species":          "Dog",
    "breed":            "Golden Retriever",
    "age":              "3 years",
    "weight":           "30 kg",
    "gender":           "Male",
    "color":            "Golden",
    "personality":      "Friendly, energetic, loves to fetch and cuddle",
    "feedingMorning":   "1 cup dry kibble + half a cup of wet food at 8 AM",
    "feedingEvening":   "1 cup dry kibble at 6 PM",
    "allergies":        "Chicken, grapes, onions",
    "medications":      "Heartworm prevention pill — give on the 1st of every month",
    "vetName":          "Dr. Sarah Mitchell",
    "vetPhone":         "(555) 123-4567",
    "vetAddress":       "Paws & Claws Clinic, 123 Oak Avenue",
    "emergencyContact": "Alex (Owner)",
    "emergencyPhone":   "(555) 987-6543",
    "walkSchedule":     "Morning walk 30 min at 9 AM • Evening walk 20 min at 7:30 PM",
    "specialNotes":     "Uses a front-clip harness. No off-leash near roads.",
    "alerts": [
        {"title": "Allergic to Chicken", "description": "Do NOT feed any chicken-based treats or food."},
        {"title": "Fear of Thunder",     "description": "Needs comfort toy and calming music during storms."},
    ],
}

# ---------------------------------------------------------------------------
# Prompt builder
# ---------------------------------------------------------------------------

def build_prompt(profile: dict) -> str:
    """
    Constructs the comprehensive structured prompt sent to the Gemini API.
    Instructs the model to return a fully populated JSON care plan covering
    medical, feeding, schedule, grooming, behavioural, and unique insights.
    """
    alerts_text = "\n".join(
        f"  - {a['title']}: {a['description']}"
        for a in profile.get("alerts", [])
    ) or "  None"

    prompt = textwrap.dedent(f"""
        You are an expert veterinary care assistant and animal behaviourist
        specialising in personalised pet care plans.

        A pet owner has provided the following profile. Your task is to generate
        a comprehensive, actionable, and genuinely helpful care plan that a
        pet-sitter or owner can follow every day. Be specific to the species,
        breed, age, weight, and all other data provided — do NOT give generic advice.

        ── PET PROFILE ──────────────────────────────────────────────────────────
        Name            : {profile['petName']}
        Species         : {profile['species']}
        Breed           : {profile.get('breed', 'Unknown')}
        Age             : {profile.get('age', 'Unknown')}
        Weight          : {profile.get('weight', 'Unknown')}
        Gender          : {profile.get('gender', 'Unknown')}
        Color/Markings  : {profile.get('color', 'Not specified')}
        Personality     : {profile.get('personality', 'Not described')}

        Feeding
          Morning       : {profile.get('feedingMorning', 'Not specified')}
          Evening       : {profile.get('feedingEvening', 'Not specified')}
          Allergies     : {profile.get('allergies', 'None known')}
          Medications   : {profile.get('medications', 'None')}

        Daily Routine
          Walks/Exercise: {profile.get('walkSchedule', 'Not specified')}
          Special Notes : {profile.get('specialNotes', 'None')}

        Vet & Emergency
          Vet           : {profile.get('vetName', 'Not provided')} — {profile.get('vetPhone', '')}
          Vet Address   : {profile.get('vetAddress', 'Not provided')}
          Emergency     : {profile.get('emergencyContact', 'Not provided')} — {profile.get('emergencyPhone', '')}

        Important Alerts:
        {alerts_text}
        ─────────────────────────────────────────────────────────────────────────

        Respond ONLY with valid JSON matching this exact schema — no markdown, no extra text:
        {{
            "aiSummary": "<2–3 sentence warm professional summary tailored to THIS pet>",
            "aiTips": [
                "<tip 1 — breed/species/age specific>",
                "<tip 2 — allergy or medication specific if applicable>",
                "<tip 3>",
                "<tip 4>",
                "<tip 5>"
            ],
            "dailySchedule": [
                {{"time": "6:30 AM", "activity": "Wake-up & Morning Stretch", "detail": "<specific instruction>"}},
                {{"time": "8:00 AM", "activity": "Morning Feeding",           "detail": "<exact feeding instruction from profile>"}},
                {{"time": "9:00 AM", "activity": "Morning Walk / Exercise",   "detail": "<exercise instruction based on breed & walkSchedule>"}},
                {{"time": "12:00 PM","activity": "Midday Check-in",           "detail": "<midday care for this species>"}},
                {{"time": "6:00 PM", "activity": "Evening Feeding",           "detail": "<exact evening feeding instruction>"}},
                {{"time": "7:30 PM", "activity": "Evening Walk & Wind Down",  "detail": "<evening routine>"}},
                {{"time": "9:00 PM", "activity": "Bedtime Routine",           "detail": "<bedtime care specific to personality/alerts>"}}
            ],
            "feedingPlan": {{
                "morning": "<morning meal with exact portions if provided>",
                "midday": "<midday snack if appropriate for species/age>",
                "evening": "<evening meal details>",
                "snacks": "<safe treat recommendations for this species & allergy profile>",
                "foodsToAvoid": ["<food 1>", "<food 2>", "<food 3>"],
                "hydrationTip": "<specific hydration advice for this breed/age/weight>"
            }},
            "medicalPlan": {{
                "currentMedications": ["<medication from profile with exact schedule>"],
                "medicationReminders": ["<practical reminder tip>"],
                "recommendedVaccinations": ["<core vaccine 1>", "<core vaccine 2>", "<optional if relevant>"],
                "healthMonitoring": ["<breed-specific health sign 1>", "<sign 2>", "<sign 3>"],
                "vetVisitFrequency": "<age-appropriate recommendation>",
                "dentalCare": "<dental advice for this species>",
                "parasitePrevention": "<flea/tick/heartworm advice for this species>"
            }},
            "groomingPlan": {{
                "brushingFrequency": "<based on breed coat type>",
                "bathingFrequency": "<based on species and activity>",
                "nailTrimming": "<frequency and tip>",
                "earCleaning": "<frequency and method>",
                "extraTips": ["<breed-specific grooming tip 1>", "<tip 2>"]
            }},
            "behaviouralPlan": {{
                "trainingTips": ["<tip 1 for this age/personality>", "<tip 2>", "<tip 3>"],
                "mentalStimulation": ["<species-specific activity 1>", "<activity 2>", "<activity 3>"],
                "socialisation": ["<advice 1>", "<advice 2>"],
                "anxietyManagement": "<if alerts or personality suggest fear/anxiety>"
            }},
            "uniqueInsight": "<A fascinating, genuinely useful fact or tip for this exact breed and age that most owners don't know. Be specific and practical.>",
            "uniqueInsightTitle": "<A short punchy title, e.g. 'Golden Retriever Joint Health Secret'>",
            "emergencyChecklist": [
                "<action 1 — e.g. what to do if pet ingests known allergen>",
                "<action 2>",
                "<action 3 — include vet name/phone from profile>",
                "<action 4>"
            ]
        }}
    """).strip()

    return prompt

# ---------------------------------------------------------------------------
# Main — call Gemini and return the result
# ---------------------------------------------------------------------------

def generate_care_plan(profile: dict) -> dict:
    """
    Sends the pet profile to the Gemini API and returns the parsed care plan.

    Args:
        profile: Dictionary containing all pet information.

    Returns:
        A dictionary with all sections of the care plan including medical,
        feeding, daily schedule, grooming, behavioural, and unique AI insights.
    """
    model  = genai.GenerativeModel(GEMINI_MODEL)
    prompt = build_prompt(profile)

    print(f"\n{'='*65}")
    print(f"  Snuggle Steward — Gemini AI Care Plan Generator")
    print(f"  Model   : {GEMINI_MODEL}")
    print(f"  Pet     : {profile['petName']} ({profile['species']} / {profile.get('breed', '?')})")
    print(f"  Age     : {profile.get('age', '?')}   Weight: {profile.get('weight', '?')}")
    print(f"  Time    : {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*65}\n")
    print("⏳ Sending request to Gemini API...\n")

    response = model.generate_content(
        prompt,
        generation_config=genai.types.GenerationConfig(
            temperature=0.7,
            max_output_tokens=2048,
            response_mime_type="application/json",
        ),
    )

    raw_text = response.text.strip()

    # Parse JSON response
    try:
        plan = json.loads(raw_text)
    except json.JSONDecodeError:
        # Fallback: try to extract JSON block if the model wrapped it
        import re
        match = re.search(r"\{.*\}", raw_text, re.DOTALL)
        if match:
            plan = json.loads(match.group())
        else:
            raise ValueError(f"Could not parse JSON from Gemini response:\n{raw_text}")

    plan["generatedAt"] = datetime.now().isoformat()
    plan["petName"]     = profile["petName"]
    plan["model"]       = GEMINI_MODEL

    return plan


def print_plan(plan: dict) -> None:
    """Pretty-prints the full generated care plan to the console."""
    print("✅ Care plan generated successfully!\n")
    print(f"{'─'*65}")
    print(f"  {plan['petName']}'s AI-Generated Care Plan")
    print(f"  Generated at: {plan['generatedAt']}")
    print(f"{'─'*65}\n")

    # AI Summary
    print("📋 AI Summary")
    print(f"   {plan.get('aiSummary', 'N/A')}\n")

    # Daily Schedule
    schedule = plan.get("dailySchedule", [])
    if schedule:
        print("🕐 Daily Schedule")
        for slot in schedule:
            print(f"   {slot.get('time',''):10} | {slot.get('activity',''):28} | {slot.get('detail','')}")
        print()

    # Feeding Plan
    feeding = plan.get("feedingPlan", {})
    if feeding:
        print("🍖 Feeding & Nutrition Plan")
        for key in ["morning", "midday", "evening", "snacks"]:
            val = feeding.get(key)
            if val:
                print(f"   {key.capitalize():10}: {val}")
        if feeding.get("hydrationTip"):
            print(f"   💧 Hydration : {feeding['hydrationTip']}")
        avoid = feeding.get("foodsToAvoid", [])
        if avoid:
            print(f"   ⚠️  Avoid     : {', '.join(avoid)}")
        print()

    # Medical Plan
    medical = plan.get("medicalPlan", {})
    if medical:
        print("🏥 Medical & Health Plan")
        for med in medical.get("currentMedications", []):
            print(f"   💊 Medication : {med}")
        for rem in medical.get("medicationReminders", []):
            print(f"   ⏰ Reminder   : {rem}")
        for h in medical.get("healthMonitoring", []):
            print(f"   🔍 Monitor    : {h}")
        print(f"   📅 Vet Visits : {medical.get('vetVisitFrequency','')}")
        print(f"   🦷 Dental     : {medical.get('dentalCare','')}")
        print(f"   🛡️  Parasites  : {medical.get('parasitePrevention','')}")
        vaccs = medical.get("recommendedVaccinations", [])
        if vaccs:
            print(f"   💉 Vaccines   : {', '.join(vaccs)}")
        print()

    # Grooming
    grooming = plan.get("groomingPlan", {})
    if grooming:
        print("✂️  Grooming Schedule")
        print(f"   Brushing  : {grooming.get('brushingFrequency','')}")
        print(f"   Bathing   : {grooming.get('bathingFrequency','')}")
        print(f"   Nails     : {grooming.get('nailTrimming','')}")
        print(f"   Ears      : {grooming.get('earCleaning','')}")
        for tip in grooming.get("extraTips", []):
            print(f"   • {tip}")
        print()

    # Behavioural
    behav = plan.get("behaviouralPlan", {})
    if behav:
        print("🧠 Behavioural & Mental Stimulation")
        for tip in behav.get("trainingTips", []):
            print(f"   🎯 Training : {tip}")
        for act in behav.get("mentalStimulation", []):
            print(f"   🧩 Mental   : {act}")
        if behav.get("anxietyManagement"):
            print(f"   😰 Anxiety  : {behav['anxietyManagement']}")
        print()

    # AI Tips
    tips = plan.get("aiTips", [])
    if tips:
        print("💡 Top AI Care Tips")
        for i, tip in enumerate(tips, 1):
            print(f"   {i}. {tip}")
        print()

    # Unique Insight
    if plan.get("uniqueInsight"):
        print(f"⭐ {plan.get('uniqueInsightTitle','Unique Insight')}")
        print(f"   {plan['uniqueInsight']}\n")

    # Emergency Checklist
    emergency = plan.get("emergencyChecklist", [])
    if emergency:
        print("🚨 Emergency Action Checklist")
        for item in emergency:
            print(f"   ⚠️  {item}")
        print()

    print("📄 Full JSON Output")
    print(json.dumps(plan, indent=2, ensure_ascii=False))


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    plan = generate_care_plan(PET_PROFILE)
    print_plan(plan)
