function Plano(ancho, largo) {

    this.getPosicion = function (u, v) {
        var x = (u - 0.5) * ancho;
        var z = (v - 0.5) * largo;
        return [x, 0, z];
    }

    this.getNormal = function (u, v) {
        return [0, 1, 0];
    }

    this.getCoordenadasTextura = function (u, v) {
        return [u, v];
    }

    this.tieneTapas = function () {
        return false;
    }
}

function Esfera(radio) {

    this.getPosicion = function (u, v) {
        var x = Math.sin(Math.PI * v) * Math.cos(2 * Math.PI * u) * radio;
        var y = Math.cos(Math.PI * v) * radio;
        var z = Math.sin(Math.PI * v) * Math.sin(2 * Math.PI * u) * radio;
        return [x, y, z];
    }

    this.getNormal = function (u, v) {
        var x = Math.sin(Math.PI * v) * Math.cos(2 * Math.PI * u);
        var y = Math.cos(Math.PI * v);
        var z = Math.sin(Math.PI * v) * Math.sin(2 * Math.PI * u);
        return [x, y, z];
    }

    this.getCoordenadasTextura = function (u, v) {
        return [u, v];
    }

    this.tieneTapas = function () {
        return false;
    }
}

function TuboSenoidal(amplitudOnda, longitudOnda, radio, altura) {

    this.getPosicion = function (u, v) {
        var x = (amplitudOnda * Math.sin((2 * Math.PI / longitudOnda) * v + Math.PI) + radio) * Math.cos(2 * Math.PI * u);
        var y = (v - 0.5) * altura;
        var z = (amplitudOnda * Math.sin((2 * Math.PI / longitudOnda) * v + Math.PI) + radio) * Math.sin(2 * Math.PI * u);
        return [x, y, z];
    }

    this.getNormal = function (u, v) {
        var tangU = vec3.fromValues(
            (amplitudOnda * Math.sin((2 * Math.PI / longitudOnda) * v + Math.PI) + radio) * Math.sin(2 * Math.PI * u) * (-2 * Math.PI),
            0,
            (amplitudOnda * Math.sin((2 * Math.PI / longitudOnda) * v + Math.PI) + radio) * Math.cos(2 * Math.PI * u) * 2 * Math.PI
        );
        var tangV = vec3.fromValues(
            (amplitudOnda * Math.cos((2 * Math.PI / longitudOnda) * v + Math.PI) * (2 * Math.PI / longitudOnda) + radio) * Math.cos(2 * Math.PI * u),
            altura,
            (amplitudOnda * Math.cos((2 * Math.PI / longitudOnda) * v + Math.PI) * (2 * Math.PI / longitudOnda) + radio) * Math.sin(2 * Math.PI * u)
        );
        var vecNormal = vec3.create();
        vec3.cross(vecNormal, tangV, tangU);
        vec3.normalize(vecNormal, vecNormal);
        return vecNormal;
    }

    this.getCoordenadasTextura = function (u, v) {
        return [u, v];
    }

    this.tieneTapas = function () {
        return false;
    }
}

