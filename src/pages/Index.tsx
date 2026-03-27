import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Clock, TrendingUp, Shield, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

const testimonials = [
  {
    name: "Dr. Ricarda Richter",
    praxis: "Hanau",
    text: "Das Coaching war ein Gamechanger. Durch Dusans klare Abrechnungssystematik habe ich erstmals verstanden, wo Umsatz liegen bleibt. Innerhalb eines Jahres hat sein Ansatz bei uns sechsstellige Zusatzgewinne freigesetzt.",
    stars: 5,
  },
  {
    name: "Dr. Daniel Krutsch",
    praxis: "Darmstadt",
    text: "Ich dachte immer, unsere Abrechnung sei solide. Erst durch das Coaching merkten wir, wie viel Potenzial wir verschenkten. Zum ersten Mal macht mir Abrechnung und Dokumentation wirklich Freude.",
    stars: 5,
  },
  {
    name: "Dr. Alfonso Padilla",
    praxis: "Frankfurt",
    text: "Ich betreibe mehrere Praxen und hatte trotz externer professioneller Unterstützung ständig Ärger mit Erstattungen. Nach wenigen gezielten Anpassungen hat sich die Zahl der Patientenbeschwerden drastisch reduziert.",
    stars: 5,
  },
  {
    name: "Dr. Patrick Weckwerth",
    praxis: "Bamberg",
    text: "Das System spart mir Zeit in der Dokumentation, erhöht die Abrechnungssicherheit und sorgt unterm Strich für mehr Gewinn.",
    stars: 5,
  },
  {
    name: "Dr. Silvia Welp",
    praxis: "Bingen",
    text: "Heute läuft die Praxis stabil, ich habe wieder Freude an meinem Beruf und fühle mich sicher in meinen Entscheidungen.",
    stars: 5,
  },
];

const usps = [
  { icon: Clock, title: ">1 Stunde Zeitersparnis", desc: "Täglich für medizinisches Fachpersonal durch automatisierte Abrechnung & Dokumentation." },
  { icon: TrendingUp, title: ">30 % Umsatzsteigerung", desc: "Durch umfassende, regelkonforme Abrechnung – keine Leistung wird mehr vergessen." },
  { icon: Shield, title: "Compliance-Sicherheit", desc: "Eingebaute GOZ/GOÄ/BEB/BEMA/BEL II-Logik, automatische Validierung und Korrekturvorschläge." },
  { icon: Zap, title: "Sofort nutzbar", desc: "Keine Installation, keine Schulung – so einfach wie die Nutzung sozialer Medien." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const } }),
};

export default function LandingPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden py-28 md:py-40">
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="font-display text-5xl font-semibold leading-[1.08] tracking-tight text-white md:text-7xl">
              Die Zukunft der{" "}
              <span className="text-gradient">Abrechnung.</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/70 md:text-xl">
              Elivyon automatisiert Ihre Abrechnung und Dokumentation – compliant, intuitiv und hochprofitabel. Entwickelt in der Zahnmedizin für die Zahnmedizin.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="rounded-full bg-elivyon-yellow text-elivyon-navy hover:bg-elivyon-navy hover:text-white font-medium px-8 h-12 text-base transition-colors">
                <Link to="/dashboard">Jetzt testen <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" className="rounded-full bg-elivyon-magenta text-white hover:opacity-90 font-medium px-8 h-12 text-base">
                <Link to="/bestellen">Preise ansehen <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* USPs */}
      <section className="py-24 apple-section-light">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center font-display text-4xl font-semibold tracking-tight text-foreground md:text-5xl"
          >
            Mehr Zeit. Mehr Umsatz.
            <br />
            <span className="text-muted-foreground">Weniger Risiko.</span>
          </motion.h2>
          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {usps.map((usp, i) => (
              <motion.div
                key={usp.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="rounded-2xl bg-background p-8 text-center shadow-sm"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-elivyon-navy/10">
                  <usp.icon className="h-6 w-6 text-elivyon-navy" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold tracking-tight text-foreground">{usp.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{usp.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3 text-center">
            {[
              { value: "+105 %", label: "Durchschnittliche Umsatzsteigerung" },
              { value: "+71 %", label: "Median Mehrumsatz pro Behandlung" },
              { value: ">1 Std.", label: "Zeitersparnis täglich" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <p className="font-display text-6xl font-semibold tracking-tight text-elivyon-navy md:text-7xl">{stat.value}</p>
                <p className="mt-3 text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 apple-section-light">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center font-display text-4xl font-semibold tracking-tight text-foreground md:text-5xl"
          >
            Das sagen unsere Klienten.
          </motion.h2>
          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="rounded-2xl bg-background p-8"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-elivyon-yellow text-elivyon-yellow" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-foreground">„{t.text}"</p>
                <div className="mt-6">
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.praxis}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container">
          <div className="rounded-3xl gradient-hero px-8 py-20 text-center md:px-16">
            <h2 className="font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Bereit für die Zukunft?
            </h2>
            <p className="mt-4 text-lg text-white/60">
              2 Wochen kostenlos testen. Keine Kreditkarte erforderlich.
            </p>
            <Button asChild size="lg" className="mt-8 rounded-full bg-elivyon-yellow text-elivyon-navy hover:opacity-90 font-medium px-8 h-12 text-base">
              <Link to="/bestellen">Kostenlos starten <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
