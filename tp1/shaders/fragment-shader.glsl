precision highp float;
varying vec3 vNormal;
varying vec3 vPosWorld;

void main(void) {

    vec3 lightVec=normalize(vec3(0.0,3.0,5.0)-vPosWorld);
    vec3 diffColor=vec3(0.2,0.9,0.2);
    vec3 color=dot(lightVec,vNormal)*diffColor+vec3(0.2,0.2,0.2);

    gl_FragColor = vec4(color,1.0);
}
