import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Rocket, DollarSign, Calendar, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const milestones = [
  { label: "Gründer-Kapitaleinlage", amount: "500.000 €", done: true },
  { label: "Pre-Seed-Runde", amount: "1.300.000 €", done: true },
  { label: "Gefördertes Bank-Darlehen", amount: "1.000.000 €", done: false },
  { label: "Seed-Runde (bei Bedarf 06/2027)", amount: "TBD", done: false },
];

const stats = [
  { icon: DollarSign, label: "SaaS-Modell", value: "499 €/User/Monat" },
  { icon: Target, label: "EBITDA-Marge", value: ">90 % ab 2028" },
  { icon: Calendar, label: "Runway", value: "25 Monate" },
  { icon: TrendingUp, label: "Prognostizierter Gewinn 2029", value: "31,4 Mio. €" },
];

export default function FinanzierungPage() {
  return (
    <Layout compact>
      <div className="container py-16">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold">Finanzierungsstatus</h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            Mehrere Investor:innen unterstützen die Weiterentwicklung von eli-flow.
            Ihr Kapital ermöglicht den Ausbau weiterer Features und die Skalierung.
          </p>
        </div>

        <div className="mx-auto max-w-4xl space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="p-5 text-center">
                  <s.icon className="mx-auto h-6 w-6 text-elivyon-navy" />
                  <p className="mt-2 text-lg font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="p-8">
            <h2 className="font-display text-2xl font-bold mb-6">Finanzierungsrunden</h2>
            <div className="space-y-6">
              {milestones.map((m, i) => (
                <div key={m.label} className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full shrink-0 ${m.done ? "bg-elivyon-navy/10 text-elivyon-navy" : "bg-muted text-muted-foreground"}`}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{m.label}</span>
                      <span className="font-semibold text-sm">{m.amount}</span>
                    </div>
                    <Progress value={m.done ? 100 : 0} className="mt-2 h-2" />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-8 bg-elivyon-navy text-white">
            <div className="flex items-start gap-4">
              <Rocket className="h-8 w-8 text-elivyon-yellow shrink-0" />
              <div>
                <h3 className="font-display text-xl font-bold">Skalierungsperspektive</h3>
                <p className="mt-2 text-sm opacity-90">
                  5-Jahres-Vision: Plattform für DACH → EU → Global.
                  Erweiterung auf alle Facharztgruppen und Kliniken.
                  Erzielbarer Umsatz-Marktanteil allein in Deutschland: ~42 Mio. € innerhalb von 5–8 Jahren.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
