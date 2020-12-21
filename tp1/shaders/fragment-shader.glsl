precision highp float;
varying vec3 vNormal;
varying vec3 vPosWorld;
varying vec2 vUV;

uniform vec3 uColor;
uniform sampler2D uSampler;

uniform bool uUseLighting;          // usar iluminacion si/no

void main(void) {
    if (uUseLighting) {
        vec3 lightVec=normalize(vec3(25.0,1000.0,1000.0)-vPosWorld);
        vec3 color=dot(lightVec,vNormal)*uColor+vec3(0.2,0.2,0.2);
        gl_FragColor = vec4(color,1.0);
    } else {
        gl_FragColor = vec4(uColor,1.0);
    }
}
