@AGENTS.md

# Travellio

A React Native travel planning app built with Expo 55. It lets users browse a trip's destinations, activities, accommodations, and transport legs with an interactive map.

## Tech stack

- **Expo ~55** / **React Native 0.83.6** / **React 19.2** / **TypeScript ~5.9**
- **expo-router** (file-based routing, typed routes enabled)
- **react-native-maps** for the interactive map
- **@gorhom/bottom-sheet** for the slide-up panel in the Trip tab
- **dayjs** for all date handling
- **i18next / react-i18next** for i18n (en-us and pt-br locales at `src/i18n/locales/`)
- **react-native-reanimated + react-native-gesture-handler** for animations/gestures

## Running the app

```bash
npm start          # Expo dev server (choose platform interactively)
npm run android    # Android
npm run ios        # iOS
npm run web        # Web
npm run lint       # ESLint
```

## Environment variables

All variables are prefixed `EXPO_PUBLIC_` and defined in `.env.local`:

| Variable                          | Purpose                                                                            |
| --------------------------------- | ---------------------------------------------------------------------------------- |
| `EXPO_PUBLIC_TRIP_JSON`           | Full trip JSON blob used for local development (loaded by `TripProvider` on mount) |
| `EXPO_PUBLIC_API_URL`             | Backend API base URL (e.g. `http://192.168.x.x:5000/api`)                          |
| `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key                                                                |

## Project structure

```
src/
  app/
    _layout.tsx          # Root layout: NativeTabs (Home + Trip)
    index.tsx            # Home tab (placeholder)
    explore.tsx          # Explore tab (placeholder)
    trip/
      _layout.tsx        # Trip layout: MapView + BottomSheet wrapping all trip routes
      index.tsx          # Entry → TripOverview
      TripOverview.tsx   # Lists destinations with activity/night counts
      DestinationOverview.tsx  # Destination detail: accommodations, transit, activities
      PlaceDetails.tsx   # Place/activity detail with rating, opening hours, actions
      TripBudget.tsx     # Budget screen (placeholder)
  components/
    MapView.tsx          # Interactive map with markers + AutoCompleteInput overlay
    ActivitiesItinerary.tsx  # Activities grouped by date
    ArrivalDepartureOverview.tsx  # Collapsable transport card with legs
    HeroView.tsx         # Scrollable screen with hero image header
    ui/                  # Reusable UI primitives (see below)
  hooks/
    useTrip.tsx          # TripProvider + useTripContext — trip state and derived lists
    useMap.tsx           # MapProvider + useMapContext — map focus state
    useInternalRouter.tsx  # InternalRouteProvider — goToDestination/goToPlace helpers
    useTheme.ts          # useThemeColor and getThemeProperty
    useDebounce.ts       # Debounce hook
  models/                # TypeScript interfaces (Trip, Destination, Activity, Accommodation, Transportation, Place, …)
  services/
    MapService.ts        # API calls: getPlaceDetails, getAutoComplete
    TripService.ts       # CDN photo URL helpers (DigitalOcean Spaces)
  helpers/
    DateHelper.ts        # dayjs wrappers: displayDate, dateDiff, formatDuration, utcDate
    MapHelper.ts         # getRadiusFromRegion (Haversine — meters from map viewport)
    PlaceHelper.ts       # getOpenStatus / isOpenNow — opening hours logic
    UrlHelper.ts         # sanitizeUrl — strips protocol and www
  constants/
    theme.ts             # Colors, Theme (light/dark ColorScheme + BaseScheme spacing)
  i18n/
    index.ts             # i18next setup
    locales/en-us.json
    locales/pt-br.json
```

## Architecture

### Trip tab layout

The `/trip` route wraps all sub-screens in a shared layout (`trip/_layout.tsx`) that provides:

1. A fullscreen `MapView` behind everything
2. A `BottomSheet` (snap points 20 % / 50 % / 93 %) whose scroll view renders the current `<Slot />`
3. Three React context providers: `InternalRouteProvider` → `MapProvider` → `TripProvider`

Navigation within the trip tab goes through `useInternalRouterContext` (`goToDestination`, `goToPlace`) instead of calling `useRouter` directly, so the map can react to route changes.

### Context providers

- **TripProvider** (`useTrip.tsx`): holds `trip` state; derives `destinations`, `activities`, `accommodations`, `transportations` via `useMemo`. On mount, reads `EXPO_PUBLIC_TRIP_JSON` to seed local dev data.
- **MapProvider** (`useMap.tsx`): holds `centeredMarkers`, `selectedMarker`, `focusedDestinationId`. Exposes `focusTripMarkers`, `focusDestinationMarkers`, `focusPlaceMarker` — called by screens to drive map viewport and callout state.
- **InternalRouteProvider** (`useInternalRouter.tsx`): wraps `useRouter` with dedup logic (won't push if already on the same param).

### Map markers

| Color        | Type                                                  |
| ------------ | ----------------------------------------------------- |
| Blue         | Destination cities                                    |
| Red / Orange | Activities (orange if category contains "Restaurant") |
| Green        | Accommodations                                        |
| Orange pin   | Newly searched place (not yet in trip)                |

Activity and accommodation markers are only shown when a destination is focused (`focusedDestinationId` is set).

### Data models

```
Trip
  destinations: Destination[]
    place: Place
    accommodations: Accommodation[]
    activities: Activity[]
  transportations: Transportation[]
    legs: Leg[]           # one or more segments per trip (e.g. flight + train)
```

Place details (coordinates, address, images, opening hours, etc.) are fetched on demand via `MapService.getPlaceDetails(placeId)`. Images are CDN keys resolved by `TripService.getPhotoForPlace(keys)` into DigitalOcean Spaces URLs.

## UI component library (`src/components/ui/`)

All components are theme-aware via `useThemeColor` / `getThemeProperty`.

| Component           | Purpose                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------- |
| `ThemedView`        | Base view with optional `background` prop for background fill                               |
| `ThemedText`        | Text with `TextType` variant (Display, Title, Headline, Caption, Footnote)                  |
| `ThemedButton`      | Button with `ButtonType` (Primary/Secondary) and optional icon; supports `round` pill shape |
| `CardView`          | Rounded card with background accent fill                                                    |
| `Collapsable`       | Expand/collapse container with `header` and `body` slots                                    |
| `CardSeeMore`       | Text with a "see more / see less" toggle (uses `numberOfLines`)                             |
| `IconCaptionText`   | Icon + stacked title + value layout used throughout detail screens                          |
| `Icon`              | Symbol icon mapped by name string (see `IconSymbols` type)                                  |
| `Tag`               | Pill badge                                                                                  |
| `PressableView`     | Touchable wrapper                                                                           |
| `HorizontalDivider` | Thin divider with optional `centerContent`                                                  |
| `AutoCompleteInput` | Search input that calls `MapService.getAutoComplete` with debouncing and abort signal       |
| `ExternalLink`      | Tappable link that opens in-app browser or system handler                                   |
| `CardList`          | Scrollable card list                                                                        |

## Theme system

`src/constants/theme.ts` exports:

- `Colors` — raw hex palette
- `Theme` — `ThemeScheme` with `light`, `dark`, and `base` objects
- `ColorScheme` keys: `background`, `backgroundSoft`, `backgroundAccent`, `text`, `caption`, `placeholder`, `divider`, `border`, `link`, `activeTint`, `inactiveTint`
- `BaseScheme` keys: `smallSpacing` (4), `mediumSpacing` (8), `largeSpacing` (16), `borderRadius` (16), `textSize` (16)

Use `useThemeColor("key")` in components, `getThemeProperty("key")` outside React for StyleSheet constants.
