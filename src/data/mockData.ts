import { Player, Coach, Club, Message, Opportunity, ProfileView } from "@/types/dashboard";

export const mockPlayers: Player[] = [
  {
    id: "p1", name: "Lucas Martínez", age: 24, gender: "Male", position: "Left Back",
    nationality: "Spanish", country: "Spain", city: "Barcelona",
    level: "Professional", availability: "Actively Looking", division: "Liga Asobal", leagueTier: "1st League",
    contractStatus: "Free Agent", handedness: "Right", height: 192, experience: 6,
    languages: ["Spanish", "English"], nationalTeam: true, hasVideo: true, verified: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face", profileCompletion: 92,
  },
  {
    id: "p2", name: "Anna Svensson", age: 22, gender: "Female", position: "Right Wing",
    nationality: "Swedish", country: "Sweden", city: "Gothenburg",
    level: "Professional", availability: "Open to Offers", division: "Handbollsligan", leagueTier: "1st League",
    contractStatus: "Expiring", handedness: "Left", height: 175, experience: 4,
    languages: ["Swedish", "English", "German"], nationalTeam: false, hasVideo: true, verified: true,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face", profileCompletion: 85,
  },
  {
    id: "p3", name: "Mehdi Bouazzaoui", age: 27, gender: "Male", position: "Pivot",
    nationality: "French", country: "France", city: "Montpellier",
    level: "Professional", availability: "Actively Looking", division: "Starligue", leagueTier: "1st League",
    contractStatus: "Free Agent", handedness: "Right", height: 198, experience: 8,
    languages: ["French", "Arabic", "English"], nationalTeam: true, hasVideo: true, verified: true,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face", profileCompletion: 97,
  },
  {
    id: "p4", name: "Erik Johansson", age: 20, gender: "Male", position: "Goalkeeper",
    nationality: "Danish", country: "Denmark", city: "Copenhagen",
    level: "Semi-Pro", availability: "Actively Looking", division: "Håndboldligaen", leagueTier: "2nd League",
    contractStatus: "Free Agent", handedness: "Both", height: 195, experience: 3,
    languages: ["Danish", "English"], nationalTeam: false, hasVideo: false, verified: false,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face", profileCompletion: 68,
  },
  {
    id: "p5", name: "Sofia Petrovic", age: 26, gender: "Female", position: "Center Back",
    nationality: "Serbian", country: "Germany", city: "Hamburg",
    level: "Professional", availability: "Open to Offers", division: "Bundesliga", leagueTier: "1st League",
    contractStatus: "Under Contract", handedness: "Right", height: 180, experience: 7,
    languages: ["Serbian", "German", "English"], nationalTeam: true, hasVideo: true, verified: true,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face", profileCompletion: 90,
  },
  {
    id: "p6", name: "Hugo Fernandes", age: 19, gender: "Male", position: "Left Wing",
    nationality: "Portuguese", country: "Portugal", city: "Porto",
    level: "Amateur", availability: "Actively Looking", division: "1ª Divisão", leagueTier: "3rd League",
    contractStatus: "Free Agent", handedness: "Right", height: 178, experience: 2,
    languages: ["Portuguese", "English"], nationalTeam: false, hasVideo: true, verified: false,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face", profileCompletion: 55,
  },
  {
    id: "p7", name: "Niklas Berger", age: 28, gender: "Male", position: "Right Back",
    nationality: "German", country: "Germany", city: "Kiel",
    level: "Professional", availability: "Open to Offers", division: "Bundesliga", leagueTier: "1st League",
    contractStatus: "Expiring", handedness: "Right", height: 191, experience: 9,
    languages: ["German", "English"], nationalTeam: true, hasVideo: true, verified: true,
    avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop&crop=face", profileCompletion: 94,
  },
  {
    id: "p8", name: "Kristian Larsen", age: 25, gender: "Male", position: "Left Back",
    nationality: "Norwegian", country: "Norway", city: "Oslo",
    level: "Professional", availability: "Actively Looking", division: "Håndboldligaen", leagueTier: "1st League",
    contractStatus: "Free Agent", handedness: "Left", height: 189, experience: 5,
    languages: ["Norwegian", "English"], nationalTeam: false, hasVideo: true, verified: true,
    avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&h=200&fit=crop&crop=face", profileCompletion: 82,
  },
  {
    id: "p9", name: "Ivana Kovačević", age: 23, gender: "Female", position: "Right Wing",
    nationality: "Croatian", country: "Croatia", city: "Zagreb",
    level: "Semi-Pro", availability: "Actively Looking", division: "Premijer liga", leagueTier: "2nd League",
    contractStatus: "Under Contract", handedness: "Right", height: 172, experience: 4,
    languages: ["Croatian", "English", "German"], nationalTeam: false, hasVideo: true, verified: false,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face", profileCompletion: 73,
  },
  {
    id: "p10", name: "Balázs Tóth", age: 30, gender: "Male", position: "Pivot",
    nationality: "Hungarian", country: "Hungary", city: "Budapest",
    level: "Professional", availability: "Open to Offers", division: "Bundesliga", leagueTier: "1st League",
    contractStatus: "Expiring", handedness: "Right", height: 200, experience: 11,
    languages: ["Hungarian", "German", "English"], nationalTeam: true, hasVideo: true, verified: true,
    avatar: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=200&h=200&fit=crop&crop=face", profileCompletion: 91,
  },
  {
    id: "p11", name: "Jonas Andersen", age: 21, gender: "Male", position: "Goalkeeper",
    nationality: "Danish", country: "Denmark", city: "Aalborg",
    level: "Semi-Pro", availability: "Actively Looking", division: "Håndboldligaen", leagueTier: "3rd League",
    contractStatus: "Free Agent", handedness: "Right", height: 197, experience: 3,
    languages: ["Danish", "English"], nationalTeam: false, hasVideo: false, verified: false,
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop&crop=face", profileCompletion: 60,
  },
  {
    id: "p12", name: "Lena Fischer", age: 24, gender: "Female", position: "Center Back",
    nationality: "German", country: "Germany", city: "Dortmund",
    level: "Professional", availability: "Open to Offers", division: "Bundesliga", leagueTier: "1st League",
    contractStatus: "Under Contract", handedness: "Left", height: 179, experience: 5,
    languages: ["German", "English"], nationalTeam: false, hasVideo: true, verified: true,
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face", profileCompletion: 87,
  },
  {
    id: "p13", name: "Mateo García", age: 22, gender: "Male", position: "Left Wing",
    nationality: "Spanish", country: "Spain", city: "Madrid",
    level: "Semi-Pro", availability: "Actively Looking", division: "Liga Asobal", leagueTier: "2nd League",
    contractStatus: "Free Agent", handedness: "Right", height: 176, experience: 3,
    languages: ["Spanish", "English"], nationalTeam: false, hasVideo: true, verified: false,
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=face", profileCompletion: 65,
  },
  {
    id: "p14", name: "Oskar Svensson", age: 29, gender: "Male", position: "Right Back",
    nationality: "Swedish", country: "Sweden", city: "Malmö",
    level: "Professional", availability: "Open to Offers", division: "Handbollsligan", leagueTier: "1st League",
    contractStatus: "Expiring", handedness: "Right", height: 188, experience: 10,
    languages: ["Swedish", "English"], nationalTeam: true, hasVideo: true, verified: true,
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop&crop=face", profileCompletion: 93,
  },
  {
    id: "p15", name: "Pierre Dupont", age: 26, gender: "Male", position: "Pivot",
    nationality: "French", country: "France", city: "Paris",
    level: "Professional", availability: "Actively Looking", division: "Starligue", leagueTier: "1st League",
    contractStatus: "Under Contract", handedness: "Right", height: 196, experience: 7,
    languages: ["French", "English"], nationalTeam: false, hasVideo: true, verified: true,
    avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=200&h=200&fit=crop&crop=face", profileCompletion: 88,
  },
];

