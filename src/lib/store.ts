import { create } from "zustand";
import { persist } from "zustand/middleware";

export type EmissionCategory =
  | "Journal Télévisé"
  | "Magazine"
  | "Documentaire"
  | "Divertissement"
  | "Débat"
  | "Événement spécial"
  | "Programme culturel"
  | "Programme religieux"
  | "Programme jeunesse"
  | "Programme sportif";

export const CATEGORY_TO_MODEL: Record<EmissionCategory, string> = {
  "Journal Télévisé": "Modèle JT",
  Magazine: "Modèle Magazine",
  Documentaire: "Modèle Documentaire",
  Divertissement: "Modèle Divertissement",
  Débat: "Modèle Débat",
  "Événement spécial": "Modèle Événement",
  "Programme culturel": "Modèle Culture",
  "Programme religieux": "Modèle Religieux",
  "Programme jeunesse": "Modèle Jeunesse",
  "Programme sportif": "Modèle Sport",
};

export const CATEGORIES = Object.keys(CATEGORY_TO_MODEL) as EmissionCategory[];

export type Status = "Actif" | "Brouillon" | "Archivé";
export type Priority = "Basse" | "Normale" | "Haute" | "Critique";

export interface Emission {
  id: string;
  title: string;
  category: EmissionCategory;
  model: string;
  responsable: string;
  createdAt: string;
  status: Status;
  description: string;
  priority: Priority;
}

export type Phase = "Pré-production" | "Production" | "Post-production" | "Diffusion";

export const PHASE_TEMPLATE: Record<Phase, string[]> = {
  "Pré-production": ["Brief initial", "Préparation conducteur", "Réunion coordination", "Validation contenu"],
  Production: ["Déplacement", "Installation technique", "Tournage / Captation", "Coordination plateau"],
  "Post-production": ["Montage", "Habillage", "Validation finale"],
  Diffusion: ["Programmation", "Diffusion antenne", "Archivage"],
};

export type BlocStatus = "Non planifié" | "Planifié" | "En cours" | "Terminé" | "Incomplet";

export interface Bloc {
  id: string;
  productionId: string;
  phase: Phase;
  name: string;
  status: BlocStatus;
  dateStart?: string;
  dateEnd?: string;
  timeStart?: string;
  timeEnd?: string;
  lieu?: string;
  responsable?: string;
  ressourcesHumaines?: string[];
  ressourcesMaterielles?: string[];
  besoinMM?: boolean;
  commentaire?: string;
}

export interface Production {
  id: string;
  code: string;
  name: string;
  emissionId: string;
  dateStart: string;
  dateEnd: string;
  lieu: string;
  responsable: string;
  priority: Priority;
  commentaire: string;
  createdAt: string;
}

export type MMStatus = "Demandée" | "En attente" | "Validée" | "Refusée";

export interface DemandeMM {
  id: string;
  emissionId: string;
  productionId: string;
  blocId: string;
  typeCouverture: string;
  date: string;
  heure: string;
  lieu: string;
  ressources: string[];
  justification: string;
  status: MMStatus;
  createdAt: string;
  motifRefus?: string;
}

interface User {
  name: string;
  email: string;
  role: string;
  service: string;
}

interface AppState {
  authed: boolean;
  user: User;
  emissions: Emission[];
  productions: Production[];
  blocs: Bloc[];
  demandes: DemandeMM[];

  login: (email: string) => void;
  logout: () => void;

  addEmission: (e: Omit<Emission, "id" | "model" | "createdAt"> & { createdAt?: string }) => Emission;
  updateEmission: (id: string, patch: Partial<Emission>) => void;

  addProduction: (p: Omit<Production, "id" | "code" | "createdAt">) => Production;
  updateBloc: (id: string, patch: Partial<Bloc>) => void;

  addDemandeMM: (d: Omit<DemandeMM, "id" | "status" | "createdAt">) => DemandeMM;
  updateDemandeMM: (id: string, patch: Partial<DemandeMM>) => void;
}

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

function buildBlocs(productionId: string): Bloc[] {
  const blocs: Bloc[] = [];
  (Object.keys(PHASE_TEMPLATE) as Phase[]).forEach((phase) => {
    PHASE_TEMPLATE[phase].forEach((name) => {
      blocs.push({
        id: uid("bloc"),
        productionId,
        phase,
        name,
        status: "Non planifié",
      });
    });
  });
  return blocs;
}

// Seed data
const seedEmissions: Emission[] = [
  { id: "em_jt", title: "JT Al Aoula 20h30", category: "Journal Télévisé", model: "Modèle JT", responsable: "M. El Idrissi", createdAt: "2026-05-02", status: "Actif", description: "Journal télévisé quotidien — édition principale du soir.", priority: "Haute" },
  { id: "em_sab", title: "Sabahiyat", category: "Magazine", model: "Modèle Magazine", responsable: "Mme Bennani", createdAt: "2026-05-04", status: "Actif", description: "Magazine matinal — actualités, société et culture.", priority: "Normale" },
  { id: "em_amd", title: "Amouddou", category: "Documentaire", model: "Modèle Documentaire", responsable: "M. Tazi", createdAt: "2026-04-18", status: "Actif", description: "Série documentaire sur le patrimoine marocain.", priority: "Normale" },
  { id: "em_lla", title: "Lalla Laaroussa", category: "Divertissement", model: "Modèle Divertissement", responsable: "Mme Alaoui", createdAt: "2026-03-21", status: "Actif", description: "Programme de divertissement familial.", priority: "Haute" },
  { id: "em_mou", title: "Moubachara Maakoum", category: "Débat", model: "Modèle Débat", responsable: "M. Rahmouni", createdAt: "2026-05-10", status: "Actif", description: "Émission de débat en direct.", priority: "Critique" },
  { id: "em_mac", title: "Macharif", category: "Programme culturel", model: "Modèle Culture", responsable: "Mme Chraïbi", createdAt: "2026-05-12", status: "Actif", description: "Magazine culturel hebdomadaire.", priority: "Normale" },
  { id: "em_ram", title: "Programme spécial Ramadan", category: "Programme religieux", model: "Modèle Religieux", responsable: "M. Filali", createdAt: "2026-02-15", status: "Brouillon", description: "Grille spéciale du mois de Ramadan.", priority: "Haute" },
];

