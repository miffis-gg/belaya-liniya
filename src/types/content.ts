export type ProblemId = 'pain' | 'treatment' | 'implantation' | 'aesthetics' | 'children';
export type Category = 'diagnostics' | 'treatment' | 'surgery' | 'aesthetics' | 'children';
export interface Problem {
  id: ProblemId;
  title: string;
  description: string;
  next: string;
  recommendationIds: string[];
}
export interface Service {
  id: string;
  category: Category;
  problemIds: ProblemId[];
  title: string;
  description: string;
  duration: string;
  priceFrom: number;
}
export interface Specialist {
  id: string;
  name: string;
  role: string;
  experience: string;
  problemIds: ProblemId[];
  image: string;
  phrase: string;
  alt: string;
}
export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  beforeImage: string;
  afterImage: string;
  disclaimer: string;
  description: string;
}
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
export interface LeadFormData {
  name: string;
  phone: string;
  direction: ProblemId | '';
  preferredTime: string;
  comment: string;
  consent: boolean;
}
export interface AppSelectionState {
  selectedProblem: ProblemId | null;
  selectedServiceId: string | null;
  selectedSpecialistId: string | null;
}
