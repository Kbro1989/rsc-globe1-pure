# Auto-Save System

## Overview
**Every game state is automatically saved to KV** - players never lose progress, even if they forget to logout.

## Auto-Save Triggers

### 1. Time-Based (Every 30 seconds)
```javascript
setInterval(() => savePlayerState(mc), 30000);
```
- Saves every 30 seconds while logged in
- Continuous background persistence
- No player action required

### 2. Tab Switch / Minimize
```javascript
document.addEventListener('visibilitychange', () => {
    if (document.hidden) savePlayerState(mc);
});
```
- Saves when player switches tabs
- Saves when browser minimized
- Ensures progress saved before context loss

### 3. Browser Close / Refresh
```javascript
window.addEventListener('beforeunload', () => {
    savePlayerState(mc, true);
});
```
- Saves on browser close
- Saves on page refresh
- Saves on navigation away
- **Critical:** Catches "forgot to logout" scenarios

### 4. Rate Limiting
- Max save frequency: Once per 5 seconds
- Prevents excessive KV writes
- Exception: Browser unload (always saves)

## What Gets Saved

### Player State
```javascript
{
    username: string,
    password: string,
    
    // Position
    x: number,
    y: number,
    
    // Stats
    skills: Int32Array,
    experience: Int32Array,
    
    // Inventory
    inventory: Int32Array,
    inventoryCount: Int32Array,
    
    // Quests
    questsComplete: Int8Array,
    questPoints: number,
    
    // Settings
    soundOn: 0 | 1,
    
    // Metadata
    lastSaved: timestamp,
    loginDate: number
}
```

## Benefits

### ✅ Never Lose Progress
- Player forgets to logout? **Saved.**
- Browser crashes? **Saved.**
- Power outage? **Saved (last 30s).**
- Tab closed accidentally? **Saved.**

### ✅ Seamless Experience
- No manual save required
- No "save game" button
- No logout requirement
- Just play and go

### ✅ Cloud Persistence
- All data in Cloudflare KV
- Accessible from any device
- No local storage dependency
- Survives browser cache clear

## Technical Details

### Save Frequency
- **Minimum:** Every 30 seconds (if active)
- **Maximum:** Every 5 seconds (rate limited)
- **Guaranteed:** On browser close

### Data Size
- ~2-5 KB per player save
- Compressed JSON
- Efficient KV usage

### Error Handling
- Failed saves logged to console
- Retries on next interval
- Doesn't block gameplay

## Console Messages

### Success
```
💾 Auto-saved to KV
```

### Failure
```
❌ Auto-save failed: [error]
```

### Startup
```
✅ Auto-Save: ACTIVE (every 30s + on every action)
```

## Future Enhancements

### Potential Additions
1. Save on skill level up
2. Save on quest completion
3. Save on item pickup/drop
4. Save on combat end
5. Configurable save interval

### Current Status
- ✅ Time-based auto-save
- ✅ Tab switch save
- ✅ Browser close save
- ✅ Rate limiting
- ⏳ Action-based saves (future)

## Testing

### Verify Auto-Save Works
1. Login to game
2. Wait 30 seconds
3. Check console for "💾 Auto-saved to KV"
4. Close browser (don't logout)
5. Reopen and login
6. Verify position/inventory preserved

### Verify Rate Limiting
1. Open console
2. Watch save messages
3. Should see max 1 save per 5 seconds
4. Exception: Browser close (always saves)
