'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _GL = require('../core/GL');

var GL = _interopRequireWildcard(_GL);

var _glMatrix = require('gl-matrix');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mesh = function () {
	function Mesh(geometry, shader) {
		_classCallCheck(this, Mesh);

		this.geometry = geometry;
		this.shader = shader;

		this.position = _glMatrix.vec3.create();
		this.rotation = _glMatrix.vec3.create();
		this.modelMatrix = _glMatrix.mat4.create();
	}

	_createClass(Mesh, [{
		key: 'draw',
		value: function draw(modelViewMatrix, projectionMatrix) {
			var gl = GL.get();

			this.shader.bindProgram();

			gl.bindBuffer(gl.ARRAY_BUFFER, this.geometry.vertexPositionBuffer);
			gl.vertexAttribPointer(this.shader.vertexPositionAttribute, this.geometry.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.geometry.vertexColorBuffer);
			gl.vertexAttribPointer(this.shader.vertexColorAttribute, this.geometry.vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.geometry.vertexNormalBuffer);
			gl.vertexAttribPointer(this.shader.vertexNormalAttribute, this.geometry.vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

			_glMatrix.mat4.identity(this.modelMatrix);
			_glMatrix.mat4.translate(this.modelMatrix, this.modelMatrix, this.position);
			_glMatrix.mat4.rotate(this.modelMatrix, this.modelMatrix, this.rotation[0], [1, 0, 0]);
			_glMatrix.mat4.rotate(this.modelMatrix, this.modelMatrix, this.rotation[1], [0, 1, 0]);
			_glMatrix.mat4.rotate(this.modelMatrix, this.modelMatrix, this.rotation[2], [0, 0, 1]);

			this.shader.setUniforms(modelViewMatrix, projectionMatrix, this.modelMatrix);

			gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.geometry.vertexPositionBuffer.numItems);
		}
	}, {
		key: 'x',
		set: function set() {
			var value = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

			this.position[0] = value;
		},
		get: function get() {
			return this.position[0];
		}
	}, {
		key: 'y',
		set: function set() {
			var value = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

			this.position[1] = value;
		},
		get: function get() {
			return this.position[1];
		}
	}, {
		key: 'z',
		set: function set() {
			var value = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

			this.position[2] = value;
		},
		get: function get() {
			return this.position[2];
		}
	}, {
		key: 'rotationX',
		set: function set() {
			var value = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

			this.rotation[0] = value;
		},
		get: function get() {
			return this.rotation[0];
		}
	}, {
		key: 'rotationY',
		set: function set() {
			var value = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

			this.rotation[1] = value;
		},
		get: function get() {
			return this.rotation[1];
		}
	}, {
		key: 'rotationZ',
		set: function set() {
			var value = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

			this.rotation[2] = value;
		},
		get: function get() {
			return this.rotation[2];
		}
	}]);

	return Mesh;
}();

exports.default = Mesh;