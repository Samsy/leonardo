import Light from './Light';
import Vector3 from 'math/Vector3';
import Color from 'math/Color';

export default class PointLight extends Light {
	constructor(options = {}) {
		super();
		this.uniforms = {
			color: {
				type: '3f',
				value: new Color(0xFFFFFF).v,
			},
			specularColor: {
				type: '3f',
				value: new Color(0xFFFFFF).v,
			},
			position: {
				type: '3f',
				value: new Vector3(0, 0, 0).v,
			},
			shininess: {
				type: 'f',
				value: 100,
			},
		};
		Object.assign(this.uniforms, options);
		this.position = new Vector3();
	}

	update() {
		this.uniforms.position.value[0] = this.position.x;
		this.uniforms.position.value[1] = this.position.y;
		this.uniforms.position.value[2] = this.position.z;
	}
}
