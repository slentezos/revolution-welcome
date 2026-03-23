export type UserRole = "player" | "coach" | "club";

export interface Player {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female";
  position: string;
  nationality: string;
  country: string;
  city: string;
  level: "Professional" | "Semi-Pro" | "Amateur" | "Youth";
  availability: "Actively Looking" | "Open to Offers" | "Not Available";
  division: string;
  leagueTier: "1st League" | "2nd League" | "3rd League" | "4th League" | "5th League";
  contractStatus: "Free Agent" | "Under Contract" | "Expiring";
  handedness: "Left" | "Right" | "Both";
  height: number;
  experience: number;
  languages: string[];
  nationalTeam: boolean;
  hasVideo: boolean;
  verified: boolean;
  avatar: string;
  profileCompletion: number;
}

export interface Coach {
  id: string;
  name: string;
  gender: "Male" | "Female";
  specialization: string;
  experience: number;
  licenseLevel: string;
  preferredRole: string;
  nationality: string;
  country: string;
  city: string;
  level: "Professional" | "Semi-Pro" | "Amateur" | "Youth";
  availability: "Actively Looking" | "Open to Offers" | "Not Available";
  leagueTier: "1st League" | "2nd League" | "3rd League" | "4th League" | "5th League";
  languages: string[];
  willingToRelocate: boolean;
  focus: "Youth" | "Senior" | "Both";
  avatar: string;
  profileCompletion: number;
}

export interface Club {
  id: string;
  name: string;
  country: string;
  city: string;
  division: string;
  leagueTier: "1st League" | "2nd League" | "3rd League" | "4th League" | "5th League";
  level: "Professional" | "Semi-Pro" | "Amateur" | "Youth";
  recruiting: "Players" | "Coaches" | "Both" | "None";
  clubType: "Professional" | "Semi-Pro" | "Amateur" | "Academy";
  rosterSize: number;
  facilities: string;
  providesHousing: boolean;
  internationalCompetition: boolean;
  logo: string;
  openPositions: string[];
}

export interface Message {
  id: string;
  from: string;
  fromRole: UserRole;
  subject: string;
  preview: string;
  timestamp: string;
  read: boolean;
  avatar: string;
}

export interface Opportunity {
  id: string;
  type: "recruitment" | "trial" | "interest" | "job" | "application";
  title: string;
  subtitle: string;
  location: string;
  level: string;
  position?: string;
  date: string;
  urgent?: boolean;
  avatar: string;
}

export interface ProfileView {
  id: string;
  viewerName: string;
  viewerRole: UserRole;
  viewerOrg?: string;
  timestamp: string;
  avatar: string;
}

export interface FilterState {
  role: UserRole | "all";
  country: string;
  city: string;
  level: string;
  availability: string;
  division: string;
  // Player-specific
  position: string;
  ageRange: [number, number];
  contractStatus: string;
  handedness: string;
  // Coach-specific
  specialization: string;
  experience: string;
  licenseLevel: string;
  preferredRole: string;
  // Club-specific
  recruiting: string;
  clubType: string;
  rosterSizeMin: string;
  facilities: string;
}

export const defaultFilters: FilterState = {
  role: "all",
  country: "",
  city: "",
  level: "",
  availability: "",
  division: "",
  position: "",
  ageRange: [16, 45],
  contractStatus: "",
  handedness: "",
  specialization: "",
  experience: "",
  licenseLevel: "",
  preferredRole: "",
  recruiting: "",
  clubType: "",
  rosterSizeMin: "",
  facilities: "",
};
