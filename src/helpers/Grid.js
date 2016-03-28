import {vec3} from 'gl-matrix'
import {lerp} from 'utils/math'
import Mesh from 'core/Mesh'
import Shader from 'core/Shader'
import * as GL from 'core/GL'

const VertexShader =
`
attribute vec3 aVertexPosition;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

void main(void){
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}
`

const FragmentShader =
`
precision mediump float;

void main(void){
	gl_FragColor = vec4(vec3(0.5), 1.0);
}
`

class GridGeometry {

	constructor(size, divisions) {

		this._size = size
		this._divisions = divisions

		const gl = GL.get()

		// Vertex positions
		this.vertexPositionBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer)

		let vertices = []
		let halfSize = this._size * 0.5

		for (let i = 0; i < this._divisions; i++) {
			const x1 = lerp(-halfSize, halfSize, i/(this._divisions-1))
			const y1 = 0
			const z1 = -halfSize
			const x2 = lerp(-halfSize, halfSize, i/(this._divisions-1))
			const y2 = 0
			const z2 = halfSize
			vertices = vertices.concat([x1, y1, z1, x2, y2, z2])
		}

		for (let i = 0; i < this._divisions; i++) {
			const x1 = -halfSize
			const y1 = 0
			const z1 = lerp(-halfSize, halfSize, i/(this._divisions-1))
			const x2 = halfSize
			const y2 = 0
			const z2 = lerp(-halfSize, halfSize, i/(this._divisions-1))
			vertices = vertices.concat([x1, y1, z1, x2, y2, z2])
		}

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

		this.vertexPositionBuffer.itemSize = 3
		this.vertexPositionBuffer.numItems = this._divisions * 4
	}
}

export default class Grid extends Mesh {

	constructor(size = 1, divisions = 10) {
		super(new GridGeometry(size, divisions), new Shader({
			vertexShader: VertexShader,
			fragmentShader: FragmentShader
		}))
	}

	draw(modelViewMatrix, projectionMatrix) {

		const gl = GL.get()

		this.shader.bindProgram()

		gl.bindBuffer(gl.ARRAY_BUFFER, this.geometry.vertexPositionBuffer)
		gl.vertexAttribPointer(this.shader.vertexPositionAttribute, this.geometry.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0)

		this.shader.setUniforms(modelViewMatrix, projectionMatrix)

		gl.drawArrays(gl.LINES, 0, this.geometry.vertexPositionBuffer.numItems)
	}
}
