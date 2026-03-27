import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Briefcase, GraduationCap, Code, Stethoscope, Star, Quote } from "lucide-react";
import fotoBarac from "@/assets/foto-barac.jpg";
import fotoHarrer from "@/assets/foto-harrer.jpg";

const founders = [
  {
    name: "Dr. med. dent. Dusan Barac",
    role: "CEO",
    motto: "Kunst kommt von Können – und Können schafft Erfolg",
    icon: Stethoscope,
    photo: fotoBarac,
    highlights: [
      "Abrechnungsexperte mit 20+ Jahren als Zahnarzt",
      "15 Jahre eigene Praxis in Bad Homburg",
      "Wirtschaftlich 3× erfolgreicher als vergleichbare Praxen",
      "Seit 3 Jahren 1:1-Coach für Gewinnmaximierung und Abrechnung",
      "Honorar bis zu 6.400 €/Tag – min. 30 Coaching-Tage pro Klient:in",
      "Tiefes Verständnis realer Praxisprozesse",
      "IT-versiert, fortgeschrittene Programmierkenntnisse seit fast 40 Jahren",
      "Strategisch relevante Fachkenntnisse in Steuer-, BWL- und Finanzthemen",
      "Fundierte Marketingkenntnisse – erfolgreich in eigener Praxis und im Coaching umgesetzt",
      "Nahezu einzigartige Kompetenzkombination: Medizin × BWL × IT",
    ],
  },
  {
    name: "Alexander C. Harrer",
    role: "COO",
    motto: "Semper prorsum",
    icon: Code,
    photo: fotoHarrer,
    highlights: [
      "Fast 30 Jahre Expertise im IT-Bereich",
      "20+ Jahre CEO einer Unternehmensberatung im IT-Projektmanagement",
      "Führungserfahrung bis 30 Personen",
      "Programm-Manager bei Enterprise-Unternehmen (>100 Mio. €)",
      "Turnaround-Management von Krisenprojekten",
      "Strategisches IT-Consulting",
      "Multi-Projekt-Management u.a. für Deutsche Bahn, Deutsche Telekom, Kaufland",
      "Infrastruktur- und Qualitätsmanagement",
      "Softwareentwicklung",
    ],
  },
];

const testimonials = [
  { name: "Dr. Ricarda Richter", praxis: "Hanau, Deutschland", text: "Das Coaching war ein Gamechanger. Durch Dusans klare Abrechnungssystematik habe ich erstmals verstanden, wo Umsatz liegen bleibt – und wie man ihn systematisch hebt. Innerhalb eines Jahres hat sein Ansatz bei uns sechsstellige Zusatzgewinne freigesetzt. Absolute Empfehlung!", stars: 5 },
  { name: "Dr. Patrick Weckwerth", praxis: "Bamberg, Deutschland", text: "Das System spart mir Zeit in der Dokumentation, erhöht die Abrechnungssicherheit und sorgt unterm Strich für mehr Gewinn.", stars: 5 },
  { name: "Dr. Daniel Krutsch", praxis: "Darmstadt, Deutschland", text: "Ich dachte immer, unsere Abrechnung sei solide – schließlich macht sie seit Jahren eine sehr erfahrene Mitarbeiterin. Erst durch das Coaching mit Dusan merkten wir, wie viel Potenzial wir verschenkten. Heute staunen wir beide über die erheblichen zusätzlichen Honorare, die wir erschließen. Zum ersten Mal macht mir Abrechnung und Dokumentation wirklich Freude.", stars: 5 },
  { name: "Dr. Silvia Welp", praxis: "Bingen, Deutschland", text: "Zu Beginn meiner Niederlassung fehlte mir die Orientierung – wirtschaftlich wie strukturell. Mit der richtigen Unterstützung habe ich gelernt, Abrechnung und Dokumentation gezielt einzusetzen. Heute läuft die Praxis stabil, ich habe wieder Freude an meinem Beruf und fühle mich sicher in meinen Entscheidungen.", stars: 5 },
  { name: "Dr. Alfonso Padilla", praxis: "Frankfurt, Deutschland", text: "Ich betreibe mehrere Praxen und hatte trotz externer professioneller Unterstützung ständig Ärger mit Erstattungen. Nach einem kurzen Vorabcoaching und wenigen gezielten Anpassungen hat sich die Zahl der Patientenbeschwerden drastisch reduziert. Das war beeindruckend – vor allem, weil es niemand vorher geschafft hat.", stars: 5 },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function TeamPage() {
  return (
    <Layout compact>
      {/* Hero */}
      <section className="gradient-hero py-16 md:py-20">
        <div className="container text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-display text-4xl font-bold text-white md:text-5xl">Die Gründer</h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-white/80 italic">
              Kein Wettbewerber deckt in vergleichbarer Tiefe die Kombination aus zahnärztlicher Expertise,
              Abrechnungskompetenz, Software-Projektmanagement und 20+ Jahre Zahnarztentwicklung, einem tiefen
              Verständnis realer Praxis-Workflows und operativer Praxisbedürfnisse sowie nachgewiesenem
              unternehmerischem Erfolg ab.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Founders */}
      <section className="py-16">
        <div className="container">
          <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
            {founders.map((f, i) => (
              <motion.div
                key={f.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <Card className="overflow-hidden h-full">
                  <div className="relative h-80 md:h-96 overflow-hidden bg-card">
                    <img src={f.photo} alt={f.name} className="h-full w-full object-cover object-center rounded-t-xl" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                    <div className="absolute bottom-4 left-6">
                      <h2 className="font-display text-xl font-bold text-foreground drop-shadow-sm">{f.name}</h2>
                      <p className="text-sm font-semibold text-elivyon-navy">{f.role}</p>
                    </div>
                  </div>

                  <div className="p-6 pt-4">
                    <p className="text-sm italic text-muted-foreground mb-4 border-l-2 border-elivyon-navy pl-3">„{f.motto}"</p>
                    <ul className="space-y-2">
                      {f.highlights.map(h => (
                        <li key={h} className="flex items-start gap-2 text-sm">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-elivyon-navy shrink-0" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="bg-muted py-12">
        <div className="container">
          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3 text-center">
            {[
              { value: "+105 %", label: "Ø Extra-Umsatz pro Behandlung" },
              { value: "+71 %", label: "Median Umsatzsteigerung" },
              { value: "100 %", label: "Gewinn-Marge auf den Extra-Umsatz" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="rounded-xl border border-border bg-card p-6"
              >
                <p className="font-display text-3xl font-bold text-elivyon-navy">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-center font-display text-3xl font-bold text-foreground md:text-4xl mb-12">
            Das sagen die Coaching-Klienten <span className="text-elivyon-navy">von Dr. Barac</span>
          </h2>
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="rounded-xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-elivyon-yellow text-elivyon-yellow" />
                  ))}
                </div>
                <Quote className="h-5 w-5 text-muted-foreground/40 mb-2" />
                <p className="text-sm leading-relaxed text-foreground">{t.text}</p>
                <div className="mt-4 border-t border-border pt-3">
                  <p className="font-semibold text-sm text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.praxis}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-muted-foreground italic">
            Extra-Umsatz pro Behandlung ▸ Median: +71 % ▸ Durchschnitt: +105 % — Gewinn-Marge: 100 %, da keine Mehrarbeit
          </p>
        </div>
      </section>
    </Layout>
  );
}
