import {
	PRECISION,
} from 'core/Constants';
import {
	warn,
} from 'utils/Console';

/**
 * https://github.com/mrdoob/three.js/blob/dev/src/renderers/webgl/WebGLCapabilities.js
 */

function getMaxPrecision(gl, precision) {
	if (precision === 'highp') {
		if (gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT).precision > 0 &&
			gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT).precision > 0) {
			return 'highp';
		}
		precision = 'mediump';
	}

	if (precision === 'mediump') {
		if (gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT).precision > 0 &&
			gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT).precision > 0) {
			return 'mediump';
		}
	}
	return 'lowp';
}

export default function (gl) {
	let precision = PRECISION;
	const maxPrecision = getMaxPrecision(gl, precision);

	if (maxPrecision !== precision) {
		warn('Capabilities:', precision, 'not supported, using', maxPrecision, 'instead.');
		precision = maxPrecision;
	}

	const maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
	const maxVertexTextures = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
	const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
	const maxCubemapSize = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE);

	const maxAttributes = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
	const maxVertexUniforms = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
	const maxVaryings = gl.getParameter(gl.MAX_VARYING_VECTORS);
	const maxFragmentUniforms = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);

	return {
		precision,
		maxTextures,
		maxPrecision,
		maxVertexTextures,
		maxTextureSize,
		maxCubemapSize,
		maxAttributes,
		maxVertexUniforms,
		maxVaryings,
		maxFragmentUniforms,
	};
}
