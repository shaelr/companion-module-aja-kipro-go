# companion-module-aja-kipro-go

Companion module for the AJA Ki Pro Go / Ki Pro Go2 recorder.

## Architecture

Built on `@companion-module/base`. All source is in `src/`. The entry point is `index.js`, which constructs `AjaKiProInstance` by mixing in the modules below via `Object.assign`.

| File | Purpose |
|---|---|
| `src/api.js` | HTTP polling, connection/auth, param fetching, state updates |
| `src/actions.js` | Companion action definitions |
| `src/feedbacks.js` | Companion feedback definitions |
| `src/variables.js` | Variable definitions and `checkVariables()` |
| `src/presets.js` | Preset button definitions |
| `src/configFields.js` | Module config fields (host, password, polling, etc.) |
| `src/upgrades.js` | Companion upgrade scripts |

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

Output: `aja-kipro-go-1.0.0.tgz` — import directly into Companion 3+ via Developer > Install from file.

## Key design notes

- `doCommand(cmd)` prepends `eParamID_` — never include it in action callbacks.
- State values for monitor channels, video/audio inputs, and record destinations are stored as strings (`'0'`, `'1'`, …) and converted to labels in `checkVariables()`.
- Media slot remaining capacity comes in as KB; `checkVariables()` converts to GB with one decimal place.
- `doGetParam` callbacks receive a single parsed JSON object with fields `value`, `value_name`, `str_value` depending on param type.
