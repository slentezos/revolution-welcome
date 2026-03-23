

## Dashboard Implementation Plan

This is a large feature set. The plan creates all three role-based dashboards (Player, Coach, Club) with mock data, plus a shared search page with universal and role-specific filters.

### New Files to Create

**Mock Data & Types**
- `src/types/dashboard.ts` — Shared types: `UserRole`, `Player`, `Coach`, `Club`, `Message`, `Opportunity`, `ProfileView`, filter option types
- `src/data/mockData.ts` — Sample players, coaches, clubs, messages, opportunities, profile views, trial announcements

**Dashboard Layout**
- `src/components/dashboard/DashboardLayout.tsx` — Sidebar layout using SidebarProvider with role-based navigation (Home, Search, Messages, Profile, Settings). Role switcher dropdown at top of sidebar.
- `src/components/dashboard/DashboardSidebar.tsx` — Sidebar component with nav items and role switcher

**Shared Dashboard Components**
- `src/components/dashboard/ActionPanel.tsx` — Top stats row (profile completion %, messages, profile views, role-specific metric). Reused across all 3 roles with different data.
- `src/components/dashboard/OpportunityCard.tsx` — Card for an opportunity/candidate listing
- `src/components/dashboard/ProfileViewItem.tsx` — Single profile view row
- `src/components/dashboard/RecommendationCard.tsx` — Recommended club/player/coach card

**Player Dashboard**
- `src/pages/dashboard/PlayerDashboard.tsx` — Action panel + Opportunities feed (clubs recruiting position, trials) + Visibility section (profile views, suggestions, featured players)

**Coach Dashboard**
- `src/pages/dashboard/CoachDashboard.tsx` — Action panel + Candidates section (free agents, players in division) + Education & assistant coaches

**Club Dashboard**
- `src/pages/dashboard/ClubDashboard.tsx` — Action panel + Market activity (free agents, matching players/coaches) + Contract tracker & saved prospects

**Dashboard Entry**
- `src/pages/Dashboard.tsx` — Wraps DashboardLayout, renders the correct role dashboard based on selected role state

**Search Page**
- `src/pages/Search.tsx` — Full search page inside DashboardLayout
- `src/components/search/UniversalFilters.tsx` — Role, Location, Level, Availability, Division filters (always visible)
- `src/components/search/PlayerFilters.tsx` — Position, Age, Contract Status, Handedness + collapsible advanced (Height, Experience, Nationality, etc.)
- `src/components/search/CoachFilters.tsx` — Specialization, Experience, License, Role + collapsible advanced
- `src/components/search/ClubFilters.tsx` — Division, Recruiting, Club Type, Country + collapsible advanced
- `src/components/search/SearchResults.tsx` — Grid of result cards with role-appropriate display

**In-Dashboard Filters**
- `src/components/dashboard/QuickFilters.tsx` — Compact inline filter bar for the main feed section of each dashboard (subset of search filters)

### Route Changes
- `src/App.tsx` — Add `/dashboard` route pointing to Dashboard.tsx, `/dashboard/search` for Search.tsx

### Technical Details

- Role state managed via React useState in Dashboard.tsx, passed via context or props
- Create `src/contexts/DashboardContext.tsx` for role + filter state shared between dashboard and search
- Filters use existing Select, Checkbox, Input, Collapsible, Slider components
- Cards use existing Card, Badge, Button, Progress components
- Sidebar uses existing Sidebar UI component with collapsible="icon"
- All data is mock — structured so it can be swapped for Supabase queries later
- Mobile-responsive: sidebar collapses to icon mode, action panel stacks vertically
- Approximately 18 new files total

### Implementation Order
1. Types and mock data
2. Dashboard context
3. Sidebar + layout
4. Action panel (shared)
5. Three role dashboards with opportunity/candidate cards
6. Universal + role-specific filter components
7. Search page
8. Quick filters in dashboard
9. Route registration

