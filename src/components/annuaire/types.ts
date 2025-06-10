
export interface ServiteurInfo {
  id: string;
  fullName: string;
  role: string;
  entity: string;
  phones: string[];
  email: string | null;
  region: string;
}

export interface RegionInfo {
  id: string;
  nom: string;
  surintendant: string | null;
  code: string;
}

export interface DistrictInfo {
  id: string;
  nom: string;
  surintendant: string | null;
  code: string;
  region_id: string;
  regions: {
    nom: string;
  } | null;
}

export interface ParoisseInfo {
  id: string;
  nom: string;
  pasteur: string | null;
  code: string;
  district_id: string;
  districts: {
    nom: string;
    regions: {
      nom: string;
    } | null;
  } | null;
}
