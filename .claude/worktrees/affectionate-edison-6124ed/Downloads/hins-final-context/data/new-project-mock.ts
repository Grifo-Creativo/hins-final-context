// data/new-project-mock.ts — New Project Dialog mock data and types

export type ProjectType = "GDCV" | "GDD"

export interface NewProjectFormData {
  nombre: string
  tipo?: ProjectType
  medidor?: string  // GDD only
  socios?: string   // GDCV only
}

export const PROJECT_TYPES = [
  { value: "GDCV", label: "Comunitario" },
  { value: "GDD", label: "Dueño" },
] as const
