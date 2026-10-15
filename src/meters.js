const http = require('http')
const zlib = require('zlib')

// The Ki Pro GO has no audio level params in its REST API. The web UI instead shows
// /images/fp-overlay.png, a 320x180 render of the front panel LCD overlay, which
// contains the VU meters for the headphone monitor channel. We read the meters from
// its pixels.
//
// Meter geometry in the overlay (measured on a Ki Pro GO2):
//   left bar column x=277-282, right bar column x=298-303
//   0 dB at y=28, 1.5 px per dB, -70 dB at y=133
//   unlit segments are dim (no colour channel above 0x50), lit segments are brighter
const METER_COLUMNS = { L: 280, R: 301 }
const METER_TOP_Y = 28
const METER_BOTTOM_Y = 134
const METER_PX_PER_DB = 1.5
const METER_FLOOR_DB = -70
const METER_LIT_THRESHOLD = 0x70

module.exports = {
	startMeterTimer() {
		this.stopMeterTimer()

		if (!this.config.audioMeters) return

		const rate = Math.max(50, Number(this.config.audioMeterRate) || 200)
		this.meterTimer = setInterval(() => this.doGetMeters(), rate)
	},

	stopMeterTimer() {
		if (this.meterTimer !== undefined) {
			clearInterval(this.meterTimer)
			delete this.meterTimer
		}
		this.meterWaiting = false
	},

	doGetMeters() {
		if (this.meterWaiting || !this.config.host) return
		this.meterWaiting = true

		const headers = {}
		if (this.authenticated && this.authToken) {
			headers['Cookie'] = this.authToken
		}

		const req = http.get(
			{
				host: this.config.host,
				path: '/images/fp-overlay.png?t=' + Date.now(),
				headers: headers,
				timeout: 2000,
			},
			(res) => {
				const chunks = []
				res.on('data', (c) => chunks.push(c))
				res.on('end', () => {
					this.meterWaiting = false
					if (res.statusCode !== 200) return
					try {
						this.processMeters(this.decodePng(Buffer.concat(chunks)))
					} catch (e) {
						if (this.config.verbose) {
							this.log('debug', 'Audio meter decode failed: ' + e)
						}
					}
				})
			}
		)
		req.on('timeout', () => req.destroy())
		req.on('error', () => {
			this.meterWaiting = false
		})
	},

	// Minimal decoder for 8-bit RGB/RGBA non-interlaced PNGs
	decodePng(data) {
		let pos = 8
		let width, height, colorType
		const idat = []
		while (pos < data.length) {
			const len = data.readUInt32BE(pos)
			const type = data.toString('ascii', pos + 4, pos + 8)
			const chunk = data.subarray(pos + 8, pos + 8 + len)
			if (type === 'IHDR') {
				width = chunk.readUInt32BE(0)
				height = chunk.readUInt32BE(4)
				colorType = chunk[9]
				if (chunk[8] !== 8 || chunk[12] !== 0 || (colorType !== 2 && colorType !== 6)) {
					throw new Error('unsupported PNG format')
				}
			} else if (type === 'IDAT') {
				idat.push(chunk)
			} else if (type === 'IEND') {
				break
			}
			pos += 12 + len
		}

		const raw = zlib.inflateSync(Buffer.concat(idat))
		const bpp = colorType === 6 ? 4 : 3
		const stride = width * bpp
		const pixels = Buffer.alloc(stride * height)
		let prev = Buffer.alloc(stride)
		for (let y = 0; y < height; y++) {
			const filter = raw[y * (stride + 1)]
			const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1))
			const out = pixels.subarray(y * stride, (y + 1) * stride)
			for (let x = 0; x < stride; x++) {
				const a = x >= bpp ? out[x - bpp] : 0
				const b = prev[x]
				const c = x >= bpp ? prev[x - bpp] : 0
				let v = line[x]
				if (filter === 1) v += a
				else if (filter === 2) v += b
				else if (filter === 3) v += (a + b) >> 1
				else if (filter === 4) {
					const p = a + b - c
					const pa = Math.abs(p - a)
					const pb = Math.abs(p - b)
					const pc = Math.abs(p - c)
					v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c
				}
				out[x] = v & 0xff
			}
			prev = out
		}

		return { width, height, bpp, pixels }
	},

	// Returns the meter level in dB, or null when nothing is lit
	readMeterLevel(img, x) {
		for (let y = METER_TOP_Y; y <= METER_BOTTOM_Y; y++) {
			const i = (y * img.width + x) * img.bpp
			const r = img.pixels[i]
			const g = img.pixels[i + 1]
			const b = img.pixels[i + 2]
			if (Math.max(r, g, b) >= METER_LIT_THRESHOLD) {
				return Math.max(METER_FLOOR_DB, -(y - METER_TOP_Y) / METER_PX_PER_DB)
			}
		}
		return null
	},

	processMeters(img) {
		if (img.width !== 320 || img.height !== 180) return

		const levelL = this.readMeterLevel(img, METER_COLUMNS.L)
		const levelR = this.readMeterLevel(img, METER_COLUMNS.R)

		const changed = levelL !== this.state['AudioLevelL'] || levelR !== this.state['AudioLevelR']
		this.state['AudioLevelL'] = levelL
		this.state['AudioLevelR'] = levelR
		if (!changed) return

		const fmt = (db) => (db === null ? '-inf' : db.toFixed(0))
		this.setVariableValues({
			AudioLevelL: fmt(levelL),
			AudioLevelR: fmt(levelR),
		})
		this.checkFeedbacks('audio_meter', 'audio_level')
	},
}