function Cabina(largo, alto, ancho) {

    function getBernsteinBasis(u) {
        return {
            b0: (1-u)*(1-u)*(1-u),
            b1: 3*(1-u)*(1-u)*u,
            b2: 3*(1-u)*u*u,
            b3: u*u*u
        }
    }

    this.getPosicion = function (u, v) {
        let position;
        let bernsteinBasis;
        let p0, p1, p2, p3;
        if (u >= 0 && u <= 0.2) {                       // curva de bezier nro 1
            p0 = {x: -largo/2, y: -alto/4};
            p1 = {x: -largo*(31/64), y: alto*(3/16)};
            p2 = {x: -largo/4, y: alto*(3/8)};          // simetrico junto con p1 del tramo siguiente
            p3 = {x: -largo*(3/16), y: alto*(13/32)};
            bernsteinBasis = getBernsteinBasis(u/0.2);
            position = vec3.fromValues(
                bernsteinBasis.b0*p0.x + bernsteinBasis.b1*p1.x + bernsteinBasis.b2*p2.x + bernsteinBasis.b3*p3.x,
                bernsteinBasis.b0*p0.y + bernsteinBasis.b1*p1.y + bernsteinBasis.b2*p2.y + bernsteinBasis.b3*p3.y,
                (v - 0.5) * ancho
            );
        } else if (u > 0.2 && u <= 0.4) {               // curva de bezier nro 2
            p0 = {x: -largo*(3/16), y: alto*(13/32)};
            p1 = {x: -largo/8, y: alto*(7/16)};         // simetrico junto con p2 del tramo anterior
            p2 = {x: largo*(7/32), y: alto*(9/16)};
            p3 = {x: largo*(29/64), y: alto*(13/32)};
            bernsteinBasis = getBernsteinBasis((u-0.2)/0.2);
            position = vec3.fromValues(
                bernsteinBasis.b0*p0.x + bernsteinBasis.b1*p1.x + bernsteinBasis.b2*p2.x + bernsteinBasis.b3*p3.x,
                bernsteinBasis.b0*p0.y + bernsteinBasis.b1*p1.y + bernsteinBasis.b2*p2.y + bernsteinBasis.b3*p3.y,
                (v - 0.5) * ancho
            );
        } else if (u > 0.4 && u <= 0.5) {               // curva de bezier nro 3
            p0 = {x: largo*(29/64), y: alto*(13/32)};
            p1 = {x: largo*0.4625, y: alto*(3/8)};      // esta dentro del segemento p0-p3
            p2 = {x: largo*0.490625, y: alto*(9/32)};   // esta dentro del segemento p0-p3
            p3 = {x: largo/2, y: alto/4};
            bernsteinBasis = getBernsteinBasis((u-0.4)/0.1);
            position = vec3.fromValues(
                bernsteinBasis.b0*p0.x + bernsteinBasis.b1*p1.x + bernsteinBasis.b2*p2.x + bernsteinBasis.b3*p3.x,
                bernsteinBasis.b0*p0.y + bernsteinBasis.b1*p1.y + bernsteinBasis.b2*p2.y + bernsteinBasis.b3*p3.y,
                (v - 0.5) * ancho
            );
        } else if (u > 0.5 && u <= 0.7) {               // curva de bezier nro 4
            p0 = {x: largo/2, y: alto/4};
            p1 = {x: largo*(15/32), y: -alto*(7/32)};
            p2 = {x: largo/4, y: -alto*(3/8)};          // simetrico junto con p1 del tramo siguiente
            p3 = {x: largo*(3/16), y: -alto*(7/16)};
            bernsteinBasis = getBernsteinBasis((u-0.5)/0.2);
            position = vec3.fromValues(
                bernsteinBasis.b0*p0.x + bernsteinBasis.b1*p1.x + bernsteinBasis.b2*p2.x + bernsteinBasis.b3*p3.x,
                bernsteinBasis.b0*p0.y + bernsteinBasis.b1*p1.y + bernsteinBasis.b2*p2.y + bernsteinBasis.b3*p3.y,
                (v - 0.5) * ancho
            );
        } else if (u > 0.7 && u <= 0.9) {               // curva de bezier nro 5
            p0 = {x: largo*(3/16), y: -alto*(7/16)};
            p1 = {x: largo/8, y: -alto/2};              // simetrico junto con p2 del tramo anterior
            p2 = {x: -largo*0.2265625, y: -alto*(19/32)};
            p3 = {x: -largo*(7/16), y: -alto*(13/32)};
            bernsteinBasis = getBernsteinBasis((u-0.7)/0.2);
            position = vec3.fromValues(
                bernsteinBasis.b0*p0.x + bernsteinBasis.b1*p1.x + bernsteinBasis.b2*p2.x + bernsteinBasis.b3*p3.x,
                bernsteinBasis.b0*p0.y + bernsteinBasis.b1*p1.y + bernsteinBasis.b2*p2.y + bernsteinBasis.b3*p3.y,
                (v - 0.5) * ancho
            );
        } else if (u > 0.9 && u <= 1) {
            p0 = {x: -largo*(7/16), y: -alto*(13/32)};
            p1 = {x: -largo*0.45, y: -alto*0.375};
            p2 = {x: -largo*0.4875, y: -alto*0.28125};
            p3 = {x: -largo/2, y: -alto/4};
            bernsteinBasis = getBernsteinBasis((u-0.9)/0.1);
            position = vec3.fromValues(
                bernsteinBasis.b0*p0.x + bernsteinBasis.b1*p1.x + bernsteinBasis.b2*p2.x + bernsteinBasis.b3*p3.x,
                bernsteinBasis.b0*p0.y + bernsteinBasis.b1*p1.y + bernsteinBasis.b2*p2.y + bernsteinBasis.b3*p3.y,
                (v - 0.5) * ancho
            );
        }
        return position;
    }

    this.getNormal = function (u, v) {
        var vecNormal;
        if (u >= 0 && u <= 0.25) {
            vecNormal = vec3.fromValues(-3 * alto, 2 * largo, 0);
        } else if (u > 0.25 && u <= 0.5) {
            vecNormal = vec3.fromValues(alto, 2 * largo, 0);
        } else if (u > 0.5 && u <= 0.75) {
            vecNormal = vec3.fromValues(3 * alto, -2 * largo, 0);
        } else if (u > 0.75 && u <= 1) {
            vecNormal = vec3.fromValues(-alto, -2 * largo, 0);
        }
        vec3.normalize(vecNormal, vecNormal);
        return vecNormal;
    }

    this.getCoordenadasTextura = function (u, v) {
        return [u, v];
    }

    this.tieneTapas = function () {
        return true;
    }

    // v deberia ser 0 o 1
    this.getPosicionTapa = function (v) {
        return [0, 0, (v - 0.5) * ancho];
    }

    // v deberia ser 0 o 1
    this.getNormalTapa = function (v) {
        var vecNormal;
        vecNormal = vec3.fromValues(0, 0, v - 0.5);
        vec3.normalize(vecNormal, vecNormal);
        return vecNormal;
    }

    this.getCoordenadasTexturaTapa = function (u, v) {
        return [u, v];
    }
}


