import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, Plus, Package, FileText } from 'lucide-react';

interface Material {
  id: string;
  bezeichnung: string;
  menge: number;
  einheit: string;
  einzelpreis: number;
  gesamtpreis: number;
  kategorie: 'Material' | 'Labor' | 'Auslage';
}

interface LaborInfo {
  laborTyp: 'eigenlabor' | 'fremdlabor' | 'keins';
  laborName?: string;
  herstellungsland: string;
  belII_beb?: 'BEL II' | 'BEB' | 'nicht_relevant';
}

interface KonsolidierungData {
  materialien: Material[];
  laborInfo: LaborInfo;
  gesamtsumme: number;
}

interface KonsolidierungStepProps {
  onNext: (data: KonsolidierungData) => void;
  onBack: () => void;
  initialData?: Partial<KonsolidierungData>;
}

export const KonsolidierungStep: React.FC<KonsolidierungStepProps> = ({
  onNext,
  onBack,
  initialData,
}) => {
  const [materialien, setMaterialien] = useState<Material[]>(
    initialData?.materialien || []
  );
  
  const [laborInfo, setLaborInfo] = useState<LaborInfo>(
    initialData?.laborInfo || {
      laborTyp: 'keins',
      herstellungsland: 'Deutschland',
    }
  );

  const [newMaterial, setNewMaterial] = useState<Partial<Material>>({
    bezeichnung: '',
    menge: 1,
    einheit: 'Stück',
    einzelpreis: 0,
    kategorie: 'Material',
  });

  const calculateGesamtpreis = (menge: number, einzelpreis: number) => {
    return menge * einzelpreis;
  };

  const addMaterial = () => {
    if (!newMaterial.bezeichnung || !newMaterial.einzelpreis) return;

    const material: Material = {
      id: Date.now().toString(),
      bezeichnung: newMaterial.bezeichnung,
      menge: newMaterial.menge || 1,
      einheit: newMaterial.einheit || 'Stück',
      einzelpreis: newMaterial.einzelpreis,
      gesamtpreis: calculateGesamtpreis(
        newMaterial.menge || 1,
        newMaterial.einzelpreis
      ),
      kategorie: newMaterial.kategorie || 'Material',
    };

    setMaterialien([...materialien, material]);
    setNewMaterial({
      bezeichnung: '',
      menge: 1,
      einheit: 'Stück',
      einzelpreis: 0,
      kategorie: 'Material',
    });
  };

  const removeMaterial = (id: string) => {
    setMaterialien(materialien.filter(m => m.id !== id));
  };

  const gesamtsumme = materialien.reduce((sum, m) => sum + m.gesamtpreis, 0);

  const handleNext = () => {
    onNext({
      materialien,
      laborInfo,
      gesamtsumme,
    });
  };

  const hasLaborkosten = materialien.some(m => m.kategorie === 'Labor');

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Konsolidierung (ext_task_consolidate)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Zusammenfassung aller Materialien, Auslagen und Laborkosten.
              Dokumentation nach GOZ §9 (Herstellungsland) und BEL II/BEB für GKV.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Materialien/Auslagen hinzufügen */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Material/Auslage hinzufügen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Kategorie</Label>
              <Select
                value={newMaterial.kategorie}
                onValueChange={(value: 'Material' | 'Labor' | 'Auslage') =>
                  setNewMaterial({ ...newMaterial, kategorie: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Material">Material</SelectItem>
                  <SelectItem value="Labor">Laborkosten</SelectItem>
                  <SelectItem value="Auslage">Auslage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Bezeichnung</Label>
              <Input
                value={newMaterial.bezeichnung}
                onChange={(e) =>
                  setNewMaterial({ ...newMaterial, bezeichnung: e.target.value })
                }
                placeholder="z.B. Zirkonkrone, Abdruck, Röntgen"
              />
            </div>

            <div>
              <Label>Menge</Label>
              <Input
                type="number"
                min="1"
                value={newMaterial.menge}
                onChange={(e) =>
                  setNewMaterial({ ...newMaterial, menge: parseFloat(e.target.value) })
                }
              />
            </div>

            <div>
              <Label>Einheit</Label>
              <Select
                value={newMaterial.einheit}
                onValueChange={(value) =>
                  setNewMaterial({ ...newMaterial, einheit: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Stück">Stück</SelectItem>
                  <SelectItem value="ml">ml</SelectItem>
                  <SelectItem value="g">g</SelectItem>
                  <SelectItem value="Pauschal">Pauschal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Einzelpreis (€)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={newMaterial.einzelpreis}
                onChange={(e) =>
                  setNewMaterial({
                    ...newMaterial,
                    einzelpreis: parseFloat(e.target.value),
                  })
                }
              />
            </div>

            <div className="flex items-end">
              <Button onClick={addMaterial} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Hinzufügen
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Materialien-Liste */}
      {materialien.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Materialliste</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {materialien.map((material) => (
                <div
                  key={material.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium">{material.bezeichnung}</div>
                    <div className="text-sm text-muted-foreground">
                      {material.kategorie} • {material.menge} {material.einheit} × €
                      {material.einzelpreis.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="font-semibold">
                      €{material.gesamtpreis.toFixed(2)}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMaterial(material.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center pt-4 border-t-2">
                <div className="font-bold text-lg">Gesamtsumme</div>
                <div className="font-bold text-xl">€{gesamtsumme.toFixed(2)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Labor-Informationen */}
      {hasLaborkosten && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Labor-Informationen (GOZ §9)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Labor-Typ</Label>
              <Select
                value={laborInfo.laborTyp}
                onValueChange={(value: 'eigenlabor' | 'fremdlabor' | 'keins') =>
                  setLaborInfo({ ...laborInfo, laborTyp: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eigenlabor">Eigenlabor</SelectItem>
                  <SelectItem value="fremdlabor">Fremdlabor</SelectItem>
                  <SelectItem value="keins">Kein Labor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {laborInfo.laborTyp === 'fremdlabor' && (
              <div>
                <Label>Laborname</Label>
                <Input
                  value={laborInfo.laborName || ''}
                  onChange={(e) =>
                    setLaborInfo({ ...laborInfo, laborName: e.target.value })
                  }
                  placeholder="Name des Dentallabors"
                />
              </div>
            )}

            <div>
              <Label>Herstellungsland (GOZ §9 Pflicht)</Label>
              <Select
                value={laborInfo.herstellungsland}
                onValueChange={(value) =>
                  setLaborInfo({ ...laborInfo, herstellungsland: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Deutschland">Deutschland</SelectItem>
                  <SelectItem value="EU">EU (außer Deutschland)</SelectItem>
                  <SelectItem value="China">China</SelectItem>
                  <SelectItem value="Türkei">Türkei</SelectItem>
                  <SelectItem value="Sonstige">Sonstige</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>BEL II / BEB (nur GKV)</Label>
              <Select
                value={laborInfo.belII_beb || 'nicht_relevant'}
                onValueChange={(value: 'BEL II' | 'BEB' | 'nicht_relevant') =>
                  setLaborInfo({ ...laborInfo, belII_beb: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nicht_relevant">Nicht relevant (PKV)</SelectItem>
                  <SelectItem value="BEL II">BEL II (GKV-Standard)</SelectItem>
                  <SelectItem value="BEB">BEB (BEMA-Ersatz)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Alert>
              <AlertDescription>
                ℹ️ Herstellungsland muss gemäß GOZ §9 auf der Rechnung angegeben werden.
                Bei GKV-Patienten: BEL II oder BEB für Laborkosten verwenden.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        <Button onClick={onBack} variant="outline" className="flex-1">
          Zurück
        </Button>
        <Button onClick={handleNext} className="flex-1">
          Weiter zum Regelcheck
        </Button>
      </div>
    </div>
  );
};
