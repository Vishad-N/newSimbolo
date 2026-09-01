export interface Expert {
  id: string;
  name: string;
  title: string;
  rating: number;
  projectsCompleted: number;
  specialization: string;
  responseTime: string;
  hourlyPrice: number;
  imageUrl: string;
  isSimboloExpert: boolean;
  skills: string[];
  experience: string;
  availability: string;
}

export interface Package {
  id: string;
  title: string;
  description: string;
  price: number;
  features: string[];
}

export interface Review {
  id: string;
  name: string;
  avatarUrl: string;
  rating: number;
  servicePurchased: string;
  content: string;
  date: string;
}

export interface Suggestion {
  id: string;
  label: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface SearchResponse {
  summary: string;
  matchPercentage: number;
  recommendedService: string;
  recommendedPackage: string;
  experts: Expert[];
  suggestions: Suggestion[];
  reviews: Review[];
  relatedServices: Service[];
}

// What the LLM itself is asked to generate — the parts that genuinely need
// reasoning about the query. Experts/reviews/relatedServices are assembled
// deterministically in AiService from data already fetched from the DB,
// rather than having the model regenerate structured JSON we already have.
export interface LlmSearchResponse {
  summary: string;
  matchPercentage: number;
  recommendedService: string;
  recommendedPackage: string;
  suggestions: Suggestion[];
}
