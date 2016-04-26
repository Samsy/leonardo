import * as GL from './GL'
import * as CONSTANTS from './constants'
import {vec3, mat3, mat4} from 'gl-matrix'
import VertexShader from 'shaders/vertex.glsl'
import FragmentShader from 'shaders/frag.glsl'

export default class Shader {

	constructor(options, vertexShader, fragmentShader) {

		const defaults = {
			vertexColors: false,
			vertexNormals: false,
			textures: false,
			lights: false,
			culling: CONSTANTS.CULL_NONE
		}

		Object.assign(this, defaults, options)

		const vs = (vertexShader !== undefined) ? vertexShader : VertexShader
		const fs = (fragmentShader !== undefined) ? fragmentShader : FragmentShader

		const gl = GL.get()

		// Create program
		this.vertexShader = this._compile('vs', vs(this))
		this.fragmentShader = this._compile('fs', fs(this))
		this.customUniforms = options.uniforms

		// console.log(vs(this.settings));
		// console.log('-----------------');
		// console.log(fs(this.settings));

		this.program = gl.createProgram()

		gl.attachShader(this.program, this.vertexShader)
		gl.attachShader(this.program, this.fragmentShader)
		gl.linkProgram(this.program)

		if(!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
			console.warn('Failed to initialise shaders')
		}

		this.vertexPositionAttribute = gl.getAttribLocation(this.program, 'aVertexPosition')
		gl.enableVertexAttribArray(this.vertexPositionAttribute)

		if(this.vertexNormals){
			this.vertexNormalAttribute = gl.getAttribLocation(this.program, 'aVertexNormal')
			gl.enableVertexAttribArray(this.vertexNormalAttribute)
		}

		if(this.vertexColors){
			this.vertexColorAttribute = gl.getAttribLocation(this.program, 'aVertexColor')
			gl.enableVertexAttribArray(this.vertexColorAttribute)
		}

		this.uniformTextures = []
		for(let key in this.customUniforms){
			const uniform = this.customUniforms[key]
			if(uniform.type === 't'){
				this.uniformTextures.push(uniform)
				uniform.value.load()
			}
		}
		// console.log(this.uniformTextures);

		if(this.uniformTextures.length > 0){
			this.textureCoordAttribute = gl.getAttribLocation(this.program, 'aTextureCoord')
			gl.enableVertexAttribArray(this.textureCoordAttribute)
		}

		// console.log(this.vertexPositionAttribute);
		// console.log(this.vertexNormalAttribute);
		// console.log(this.vertexColorAttribute);
		// console.log(this.textureCoordAttribute);

		gl.useProgram(this.program)

		this.uniforms = Object.assign({
			 uPMatrix: { type: '4fv' , value: null, location: null }
			,uMVMatrix: { type: '4fv', value: null, location: null }
			,uModelMatrix: { type: '4fv', value: null, location: null }
			,uNormalMatrix: { type: '4fv', value: null, location: null }
			,uAmbientColor: { type: '3f', value: null, location: null }
			,uDirectionalColor: { type: '3f', value: null, location: null }
			,uLightDirection: { type: '3f', value: null, location: null }
		}, this.customUniforms)

		for(let uniform in this.uniforms){
			this.uniforms[uniform].location = gl.getUniformLocation(this.program, uniform)
		}

		console.log(this.uniforms);
	}

	bindProgram() {
		const gl = GL.get()
		gl.useProgram(this.program)
	}

	setUniforms(modelViewMatrix, projectionMatrix, modelMatrix) {

		const gl = GL.get()

		gl.uniformMatrix4fv(this.uniforms.uPMatrix.location, false, projectionMatrix)
		gl.uniformMatrix4fv(this.uniforms.uMVMatrix.location, false, modelViewMatrix)
		gl.uniformMatrix4fv(this.uniforms.uModelMatrix.location, false, modelMatrix)

		if(this.lights){
			gl.uniform3f(this.uniforms.uAmbientColor.location, 0.1, 0.1, 0.1);
			gl.uniform3f(this.uniforms.uDirectionalColor.location, 1.0, 1.0, 1.0);

			let direction = [0.0, 1.0, 1.0]
			let directionalInversed = vec3.create()
			vec3.normalize(directionalInversed, direction)
			// vec3.scale(directionalInversed, directionalInversed, -1)

			gl.uniform3fv(this.uniforms.uLightDirection.location, directionalInversed);
		}

		let inversedModelViewMatrix = mat4.create()
		mat4.invert(inversedModelViewMatrix, modelMatrix)

		if(this.vertexNormals){
			// removes scale and translation
			let normalMatrix = mat3.create()
			mat3.fromMat4(normalMatrix, inversedModelViewMatrix)
			mat3.transpose(normalMatrix, normalMatrix)
			gl.uniformMatrix3fv(this.uniforms.uNormalMatrix.location, false, normalMatrix)
		}

		// Update the other uniforms
		for(let uniform in this.customUniforms){

			const value = this.uniforms[uniform].value

			switch (this.customUniforms[uniform].type) {
				case 'i':
					gl.uniform1i(this.uniforms[uniform].location, value)
					break;
				case 'f':
					gl.uniform1f(this.uniforms[uniform].location, value)
					break;
				case '2f':
					gl.uniform2f(this.uniforms[uniform].location, value[0], value[1])
					break;
				case '3f':
					gl.uniform3f(this.uniforms[uniform].location, value[0], value[1], value[2])
					break;
				case '4f':
					gl.uniform4f(this.uniforms[uniform].location, value[0], value[1], value[2], value[3])
					break;
				case '1iv':
					gl.uniform1iv(this.uniforms[uniform].location, value)
					break;
				case '2iv':
					gl.uniform2iv(this.uniforms[uniform].location, value)
					break;
				case '1fv':
					gl.uniform1fv(this.uniforms[uniform].location, value)
					break;
				case '2fv':
					gl.uniform2fv(this.uniforms[uniform].location, value)
					break;
				case '3fv':
					gl.uniform3fv(this.uniforms[uniform].location, value)
					break;
				case '4fv':
					gl.uniform4fv(this.uniforms[uniform].location, value)
					break;
				case 'Matrix3fv':
					gl.uniformMatrix3fv(this.uniforms[uniform].location, false, value)
					break;
				case 'Matrix4fv':
					gl.uniformMatrix4fv(this.uniforms[uniform].location, false, value)
					break;
			}
		}
	}

	_compile(type, source) {

		const gl = GL.get()
		let shader

		switch (type) {
			case 'vs':
				shader = gl.createShader(gl.VERTEX_SHADER)
				break
			default:
				shader = gl.createShader(gl.FRAGMENT_SHADER)
		}

		gl.shaderSource(shader, source)
		gl.compileShader(shader)

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.warn('Failed to compile shader', gl.getShaderInfoLog(shader))
			return null
		}

		return shader
	}
}
