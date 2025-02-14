

/*

    Tareas:
    ------

    1) Modificar a función "generarSuperficie" para que tenga en cuenta los parametros filas y columnas al llenar el indexBuffer
       Con esta modificación deberían poder generarse planos de N filas por M columnas

    2) Modificar la funcion "dibujarMalla" para que use la primitiva "triangle_strip"

    3) Crear nuevos tipos funciones constructoras de superficies

        3a) Crear la función constructora "Esfera" que reciba como parámetro el radio

        3b) Crear la función constructora "TuboSenoidal" que reciba como parámetro la amplitud de onda, longitud de onda, radio del tubo y altura.
        (Ver imagenes JPG adjuntas)
        
        
    Entrega:
    -------

    - Agregar una variable global que permita elegir facilmente que tipo de primitiva se desea visualizar [plano,esfera,tubosenoidal]
    
*/


var superficie3D;
var mallaDeTriangulos;

// VARIABLE GLOBAL QUE PERMITE CAMBIAR DE SUPERFICIE
var funcionCrearSuperficie = crearTuboSenoidal;

var filas=100;
var columnas=100;

function crearPlano(){
    return new Plano(3,3);
}

function crearEsfera(){
    return new Esfera(1.5);
}

function crearTuboSenoidal(){
    return new TuboSenoidal(0.1, 0.1, 1, 3);
}


function crearGeometria(){
    superficie3D=funcionCrearSuperficie();
    mallaDeTriangulos=generarSuperficie(superficie3D,filas,columnas);
    
}

function dibujarGeometria(){

    dibujarMalla(mallaDeTriangulos);

}

function Plano(ancho,largo){

    this.getPosicion=function(u,v){
        var x=(u-0.5)*ancho;
        var z=(v-0.5)*largo;
        return [x,0,z];
    }

    this.getNormal=function(u,v){
        return [0,1,0];
    }

    this.getCoordenadasTextura=function(u,v){
        return [u,v];
    }
}

function Esfera(radio){

    this.getPosicion=function(u,v){
        var x=Math.sin(Math.PI*v)*Math.cos(2*Math.PI*u)*radio;
        var y=Math.cos(Math.PI*v)*radio;
        var z=Math.sin(Math.PI*v)*Math.sin(2*Math.PI*u)*radio;
        return [x,y,z];
    }

    this.getNormal=function(u,v){
        var x=Math.sin(Math.PI*v)*Math.cos(2*Math.PI*u);
        var y=Math.cos(Math.PI*v);
        var z=Math.sin(Math.PI*v)*Math.sin(2*Math.PI*u);
        return [x,y,z];
    }

    this.getCoordenadasTextura=function(u,v){
        return [u,v];
    }
}

function TuboSenoidal(amplitudOnda,longitudOnda,radio,altura){

    this.getPosicion=function(u,v){
        var x=(amplitudOnda*Math.sin((2*Math.PI/longitudOnda)*v+Math.PI)+radio)*Math.cos(2*Math.PI*u);
        var y=(v-0.5)*altura;
        var z=(amplitudOnda*Math.sin((2*Math.PI/longitudOnda)*v+Math.PI)+radio)*Math.sin(2*Math.PI*u);
        return [x,y,z];
    }

    this.getNormal=function(u,v){
        var deltaU = vec3.fromValues(
            (amplitudOnda*Math.sin((2*Math.PI/longitudOnda)*v+Math.PI)+radio)*Math.cos(2*Math.PI*(u+0.01)), 
            (v-0.5)*altura, 
            (amplitudOnda*Math.sin((2*Math.PI/longitudOnda)*v+Math.PI)+radio)*Math.sin(2*Math.PI*(u+0.01))
        );
        var deltaV = vec3.fromValues(
            (amplitudOnda*Math.sin((2*Math.PI/longitudOnda)*v+Math.PI)+radio)*Math.cos(2*Math.PI*u), 
            (v+0.01-0.5)*altura, 
            (amplitudOnda*Math.sin((2*Math.PI/longitudOnda)*v+Math.PI)+radio)*Math.sin(2*Math.PI*u)
        );
        var vecNormal = vec3.create();
        vec3.cross(vecNormal, deltaU, deltaV);
        return vecNormal;
    }

    this.getCoordenadasTextura=function(u,v){
        return [u,v];
    }
}

function generarSuperficie(superficie,filas,columnas){
    
    positionBuffer = [];
    normalBuffer = [];
    uvBuffer = [];

    for (var i=0; i <= filas; i++) {
        for (var j=0; j <= columnas; j++) {

            var u=j/columnas;
            var v=i/filas;

            var pos=superficie.getPosicion(u,v);

            positionBuffer.push(pos[0]);
            positionBuffer.push(pos[1]);
            positionBuffer.push(pos[2]);

            var nrm=superficie.getNormal(u,v);

            normalBuffer.push(nrm[0]);
            normalBuffer.push(nrm[1]);
            normalBuffer.push(nrm[2]);

            var uvs=superficie.getCoordenadasTextura(u,v);

            uvBuffer.push(uvs[0]);
            uvBuffer.push(uvs[1]);

        }
    }

    // Buffer de indices de los triángulos
    
    indexBuffer=[];  
    
    for (i=0; i < filas; i++) {
        indexBuffer.push(i*(columnas+1));
        indexBuffer.push(i*(columnas+1));
        indexBuffer.push((i+1)*(columnas+1));
        for (j=0; j < columnas; j++) {
            indexBuffer.push(i*(columnas+1)+j+1);
            indexBuffer.push((i+1)*(columnas+1)+j+1);
        }
        indexBuffer.push((i+1)*(columnas+1)+columnas);
    }

    // Creación e Inicialización de los buffers

    webgl_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionBuffer), gl.STATIC_DRAW);
    webgl_position_buffer.itemSize = 3;
    webgl_position_buffer.numItems = positionBuffer.length / 3;

    webgl_normal_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalBuffer), gl.STATIC_DRAW);
    webgl_normal_buffer.itemSize = 3;
    webgl_normal_buffer.numItems = normalBuffer.length / 3;

    webgl_uvs_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_uvs_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvBuffer), gl.STATIC_DRAW);
    webgl_uvs_buffer.itemSize = 2;
    webgl_uvs_buffer.numItems = uvBuffer.length / 2;


    webgl_index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webgl_index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexBuffer), gl.STATIC_DRAW);
    webgl_index_buffer.itemSize = 1;
    webgl_index_buffer.numItems = indexBuffer.length;

    return {
        webgl_position_buffer,
        webgl_normal_buffer,
        webgl_uvs_buffer,
        webgl_index_buffer
    }
}

function dibujarMalla(mallaDeTriangulos){
    
    // Se configuran los buffers que alimentaron el pipeline
    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_position_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, mallaDeTriangulos.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_uvs_buffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, mallaDeTriangulos.webgl_uvs_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_normal_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, mallaDeTriangulos.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);
       
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mallaDeTriangulos.webgl_index_buffer);


    if (modo!="wireframe"){
        gl.uniform1i(shaderProgram.useLightingUniform,(lighting=="true"));                    
        gl.drawElements(gl.TRIANGLE_STRIP, mallaDeTriangulos.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
    
    if (modo!="smooth") {
        gl.uniform1i(shaderProgram.useLightingUniform,false);
        gl.drawElements(gl.LINE_STRIP, mallaDeTriangulos.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
 
}

