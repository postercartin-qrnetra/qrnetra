export type ContentSection = {
  id: string;
  title: string;
  body?: string;
  paragraphs?: string[];
  list?: string[];
};

export type LegalPageContent = {
  title: string;
  description: string;
  lastUpdated: string;
  sections: ContentSection[];
};

export type MarketingPageContent = {
  title: string;
  description: string;
  hero?: string;
  sections: ContentSection[];
};