const seedProds: Production[] = [
  { id: "pr_jt_25", code: "P1-2605", name: "JT 20h30 — Édition 25 mai", emissionId: "em_jt", dateStart: "2026-05-25", dateEnd: "2026-05-25", lieu: "Studio A — SNRT Rabat", responsable: "M. El Idrissi", priority: "Haute", commentaire: "Édition principale", createdAt: "2026-05-20" },
  { id: "pr_amd_03", code: "P2-2605", name: "Amouddou — Épisode Fès", emissionId: "em_amd", dateStart: "2026-05-28", dateEnd: "2026-06-02", lieu: "Médina de Fès", responsable: "M. Tazi", priority: "Normale", commentaire: "Tournage extérieur 4 jours", createdAt: "2026-05-15" },
  { id: "pr_mou_12", code: "P3-2605", name: "Moubachara — Débat économique", emissionId: "em_mou", dateStart: "2026-05-27", dateEnd: "2026-05-27", lieu: "Plateau B", responsable: "M. Rahmouni", priority: "Critique", commentaire: "Direct 22h", createdAt: "2026-05-18" },
];

const seedBlocs: Bloc[] = [
  ...buildBlocs("pr_jt_25").map((b, i) => ({
    ...b,
    status: (i < 8 ? "Planifié" : "Non planifié") as BlocStatus,
    dateStart: i < 8 ? "2026-05-25" : undefined,
    lieu: i < 8 ? "Studio A" : undefined,
    responsable: i < 8 ? "M. El Idrissi" : undefined,
  })),
  ...buildBlocs("pr_amd_03").map((b, i) => ({
    ...b,
    status: (i < 4 ? "Planifié" : i === 4 ? "Incomplet" : "Non planifié") as BlocStatus,
    dateStart: i < 5 ? "2026-05-28" : undefined,
  })),
  ...buildBlocs("pr_mou_12"),
];

const seedDemandes: DemandeMM[] = [
  { id: "mm_001", emissionId: "em_amd", productionId: "pr_amd_03", blocId: seedBlocs.find((b) => b.productionId === "pr_amd_03" && b.name === "Tournage / Captation")!.id, typeCouverture: "Reportage extérieur", date: "2026-05-28", heure: "08:00", lieu: "Médina de Fès", ressources: ["Régie mobile", "Équipe caméra", "Son"], justification: "Captation extérieure multi-caméras", status: "En attente", createdAt: "2026-05-19" },
  { id: "mm_002", emissionId: "em_jt", productionId: "pr_jt_25", blocId: seedBlocs.find((b) => b.productionId === "pr_jt_25" && b.name === "Déplacement")!.id, typeCouverture: "Duplex direct", date: "2026-05-25", heure: "19:30", lieu: "Casablanca — Place Mohammed V", ressources: ["Fourgonnette", "Unité de transmission", "Équipe caméra"], justification: "Duplex pour ouverture JT", status: "Validée", createdAt: "2026-05-22" },
];

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      authed: false,
      user: {
        name: "Salma Bennani",
        email: "s.bennani@snrt.ma",
        role: "Chargée de productions audiovisuelles",
        service: "Al Aoula",
      },
      emissions: seedEmissions,
      productions: seedProds,
      blocs: seedBlocs,
      demandes: seedDemandes,

      login: (email) =>
        set((s) => ({ authed: true, user: { ...s.user, email: email || s.user.email } })),
      logout: () => set({ authed: false }),

      addEmission: (e) => {
        const em: Emission = {
          ...e,
          id: uid("em"),
          model: CATEGORY_TO_MODEL[e.category],
          createdAt: e.createdAt ?? new Date().toISOString().slice(0, 10),
        };
        set((s) => ({ emissions: [em, ...s.emissions] }));
        return em;
      },
      updateEmission: (id, patch) =>
        set((s) => ({
          emissions: s.emissions.map((e) =>
            e.id === id
              ? { ...e, ...patch, model: patch.category ? CATEGORY_TO_MODEL[patch.category] : e.model }
              : e,
          ),
        })),

      addProduction: (p) => {
        const count = get().productions.length + 1;
        const prod: Production = {
          ...p,
          id: uid("pr"),
          code: `P${count}-${new Date().toISOString().slice(5, 10).replace("-", "")}`,
          createdAt: new Date().toISOString().slice(0, 10),
        };
        const blocs = buildBlocs(prod.id);
        set((s) => ({ productions: [prod, ...s.productions], blocs: [...s.blocs, ...blocs] }));
        return prod;
      },

      updateBloc: (id, patch) =>
        set((s) => ({ blocs: s.blocs.map((b) => (b.id === id ? { ...b, ...patch } : b)) })),

      addDemandeMM: (d) => {
        const dm: DemandeMM = {
          ...d,
          id: uid("mm"),
          status: "Demandée",
          createdAt: new Date().toISOString().slice(0, 10),
        };
        set((s) => ({ demandes: [dm, ...s.demandes] }));
        return dm;
      },
      updateDemandeMM: (id, patch) =>
        set((s) => ({ demandes: s.demandes.map((d) => (d.id === id ? { ...d, ...patch } : d)) })),
    }),
    { name: "mplanner-store" },
  ),
);
