import Vector3 from 'math/Vector3';

export default class DirectionalLight {
	constructor(options = {}) {
		this.uniforms = {
			uDirectionalLightColor: {
				type: '3f',
				value: new Vector3(1, 1, 1).v,
			},
			uDirectionalLightPosition: {
				type: '3f',
				value: new Vector3(1, 1, 1).v,
			},
		};
		Object.assign(this.uniforms, options);
	}
}
