## AJA Ki Pro / Ki Pro Ultra

Version 2.0 and later of this module require Companion 5.0 or newer.

This module will allow you to control the AJA Ki Pro and Ki Pro Ultra series recorders.

### Configuration

- Enter the IP Address of the KiPro.
- Enter the password for the KiPro. If authentication is not used leave blank.
- Enable or disable polling of the KiPro for feedback items
- Select a rate to poll the KiPro

Some older KiPro units will output incorrect headers that will result in polling being disabled

### Audio meters (Ki Pro GO)

The Ki Pro GO does not report audio levels through its API. With **Audio Meters** enabled in the config, the module reads the headphone channel VU meters from the front panel overlay image the web UI shows. This provides:

- Variables `AudioLevelL` / `AudioLevelR` (dB, `-inf` when silent)
- **Audio meter level (dB)** value feedback, for driving gauge elements on layered buttons. The **Audio Meter** preset is a ready-made stereo meter that also turns red when the audio peaks
- **Audio level above threshold** feedback for peak / signal-present indication

Use **Set Headphone Monitor Channel** to choose which channel is metered.

### To use the module

Add an action to a button and choose the action you wish to use.

**Available actions:**

- Play
- Stop
- Record
- Next Clip
- Previous Cliip
- Fast Forward
- Fast Reverse
- Step Forward
- Step Reverse/Back
- Format
- Erase Clip By Name (Requires extension)
- Erase Clip By List
- Set Custom Take Number
- Set Custom Clip Name
- Load Clip By Name (Requires extension)
- Load Clip By List
- Loop Clip
- Set Timecode Value
- Set Media State

**Available feedback:**

- Transport State
- Media State

**Available Variables:**

- Timecode Hours
- Timecode Minutes
- Timecode Seconds
- Timecode Frames
- Transport State
- Media State
- Current Clip Name
- Remaining Media Available
- System Name

**Available Presets:**

- Transport control
  - Play
  - Stop
  - Record
  - Next Clip
  - Previous Clip
  - Fast Forward
  - Rewind
  - Step Forward
  - Step Backward
- Timecode
  - Full Timecode
  - Timecode Hours
  - Timecode Minutes
  - Timecode Seconds
  - Timecode Frames
- Functions
  - Stop and Format
  - Reset Timecode and Record

### Non-compliant header warning

- Some older KiPro units will return non HTTP compliant headers that will result in a warning in the log and polling being disabled
