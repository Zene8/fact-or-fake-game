export interface User {
  id: number;
  name: string;
  handle: string;
  avatar: string;
  quality?: 'low'; // For uncanny factor
}

export interface NewsOrganization {
  id: number;
  name: string;
  handle: string;
  logo: string;
  verified_badge?: boolean; // For visual checkmark trap
}

export interface Post {
  id: number;
  username: string;
  handle: string;
  avatar: string;
  content: string;
  timestamp: string;
  type: 'Verified' | 'Misinformation';
  reasoning: string; // Used for the educational breakdown modal
}
