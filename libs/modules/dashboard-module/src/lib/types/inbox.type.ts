export interface LeadOwner {
  name: string;
  avatar?: string;
}

export interface LeadLabel {
  text: string;
  color: 'warm' | 'cold' | 'active' | 'push';
}

export interface LeadSource {
  icon: 'target' | 'automatic';
  text: string;
}

export interface LeadActivity {
  text: string;
  color: 'red' | 'gray' | 'green';
}

export interface Lead {
  id: string;
  title: string;
  owner: LeadOwner;
  labels: LeadLabel;
  source: LeadSource;
  leadCreated: string;
  nextActivity: LeadActivity;
  selected?: boolean;
}

export type FilterType = 'all' | 'warm' | 'cold' | 'active';
export type ViewType = 'inbox' | 'archive';
