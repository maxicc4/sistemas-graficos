precision highp float;
varying vec3 vNormal;
varying vec3 vPosWorld;
varying vec2 vUV;

uniform vec3 uColor;
uniform sampler2D uSampler;

void main(void) {

    vec3 lightVec=normalize(vec3(10.0,100.0,25.0)-vPosWorld);
    vec3 color=texture2D(uSampler, vec2(vUV.s, vUV.t)).xyz;
    color=dot(lightVec,vNormal)*color+vec3(0.2,0.2,0.2);

    gl_FragColor = vec4(color,1.0);
}
