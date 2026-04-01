import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileCheck, 
  RotateCcw 
} from 'lucide-react';

interface ValidationRule {
  id: string;
  name: string;
  description: string;
  status: 'success' | 'warning' | 'error' | 'pending';
  details?: string;
}

interface RegelcheckData {
  validationResults: ValidationRule[];
  hasErrors: boolean;
  hasWarnings: boolean;
  canProceed: boolean;
}

interface RegelcheckStepProps {
  onNext: () => void;
  onBack: () => void;
  onRework: () => void;
  behandlungData: any; // Daten aus vorherigen Steps
}

export const RegelcheckStep: React.FC<RegelcheckStepProps> = ({
  onNext,
  onBack,
  onRework,
  behandlungData,
}) => {
  const [validationResults, setValidationResults] = useState<ValidationRule[]>([]);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    performValidation();
  }, []);

  const performValidation = () => {
    setIsValidating(true);
    
    // Simuliere Validierung (in Produktion: echte Regelprüfung)
    setTimeout(() => {
      const rules: ValidationRule[] = [
        validateBegruendungspflicht(),
        validateFaktorGrenzen(),
        validateDoppelabrechnung(),
        validateKombiAusschluesse(),
        validateMehrkostenVereinbarung(),
        validateHKPVollstaendigkeit(),
      ];

      setValidationResults(rules);
      setIsValidating(false);
    }, 1500);
  };

  // Regel 1: Begründungspflicht prüfen
  const validateBegruendungspflicht = (): ValidationRule => {
    const faktor = behandlungData?.faktor || 2.3;
    const begruendung = behandlungData?.begruendung || '';

    if (faktor > 2.3 && begruendung.length < 50) {
      return {
        id: 'begruendung',
        name: 'Begründungspflicht',
        description: 'GOZ-Faktor > 2,3 erfordert schriftliche Begründung',
        status: 'error',
        details: `Faktor ${faktor}× gewählt, aber Begründung zu kurz (${begruendung.length} Zeichen, mind. 50 erforderlich)`,
      };
    }

    return {
      id: 'begruendung',
      name: 'Begründungspflicht',
      description: 'Prüfung der Begründungspflicht nach GOZ §5',
      status: 'success',
      details: faktor > 2.3 
        ? 'Begründung vorhanden und ausreichend' 
        : 'Keine Begründung erforderlich (Faktor ≤ 2,3)',
    };
  };

  // Regel 2: Faktor-Grenzen
  const validateFaktorGrenzen = (): ValidationRule => {
    const faktor = behandlungData?.faktor || 2.3;

    if (faktor < 1.0 || faktor > 3.5) {
      return {
        id: 'faktor',
        name: 'Faktor-Grenzen',
        description: 'GOZ-Faktor muss zwischen 1,0× und 3,5× liegen',
        status: 'error',
        details: `Faktor ${faktor}× liegt außerhalb des zulässigen Rahmens`,
      };
    }

    if (faktor > 3.5) {
      return {
        id: 'faktor',
        name: 'Faktor-Grenzen',
        description: 'Faktor > 3,5× erfordert Vereinbarung vor Behandlung',
        status: 'warning',
        details: 'Schriftliche Vereinbarung nach §2 GOZ erforderlich',
      };
    }

    return {
      id: 'faktor',
      name: 'Faktor-Grenzen',
      description: 'Prüfung der Faktor-Grenzen nach GOZ §5',
      status: 'success',
      details: `Faktor ${faktor}× im zulässigen Bereich`,
    };
  };

  // Regel 3: Doppelabrechnung vermeiden
  const validateDoppelabrechnung = (): ValidationRule => {
    const leistungen = behandlungData?.leistungen || [];
    const doppelte = findDuplicateLeistungen(leistungen);

    if (doppelte.length > 0) {
      return {
        id: 'doppelabrechnung',
        name: 'Doppelabrechnung',
        description: 'Prüfung auf doppelt abgerechnete Leistungen',
        status: 'error',
        details: `Folgende Leistungen wurden mehrfach abgerechnet: ${doppelte.join(', ')}`,
      };
    }

    return {
      id: 'doppelabrechnung',
      name: 'Doppelabrechnung',
      description: 'Prüfung auf doppelt abgerechnete Leistungen',
      status: 'success',
      details: 'Keine Doppelabrechnung festgestellt',
    };
  };

  // Regel 4: Kombi-Ausschlüsse
  const validateKombiAusschluesse = (): ValidationRule => {
    const leistungen = behandlungData?.leistungen || [];
    const konflikte = checkKombiKonflikte(leistungen);

    if (konflikte.length > 0) {
      return {
        id: 'kombi',
        name: 'Kombinationsausschlüsse',
        description: 'Prüfung unzulässiger Leistungskombinationen',
        status: 'error',
        details: `Unzulässige Kombination: ${konflikte.join('; ')}`,
      };
    }

    return {
      id: 'kombi',
      name: 'Kombinationsausschlüsse',
      description: 'Prüfung unzulässiger Leistungskombinationen',
      status: 'success',
      details: 'Alle Leistungskombinationen zulässig',
    };
  };

  // Regel 5: Mehrkosten-Vereinbarung
  const validateMehrkostenVereinbarung = (): ValidationRule => {
    const kostentraeger = behandlungData?.kostentraeger || 'GKV';
    const mehrkosten = behandlungData?.mehrkosten || 0;
    const vereinbarung = behandlungData?.mehrkostenVereinbarung || false;

    if (kostentraeger === 'GKV' && mehrkosten > 0 && !vereinbarung) {
      return {
        id: 'mehrkosten',
        name: 'Mehrkosten-Vereinbarung',
        description: 'Bei GKV-Mehrkosten ist §4 Abs. 5 GOZ erforderlich',
        status: 'error',
        details: `Mehrkosten von €${mehrkosten.toFixed(2)} ohne Vereinbarung`,
      };
    }

    return {
      id: 'mehrkosten',
      name: 'Mehrkosten-Vereinbarung',
      description: 'Prüfung der Mehrkosten-Vereinbarung',
      status: 'success',
      details: mehrkosten > 0 
        ? 'Mehrkosten-Vereinbarung liegt vor' 
        : 'Keine Mehrkosten',
    };
  };

  // Regel 6: HKP-Vollständigkeit
  const validateHKPVollstaendigkeit = (): ValidationRule => {
    const behandlungsart = behandlungData?.behandlungsart || '';
    const hkp = behandlungData?.hkp || null;

    if (
      behandlungsart === 'ZAHNERSATZ' && 
      (!hkp || !hkp.regelversorgung || !hkp.befund)
    ) {
      return {
        id: 'hkp',
        name: 'HKP-Vollständigkeit',
        description: 'Zahnersatz erfordert vollständigen Heil- und Kostenplan',
        status: 'error',
        details: 'Regelversorgung oder Befund fehlt im HKP',
      };
    }

    return {
      id: 'hkp',
      name: 'HKP-Vollständigkeit',
      description: 'Prüfung des Heil- und Kostenplans',
      status: 'success',
      details: behandlungsart === 'ZAHNERSATZ' 
        ? 'HKP vollständig' 
        : 'Nicht relevant (kein Zahnersatz)',
    };
  };

  // Hilfsfunktionen
  const findDuplicateLeistungen = (leistungen: any[]) => {
    const seen = new Set();
    const duplicates: string[] = [];

    leistungen.forEach((l: any) => {
      const key = l.code || l.nummer;
      if (seen.has(key)) {
        duplicates.push(key);
      }
      seen.add(key);
    });

    return duplicates;
  };

  const checkKombiKonflikte = (leistungen: any[]) => {
    // Beispiel: GOZ 2197 + 2198 schließen sich aus
    const codes = leistungen.map((l: any) => l.code || l.nummer);
    const konflikte: string[] = [];

    if (codes.includes('2197') && codes.includes('2198')) {
      konflikte.push('GOZ 2197 und 2198 nicht kombinierbar');
    }

    // Weitere Kombi-Regeln hier...

    return konflikte;
  };

  const hasErrors = validationResults.some(r => r.status === 'error');
  const hasWarnings = validationResults.some(r => r.status === 'warning');
  const canProceed = !hasErrors;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="w-5 h-5" />
            Regelcheck (ext_task_preaudit)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Automatische Validierung der Abrechnung gegen GOZ, BEMA und Kombi-Regeln.
              Fehler müssen vor Weiterleitung korrigiert werden.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Validierungs-Status */}
      {isValidating ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Validierung läuft...</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Zusammenfassung */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="border-green-200">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-green-600">
                  {validationResults.filter(r => r.status === 'success').length}
                </div>
                <div className="text-sm text-muted-foreground">Erfolgreich</div>
              </CardContent>
            </Card>

            <Card className="border-yellow-200">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-yellow-600">
                  {validationResults.filter(r => r.status === 'warning').length}
                </div>
                <div className="text-sm text-muted-foreground">Warnungen</div>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-red-600">
                  {validationResults.filter(r => r.status === 'error').length}
                </div>
                <div className="text-sm text-muted-foreground">Fehler</div>
              </CardContent>
            </Card>
          </div>

          {/* Validierungs-Details */}
          <div className="space-y-3">
            {validationResults.map((rule) => (
              <Card key={rule.id} className={getStatusColor(rule.status)}>
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    {getStatusIcon(rule.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{rule.name}</h4>
                        <Badge
                          variant={
                            rule.status === 'error'
                              ? 'destructive'
                              : rule.status === 'warning'
                              ? 'outline'
                              : 'default'
                          }
                        >
                          {rule.status === 'error'
                            ? 'Fehler'
                            : rule.status === 'warning'
                            ? 'Warnung'
                            : 'OK'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {rule.description}
                      </p>
                      {rule.details && (
                        <p className="text-sm font-medium">{rule.details}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Rework-Loop (ext_gw_rework) */}
          {hasErrors && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-700 flex items-center gap-2">
                  <RotateCcw className="w-5 h-5" />
                  Korrektur erforderlich (ext_gw_rework)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>
                    Die Abrechnung enthält {validationResults.filter(r => r.status === 'error').length} Fehler
                    und kann nicht fortgesetzt werden. Bitte korrigieren Sie die markierten Punkte.
                  </AlertDescription>
                </Alert>
                <Button onClick={onRework} variant="destructive" className="w-full">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Zurück zur Korrektur
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Erfolgs-Meldung */}
          {canProceed && !hasWarnings && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <AlertDescription className="text-green-700">
                ✓ Alle Validierungen erfolgreich. Die Abrechnung ist regelkonform.
              </AlertDescription>
            </Alert>
          )}
        </>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        <Button onClick={onBack} variant="outline" className="flex-1">
          Zurück
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!canProceed || isValidating}
          className="flex-1"
        >
          {canProceed ? 'Weiter zum Review' : 'Korrektur erforderlich'}
        </Button>
      </div>
    </div>
  );
};
