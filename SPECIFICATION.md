# SaltyDog — Design & Development Specification

> **Version:** 2.0.0  
> **Last Updated:** February 20, 2026  
> **Platform-Agnostic Reference Document**

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Overview](#2-product-overview)
3. [Target Users & Use Cases](#3-target-users--use-cases)
4. [Functional Requirements](#4-functional-requirements)
5. [User Interface Specification](#5-user-interface-specification)
6. [Data Model & State Management](#6-data-model--state-management)
7. [Technical Requirements](#7-technical-requirements)
8. [Business Logic & Algorithms](#8-business-logic--algorithms)
9. [Platform Considerations](#9-platform-considerations)
10. [Visual Design Guidelines](#10-visual-design-guidelines)
11. [Assets & Resources](#11-assets--resources)
12. [Testing Requirements](#12-testing-requirements)
13. [Future Roadmap](#13-future-roadmap)

---

## 1. Executive Summary

**SaltyDog** is a nautical-themed wearable/mobile application designed for sailors, boaters, and marine enthusiasts. It provides real-time GPS-based navigation data including speed over ground (SOG), heading, session statistics, and track visualization—all presented in a clean, ocean-inspired interface with animated wave graphics.

### Key Value Proposition

- Real-time speed and heading data at a glance
- Session tracking with top speed and distance traveled
- Visual track/path map of journey
- Unit flexibility (knots, MPH, KPH)
- Nautical aesthetic design
- Battery-optimized background operation

---

## 2. Product Overview

### 2.1 Application Name

**SaltyDog**

### 2.2 Application Type

- Wearable Application (Smartwatch)
- Mobile Application (Smartphone)
- Potential: Tablet / Marine Display

### 2.3 Core Purpose

Provide sailors and boaters with essential navigation data in a quick-glance format optimized for on-water use.

### 2.4 Design Philosophy

- **Glanceability:** Critical data visible without interaction
- **Maritime Theme:** Ocean-inspired visual design
- **Simplicity:** Minimal UI with maximum utility
- **Durability:** Works reliably in challenging conditions

---

## 3. Target Users & Use Cases

### 3.1 Primary Users

| User Type            | Description                                           |
| -------------------- | ----------------------------------------------------- |
| Recreational Sailors | Weekend sailors needing quick speed/heading reference |
| Boaters              | Powerboat operators monitoring speed and distance     |
| Kayakers/Paddlers    | Tracking paddling sessions and distance               |
| Marine Professionals | Charter captains, ferry operators, etc.               |

### 3.2 Use Cases

#### UC-1: Real-Time Speed Monitoring

**Actor:** Sailor  
**Trigger:** User glances at watch while sailing  
**Flow:**

1. App displays current speed in selected unit (knots/MPH/KPH)
2. User reads speed without interaction
3. Speed updates in real-time as vessel speed changes

#### UC-2: Heading Check

**Actor:** Boater  
**Trigger:** User needs to verify current heading  
**Flow:**

1. App displays heading in degrees (0-360°)
2. Directional indicator rotates to show visual heading
3. User confirms course alignment

#### UC-3: Unit Toggle

**Actor:** User  
**Trigger:** User prefers different speed unit  
**Flow:**

1. User taps main screen
2. Speed unit cycles: Knots → MPH → KPH → Knots
3. Display updates immediately with converted value

#### UC-4: Session Statistics Review

**Actor:** Sailor  
**Trigger:** User wants to see trip stats  
**Flow:**

1. User navigates to stats view
2. App displays top speed, total distance, and track map
3. User reviews session performance

#### UC-5: Session Reset

**Actor:** User  
**Trigger:** Starting a new trip  
**Flow:**

1. User taps "RESET" button on stats view
2. All session data clears (top speed, distance, track)
3. Fresh tracking begins

---

## 4. Functional Requirements

### 4.1 Core Features

| ID    | Feature                   | Priority | Description                            |
| ----- | ------------------------- | -------- | -------------------------------------- |
| F-001 | Real-time SOG Display     | P0       | Display current speed over ground      |
| F-002 | Real-time Heading Display | P0       | Display current heading in degrees     |
| F-003 | Directional Indicator     | P0       | Visual compass/arrow showing heading   |
| F-004 | Clock Display             | P0       | Standard time display (12-hour format) |
| F-005 | Unit Toggle               | P1       | Cycle between knots, MPH, KPH          |
| F-006 | Top Speed Tracking        | P1       | Record highest speed during session    |
| F-007 | Distance Tracking         | P1       | Calculate total distance traveled      |
| F-008 | Track Visualization       | P1       | Visual map of GPS path                 |
| F-009 | Session Reset             | P1       | Clear all session statistics           |
| F-010 | Animated Waves            | P2       | Decorative wave animation              |
| F-011 | Background Operation      | P2       | Continue tracking when app not focused |
| F-012 | Battery Optimization      | P2       | Pause animations when display off      |

### 4.2 Feature Details

#### F-001: Real-time SOG Display

- **Input:** GPS speed (meters/second)
- **Output:** Converted speed value with 1 decimal precision
- **Update Frequency:** On every GPS update
- **Default Unit:** Knots
- **Display Format:** `XX.X` (e.g., "6.5")

#### F-002: Real-time Heading Display

- **Input:** GPS heading (degrees)
- **Output:** Integer degrees with degree symbol
- **Range:** 0° – 360°
- **Display Format:** `XXX°` (e.g., "045°")

#### F-003: Directional Indicator

- **Type:** Rotating arrow/compass icon
- **Rotation:** Negative of heading (indicator points to north)
- **Origin:** Center of indicator element

#### F-005: Unit Toggle

- **Interaction:** Single tap on main display area
- **Cycle Order:** Knots → MPH → KPH → Knots
- **Persistence:** Session-only (resets to knots on app restart)
- **Label Updates:**
  - Knots: "kts"
  - MPH: "mph"
  - KPH: "kph"

#### F-007: Distance Tracking

- **Algorithm:** Haversine formula
- **Base Unit:** Nautical miles (internal)
- **Display Conversion:**
  - Knots mode: nautical miles ("nm")
  - MPH mode: statute miles ("mi")
  - KPH mode: kilometers ("km")
- **Noise Filter:** Ignore movements < 0.001 nm (~6 feet)

#### F-008: Track Visualization

- **Storage:** Array of {latitude, longitude} points
- **Max Points:** 500 (rolling buffer)
- **Display Elements:**
  - Start marker (green circle)
  - Current position marker (orange circle)
  - Path line (optional)
- **Scaling:** Auto-fit to container bounds with padding

---

## 5. User Interface Specification

### 5.1 View Architecture

```
┌──────────────────────────────────────┐
│            Application               │
├──────────────────┬───────────────────┤
│    View 1        │      View 2       │
│  (Main/Nav)      │    (Stats)        │
├──────────────────┼───────────────────┤
│ • Clock          │ • Header          │
│ • Speed (SOG)    │ • Top Speed       │
│ • Heading        │ • Distance        │
│ • Dir Indicator  │ • Track Map       │
│ • Wave Animation │ • Reset Button    │
└──────────────────┴───────────────────┘
         ↔ Navigate via chevrons
```

### 5.2 View 1: Main Navigation View

#### Layout (Top to Bottom)

| Element             | Position       | Description                         |
| ------------------- | -------------- | ----------------------------------- |
| Clock               | Top-left       | Current time in 12-hour format      |
| Speed (SOG)         | Middle-left    | Large speed value with unit label   |
| Heading             | Below speed    | Heading in degrees with "hdg" label |
| Direction Indicator | Right side     | Rotating arrow/vane                 |
| Wave Animation      | Bottom         | Animated wave graphic               |
| Navigation Chevrons | Bottom corners | < > indicators for view switching   |

#### Element Specifications

**Clock Display**

- Font: System bold/heavy (100pt equivalent)
- Format: `H:MM` (12-hour, no leading zero on hour)
- Position: Upper left quadrant
- Color: White

**Speed Display**

- Label: Unit indicator (kts/mph/kph) in accent color
- Value: Large numeric display in white
- Font: Bold/black weight, large size (70pt equivalent)
- Precision: 1 decimal place
- Tap Action: Cycle unit

**Heading Display**

- Label: "hdg" in accent color
- Value: Integer degrees with ° symbol
- Position: Below speed
- Font: Medium size (32pt equivalent)

**Direction Indicator**

- Type: Arrow/vane image
- Size: 50×80px equivalent
- Behavior: Rotates opposite to heading (points north)
- Position: Right-center of screen

**Wave Animation**

- Asset: Seamless horizontal wave pattern
- Animation 1: Horizontal scroll (10-second cycle)
- Animation 2: Vertical bob (1-second cycle)
- Animation 3: Subtle rotation (±5°, 5-second cycle)
- Battery: Pauses when display off or stats view active

### 5.3 View 2: Stats View

#### Layout (Top to Bottom)

| Element         | Y Position   | Description                |
| --------------- | ------------ | -------------------------- |
| Header          | Top          | "SESSION STATS" title      |
| Top Speed Label | Below header | "TOP SPEED"                |
| Top Speed Value | Below label  | Large numeric + unit       |
| Distance Label  | Below speed  | "DISTANCE"                 |
| Distance Value  | Inline       | Value + unit               |
| Track Map       | Middle       | Visual path representation |
| Reset Button    | Bottom       | "RESET" action button      |

#### Element Specifications

**Stats Header**

- Text: "SESSION STATS"
- Alignment: Center
- Color: Accent blue
- Font: Bold, 24pt equivalent

**Top Speed Display**

- Label: "TOP SPEED" (16pt, accent color)
- Value: Large numeric (48pt, white)
- Unit: Matches current preference (24pt, white)

**Distance Display**

- Label: "DISTANCE" (16pt, accent color)
- Value: Numeric with 2 decimal places + unit (32pt, white)
- Unit conversion based on speed unit preference

**Track Map Container**

- Background: Dark semi-transparent panel
- Dimensions: ~300×130px equivalent
- Label: "TRACK" in corner
- Start Marker: Green circle (4px radius)
- Current Marker: Orange circle (5px radius)
- Scaling: Auto-fit GPS bounds with padding

**Reset Button**

- Background: Accent blue (#47A8FF)
- Text: "RESET" in white
- Size: 100×36px equivalent
- Corners: Rounded (8px radius)
- Position: Bottom center
- Action: Clear all session data

### 5.4 Navigation

**Left Chevron (<)**

- Position: Bottom-left corner
- Tap Area: 50×80px equivalent
- Active Color: White (when can navigate back)
- Inactive Color: Gray (#666) (when on first view)

**Right Chevron (>)**

- Position: Bottom-right corner
- Tap Area: 50×80px equivalent
- Active Color: White (when can navigate forward)
- Inactive Color: Gray (#666) (when on last view)

---

## 6. Data Model & State Management

### 6.1 Application State

```typescript
interface AppState {
  // View State
  currentView: 0 | 1; // 0=main, 1=stats

  // User Preferences
  speedUnit: "knots" | "mph" | "kph";

  // Real-time Data
  currentSpeed: number; // m/s (raw GPS)
  currentHeading: number; // degrees
  currentPosition: GeoCoordinate | null;

  // Session Data
  session: SessionData;

  // Animation State
  waveXDirection: "in" | "out";
  waveYDirection: "up" | "down";
  animationsActive: boolean;
}

interface SessionData {
  topSpeed: number; // m/s (raw)
  topSpeedKnots: number;
  topSpeedMph: number;
  topSpeedKph: number;
  totalDistance: number; // nautical miles
  trackPoints: GeoCoordinate[];
  lastPosition: GeoCoordinate | null;
}

interface GeoCoordinate {
  lat: number; // latitude (decimal degrees)
  lon: number; // longitude (decimal degrees)
}
```

### 6.2 Data Flow

```
GPS Hardware
     │
     ▼
┌─────────────────┐
│ Position Event  │
│ • speed (m/s)   │
│ • heading (°)   │
│ • latitude      │
│ • longitude     │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ Position Handler                         │
│ ┌─────────────┐  ┌──────────────────┐   │
│ │ Convert     │  │ Update Session   │   │
│ │ Speed Units │  │ • Check top speed│   │
│ └──────┬──────┘  │ • Calc distance  │   │
│        │         │ • Add track point│   │
│        ▼         └────────┬─────────┘   │
│ ┌─────────────┐           │             │
│ │ Update UI   │           │             │
│ │ • Speed     │◀──────────┘             │
│ │ • Heading   │                         │
│ │ • Indicator │                         │
│ └─────────────┘                         │
└─────────────────────────────────────────┘
```

### 6.3 Session Persistence

| Approach    | Description                             |
| ----------- | --------------------------------------- |
| Current     | Session-only (lost on app close)        |
| Recommended | Persist to local storage on each update |
| Advanced    | Cloud sync via companion/mobile app     |

---

## 7. Technical Requirements

### 7.1 Required Permissions

| Permission           | Purpose                            | Required    |
| -------------------- | ---------------------------------- | ----------- |
| GPS/Location         | Speed, heading, position data      | Yes         |
| Background Execution | Continue tracking when not focused | Recommended |
| Storage              | Persist session data               | Recommended |

### 7.2 GPS Requirements

- **Accuracy:** Best available (high accuracy mode)
- **Update Frequency:** Continuous watching (OS-controlled)
- **Required Data:**
  - Speed (meters/second)
  - Heading (degrees, 0-360)
  - Latitude (decimal degrees)
  - Longitude (decimal degrees)

### 7.3 Performance Requirements

| Metric               | Target                               |
| -------------------- | ------------------------------------ |
| App Launch           | < 2 seconds to first display         |
| GPS Acquisition      | Display data within 5 seconds of fix |
| UI Update Latency    | < 100ms from GPS event to display    |
| Animation Frame Rate | 30+ FPS                              |
| Memory Usage         | < 50MB (wearables), < 100MB (mobile) |
| Battery Impact       | < 5% per hour of active use          |

### 7.4 Offline Behavior

- App should function fully offline (no network required)
- GPS must be available
- Display "..." or equivalent when awaiting GPS fix

---

## 8. Business Logic & Algorithms

### 8.1 Speed Conversions

```javascript
// Input: speed in meters per second (m/s)

// Convert m/s to Knots
function toKnots(speedMs) {
  return speedMs / 0.5144456334;
}

// Convert m/s to MPH
function toMph(speedMs) {
  return speedMs / 0.447039259;
}

// Convert m/s to KPH
function toKph(speedMs) {
  return speedMs * 3.6;
}
```

### 8.2 Distance Calculation (Haversine Formula)

```javascript
/**
 * Calculate distance between two GPS coordinates
 * @param lat1, lon1 - First point (decimal degrees)
 * @param lat2, lon2 - Second point (decimal degrees)
 * @returns Distance in nautical miles
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3440.065; // Earth radius in nautical miles

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
```

### 8.3 Distance Unit Conversions

```javascript
// Base unit: Nautical Miles (nm)

// Nautical miles to Statute miles
function nmToMiles(nm) {
  return nm * 1.15078;
}

// Nautical miles to Kilometers
function nmToKm(nm) {
  return nm * 1.852;
}
```

### 8.4 Time Formatting

```javascript
// 12-hour format without leading zero
function formatTime(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();

  // Convert to 12-hour
  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12;

  // Zero-pad minutes
  const paddedMinutes = minutes < 10 ? "0" + minutes : minutes;

  return `${hours}:${paddedMinutes}`;
}
```

### 8.5 Track Point Management

```javascript
const MAX_TRACK_POINTS = 500;
const MIN_DISTANCE_THRESHOLD = 0.001; // nm (~6 feet)

function addTrackPoint(lat, lon, sessionData) {
  const currentPosition = { lat, lon };

  if (sessionData.lastPosition) {
    const distance = calculateDistance(
      sessionData.lastPosition.lat,
      sessionData.lastPosition.lon,
      lat,
      lon,
    );

    // Noise filter: only add if moved significantly
    if (distance > MIN_DISTANCE_THRESHOLD) {
      sessionData.totalDistance += distance;
      sessionData.trackPoints.push(currentPosition);

      // Rolling buffer: prevent memory bloat
      if (sessionData.trackPoints.length > MAX_TRACK_POINTS) {
        sessionData.trackPoints.shift();
      }
    }
  } else {
    // First point
    sessionData.trackPoints.push(currentPosition);
  }

  sessionData.lastPosition = currentPosition;
}
```

### 8.6 Track Visualization Scaling

```javascript
function scaleTrackToDisplay(
  trackPoints,
  displayWidth,
  displayHeight,
  padding,
) {
  // Find bounds
  let minLat = Infinity,
    maxLat = -Infinity;
  let minLon = Infinity,
    maxLon = -Infinity;

  for (const point of trackPoints) {
    minLat = Math.min(minLat, point.lat);
    maxLat = Math.max(maxLat, point.lat);
    minLon = Math.min(minLon, point.lon);
    maxLon = Math.max(maxLon, point.lon);
  }

  // Calculate ranges (avoid division by zero)
  const latRange = maxLat - minLat || 0.001;
  const lonRange = maxLon - minLon || 0.001;

  // Scale to fit display
  const scaleX = (displayWidth - 2 * padding) / lonRange;
  const scaleY = (displayHeight - 2 * padding) / latRange;
  const scale = Math.min(scaleX, scaleY);

  // Convert GPS to screen coords
  function toScreen(lat, lon) {
    return {
      x: padding + (lon - minLon) * scale,
      y: displayHeight - padding - (lat - minLat) * scale,
    };
  }

  return trackPoints.map((p) => toScreen(p.lat, p.lon));
}
```

---

## 9. Platform Considerations

### 9.1 Wearable Platforms

| Platform       | SDK/Framework                   | Key Considerations                  |
| -------------- | ------------------------------- | ----------------------------------- |
| Fitbit OS      | Fitbit SDK                      | SVG-based UI, limited resources     |
| Wear OS        | Jetpack Compose / Android Views | Full Android capabilities           |
| watchOS        | SwiftUI / WatchKit              | Apple HIG compliance, Complications |
| Garmin         | Connect IQ SDK                  | Monkey C language, resource limits  |
| Samsung Galaxy | Tizen / One UI Watch            | Web-based or native                 |

### 9.2 Mobile Platforms

| Platform       | Framework Options                |
| -------------- | -------------------------------- |
| iOS            | SwiftUI, UIKit                   |
| Android        | Jetpack Compose, XML Views       |
| Cross-Platform | React Native, Flutter, .NET MAUI |

### 9.3 Platform-Specific Adaptations

**Wearable (Small Screen)**

- Prioritize glanceability
- Larger touch targets
- Reduce animation complexity
- Single view with scroll/swipe navigation

**Mobile (Standard Screen)**

- Full dashboard layout option
- More detailed statistics
- Charts/graphs for session history
- Settings screen for preferences

**Tablet / Marine Display**

- Multi-pane layout
- Additional data points (VMG, bearing, etc.)
- Map integration
- Persistent display mode

### 9.4 GPS API Reference

| Platform          | GPS API                                 |
| ----------------- | --------------------------------------- |
| Fitbit OS         | `geolocation.watchPosition()`           |
| Wear OS / Android | `FusedLocationProviderClient`           |
| watchOS / iOS     | `CLLocationManager`                     |
| Garmin            | `Position.getInfo()`                    |
| Web               | `navigator.geolocation.watchPosition()` |

---

## 10. Visual Design Guidelines

### 10.1 Color Palette

| Name            | Hex       | Usage                                |
| --------------- | --------- | ------------------------------------ |
| Primary Blue    | `#47A8FF` | Accent, labels, interactive elements |
| Background Dark | `#0a1628` | View 2 background                    |
| Panel Dark      | `#152238` | Track container, panels              |
| Text Primary    | `#FFFFFF` | Main data values                     |
| Text Muted      | `#666666` | Inactive controls, secondary text    |
| Success Green   | `#4CAF50` | Start marker                         |
| Warning Orange  | `#FF5722` | Current position marker              |

### 10.2 Typography

| Element           | Weight      | Size  | Color        |
| ----------------- | ----------- | ----- | ------------ |
| Clock             | Black/Heavy | 100pt | White        |
| Speed Value       | Black/Heavy | 70pt  | White        |
| Heading Value     | Bold        | 32pt  | White        |
| Labels            | Regular     | 36pt  | Primary Blue |
| Stats Header      | Bold        | 24pt  | Primary Blue |
| Stats Value Large | Black       | 48pt  | White        |
| Stats Value Small | Black       | 32pt  | White        |
| Button Text       | Bold        | 18pt  | White        |

### 10.3 Spacing & Layout

- **Screen Padding:** 19-20px from edges
- **Element Spacing:** 8-16px between elements
- **Button Padding:** 10px vertical, 20px horizontal
- **Border Radius:** 8px for buttons/panels

### 10.4 Animation Specifications

**Wave Horizontal Scroll**

- Duration: 10 seconds
- Easing: Linear (continuous)
- Direction: Left to right
- Pattern: Seamless loop (image width = 2× visible width)

**Wave Vertical Bob**

- Duration: 1 second
- Easing: Ease-in-out
- Range: ±5-10px vertical

**Wave Rotation**

- Duration: 5 seconds
- Range: ±5°
- Easing: Ease-in-out

---

## 11. Assets & Resources

### 11.1 Required Image Assets

| Asset               | Purpose              | Format         | Sizes Needed      |
| ------------------- | -------------------- | -------------- | ----------------- |
| App Icon            | App launcher         | PNG            | Platform-specific |
| Direction Indicator | Heading arrow        | PNG/SVG        | 50×80px base      |
| Wave Pattern        | Animation background | PNG (tileable) | 336×60px tile     |

### 11.2 Direction Indicator Specifications

- Arrow/vane pointing up (north = 0°)
- Clean, simple silhouette
- High contrast (white/light on transparent)
- Rotation pivot point: bottom center

### 11.3 Wave Pattern Specifications

- Horizontally seamless (left edge matches right edge)
- Semi-transparent suggested
- Ocean wave silhouette
- Width should be 2× display width for smooth looping

---

## 12. Testing Requirements

### 12.1 Unit Tests

| Component            | Test Cases                               |
| -------------------- | ---------------------------------------- |
| Speed Conversion     | All three unit conversions               |
| Distance Calculation | Known coordinates, edge cases            |
| Time Formatting      | 12-hour edge cases (noon, midnight, 1pm) |
| Track Scaling        | Single point, two points, many points    |

### 12.2 Integration Tests

| Scenario        | Test                                    |
| --------------- | --------------------------------------- |
| GPS Updates     | Verify UI updates with position changes |
| Unit Toggle     | All three states cycle correctly        |
| View Navigation | Chevrons function, views switch         |
| Session Reset   | All data clears, UI reflects reset      |

### 12.3 Manual Test Scenarios

| ID   | Scenario                        | Expected Result                       |
| ---- | ------------------------------- | ------------------------------------- |
| T-01 | Launch app with GPS on          | Display shows speed/heading within 5s |
| T-02 | Launch app with GPS off         | Display shows "..." or loading state  |
| T-03 | Walk/drive with app open        | Speed increases, track records        |
| T-04 | Achieve high speed, check stats | Top speed reflects max achieved       |
| T-05 | Navigate to stats, back to main | Both views render correctly           |
| T-06 | Reset session                   | All stats return to zero              |
| T-07 | Toggle units 3 times            | Cycles through kts → mph → kph → kts  |
| T-08 | Turn display off, back on       | Animations resume (main view)         |

### 12.4 Performance Tests

| Test                         | Acceptance Criteria         |
| ---------------------------- | --------------------------- |
| Memory with 500 track points | < 50MB on wearable          |
| 8+ hours continuous use      | No crashes, data intact     |
| Rapid GPS updates (1/sec)    | No UI lag or dropped frames |

---

## 13. Future Roadmap

### 13.1 Phase 1 Enhancements

- [ ] Persist session data across app restarts
- [ ] User preference persistence (speed unit)
- [ ] Enhanced track visualization (path lines)
- [ ] 24-hour time format option

### 13.2 Phase 2 Features

- [ ] Session history (past trips)
- [ ] Export session data (GPX, CSV)
- [ ] Companion mobile app
- [ ] Cloud sync

### 13.3 Phase 3 Advanced

- [ ] VMG (Velocity Made Good) calculation
- [ ] Bearing/waypoint to destination
- [ ] Weather data integration
- [ ] Tide information
- [ ] AIS data integration

### 13.4 Platform Expansion Priority

1. Wear OS (Google/Samsung watches)
2. watchOS (Apple Watch)
3. iOS mobile app
4. Android mobile app
5. Garmin Connect IQ

---

## Appendix A: Constants Reference

```javascript
// Earth radius for distance calculations
const EARTH_RADIUS_NM = 3440.065; // nautical miles
const EARTH_RADIUS_MI = 3958.8; // statute miles
const EARTH_RADIUS_KM = 6371.0; // kilometers

// Speed conversion factors (from m/s)
const MS_TO_KNOTS = 1.9438444924; // 1 m/s = 1.94 knots
const MS_TO_MPH = 2.2369362921; // 1 m/s = 2.24 mph
const MS_TO_KPH = 3.6; // 1 m/s = 3.6 kph

// Distance conversion factors
const NM_TO_MI = 1.15078; // 1 nm = 1.15 mi
const NM_TO_KM = 1.852; // 1 nm = 1.852 km

// Application limits
const MAX_TRACK_POINTS = 500;
const MIN_MOVEMENT_THRESHOLD_NM = 0.001; // ~6 feet
```

---

## Appendix B: Glossary

| Term      | Definition                                             |
| --------- | ------------------------------------------------------ |
| SOG       | Speed Over Ground - actual speed relative to the earth |
| Heading   | Direction of travel in degrees (0-360°)                |
| Knots     | Nautical miles per hour                                |
| VMG       | Velocity Made Good - speed toward a destination        |
| Haversine | Formula for calculating great-circle distance          |
| Track     | Recorded path of GPS coordinates                       |
| Session   | Period between app launch/reset and close/reset        |

---

_Document prepared for cross-platform development of SaltyDog application._
