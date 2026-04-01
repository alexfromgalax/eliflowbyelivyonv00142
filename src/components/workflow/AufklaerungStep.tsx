import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

interface AufklaerungStepProps {
  onNext: (data: AufklaerungData) => void;
  onEmergency: () => void;
  onBack: () => void;
}

interface AufklaerungData {
  isEmergency: boolean;
  risikoaufklaerung: boolean;
  therapieaufklaerung: boolean;
  alternativenaufklaerung: boolean;
  kostenaufklaerung: boolean;
  patientEinwilligung: boolean;
  aufklaerungsDatum: string;
}

export const AufklaerungStep: React.FC<AufklaerungStepProps> = ({
  onNext,
  onEmergency,
  onBack,
}) => {
  const [data, setData] = useState<AufklaerungData>({
    isEmergency: false,
    risikoaufklaerung: false,
    therapieaufklaerung: false,
    alternativenaufklaerung: false,
    kostenaufklaerung: false,
    patientEinwilligung: false,
    aufklaerungsDatum: new Date().toISOString().split('T')[0],
  });

  const [showEmergencyConfirm, setShowEmergencyConfirm] = useState(false);

  const allChecked = 
    data.risikoaufklaerung &&
    data.therapieaufklaerung &&
    data.alternativenaufklaerung &&
    data.kostenaufklaerung &&
    data.patientEinwilligung;

  const handleEmergencyClick = () => {
    setShowEmergencyConfirm(true);
  };

  const confirmEmergency = () => {
    onEmergency();
  };

  const handleCheckboxChange = (field: keyof AufklaerungData) => {
    setData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="space-y-6">
      {/* Notfall-Gateway */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            Notfall-Gateway (ext_gw_emergency)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertDescription>
              Handelt es sich um eine <strong>akute Notfallbehandlung</strong>?
              <br />
              (Schmerzbehandlung, Trauma, akute Entzündung)
            </AlertDescription>
          </Alert>
          
          {!showEmergencyConfirm ? (
            <Button 
              onClick={handleEmergencyClick}
              variant="destructive"
              className="w-full"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Ja, Notfallbehandlung → Fast-Track zu DIVERS/Notfall
            </Button>
          ) : (
            <div className="space-y-3">
              <Alert variant="destructive">
                <AlertDescription>
                  ⚠️ Notfall-Fast-Track aktiviert. Sie werden direkt zur Notfall-Triage weitergeleitet
                  (BEMA 03 Zuschläge, DIVERS-Auswahl).
                </AlertDescription>
              </Alert>
              <div className="flex gap-2">
                <Button onClick={confirmEmergency} variant="destructive" className="flex-1">
                  Bestätigen → Notfall-Workflow
                </Button>
                <Button 
                  onClick={() => setShowEmergencyConfirm(false)} 
                  variant="outline"
                  className="flex-1"
                >
                  Abbrechen
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Aufklärung nach §630d BGB */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Aufklärung nach §630d BGB (ext_task_consent_check)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              Rechtliche Pflicht zur Aufklärung über Behandlung, Risiken, Alternativen und Kosten
              gemäß §630d BGB. Einwilligung muss dokumentiert werden.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <Checkbox
                id="risiko"
                checked={data.risikoaufklaerung}
                onCheckedChange={() => handleCheckboxChange('risikoaufklaerung')}
              />
              <div className="flex-1">
                <Label htmlFor="risiko" className="font-medium cursor-pointer">
                  1. Risikoaufklärung
                </Label>
                <p className="text-sm text-muted-foreground">
                  Komplikationen, Nebenwirkungen, Behandlungsrisiken
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <Checkbox
                id="therapie"
                checked={data.therapieaufklaerung}
                onCheckedChange={() => handleCheckboxChange('therapieaufklaerung')}
              />
              <div className="flex-1">
                <Label htmlFor="therapie" className="font-medium cursor-pointer">
                  2. Therapieaufklärung
                </Label>
                <p className="text-sm text-muted-foreground">
                  Ablauf, Dauer, Prognose der geplanten Behandlung
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <Checkbox
                id="alternativen"
                checked={data.alternativenaufklaerung}
                onCheckedChange={() => handleCheckboxChange('alternativenaufklaerung')}
              />
              <div className="flex-1">
                <Label htmlFor="alternativen" className="font-medium cursor-pointer">
                  3. Alternativenaufklärung
                </Label>
                <p className="text-sm text-muted-foreground">
                  Alternative Behandlungsmethoden, Vor-/Nachteile
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <Checkbox
                id="kosten"
                checked={data.kostenaufklaerung}
                onCheckedChange={() => handleCheckboxChange('kostenaufklaerung')}
              />
              <div className="flex-1">
                <Label htmlFor="kosten" className="font-medium cursor-pointer">
                  4. Kostenaufklärung
                </Label>
                <p className="text-sm text-muted-foreground">
                  Eigenanteil, Mehrkosten, Kostenvoranschlag besprochen
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border-2 border-blue-200 rounded-lg bg-blue-50">
              <Checkbox
                id="einwilligung"
                checked={data.patientEinwilligung}
                onCheckedChange={() => handleCheckboxChange('patientEinwilligung')}
              />
              <div className="flex-1">
                <Label htmlFor="einwilligung" className="font-medium cursor-pointer text-blue-900">
                  ✓ Patient-Einwilligung erteilt
                </Label>
                <p className="text-sm text-blue-700">
                  Patient wurde vollständig aufgeklärt und hat seine Einwilligung zur Behandlung erteilt
                </p>
              </div>
            </div>
          </div>

          {allChecked && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Alle Aufklärungspflichten erfüllt. §630d BGB-konform.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button onClick={onBack} variant="outline" className="flex-1">
          Zurück
        </Button>
        <Button 
          onClick={() => onNext(data)} 
          disabled={!allChecked}
          className="flex-1"
        >
          Weiter zur Behandlungsauswahl
        </Button>
      </div>
    </div>
  );
};
