module.exports =
`
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec4 aVertexColor;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uModelMatrix;

varying vec4 vColor;
varying vec3 vNormal;

void main(void){
	vColor = aVertexColor;
	vNormal = aVertexNormal;
	gl_Position = uPMatrix * uMVMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
}
`
