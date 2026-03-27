import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { toast } from "sonner";

const plans = [
  {
    name: "Freemium",
    subtitle: "eli-flow",
    price: "0 €",
    period: "2 Wochen kostenlos",
    features: [
      "Nur Prophylaxe (PZR)",
      "PZR-Dokumentation",
      "Behandlungshistorie",
      "Kein E-Mail-Versand",
      "Keine PVS-Schnittstelle",
      "Kein Abo – endet automatisch",
    ],
    theme: "light" as const,
    cta: "Kostenlos testen",
  },
  {
    name: "Starter PZR",
    subtitle: "eli-flow",
    price: "120 €",
    period: "pro User / Monat",
    features: [
      "Alle Freemium-Features",
      "Nur PZR-Abrechnung",
      "PZR-optimiertes Zahnschema",
      "Best-Practice Abrechnungsvorauswahl",
      "E-Mail-Versand",
      "Keine PVS-Schnittstelle",
      "KI-gestützte Optimierung",
      "Compliance-Prüfung",
      "Prioritäts-Support",
      "Regelmäßige Updates",
    ],
    theme: "magenta" as const,
    cta: "Jetzt bestellen",
  },
  {
    name: "Full",
    subtitle: "eli-flow",
    price: "499 €",
    period: "pro User / Monat",
    features: [
      "Alle Starter-Features",
      "Alle Behandlungsarten",
      "KI-gestützte Optimierung",
      "Compliance-Prüfung",
      "Prioritäts-Support",
      "Unbegrenzte Patient:innen",
      "Regelmäßige Updates",
    ],
    theme: "navy" as const,
    cta: "Jetzt bestellen",
  },
];

const themeStyles = {
  light: {
    card: "bg-secondary text-foreground",
    badge: "",
    check: "text-elivyon-navy",
    featureText: "",
    button: "bg-elivyon-navy text-white hover:opacity-90",
    subtitle: "text-elivyon-magenta",
  },
  magenta: {
    card: "bg-elivyon-magenta text-white",
    badge: "",
    check: "text-elivyon-yellow",
    featureText: "opacity-90",
    button: "bg-elivyon-yellow text-elivyon-navy hover:opacity-90",
    subtitle: "text-elivyon-yellow",
  },
  navy: {
    card: "bg-elivyon-navy text-white",
    badge: "absolute top-6 right-6 rounded-full bg-elivyon-yellow px-3 py-1 text-xs font-medium text-elivyon-navy",
    check: "text-elivyon-yellow",
    featureText: "opacity-80",
    button: "bg-elivyon-yellow text-elivyon-navy hover:opacity-90",
    subtitle: "text-elivyon-yellow",
  },
};

export default function BestellenPage() {
  return (
    <Layout compact>
      <div className="container py-20">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-5xl font-semibold tracking-tight md:text-6xl"
          >
            Finden Sie Ihren Plan.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            Starten Sie kostenlos – upgraden Sie, wenn Sie bereit sind.
          </motion.p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {plans.map((plan, i) => {
            const style = themeStyles[plan.theme];
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className={`relative rounded-2xl p-8 h-full flex flex-col ${style.card}`}
              >
                {plan.theme === "navy" && (
                  <span className={style.badge}>Empfohlen</span>
                )}
                <h2 className="text-sm font-medium opacity-60">{plan.name}</h2>
                <span className={`text-xs font-semibold ${style.subtitle}`}>{plan.subtitle}</span>
                <div className="mt-3">
                  <span className="text-5xl font-semibold tracking-tight">{plan.price}</span>
                  <span className="ml-2 text-sm opacity-50">{plan.period}</span>
                </div>
                <ul className="mt-8 space-y-3 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${style.check}`} />
                      <span className={style.featureText}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`mt-8 w-full rounded-full h-12 text-base font-medium ${style.button}`}
                  onClick={() => toast.success(`${plan.name}-Paket ausgewählt! (Prototyp)`)}
                >
                  {plan.cta} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
