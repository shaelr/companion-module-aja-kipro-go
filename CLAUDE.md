# companion-module-aja-kipro-go

Companion module for the AJA Ki Pro Go / Ki Pro Go2 recorder.

## Architecture

Built on `@companion-module/base` 2.1.x (module API 2, Companion 5.0+), as an ES module (`"type": "module"`). All source is in `src/`. The entry point is `index.js`, which default-exports `AjaKiProInstance` (built by mixing in the modules below via `Object.assign`) and exports `UpgradeScripts`.

| File | Purpose |
|---|---|
| `src/api.js` | HTTP polling, connection/auth, param fetching, state updates (uses Node's built-in `fetch`) |
| `src/actions.js` | Companion action definitions |
| `src/feedbacks.js` | Companion feedback definitions |
| `src/variables.js` | Variable definitions and `checkVariables()` |
| `src/presets.js` | Preset button definitions |
| `src/configFields.js` | Module config fields (host, password, polling, etc.) |
| `src/upgrades.js` | Companion upgrade scripts |
| `src/meters.js` | Audio meters read from the front panel overlay image (opt-in) |

## Device API

The Ki Pro Go2 exposes a REST API at `http://<host>/`:

- **Connect**: `GET /json?action=connect&configid=0` → returns `connectionid` + initial `configevents` array
- **Poll**: `GET /json?action=wait_for_config_events&configid=0&connectionid=<id>` → long-poll for param changes
- **Get param**: `GET /config?action=get&paramid=eParamID_<name>&configid=0`
- **Set param**: `GET /config?action=set&paramid=eParamID_<name>&value=<v>`
- **Clips**: `GET /clips?action=get_clips`

All param IDs are prefixed `eParamID_` on the wire. In `doCommand(cmd)`, the prefix is prepended automatically, so actions pass `'TransportCommand&value=1'` etc.

## State

`this.state` holds all current device values. Keys use camelCase without the `eParamID_` prefix (e.g. `MediaSlot1State`, `Ch1Enable`). On connect, `processConnection()` fires `doGetParam` calls for every param. The long-poll response feeds `processPollingResponse()`, which handles both `param_id` (event stream) and `name` (GET response) JSON shapes.

### Media slot state values
`0`=Unknown, `1`=Mounting, `2`=Read-Only, `3`=Ready (RW), `4`=Unmounting, `5`=Unmounted, `9`=Error

### Transport state keys (used in feedbacks/presets)
`UNKNOWN`, `IDLE`, `RECORDING`, `FORWARD`, `FORWARD_2X`…`FORWARD_32X`, `FORWARD_STEP`, `REVERSE`…`REVERSE_32X`, `REVERSE_STEP`, `PAUSED`, `IDLE_ERROR`, `RECORD_ERROR`, `PLAY_ERROR`, `PAUSE_ERROR`, `SHUTDOWN`

## Build

```bash
npm install
node_modules/.bin/companion-module-build
```

Output: `aja-kipro-go-<version>.tgz` — import directly into Companion 5+ via Developer > Install from file. `npx companion-module-check` validates the module.

## Key design notes

- `doCommand(cmd)` prepends `eParamID_` — never include it in action callbacks.
- Record destination, backup destination and playback source use the device enum values `5`–`10` (USB 1–5, SMB); backup also allows `0` = None. Check `http://<host>/descriptors` for real enum values before adding params.
- Formatting is done like the web UI: set `StorageCommand` to `5`–`9` (USB 1–5) or `10` (All), then reset `FormatMedia_USB_x` to `0`.
- State values for monitor channels, video/audio inputs, and record destinations are stored as strings (`'0'`, `'1'`, …) and converted to labels in `checkVariables()`.
- Media slot remaining capacity comes in as KB; `checkVariables()` converts to GB with one decimal place.
- `doGetParam` callbacks receive a single parsed JSON object with fields `value`, `value_name`, `str_value` depending on param type.
- There are no audio level params in the API. `src/meters.js` polls `/images/fp-overlay.png` (320x180 front panel overlay the web UI draws its meters from), decodes the PNG and reads the headphone channel VU bars from pixel columns x=280/301 (0 dB at y=28, 1.5 px/dB). Pixels above `0x70` count as lit; unlit segments max out at `0x50`. Each bar has a slow-falling peak-hold marker floating above it, so the level is read upwards from the bottom of the bar (reading the topmost lit pixel tracks the marker instead). The Audio Meter preset's gauges use the device's scale and zones (-70 to 0 dB, yellow from -20, red above -2) so they match the web UI.
- Module API 2.x rules: call `checkAllFeedbacks()` (not `checkFeedbacks()` with no args); `setVariableDefinitions` takes an object; text options with `useVariables` arrive already parsed (there is no `parseVariablesInString`); upgrade scripts receive option values as `{ value, isExpression }`.
- Presets are built as a flat list in `initPresets()` and converted to sections + `simple` definitions at the end. The Audio Meter preset is a `layered` definition with gauge elements driven by local variables bound to the `audio_level_db` value feedback. Avoid `advanced` feedbacks/image buffers — Companion 5 marks them deprecated.
- The build bundles everything into one file with esbuild. `node-rest-client` broke under bundling (`ReferenceError: result is not defined`, crashing the module in a restart loop), so HTTP uses `fetch` via `httpRequest()` / `request()` in `api.js`. Test changes against the built `.tgz` (`pkg/main.js`), not just the source, before releasing.
