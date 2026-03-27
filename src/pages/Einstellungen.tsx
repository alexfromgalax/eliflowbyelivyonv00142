import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Heart, HelpCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "eli-flow-likes";

const faqItems = [
  {
    question: "Was sind Favoriten und wie funktionieren sie?",
    answer: "Durch Klick auf das Herz-Symbol können Sie häufig verwendete Leistungen, Techniken und Materialien als Favoriten markieren. Diese werden beim nächsten Durchlauf automatisch vorausgewählt und an oberster Stelle angezeigt – so sparen Sie Zeit bei der Dokumentation."
  },
  {
    question: "Wann werden favorisierte Einträge als Standard vorausgewählt?",
    answer: "Favoriten werden erst beim nächsten Workflow-Durchlauf an die oberste Position gesetzt und als Standard vorausgewählt. Innerhalb des aktuellen Durchlaufs bleibt die Reihenfolge bestehen, damit Sie nicht durch plötzliche Umordnungen verwirrt werden."
  },
  {
    question: "Wie dokumentiere ich eine Behandlung korrekt?",
    answer: "Navigieren Sie zu Doku/Abrechnung, wählen Sie den Patienten und die gewünschte Behandlungskategorie. Folgen Sie den Schritten des Workflows und bestätigen Sie am Ende. Die Dokumentation wird automatisch gespeichert."
  },
  {
    question: "Kann ich eine bereits abgeschlossene Dokumentation nachträglich ändern?",
    answer: "Abgeschlossene Dokumentationen finden Sie unter Historie. Dort können Sie Einträge einsehen. Änderungen an bereits abgerechneten Leistungen sollten mit Vorsicht und ggf. in Rücksprache mit der Abrechnungsstelle vorgenommen werden."
  },
  {
    question: "Was passiert, wenn ich die Favoriten zurücksetze?",
    answer: "Alle gespeicherten Favoriten (Herz-Markierungen) werden gelöscht. Es werden keine vorausgewählten Standards mehr gesetzt, bis Sie neue Favoriten anlegen. Ihre bisherigen Dokumentationen und Abrechnungen bleiben davon unberührt."
  },
  {
    question: "Wie wähle ich die richtige Behandlungskategorie aus?",
    answer: "Auf der Seite Doku/Abrechnung finden Sie alle verfügbaren Kategorien übersichtlich dargestellt. Wählen Sie die Kategorie, die zur durchgeführten Behandlung passt. Der Workflow führt Sie dann Schritt für Schritt durch die zugehörigen Leistungen, Techniken und Materialien."
  },
  {
    question: "Was bedeuten die einzelnen Schritte im Dokumentations-Workflow?",
    answer: "Der Workflow gliedert sich in mehrere Teilschritte: Zuerst wählen Sie die Leistung, dann die angewandte Technik und zuletzt das verwendete Material. In jedem Schritt können Sie Favoriten setzen, um den Ablauf beim nächsten Mal zu verkürzen."
  },
  {
    question: "Wie kann ich mein Team verwalten?",
    answer: "Unter Team sehen Sie alle Teammitglieder Ihrer Praxis. Dort können Rollen zugewiesen, Arbeitszeiten eingesehen und Kontaktdaten verwaltet werden."
  },
  {
    question: "Wie kann ich den Workflow beschleunigen?",
    answer: "Nutzen Sie die Favoriten-Funktion, um häufig verwendete Leistungen, Techniken und Materialien zu markieren. Diese werden beim nächsten Durchlauf automatisch vorausgewählt, sodass Sie nur noch bestätigen müssen statt alles neu auszuwählen."
  },
  {
    question: "Kann ich mehrere Behandlungen hintereinander dokumentieren?",
    answer: "Ja, nach Abschluss einer Dokumentation können Sie direkt die nächste Behandlung starten. Ihre Favoriten-Einstellungen bleiben erhalten und beschleunigen jeden weiteren Durchlauf."
  },
];

export default function Einstellungen() {
  const handleResetFavorites = () => {
    localStorage.removeItem(STORAGE_KEY);
    toast.success("Alle Favoriten wurden zurückgesetzt.");
  };

  return (
    <Layout compact>
      <div className="container py-8 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">Einstellungen</h1>

        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Heart className="h-4 w-4 text-destructive" />
              Favoriten zurücksetzen
            </CardTitle>
            <CardDescription>
              Entfernt alle gespeicherten Favoriten (Herz-Markierungen). Ihre Dokumentationen bleiben erhalten.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Alle Favoriten jetzt löschen
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Favoriten wirklich zurücksetzen?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Alle Ihre Favoriten werden unwiderruflich gelöscht. Vorausgewählte Standards werden erst nach dem Setzen neuer Favoriten wieder verfügbar.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                  <AlertDialogAction onClick={handleResetFavorites}>
                    Ja, zurücksetzen
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <HelpCircle className="h-4 w-4 text-primary" />
              Häufige Fragen (FAQ)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="text-sm text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
