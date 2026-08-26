export interface QuoteFormData {
  name: string;
  phone: string;
  email: string;
  eventType: string;
  eventTypeOther: string;
  date: string;
  guests: string;
  location: string;
  drinks: string[];
  budget: string;
  comments: string;
}

export type SetQuoteField = (field: keyof QuoteFormData, value: string) => void;

export const EMPTY_QUOTE: QuoteFormData = {
  name: '',
  phone: '',
  email: '',
  eventType: '',
  eventTypeOther: '',
  date: '',
  guests: '',
  location: '',
  drinks: [],
  budget: '',
  comments: '',
};
