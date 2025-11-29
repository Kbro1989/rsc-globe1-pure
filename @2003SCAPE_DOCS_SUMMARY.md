# @2003scape Repository Documentation Summary

## From rsc-client/README.md

### Key Info
- Port of **mudclient revision 204** (Java → JavaScript)
- Works with `rsc-server` and `RSCGo`
- Can use **Web Worker** instead of separate server!

### Build Process
```bash
npm install
npm run build-dev  # Creates dist/index.bundle.js
npm start          # Runs HTTP server on :1337
```

### Assets Required
- `./data204/` directory (cache files via XHR)
- Sprites, landscapes, interfaces

### Web Worker Mode (Important!)
> "if you don't want to host a separate websockets server, you can
> pass a Web Worker instance of rsc-server into the `.server` property"

**This is our deployment strategy!**

## From rsc-sounds/README.md

### Key Info
- Extracts/packs RSC sounds from `.mem` archives
- Format: 8-bit, u-law encoded, 8000 Hz PCM
- Can dump all sounds: `rsc-sounds dump-wav sounds1.mem -i sounds1.json`

### Sound Archive Files
- `sounds1.mem` - Main sound archive
- Contains: death, attack, cooking, anvil, fish, prospect, chisel, foundgem, etc.

### Verification Command
```bash
rsc-sounds dump-wav sounds1.mem -i sounds1.json
```
This creates a JSON list of ALL sounds in the archive!

## From rsc-sprites/README.md

### Key Info
- (De)serializes entity, UI, and texture images
- Two types:
  1. **EntitySprites** - NPCs, players, equipment (`.jag` and `.mem`)
  2. **MediaSprites** - Interface items, inventory icons

### Archive Files
- Entity archives (`.jag` for free, `.mem` for members)
- `media58.jag` - Interface sprites for mudclient204

### Sprite Offsets
Hard-coded in client at `src/mudclient.js#L4350`

## From rsc-server/RSC_PRESERVATION.md
(Need to view this file)

## What This Tells Us

### For Verification
1. **Sounds**: Run `rsc-sounds dump-wav` to get complete list
2. **Sprites**: Check for `media58.jag` and entity archives
3. **Client**: Needs `data204/` directory

### For Deployment
1. Use **Web Worker mode** (no separate server needed!)
2. Build client with `npm run build-dev`
3. Deploy to Cloudflare Pages with bundled assets

### Missing Info
- Exact list of required cache files
- Which `.jag`/`.mem` files are needed
- Complete sound/sprite inventory

## Next Steps
1. View `RSC_PRESERVATION.md` from rsc-server
2. Run sound dump command to inventory sounds
3. Check for required archive files