class Grilla3D {
    constructor(superficie) {
        this.filas = 100;
        this.columnas = 100;
        this.superficie3D = superficie;
        this.mallaDeTriangulos = this.generarSuperficie(this.superficie3D, this.filas, this.columnas);
    }

    dibujarGeometria() {
        this.dibujarMalla(this.mallaDeTriangulos);
    }

    generarSuperficie(superficie, filas, columnas) {
        let positionBuffer = [];
        let normalBuffer = [];
        let uvBuffer = [];
        let u, v, pos, nrm, uvs;

        // tapa inferior (v===0)
        if (superficie.tieneTapas()) {
            v = 0;
            pos = superficie.getPosicionTapa(v);
            nrm = superficie.getNormalTapa(v);
            for (let j = 0; j <= columnas; j++) {
                u = j / columnas;
                positionBuffer.push(pos[0]);
                positionBuffer.push(pos[1]);
                positionBuffer.push(pos[2]);

                normalBuffer.push(nrm[0]);
                normalBuffer.push(nrm[1]);
                normalBuffer.push(nrm[2]);

                uvs = superficie.getCoordenadasTexturaTapa(u, v);

                uvBuffer.push(uvs[0]);
                uvBuffer.push(uvs[1]);
            }
            for (let j = 0; j <= columnas; j++) {
                u = j / columnas;
                pos = superficie.getPosicion(u, v);
                positionBuffer.push(pos[0]);
                positionBuffer.push(pos[1]);
                positionBuffer.push(pos[2]);

                normalBuffer.push(nrm[0]);
                normalBuffer.push(nrm[1]);
                normalBuffer.push(nrm[2]);

                uvs = superficie.getCoordenadasTexturaTapa(u, v);

                uvBuffer.push(uvs[0]);
                uvBuffer.push(uvs[1]);
            }
        }

        for (let i = 0; i <= filas; i++) {
            for (let j = 0; j <= columnas; j++) {

                u = j / columnas;
                v = i / filas;
                pos = superficie.getPosicion(u, v);

                positionBuffer.push(pos[0]);
                positionBuffer.push(pos[1]);
                positionBuffer.push(pos[2]);

                nrm = superficie.getNormal(u, v);

                normalBuffer.push(nrm[0]);
                normalBuffer.push(nrm[1]);
                normalBuffer.push(nrm[2]);

                uvs = superficie.getCoordenadasTextura(u, v);

                uvBuffer.push(uvs[0]);
                uvBuffer.push(uvs[1]);
            }
        }

        // tapa superior (v===1)
        if (superficie.tieneTapas()) {
            v = 1;
            nrm = superficie.getNormalTapa(v);
            for (let j = 0; j <= columnas; j++) {
                u = j / columnas;
                pos = superficie.getPosicion(u, v);
                positionBuffer.push(pos[0]);
                positionBuffer.push(pos[1]);
                positionBuffer.push(pos[2]);

                normalBuffer.push(nrm[0]);
                normalBuffer.push(nrm[1]);
                normalBuffer.push(nrm[2]);

                uvs = superficie.getCoordenadasTexturaTapa(u, v);

                uvBuffer.push(uvs[0]);
                uvBuffer.push(uvs[1]);
            }
            pos = superficie.getPosicionTapa(v);
            for (let j = 0; j <= columnas; j++) {
                u = j / columnas;
                positionBuffer.push(pos[0]);
                positionBuffer.push(pos[1]);
                positionBuffer.push(pos[2]);

                normalBuffer.push(nrm[0]);
                normalBuffer.push(nrm[1]);
                normalBuffer.push(nrm[2]);

                uvs = superficie.getCoordenadasTexturaTapa(u, v);

                uvBuffer.push(uvs[0]);
                uvBuffer.push(uvs[1]);
            }
        }

        // Buffer de indices de los triángulos

        let indexBuffer = [];
        var filasTotales = filas;
        if (superficie.tieneTapas()) {
            // si tiene tapas, se adicionan 2 filas mas por cada tapa
            filasTotales += 4;
        }

        for (let i = 0; i < filasTotales; i++) {
            indexBuffer.push(i * (columnas + 1));
            indexBuffer.push(i * (columnas + 1));
            indexBuffer.push((i + 1) * (columnas + 1));
            for (let j = 0; j < columnas; j++) {
                indexBuffer.push(i * (columnas + 1) + j + 1);
                indexBuffer.push((i + 1) * (columnas + 1) + j + 1);
            }
            indexBuffer.push((i + 1) * (columnas + 1) + columnas);
        }

        // Creación e Inicialización de los buffers

        let webgl_position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionBuffer), gl.STATIC_DRAW);
        webgl_position_buffer.itemSize = 3;
        webgl_position_buffer.numItems = positionBuffer.length / 3;

        let webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalBuffer), gl.STATIC_DRAW);
        webgl_normal_buffer.itemSize = 3;
        webgl_normal_buffer.numItems = normalBuffer.length / 3;

        let webgl_uvs_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_uvs_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvBuffer), gl.STATIC_DRAW);
        webgl_uvs_buffer.itemSize = 2;
        webgl_uvs_buffer.numItems = uvBuffer.length / 2;


        let webgl_index_buffer = gl.createBuffer();
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

    dibujarMalla(mallaDeTriangulos) {
        // Se configuran los buffers que alimentaron el pipeline
        gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_position_buffer);
        gl.vertexAttribPointer(glProgram.vertexPositionAttribute, mallaDeTriangulos.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

        //gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_uvs_buffer);
        //gl.vertexAttribPointer(glProgram.textureCoordAttribute, mallaDeTriangulos.webgl_uvs_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_normal_buffer);
        gl.vertexAttribPointer(glProgram.vertexNormalAttribute, mallaDeTriangulos.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mallaDeTriangulos.webgl_index_buffer);

        gl.drawElements(gl.TRIANGLE_STRIP, mallaDeTriangulos.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        /*if (modo!="wireframe"){
            gl.uniform1i(glProgram.useLightingUniform,(lighting=="true"));
            gl.drawElements(gl.TRIANGLE_STRIP, mallaDeTriangulos.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        }

        if (modo!="smooth") {
            gl.uniform1i(glProgram.useLightingUniform,false);
            gl.drawElements(gl.LINE_STRIP, mallaDeTriangulos.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        }*/
    }
}
