precision highp float;
varying vec3 vNormal;
varying vec3 vPosWorld;
uniform vec3 uColor;

void main(void) {

    vec3 lightVec=normalize(vec3(0.0,3.0,5.0)-vPosWorld);
    //vec3 diffColor=vec3(0.2,0.9,0.2);     //verde
    //vec3 diffColor=vec3(0.8,0.23,0.16);     //rojo
    vec3 color=dot(lightVec,vNormal)*uColor+vec3(0.2,0.2,0.2);

    gl_FragColor = vec4(color,1.0);
}
