import * as GL from '../core/GL';
import {
	mat4,
} from 'gl-matrix';
import Vector3 from 'math/Vector3';

export default class Mesh {
	constructor(geometry, shader) {
		this.geometry = geometry;
		this.shader = shader;
		this.shader.create(this.geometry);

		this.position = new Vector3();
		this.rotation = new Vector3();
		this.scale = new Vector3(1, 1, 1);
		this.modelMatrix = mat4.create();
		this.visible = true;
	}

	draw(modelViewMatrix, projectionMatrix) {
		if (!this.visible) return;

		const gl = GL.get();

		this.shader.bindProgram();

		if (this.geometry.vertices) {
			gl.bindBuffer(gl.ARRAY_BUFFER, this.geometry.vertexPositionBuffer);
			gl.vertexAttribPointer(this.shader.vertexPositionAttribute,
				this.geometry.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		}

		if (this.geometry.uvs) {
			gl.bindBuffer(gl.ARRAY_BUFFER, this.geometry.uvBuffer);
			gl.vertexAttribPointer(this.shader.vertexUvAttribute,
				this.geometry.uvBuffer.itemSize, gl.FLOAT, false, 0, 0);
		}

		if (this.geometry.colors) {
			gl.bindBuffer(gl.ARRAY_BUFFER, this.geometry.vertexColorBuffer);
			gl.vertexAttribPointer(this.shader.vertexColorAttribute,
				this.geometry.vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
		}

		if (this.geometry.normals) {
			gl.bindBuffer(gl.ARRAY_BUFFER, this.geometry.vertexNormalBuffer);
			gl.vertexAttribPointer(this.shader.vertexNormalAttribute,
				this.geometry.vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
		}

		if (this.shader.uniformTextures.length > 0) {
			gl.bindBuffer(gl.ARRAY_BUFFER, this.geometry.textureCoordBuffer);
			gl.vertexAttribPointer(this.shader.textureCoordAttribute,
				this.geometry.textureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

			this.shader.uniformTextures.forEach((uniform, i) => {
				gl.activeTexture(gl[`TEXTURE${i}`]);
				gl.bindTexture(gl.TEXTURE_2D, uniform.value.texture);
				gl.uniform1i(uniform.location, i);
			});
		}

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.geometry.vertexIndexBuffer);

		mat4.identity(this.modelMatrix);
		mat4.translate(this.modelMatrix, this.modelMatrix, this.position.v);
		mat4.rotate(this.modelMatrix, this.modelMatrix, this.rotation.x, [1, 0, 0]);
		mat4.rotate(this.modelMatrix, this.modelMatrix, this.rotation.y, [0, 1, 0]);
		mat4.rotate(this.modelMatrix, this.modelMatrix, this.rotation.z, [0, 0, 1]);
		mat4.scale(this.modelMatrix, this.modelMatrix, this.scale.v);

		this.shader.setUniforms(modelViewMatrix, projectionMatrix, this.modelMatrix);

		// gl.enable(gl.CULL_FACE)
		// gl.cullFace(gl.BACK)

		// gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.geometry.vertexPositionBuffer.numItems)

		gl.drawElements(this.shader.drawType,
			this.geometry.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

		// gl.disable(gl.CULL_FACE)
	}
}
