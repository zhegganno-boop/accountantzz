export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  basePrice: string;
  period: string; // "місяць", "разово", "квартал"
  details: string[];
  features: string[];
  popular?: boolean;
}

export interface ConsultationRequest {
  id: string;
  name: string;
  phone: string;
  businessType: string;
  message?: string;
  calculatedPrice?: number;
  timestamp: string;
  status: 'new' | 'contacted' | 'completed';
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'fop' | 'tov' | 'general' | 'taxes';
}

export interface InstagramPost {
  id: string;
  imageUrl: string;
  likes: number;
  comments: number;
  caption: string;
  link: string;
  date: string;
}
