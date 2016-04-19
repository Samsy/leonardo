'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _GL = require('./GL');

var GL = _interopRequireWildcard(_GL);

var _constants = require('./constants');

var CONSTANTS = _interopRequireWildcard(_constants);

var _glMatrix = require('gl-matrix');

var _vertex = require('../shaders/vertex.glsl');

var _vertex2 = _interopRequireDefault(_vertex);

var _frag = require('../shaders/frag.glsl');

var _frag2 = _interopRequireDefault(_frag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var glslify = require('glslify');

var Shader = function () {
	function Shader(options, vertexShader, fragmentShader) {
		_classCallCheck(this, Shader);

		var defaults = {
			vertexColors: false,
			vertexNormals: false,
			lights: false,
			culling: CONSTANTS.CULL_NONE
		};

		this.settings = Object.assign({}, defaults, options);

		var vs = vertexShader !== undefined ? vertexShader : _vertex2.default;
		var fs = fragmentShader !== undefined ? fragmentShader : _frag2.default;

		var gl = GL.get();

		// Create program
		this.vertexShader = this._compile('vs', vs(this.settings));
		this.fragmentShader = this._compile('fs', fs(this.settings));

		this.program = gl.createProgram();

		gl.attachShader(this.program, this.vertexShader);
		gl.attachShader(this.program, this.fragmentShader);
		gl.linkProgram(this.program);

		if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
			console.warn('Failed to initialise shaders');
		}

		this.vertexPositionAttribute = gl.getAttribLocation(this.program, 'aVertexPosition');
		gl.enableVertexAttribArray(this.vertexPositionAttribute);

		if (this.settings.vertexNormals) {
			this.vertexNormalAttribute = gl.getAttribLocation(this.program, 'aVertexNormal');
			gl.enableVertexAttribArray(this.vertexNormalAttribute);
		}

		if (this.settings.vertexColors) {
			this.vertexColorAttribute = gl.getAttribLocation(this.program, 'aVertexColor');
			gl.enableVertexAttribArray(this.vertexColorAttribute);
		}

		// console.log(this.vertexPositionAttribute);
		// console.log(this.vertexNormalAttribute);
		// console.log(this.vertexColorAttribute);

		gl.useProgram(this.program);

		this.pMatrixUniform = gl.getUniformLocation(this.program, 'uPMatrix');
		this.mvMatrixUniform = gl.getUniformLocation(this.program, 'uMVMatrix');
		this.mMatrixUniform = gl.getUniformLocation(this.program, 'uModelMatrix');
		this.nMatrixUniform = gl.getUniformLocation(this.program, 'uNormalMatrix');
		this.ambientColorUniform = gl.getUniformLocation(this.program, 'uAmbientColor');
		this.directionalColorUniform = gl.getUniformLocation(this.program, 'uDirectionalColor');
		this.lightDirectionUniform = gl.getUniformLocation(this.program, 'uLightDirection');
	}

	_createClass(Shader, [{
		key: 'bindProgram',
		value: function bindProgram() {
			var gl = GL.get();
			gl.useProgram(this.program);
		}
	}, {
		key: 'setUniforms',
		value: function setUniforms(modelViewMatrix, projectionMatrix, modelMatrix) {

			var gl = GL.get();

			gl.uniformMatrix4fv(this.pMatrixUniform, false, projectionMatrix);
			gl.uniformMatrix4fv(this.mvMatrixUniform, false, modelViewMatrix);
			gl.uniformMatrix4fv(this.mMatrixUniform, false, modelMatrix);
			gl.uniform3f(this.ambientColorUniform, 0.1, 0.1, 0.1);
			gl.uniform3f(this.directionalColorUniform, 1.0, 1.0, 1.0);

			var direction = [0.0, 1.0, 1.0];
			var directionalInversed = _glMatrix.vec3.create();
			_glMatrix.vec3.normalize(directionalInversed, direction);
			// vec3.scale(directionalInversed, directionalInversed, -1)

			gl.uniform3fv(this.lightDirectionUniform, directionalInversed);

			var inversedModelViewMatrix = _glMatrix.mat4.create();

			_glMatrix.mat4.invert(inversedModelViewMatrix, modelMatrix);

			// removes scale and translation
			var normalMatrix = _glMatrix.mat3.create();
			_glMatrix.mat3.fromMat4(normalMatrix, inversedModelViewMatrix);
			_glMatrix.mat3.transpose(normalMatrix, normalMatrix);
			gl.uniformMatrix3fv(this.nMatrixUniform, false, normalMatrix);
		}
	}, {
		key: '_compile',
		value: function _compile(type, source) {

			var gl = GL.get();
			var shader = void 0;

			switch (type) {
				case 'vs':
					shader = gl.createShader(gl.VERTEX_SHADER);
					break;
				default:
					shader = gl.createShader(gl.FRAGMENT_SHADER);
			}

			gl.shaderSource(shader, source);
			gl.compileShader(shader);

			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				console.warn('Failed to compile shader', gl.getShaderInfoLog(shader));
				return null;
			}

			return shader;
		}
	}]);

	return Shader;
}();

exports.default = Shader;