export const mockCoaches: Coach[] = [
  {
    id: "c1", name: "Thomas Weber", gender: "Male", specialization: "Defense Systems",
    experience: 15, licenseLevel: "EHF Master Coach", preferredRole: "Head Coach",
    nationality: "German", country: "Germany", city: "Berlin",
    level: "Professional", availability: "Actively Looking", leagueTier: "1st League",
    languages: ["German", "English", "French"], willingToRelocate: true, focus: "Senior",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face", profileCompletion: 95,
  },
  {
    id: "c2", name: "Marie Lefèvre", gender: "Female", specialization: "Goalkeeping",
    experience: 10, licenseLevel: "EHF Pro License", preferredRole: "Goalkeeper Coach",
    nationality: "French", country: "France", city: "Paris",
    level: "Professional", availability: "Open to Offers", leagueTier: "1st League",
    languages: ["French", "English"], willingToRelocate: false, focus: "Both",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face", profileCompletion: 88,
  },
  {
    id: "c3", name: "Jens Andersen", gender: "Male", specialization: "Youth Development",
    experience: 8, licenseLevel: "National License", preferredRole: "Assistant Coach",
    nationality: "Danish", country: "Denmark", city: "Aarhus",
    level: "Semi-Pro", availability: "Actively Looking", leagueTier: "2nd League",
    languages: ["Danish", "English", "Norwegian"], willingToRelocate: true, focus: "Youth",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face", profileCompletion: 78,
  },
];

