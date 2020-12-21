precision highp float;

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aUV;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projMatrix;

uniform mat4 normalMatrix;

uniform vec2 uOffsetUV;
uniform float uScaleUV;

varying vec3 vNormal;
varying vec3 vPosWorld;
varying vec2 vUV;

uniform sampler2D uSampler;

const float epsilon=0.01;
const float amplitud=40.0;

void main(void) {
    vec3 position = aVertexPosition;
    vec3 normal = aVertexNormal;
    vec2 uv = uOffsetUV + aUV*uScaleUV;

    vec4 center = texture2D(uSampler, vec2(uv.s, uv.t));
    vec4 masU = texture2D(uSampler, vec2(uv.s+epsilon, uv.t));
    vec4 masV = texture2D(uSampler, vec2(uv.s, uv.t+epsilon));

    vec4 menosU = texture2D(uSampler, vec2(uv.s-epsilon, uv.t));
    vec4 menosV = texture2D(uSampler, vec2(uv.s, uv.t-epsilon));


    // elevamos la coordenada Y
    position.y+=center.x*amplitud;

    vec4 worldPos = modelMatrix*vec4(position, 1.0);

    gl_Position = projMatrix*viewMatrix*worldPos;

    vPosWorld=worldPos.xyz;

    /*
     hay que calcular la normal ya que el valor original es la normal del plano
     pero luego de elevar Y, el valor original no tiene sentido

     La idea es calcular la diferencia de altura entre 2 muestras proximas
     y estimar el vector tangente.

     Haciendo lo mismo en el eje U y en el eje V tenemos 2 vectores tangentes a la superficie
     Luego calculamos el producto vectorial y obtenemos la normal

     Para tener un resultado con mayor precision, para cada eje U y V calculo 2 tangentes
     y las promedio
    */
    float angU=atan((masU.x-center.x)*amplitud,epsilon);
    float angV=atan((masV.x-center.x)*amplitud,epsilon);

    // tangentes en U y en V
    vec3 gradU1=vec3(cos(angU),sin(angU),0.0);
    vec3 gradV1=vec3(0.0      ,sin(angV),cos(angV));

    angU=atan((center.x-menosU.x)*amplitud,epsilon);
    angV=atan((center.x-menosV.x)*amplitud,epsilon);

    // segundo conjunto de tangentes en U y en V
    vec3 gradU2=vec3(cos(angU),sin(angU),0.0);
    vec3 gradV2=vec3(0.0      ,sin(angV),cos(angV));



    // calculo el producto vectorial
    vec3 tan1=(gradV1+gradV2)/2.0;
    vec3 tan2=(gradU1+gradU2)/2.0;
    // si no hago nada con aVertexNormal falla. Ver de no pasarselo.
    vNormal=(normalMatrix*vec4(aVertexNormal,1.0)).xyz;
    vNormal=cross(tan1,tan2);
    vUV=uv;
}
