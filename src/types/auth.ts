export type UserRole = 
  | "assistant_director"
  | "assistant_pastor"
  | "chaplain"
  | "community_pastor"
  | "director"
  | "district_superintendent"
  | "missionary"
  | "parish_intendant"
  | "president"
  | "region_superintendent"
  | "secretary_general"
  | "technical_assistant"
  | "visitor";

export interface EntityData {
  role: UserRole;
  departement_id?: string;
  region_id?: string;
  district_id?: string;
  paroisse_id?: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  role: UserRole;
  full_name: string;
  paroisse_id?: string;
  district_id?: string;
  region_id?: string;
  departement_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  profile: UserProfile;
}