export const mockClubs: Club[] = [
  {
    id: "cl1", name: "THW Kiel", country: "Germany", city: "Kiel",
    division: "Bundesliga", leagueTier: "1st League", level: "Professional", recruiting: "Both",
    clubType: "Professional", rosterSize: 18, facilities: "World-class",
    providesHousing: true, internationalCompetition: true,
    logo: "/placeholder.svg", openPositions: ["Left Back", "Pivot"],
  },
  {
    id: "cl2", name: "FC Barcelona Handbol", country: "Spain", city: "Barcelona",
    division: "Liga Asobal", leagueTier: "1st League", level: "Professional", recruiting: "Players",
    clubType: "Professional", rosterSize: 20, facilities: "World-class",
    providesHousing: true, internationalCompetition: true,
    logo: "/placeholder.svg", openPositions: ["Right Wing"],
  },
  {
    id: "cl3", name: "Paris Saint-Germain HB", country: "France", city: "Paris",
    division: "Starligue", leagueTier: "1st League", level: "Professional", recruiting: "Coaches",
    clubType: "Professional", rosterSize: 19, facilities: "World-class",
    providesHousing: true, internationalCompetition: true,
    logo: "/placeholder.svg", openPositions: [],
  },
  {
    id: "cl4", name: "Aalborg Håndbold", country: "Denmark", city: "Aalborg",
    division: "Håndboldligaen", leagueTier: "1st League", level: "Professional", recruiting: "Both",
    clubType: "Professional", rosterSize: 16, facilities: "Excellent",
    providesHousing: true, internationalCompetition: true,
    logo: "/placeholder.svg", openPositions: ["Goalkeeper", "Center Back"],
  },
  {
    id: "cl5", name: "SG Flensburg-Handewitt", country: "Germany", city: "Flensburg",
    division: "Bundesliga", leagueTier: "1st League", level: "Professional", recruiting: "Players",
    clubType: "Professional", rosterSize: 17, facilities: "World-class",
    providesHousing: false, internationalCompetition: true,
    logo: "/placeholder.svg", openPositions: ["Left Wing"],
  },
];

export const mockMessages: Message[] = [
  { id: "m1", from: "THW Kiel", fromRole: "club", subject: "Interest in your profile", preview: "We have reviewed your game footage and would like to discuss...", timestamp: "2h ago", read: false, avatar: "/placeholder.svg" },
  { id: "m2", from: "Thomas Weber", fromRole: "coach", subject: "Training opportunity", preview: "I'm organizing an elite training camp next month in...", timestamp: "5h ago", read: false, avatar: "/placeholder.svg" },
  { id: "m3", from: "Lucas Martínez", fromRole: "player", subject: "Re: Trial invitation", preview: "Thank you for the invitation. I would be happy to...", timestamp: "1d ago", read: true, avatar: "/placeholder.svg" },
  { id: "m4", from: "Aalborg Håndbold", fromRole: "club", subject: "Goalkeeper position available", preview: "We are looking for a goalkeeper for the upcoming season...", timestamp: "2d ago", read: true, avatar: "/placeholder.svg" },
];

