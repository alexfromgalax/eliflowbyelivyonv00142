import fotoBarac from "@/assets/foto-barac.jpg";
import assistant1 from "@/assets/staff/assistant-1.jpg";
import assistant2 from "@/assets/staff/assistant-2.jpg";
import assistant3 from "@/assets/staff/assistant-3.jpg";
import assistant4 from "@/assets/staff/assistant-4.jpg";
import assistant5 from "@/assets/staff/assistant-5.jpg";

export interface StaffMember {
  id: string;
  name: string;
  role: "behandler" | "assistenz";
  photo: string;
  kuerzel: string;
}

/** The logged-in practitioner (mock) */
export const currentBehandler: StaffMember = {
  id: "b1",
  name: "Dr. Barac",
  role: "behandler",
  photo: fotoBarac,
  kuerzel: "BA",
};

/** Available assistants (mock) */
export const availableAssistants: StaffMember[] = [
  { id: "a1", name: "Lisa Neumann", role: "assistenz", photo: assistant1, kuerzel: "LN" },
  { id: "a2", name: "Sabine Krüger", role: "assistenz", photo: assistant2, kuerzel: "SK" },
  { id: "a3", name: "Tim Hoffmann", role: "assistenz", photo: assistant3, kuerzel: "TH" },
  { id: "a4", name: "Maria Oliveira", role: "assistenz", photo: assistant4, kuerzel: "MO" },
  { id: "a5", name: "Karin Lindberg", role: "assistenz", photo: assistant5, kuerzel: "KL" },
];
