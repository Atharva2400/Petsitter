import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { GeminiCarePlan } from "@/lib/geminiService";
import {
  Download, ArrowLeft, PawPrint, Stethoscope, Phone,
  UtensilsCrossed, Pill, AlertTriangle, Clock, FileText,
  Sparkles, Heart, Scissors, Brain, ShieldAlert, Droplets,
  CheckCircle2, Star, Zap, Info, PenLine,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface CarePlanReportProps {
  data: GeminiCarePlan;
  onBack: () => void;
  isSample?: boolean;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const Section = ({
  icon: Icon,
  title,
  color = "primary",
  children,
}: {
  icon: React.ElementType;
  title: string;
  color?: string;
  children: React.ReactNode;
}) => (
  <div className={`rounded-xl border border-l-4 border-l-${color} bg-card p-6`}>
    <div className="flex items-center gap-3 mb-4">
      <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-${color}/10`}>
        <Icon className={`h-5 w-5 text-${color}`} />
      </div>
      <h3 className="text-lg font-bold">{title}</h3>
    </div>
    {children}
  </div>
);

const Bullet = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-2 text-sm text-muted-foreground">
    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
    <span>{children}</span>
  </li>
);

// ── Main Component ────────────────────────────────────────────────────────────

const CarePlanReport = ({ data, onBack, isSample = false }: CarePlanReportProps) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#faf7f2",
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const ratio = pdfWidth / canvas.width;
    const totalHeight = canvas.height * ratio;
    let position = 0;
    while (position < totalHeight) {
      if (position > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, -position, pdfWidth, totalHeight);
      position += pdfHeight;
    }
    const filename = isSample
      ? "SAMPLE-buddy-golden-retriever-care-plan.pdf"
      : `${data.petName || "pet"}-care-plan.pdf`;
    pdf.save(filename);
  };

  const hasAiContent = data.model !== undefined;

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">

        {/* ── Sample Report Notice Banner ─────────────────────────────── */}
        {isSample && (
          <div className="max-w-4xl mx-auto mb-6 rounded-2xl border-2 border-amber-400/60 bg-amber-50 dark:bg-amber-950/30 p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50">
                <Info className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <p className="font-extrabold text-amber-800 dark:text-amber-300 text-base mb-1">
                  📋 You are viewing a SAMPLE REPORT
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
                  This is a demo care plan generated for a sample Golden Retriever named <strong>Buddy</strong>. It shows you exactly what your personalised plan will look like.
                  To generate and download your own pet's plan, go back and fill in your pet's details. The downloaded PDF will also be stamped with <strong>"SAMPLE REPORT"</strong>.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 border-amber-400/60 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 font-bold"
                onClick={onBack}
              >
                <PenLine className="h-4 w-4 mr-2" />
                Fill My Pet's Details
              </Button>
            </div>
          </div>
        )}

        {/* Top Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 max-w-4xl mx-auto">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" /> {isSample ? "Back to Form" : "Edit Details"}
          </Button>
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-primary/5 border border-primary/20 rounded-full px-4 py-2">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            {isSample ? (
              <span className="text-amber-600 dark:text-amber-400 font-semibold">⚠️ Sample Report — Fill form for your pet's plan</span>
            ) : (
              <>AI-powered plan — personalised for {data.petName}</>
            )}
          </div>
          <Button onClick={downloadPDF} className="font-bold" variant={isSample ? "outline" : "default"}>
            <Download className="h-4 w-4 mr-2" /> {isSample ? "Download Sample PDF" : "Download PDF"}
          </Button>
        </div>

        {/* Report Content */}
        <div ref={reportRef} className="max-w-4xl mx-auto bg-background rounded-2xl border shadow-card overflow-hidden">

          {/* ── Sample Watermark Header ──────────────────────────────── */}
          {isSample && (
            <div className="bg-amber-400/90 dark:bg-amber-600/90 py-3 px-6 text-center">
              <p className="text-amber-900 dark:text-amber-100 font-extrabold text-sm tracking-widest uppercase">
                ⚠️ SAMPLE REPORT — For demonstration purposes only. Fill in your pet's details to get your personalised plan.
              </p>
            </div>
          )}

          {/* ── Header ─────────────────────────────────────────────────── */}
          <div className="gradient-hero p-8 text-center border-b">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 mb-4">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-primary">
                {isSample ? "📋 Sample AI-Generated Pet Care Plan" : "AI-Generated Pet Care Plan"}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
              {data.petName}'s Care Plan 🐾
            </h1>
            <p className="text-muted-foreground text-sm">
              Generated on {new Date(data.generatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              {data.model && data.model !== "fallback" && data.model !== "sample" && <span className="ml-2 text-primary">• {data.model}</span>}
              {isSample && <span className="ml-2 font-bold text-amber-600 dark:text-amber-400"> • SAMPLE DATA</span>}
            </p>
          </div>

          <div className="p-6 md:p-8 space-y-8">

            {/* ── Pet Profile ──────────────────────────────────────────── */}
            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <PawPrint className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold">{data.petName}</h2>
                  <p className="text-sm text-muted-foreground">
                    {[data.breed, data.species, data.gender].filter(Boolean).join(" • ")}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Age", value: data.age },
                  { label: "Weight", value: data.weight },
                  { label: "Color", value: data.color },
                  { label: "Species", value: data.species },
                ].filter(i => i.value).map(item => (
                  <div key={item.label} className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-bold">{item.value}</p>
                  </div>
                ))}
              </div>
              {data.personality && (
                <div className="mt-4 rounded-lg bg-primary/5 border border-primary/10 p-4">
                  <p className="text-sm font-semibold mb-1 flex items-center gap-1.5">
                    <Heart className="h-3.5 w-3.5 text-primary" /> Personality
                  </p>
                  <p className="text-sm text-muted-foreground">{data.personality}</p>
                </div>
              )}
            </div>

            {/* ── AI Summary ───────────────────────────────────────────── */}
            {data.aiSummary && (
              <div className="rounded-xl border bg-gradient-to-br from-primary/5 to-primary/10 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-bold">AI Care Summary</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{data.aiSummary}</p>
              </div>
            )}

            {/* ── Unique AI Insight ─────────────────────────────────────── */}
            {data.uniqueInsight && (
              <div className="rounded-xl border-2 border-yellow-400/40 bg-yellow-50 dark:bg-yellow-950/20 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <h3 className="text-lg font-bold text-yellow-700 dark:text-yellow-400">
                    {data.uniqueInsightTitle || "Unique AI Insight"}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-yellow-800 dark:text-yellow-200">{data.uniqueInsight}</p>
              </div>
            )}

            {/* ── Daily Schedule ────────────────────────────────────────── */}
            {data.dailySchedule?.length > 0 && (
              <Section icon={Clock} title="Daily Schedule" color="secondary">
                <div className="space-y-3">
                  {data.dailySchedule.map((slot, i) => (
                    <div key={i} className="flex gap-4 items-start rounded-lg bg-muted/30 p-3">
                      <div className="text-xs font-bold text-primary bg-primary/10 rounded-md px-2 py-1 whitespace-nowrap min-w-[72px] text-center">
                        {slot.time}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{slot.activity}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{slot.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* ── Feeding Plan ──────────────────────────────────────────── */}
            {data.feedingPlan && (
              <Section icon={UtensilsCrossed} title="Feeding & Nutrition Plan" color="primary">
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { label: "🌅 Morning", value: data.feedingPlan.morning },
                      { label: "🌙 Evening", value: data.feedingPlan.evening },
                      { label: "☀️ Midday", value: data.feedingPlan.midday },
                      { label: "🍬 Snacks / Treats", value: data.feedingPlan.snacks },
                    ].filter(i => i.value).map(item => (
                      <div key={item.label} className="rounded-lg bg-muted/40 p-3">
                        <p className="text-xs font-bold text-muted-foreground">{item.label}</p>
                        <p className="text-sm mt-1">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  {data.feedingPlan.hydrationTip && (
                    <div className="flex items-start gap-2 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-3">
                      <Droplets className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-blue-700 dark:text-blue-300">{data.feedingPlan.hydrationTip}</p>
                    </div>
                  )}
                  {data.feedingPlan.foodsToAvoid?.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                        <AlertTriangle className="h-4 w-4 text-destructive" /> Foods to Avoid
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {data.feedingPlan.foodsToAvoid.map((f, i) => (
                          <span key={i} className="text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20 rounded-full px-3 py-1">
                            ✕ {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Section>
            )}

            {/* ── Medical Plan ──────────────────────────────────────────── */}
            {data.medicalPlan && (
              <Section icon={Stethoscope} title="Medical & Health Plan" color="accent">
                <div className="space-y-5">
                  {data.medicalPlan.currentMedications?.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                        <Pill className="h-4 w-4 text-accent" /> Current Medications
                      </p>
                      <ul className="space-y-1">
                        {data.medicalPlan.currentMedications.map((m, i) => <Bullet key={i}>{m}</Bullet>)}
                      </ul>
                    </div>
                  )}
                  {data.medicalPlan.medicationReminders?.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold mb-2">⏰ Medication Reminders</p>
                      <ul className="space-y-1">
                        {data.medicalPlan.medicationReminders.map((r, i) => <Bullet key={i}>{r}</Bullet>)}
                      </ul>
                    </div>
                  )}
                  <div className="grid sm:grid-cols-2 gap-4">
                    {data.medicalPlan.vetVisitFrequency && (
                      <div className="rounded-lg bg-muted/40 p-3">
                        <p className="text-xs font-bold text-muted-foreground mb-1">Vet Visit Frequency</p>
                        <p className="text-sm">{data.medicalPlan.vetVisitFrequency}</p>
                      </div>
                    )}
                    {data.medicalPlan.dentalCare && (
                      <div className="rounded-lg bg-muted/40 p-3">
                        <p className="text-xs font-bold text-muted-foreground mb-1">Dental Care</p>
                        <p className="text-sm">{data.medicalPlan.dentalCare}</p>
                      </div>
                    )}
                    {data.medicalPlan.parasitePrevention && (
                      <div className="rounded-lg bg-muted/40 p-3 sm:col-span-2">
                        <p className="text-xs font-bold text-muted-foreground mb-1">Parasite Prevention</p>
                        <p className="text-sm">{data.medicalPlan.parasitePrevention}</p>
                      </div>
                    )}
                  </div>
                  {data.medicalPlan.healthMonitoring?.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold mb-2">🔍 Health Monitoring — Watch For</p>
                      <ul className="space-y-1">
                        {data.medicalPlan.healthMonitoring.map((h, i) => <Bullet key={i}>{h}</Bullet>)}
                      </ul>
                    </div>
                  )}
                  {data.medicalPlan.recommendedVaccinations?.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold mb-2">💉 Recommended Vaccinations</p>
                      <div className="flex flex-wrap gap-2">
                        {data.medicalPlan.recommendedVaccinations.map((v, i) => (
                          <span key={i} className="text-xs bg-accent/10 text-accent border border-accent/20 rounded-full px-3 py-1 font-medium">{v}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Section>
            )}

            {/* ── Grooming Plan ─────────────────────────────────────────── */}
            {data.groomingPlan && (
              <Section icon={Scissors} title="Grooming Schedule" color="secondary">
                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                  {[
                    { label: "Brushing", value: data.groomingPlan.brushingFrequency },
                    { label: "Bathing", value: data.groomingPlan.bathingFrequency },
                    { label: "Nail Trimming", value: data.groomingPlan.nailTrimming },
                    { label: "Ear Cleaning", value: data.groomingPlan.earCleaning },
                  ].filter(i => i.value).map(item => (
                    <div key={item.label} className="rounded-lg bg-muted/40 p-3">
                      <p className="text-xs font-bold text-muted-foreground">{item.label}</p>
                      <p className="text-sm mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
                {data.groomingPlan.extraTips?.length > 0 && (
                  <ul className="space-y-1">
                    {data.groomingPlan.extraTips.map((t, i) => <Bullet key={i}>{t}</Bullet>)}
                  </ul>
                )}
              </Section>
            )}

            {/* ── Behavioural Plan ──────────────────────────────────────── */}
            {data.behaviouralPlan && (
              <Section icon={Brain} title="Behavioural & Mental Stimulation" color="primary">
                <div className="space-y-4">
                  {data.behaviouralPlan.anxietyManagement && (
                    <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-3">
                      <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">Anxiety & Comfort</p>
                      <p className="text-sm text-amber-800 dark:text-amber-200">{data.behaviouralPlan.anxietyManagement}</p>
                    </div>
                  )}
                  {data.behaviouralPlan.trainingTips?.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold mb-2">🎯 Training Tips</p>
                      <ul className="space-y-1">
                        {data.behaviouralPlan.trainingTips.map((t, i) => <Bullet key={i}>{t}</Bullet>)}
                      </ul>
                    </div>
                  )}
                  {data.behaviouralPlan.mentalStimulation?.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold mb-2">🧩 Mental Stimulation</p>
                      <ul className="space-y-1">
                        {data.behaviouralPlan.mentalStimulation.map((t, i) => <Bullet key={i}>{t}</Bullet>)}
                      </ul>
                    </div>
                  )}
                  {data.behaviouralPlan.socialisation?.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold mb-2">🤝 Socialisation</p>
                      <ul className="space-y-1">
                        {data.behaviouralPlan.socialisation.map((t, i) => <Bullet key={i}>{t}</Bullet>)}
                      </ul>
                    </div>
                  )}
                </div>
              </Section>
            )}

            {/* ── Top AI Tips ───────────────────────────────────────────── */}
            {data.aiTips?.length > 0 && (
              <Section icon={Zap} title="Top AI Care Tips" color="primary">
                <ol className="space-y-3">
                  {data.aiTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        {i + 1}
                      </span>
                      <p className="text-sm text-muted-foreground">{tip}</p>
                    </li>
                  ))}
                </ol>
              </Section>
            )}

            {/* ── Emergency Checklist ───────────────────────────────────── */}
            {data.emergencyChecklist?.length > 0 && (
              <div className="rounded-xl border-2 border-destructive/30 bg-destructive/5 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldAlert className="h-6 w-6 text-destructive" />
                  <h3 className="text-lg font-bold text-destructive">Emergency Action Checklist</h3>
                </div>
                <ul className="space-y-2">
                  {data.emergencyChecklist.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ── Vet & Emergency Contacts ──────────────────────────────── */}
            {(data.vetName || data.emergencyContact) && (
              <div className="grid sm:grid-cols-2 gap-4">
                {data.vetName && (
                  <div className="rounded-xl border bg-card p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Stethoscope className="h-5 w-5 text-accent" />
                      <h3 className="font-bold">Veterinarian</h3>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p className="font-semibold text-foreground">{data.vetName}</p>
                      {data.vetPhone && <p>📞 {data.vetPhone}</p>}
                      {data.vetAddress && <p>📍 {data.vetAddress}</p>}
                    </div>
                  </div>
                )}
                {data.emergencyContact && (
                  <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Phone className="h-5 w-5 text-destructive" />
                      <h3 className="font-bold">Emergency Contact</h3>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p className="font-semibold text-foreground">{data.emergencyContact}</p>
                      {data.emergencyPhone && <p>📞 {data.emergencyPhone}</p>}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── User Alerts ────────────────────────────────────────────── */}
            {data.alerts?.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" /> Important Alerts
                </h3>
                {data.alerts.map((alert, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl border border-warning/40 bg-warning/5 p-4">
                    <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm">{alert.title}</p>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Footer ────────────────────────────────────────────────── */}
            <div className="text-center pt-4 border-t text-xs text-muted-foreground">
              <p>Generated by Snuggle Steward AI • {new Date().getFullYear()}</p>
              {hasAiContent && data.model !== "fallback" && (
                <p className="mt-1 text-primary/60">Powered by {data.model}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarePlanReport;
