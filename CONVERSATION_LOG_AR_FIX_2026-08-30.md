# Conversation Log - Getas AR Project
Date: 2026-08-30

## Problem
User reported that in AR fallback mode (`ar-fallback.jsx`), only the "Pendopo" marker was clickable, while markers Poin.001 to Poin.009 were not responding to clicks.

## Root Cause Analysis
From console debug logs:
```
All node names in GLB: [...'Pendopo', 'Poin001', 'Poin002', ..., 'Poin009'...]
Total POI Groups found: 1  // Only Pendopo!
Final poiMeshes keys: ['Pendopo']
```

**Issue Found:**
- GLB file uses node names: `Poin001`, `Poin002`, ..., `Poin009` (WITHOUT dots)
- Code regex was: `/^Poin\.(\d+)$/` (SEARCHING FOR Poin.DOT.number)
- This regex only matched `Pendopo` and failed to match any `Poin00X` nodes

## Solution Implemented

### 1. Fixed `findPoiGroup()` Regex
**Before:**
```javascript
const match = current.name && current.name.match(/^Poin\.(\d+)$/);
if (match) return { key: `Poin.${match[1].padStart(3, '0')}`, groupNode: current };
```

**After:**
```javascript
const match = current.name && current.name.match(/^Poin(\d+)$/);  // Removed the dot
if (match) return { key: `Poin.${match[1].padStart(3, '0')}`, groupNode: current };
```

Also changed `while` loop to `do-while` to ensure the model node itself is checked.

### 2. Updated `poiData` Object Keys
Changed from:
```javascript
"Poin.001": { ... },
"Poin.002": { ... },
// ... etc
```

To:
```javascript
"Poin001": { ... },
"Poin002": { ... },
// ... etc
```

This matches the actual node names in the GLB file.

## Result
- Total POI Groups found: 9 (was 1)
- All markers (Pendopo + Poin.001 to Poin.009) now have clickable HTML overlays
- Debug logs confirmed all 9 POI groups were properly detected and markers created

## Files Modified
- `src/ar-fallback.jsx` - Lines 165-174 (findPoiGroup function), Lines 23-31 (poiData keys)

## Files Added (for logging/debugging)
- Console debug logs added to track POI detection and marker creation
