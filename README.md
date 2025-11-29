# Globe 1: Pure RSC Preservation

**Fresh @2003scape RSC Foundation with Minimal Changes**

## Purpose

This is the "Globe 1" server - a pure, authentic RuneScape Classic preservation with only essential modifications:
- Cloudflare KV persistence (cross-session data)
- 2 sound fixes (woodcutting, smelting)

No custom features. No AI. No evolution systems. **Pure 2003-era RSC.**

## Structure

```
rsc-globe1-pure/
├── rsc-server/     # @2003scape RSC server
├── rsc-client/     # @2003scape RSC browser client
├── rsc-sounds/     # Authentic RSC audio files
└── README.md       # This file
```

## Next Steps

1. Apply KV persistence integration
2. Add 2 sound fixes
3. Configure Cloudflare deployment
4. Test & deploy as Globe 1

## Related

- **Tools**: See `../rsc-tools/` for extraction utilities
- **Vision**: See `../rsc-tools/docs/VISION.md` for multi-globe architecture
- **Legacy**: `../copy-of-rsc-evolution-ai/` is the old experimental codebase