export const mockPlayerOpportunities: Opportunity[] = [
  { id: "o1", type: "recruitment", title: "THW Kiel recruiting Left Back", subtitle: "Bundesliga · Germany", location: "Kiel, Germany", level: "Professional", position: "Left Back", date: "Posted 2h ago", urgent: true, avatar: "/placeholder.svg" },
  { id: "o2", type: "trial", title: "Elite Trial Camp — Scandinavia", subtitle: "Open to all positions · Semi-Pro+", location: "Copenhagen, Denmark", level: "Semi-Pro", date: "Mar 15-18, 2026", avatar: "/placeholder.svg" },
  { id: "o3", type: "recruitment", title: "Aalborg seeking Goalkeeper", subtitle: "Håndboldligaen · Denmark", location: "Aalborg, Denmark", level: "Professional", position: "Goalkeeper", date: "Posted 1d ago", avatar: "/placeholder.svg" },
  { id: "o4", type: "interest", title: "FC Barcelona viewed your profile", subtitle: "Liga Asobal · Spain", location: "Barcelona, Spain", level: "Professional", date: "3h ago", avatar: "/placeholder.svg" },
  { id: "o5", type: "recruitment", title: "SG Flensburg needs Left Wing", subtitle: "Bundesliga · Germany", location: "Flensburg, Germany", level: "Professional", position: "Left Wing", date: "Posted 3d ago", avatar: "/placeholder.svg" },
];

export const mockCoachOpportunities: Opportunity[] = [
  { id: "co1", type: "job", title: "Head Coach — THW Kiel U21", subtitle: "Bundesliga Youth · Germany", location: "Kiel, Germany", level: "Professional", date: "Posted 1d ago", urgent: true, avatar: "/placeholder.svg" },
  { id: "co2", type: "job", title: "Goalkeeper Coach — PSG Handball", subtitle: "Starligue · France", location: "Paris, France", level: "Professional", date: "Posted 3d ago", avatar: "/placeholder.svg" },
  { id: "co3", type: "application", title: "New application from Erik Johansson", subtitle: "Goalkeeper · 20yo · Free Agent", location: "Copenhagen, Denmark", level: "Semi-Pro", date: "5h ago", avatar: "/placeholder.svg" },
];

export const mockClubOpportunities: Opportunity[] = [
  { id: "clo1", type: "application", title: "Lucas Martínez — Left Back", subtitle: "24yo · Free Agent · National Team", location: "Barcelona, Spain", level: "Professional", date: "2h ago", urgent: true, avatar: "/placeholder.svg" },
  { id: "clo2", type: "application", title: "Mehdi Bouazzaoui — Pivot", subtitle: "27yo · Free Agent · 8yr experience", location: "Montpellier, France", level: "Professional", date: "1d ago", avatar: "/placeholder.svg" },
  { id: "clo3", type: "interest", title: "Thomas Weber interested in coaching role", subtitle: "15yr experience · EHF Master Coach", location: "Berlin, Germany", level: "Professional", date: "3h ago", avatar: "/placeholder.svg" },
];

export const mockProfileViews: ProfileView[] = [
  { id: "pv1", viewerName: "THW Kiel", viewerRole: "club", viewerOrg: "Bundesliga", timestamp: "2h ago", avatar: "/placeholder.svg" },
  { id: "pv2", viewerName: "FC Barcelona Handbol", viewerRole: "club", viewerOrg: "Liga Asobal", timestamp: "5h ago", avatar: "/placeholder.svg" },
  { id: "pv3", viewerName: "Thomas Weber", viewerRole: "coach", viewerOrg: "Independent", timestamp: "1d ago", avatar: "/placeholder.svg" },
  { id: "pv4", viewerName: "Aalborg Håndbold", viewerRole: "club", viewerOrg: "Håndboldligaen", timestamp: "2d ago", avatar: "/placeholder.svg" },
  { id: "pv5", viewerName: "Marie Lefèvre", viewerRole: "coach", viewerOrg: "PSG Handball", timestamp: "3d ago", avatar: "/placeholder.svg" },
];
