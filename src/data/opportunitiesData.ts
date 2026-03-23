export type OpportunityCategory = "recruiting_position" | "preferred_country" | "trial_camp" | "direct_interest";

export interface TransferOpportunity {
  id: string;
  category: OpportunityCategory;
  type: "recruitment" | "trial" | "interest" | "camp";
  clubName: string;
  clubLogo: string;
  position?: string;
  title: string;
  subtitle: string;
  location: string;
  country: string;
  level: "Professional" | "Semi-Pro" | "Amateur" | "Youth";
  division: string;
  datePosted: Date;
  deadline?: string;
  urgent?: boolean;
  verified?: boolean;
  housing?: boolean;
  salary?: string;
  details?: string;
}

const now = Date.now();
const h = (hours: number) => new Date(now - hours * 3600000);
const d = (days: number) => new Date(now - days * 86400000);

export const transferOpportunities: TransferOpportunity[] = [
  // ── Clubs recruiting your position ──
  {
    id: "tp1", category: "recruiting_position", type: "recruitment",
    clubName: "THW Kiel", clubLogo: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=80&h=80&fit=crop",
    position: "Left Back", title: "Left Back — Bundesliga", subtitle: "Full-time professional contract, immediate start",
    location: "Kiel, Germany", country: "Germany", level: "Professional", division: "Bundesliga",
    datePosted: h(2), urgent: true, verified: true, housing: true, salary: "Competitive",
  },
  {
    id: "tp2", category: "recruiting_position", type: "recruitment",
    clubName: "SG Flensburg-Handewitt", clubLogo: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=80&h=80&fit=crop",
    position: "Left Back", title: "Left Back — Bundesliga", subtitle: "Contract until 2028, Champions League squad",
    location: "Flensburg, Germany", country: "Germany", level: "Professional", division: "Bundesliga",
    datePosted: h(8), verified: true, housing: false, salary: "Top tier",
  },
  {
    id: "tp3", category: "recruiting_position", type: "recruitment",
    clubName: "Veszprém HC", clubLogo: "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=80&h=80&fit=crop",
    position: "Left Back", title: "Left Back — NB I", subtitle: "Experienced player wanted for EHF Champions League campaign",
    location: "Veszprém, Hungary", country: "Hungary", level: "Professional", division: "NB I",
    datePosted: d(1), verified: true, housing: true, salary: "Competitive",
  },
  {
    id: "tp4", category: "recruiting_position", type: "recruitment",
    clubName: "Wisła Płock", clubLogo: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=80&h=80&fit=crop",
    position: "Left Back", title: "Left Back — PGNiG Superliga", subtitle: "2-year deal, European competition guaranteed",
    location: "Płock, Poland", country: "Poland", level: "Professional", division: "PGNiG Superliga",
    datePosted: d(2), housing: true,
  },
  {
    id: "tp5", category: "recruiting_position", type: "recruitment",
    clubName: "Sporting CP", clubLogo: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=80&h=80&fit=crop",
    position: "Left Back", title: "Left Back — 1ª Divisão", subtitle: "Growing project, young squad",
    location: "Lisbon, Portugal", country: "Portugal", level: "Professional", division: "1ª Divisão",
    datePosted: d(3),
  },

  // ── Clubs in preferred countries ──
  {
    id: "tc1", category: "preferred_country", type: "recruitment",
    clubName: "FC Barcelona Handbol", clubLogo: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=80&h=80&fit=crop",
    position: "Right Wing", title: "Right Wing — Liga Asobal", subtitle: "World-class facilities, global brand",
    location: "Barcelona, Spain", country: "Spain", level: "Professional", division: "Liga Asobal",
    datePosted: h(5), verified: true, housing: true, salary: "Top tier",
  },
  {
    id: "tc2", category: "preferred_country", type: "recruitment",
    clubName: "BM Logroño", clubLogo: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=80&h=80&fit=crop",
    position: "Pivot", title: "Pivot — Liga Asobal", subtitle: "Solid mid-table club, great city to live",
    location: "Logroño, Spain", country: "Spain", level: "Professional", division: "Liga Asobal",
    datePosted: d(1),
  },
  {
    id: "tc3", category: "preferred_country", type: "recruitment",
    clubName: "Aalborg Håndbold", clubLogo: "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=80&h=80&fit=crop",
    position: "Goalkeeper", title: "Goalkeeper — Håndboldligaen", subtitle: "Champions League regular, housing provided",
    location: "Aalborg, Denmark", country: "Denmark", level: "Professional", division: "Håndboldligaen",
    datePosted: h(12), urgent: true, verified: true, housing: true,
  },
  {
    id: "tc4", category: "preferred_country", type: "recruitment",
    clubName: "GOG Håndbold", clubLogo: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=80&h=80&fit=crop",
    position: "Center Back", title: "Center Back — Håndboldligaen", subtitle: "Strong youth academy, development pathway",
    location: "Gudme, Denmark", country: "Denmark", level: "Professional", division: "Håndboldligaen",
    datePosted: d(2),
  },
  {
    id: "tc5", category: "preferred_country", type: "recruitment",
    clubName: "Montpellier HB", clubLogo: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=80&h=80&fit=crop",
    position: "Right Back", title: "Right Back — Starligue", subtitle: "Ambitious project, new arena",
    location: "Montpellier, France", country: "France", level: "Professional", division: "Starligue",
    datePosted: d(4), verified: true,
  },

  // ── Trial / Camp announcements ──
  {
    id: "tt1", category: "trial_camp", type: "trial",
    clubName: "Scandinavian Handball Federation", clubLogo: "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=80&h=80&fit=crop",
    title: "Elite Trial Camp — Copenhagen", subtitle: "Open to all positions · Semi-Pro and above · 4 days",
    location: "Copenhagen, Denmark", country: "Denmark", level: "Semi-Pro", division: "Multiple",
    datePosted: h(6), deadline: "Mar 10, 2026",
    details: "March 15-18, 2026 · 30 spots available",
  },
  {
    id: "tt2", category: "trial_camp", type: "camp",
    clubName: "EHF Development", clubLogo: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=80&h=80&fit=crop",
    title: "U23 Showcase — Berlin", subtitle: "Invitation-only showcase for top youth talent · Scouts from 20+ clubs",
    location: "Berlin, Germany", country: "Germany", level: "Youth", division: "International",
    datePosted: d(1), deadline: "Mar 25, 2026", verified: true,
    details: "April 2-5, 2026 · Video submission required",
  },
  {
    id: "tt3", category: "trial_camp", type: "trial",
    clubName: "PSG Handball", clubLogo: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=80&h=80&fit=crop",
    title: "Open Trials — Paris", subtitle: "Goalkeeper & Pivot positions · Professional level only",
    location: "Paris, France", country: "France", level: "Professional", division: "Starligue",
    datePosted: d(3), deadline: "Apr 1, 2026", verified: true,
    details: "April 10-12, 2026 · Limited to 15 participants per position",
  },
  {
    id: "tt4", category: "trial_camp", type: "camp",
    clubName: "Handball Performance Lab", clubLogo: "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=80&h=80&fit=crop",
    title: "Summer Development Camp — Split", subtitle: "All levels · Coaching staff from Bundesliga & Starligue clubs",
    location: "Split, Croatia", country: "Croatia", level: "Amateur", division: "Multiple",
    datePosted: d(5), deadline: "May 15, 2026",
    details: "June 20 - July 2, 2026 · €450 registration fee",
  },

  // ── Direct interest from clubs ──
  {
    id: "ti1", category: "direct_interest", type: "interest",
    clubName: "FC Barcelona Handbol", clubLogo: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=80&h=80&fit=crop",
    title: "Viewed your profile", subtitle: "Scouting department reviewed your highlight reel",
    location: "Barcelona, Spain", country: "Spain", level: "Professional", division: "Liga Asobal",
    datePosted: h(3), verified: true,
  },
  {
    id: "ti2", category: "direct_interest", type: "interest",
    clubName: "THW Kiel", clubLogo: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=80&h=80&fit=crop",
    title: "Shortlisted you", subtitle: "Added to their transfer watchlist for 2026/27 season",
    location: "Kiel, Germany", country: "Germany", level: "Professional", division: "Bundesliga",
    datePosted: h(6), verified: true, urgent: true,
  },
  {
    id: "ti3", category: "direct_interest", type: "interest",
    clubName: "Aalborg Håndbold", clubLogo: "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=80&h=80&fit=crop",
    title: "Requested your availability", subtitle: "Sporting director wants to know your contract situation",
    location: "Aalborg, Denmark", country: "Denmark", level: "Professional", division: "Håndboldligaen",
    datePosted: d(1), verified: true,
  },
  {
    id: "ti4", category: "direct_interest", type: "interest",
    clubName: "Telekom Veszprém", clubLogo: "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=80&h=80&fit=crop",
    title: "Declared interest", subtitle: "Formal expression of interest sent to your agent",
    location: "Veszprém, Hungary", country: "Hungary", level: "Professional", division: "NB I",
    datePosted: d(2),
  },
  {
    id: "ti5", category: "direct_interest", type: "interest",
    clubName: "Vardar Skopje", clubLogo: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=80&h=80&fit=crop",
    title: "Viewed your profile", subtitle: "First-team coach viewed your stats page",
    location: "Skopje, North Macedonia", country: "North Macedonia", level: "Professional", division: "Super League",
    datePosted: d(4),
  },
];

export const categoryLabels: Record<OpportunityCategory, { label: string; description: string }> = {
  recruiting_position: { label: "Recruiting Your Position", description: "Clubs actively looking for your position" },
  preferred_country: { label: "In Your Preferred Countries", description: "Openings in countries you've selected" },
  trial_camp: { label: "Trials & Camps", description: "Upcoming trial sessions and development camps" },
  direct_interest: { label: "Direct Interest", description: "Clubs that have shown interest in you" },
};

export const allPositions = ["Left Back", "Right Back", "Center Back", "Left Wing", "Right Wing", "Pivot", "Goalkeeper"];
export const allCountries = [...new Set(transferOpportunities.map(o => o.country))].sort();
export const allLevels = ["Professional", "Semi-Pro", "Amateur", "Youth"];
export const allDivisions = [...new Set(transferOpportunities.map(o => o.division))].filter(d => d !== "Multiple").sort();
