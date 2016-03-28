export function degToRad(degrees) {
	return degrees * (Math.PI / 180)
}

export function radToDeg(radians) {
	return radians * (180 / Math.PI)
}

export function clamp(value, min, max) {
	return Math.max(Math.min(value, max), min)
}

export function lerp(min, max, alpha) {
	return min + ((max - min) * alpha)
}
