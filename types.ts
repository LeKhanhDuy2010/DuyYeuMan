
import { Timestamp } from 'firebase/firestore';

export interface AppSettings {
  loveStartDate: string; // ISO format string
  avatar1: string;
  avatar2: string;
  bgImage: string;
  bgMusic: string;
  coupleName?: string;
}

export interface Memory {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: Timestamp;
}

export interface UserProfile {
  uid: string;
  email: string | null;
}
