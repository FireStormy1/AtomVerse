export type ElementCategory = 
  | "Alkali Metal" 
  | "Alkaline Earth Metal" 
  | "Transition Metal" 
  | "Post-Transition Metal" 
  | "Metalloid" 
  | "Nonmetal" 
  | "Halogen" 
  | "Noble Gas" 
  | "Lanthanide" 
  | "Actinide"
  | "Unknown";

export interface ElementData {
  atomicNumber: number;
  symbol: string;
  name: string;
  atomicMass: number;
  period: number;
  group: number;
  category: ElementCategory;
  stateAtSTP: string;
  meltingPoint: number | null;
  boilingPoint: number | null;
  density: number | null;
  electronConfiguration: string;
  electrons: number[];
  protons: number;
  neutrons: number;
  valenceElectrons: number;
  electronegativity: number;
  atomicRadius: number;
  ionizationEnergy: number;
  oxidationStates: string;
  yearDiscovered: number | string;
  discoverer: string;
  namedAfter: string;
  crystalStructure: string;
  block: string;
  isRadioactive: boolean;
  isNatural: boolean;
  abundance: number;
  uses: string[];
  interestingFacts: string[];
  biologicalImportance: string;
  industrialApplications: string;
  hazards: string;
}
