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
