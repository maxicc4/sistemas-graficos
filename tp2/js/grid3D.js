class BezierCurve {
    constructor(p0, p1, p2, p3) {
        this.p0 = p0;
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
    }

    getBernsteinBasis(u) {
        return {
            b0: (1-u)*(1-u)*(1-u),
            b1: 3*(1-u)*(1-u)*u,
            b2: 3*(1-u)*u*u,
            b3: u*u*u
        }
    }

    getDerivedBernsteinBasis(u) {
        return {
            b0: -3*(1-u)*(1-u),
            b1: -6*(1-u)*u + 3*(1-u)*(1-u),
            b2: -3*u*u + 6*(1-u)*u,
            b3: 3*u*u
        }
    }

    getPosition(u) {
        let bernsteinBasis = this.getBernsteinBasis(u);
        return vec3.fromValues(
            bernsteinBasis.b0*this.p0.x + bernsteinBasis.b1*this.p1.x + bernsteinBasis.b2*this.p2.x + bernsteinBasis.b3*this.p3.x,
            bernsteinBasis.b0*this.p0.y + bernsteinBasis.b1*this.p1.y + bernsteinBasis.b2*this.p2.y + bernsteinBasis.b3*this.p3.y,
            0
        );
    }

    getTangent(u) {
        let derivedBernsteinBasis = this.getDerivedBernsteinBasis(u);
        return vec3.fromValues(
            derivedBernsteinBasis.b0*this.p0.x + derivedBernsteinBasis.b1*this.p1.x + derivedBernsteinBasis.b2*this.p2.x + derivedBernsteinBasis.b3*this.p3.x,
            derivedBernsteinBasis.b0*this.p0.y + derivedBernsteinBasis.b1*this.p1.y + derivedBernsteinBasis.b2*this.p2.y + derivedBernsteinBasis.b3*this.p3.y,
            0
        );
    }
}

class Grid3D {
    constructor(surface, rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.surface3D = surface;
        this.triangleMesh = this.generateSurface(this.surface3D, this.rows, this.cols);
    }

    drawGeometry() {
        this.drawMesh(this.triangleMesh);
    }

    generateSurface(surface, rows, cols) {
        let positionBuffer = [];
        let normalBuffer = [];
        let uvBuffer = [];
        let u, v, pos, nrm, uvs;

        // tapa inferior (v===0)
        if (surface.haveCaps()) {
            v = 0;
            pos = surface.getCapPosition(v);
            nrm = surface.getCapNormal(v);
            uvs = surface.getCapTextureCoordinatesCenter(v);
            for (let j = 0; j <= cols; j++) {
                u = j / cols;
                positionBuffer.push(pos[0]);
                positionBuffer.push(pos[1]);
                positionBuffer.push(pos[2]);

                normalBuffer.push(nrm[0]);
                normalBuffer.push(nrm[1]);
                normalBuffer.push(nrm[2]);

                uvBuffer.push(uvs[0]);
                uvBuffer.push(uvs[1]);
            }
            for (let j = 0; j <= cols; j++) {
                u = j / cols;
                pos = surface.getPosition(u, v);
                positionBuffer.push(pos[0]);
                positionBuffer.push(pos[1]);
                positionBuffer.push(pos[2]);

                normalBuffer.push(nrm[0]);
                normalBuffer.push(nrm[1]);
                normalBuffer.push(nrm[2]);

                uvs = surface.getCapTextureCoordinates(u, v);

                uvBuffer.push(uvs[0]);
                uvBuffer.push(uvs[1]);
            }
        }

        for (let i = 0; i <= rows; i++) {
            for (let j = 0; j <= cols; j++) {

                u = j / cols;
                v = i / rows;
                pos = surface.getPosition(u, v);

                positionBuffer.push(pos[0]);
                positionBuffer.push(pos[1]);
                positionBuffer.push(pos[2]);

                nrm = surface.getNormal(u, v);

                normalBuffer.push(nrm[0]);
                normalBuffer.push(nrm[1]);
                normalBuffer.push(nrm[2]);

                uvs = surface.getTextureCoordinates(u, v);

                uvBuffer.push(uvs[0]);
                uvBuffer.push(uvs[1]);
            }
        }

        // tapa superior (v===1)
        if (surface.haveCaps()) {
            v = 1;
            nrm = surface.getCapNormal(v);
            for (let j = 0; j <= cols; j++) {
                u = j / cols;
                pos = surface.getPosition(u, v);
                positionBuffer.push(pos[0]);
                positionBuffer.push(pos[1]);
                positionBuffer.push(pos[2]);

                normalBuffer.push(nrm[0]);
                normalBuffer.push(nrm[1]);
                normalBuffer.push(nrm[2]);

                uvs = surface.getCapTextureCoordinates(u, v);

                uvBuffer.push(uvs[0]);
                uvBuffer.push(uvs[1]);
            }
            pos = surface.getCapPosition(v);
            uvs = surface.getCapTextureCoordinatesCenter(v);
            for (let j = 0; j <= cols; j++) {
                u = j / cols;
                positionBuffer.push(pos[0]);
                positionBuffer.push(pos[1]);
                positionBuffer.push(pos[2]);

                normalBuffer.push(nrm[0]);
                normalBuffer.push(nrm[1]);
                normalBuffer.push(nrm[2]);

                uvBuffer.push(uvs[0]);
                uvBuffer.push(uvs[1]);
            }
        }

        // Buffer de indices de los triángulos

        let indexBuffer = [];
        let totalRows = rows;
        if (surface.haveCaps()) {
            // si tiene tapas, se adicionan 2 filas mas por cada tapa
            totalRows += 4;
        }

        for (let i = 0; i < totalRows; i++) {
            indexBuffer.push(i * (cols + 1));
            indexBuffer.push(i * (cols + 1));
            indexBuffer.push((i + 1) * (cols + 1));
            for (let j = 0; j < cols; j++) {
                indexBuffer.push(i * (cols + 1) + j + 1);
                indexBuffer.push((i + 1) * (cols + 1) + j + 1);
            }
            indexBuffer.push((i + 1) * (cols + 1) + cols);
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

    drawMesh(triangleMesh) {
        let currentProgram = gl.getParameter(gl.CURRENT_PROGRAM);
        // Se configuran los buffers que alimentaron el pipeline
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleMesh.webgl_position_buffer);
        gl.vertexAttribPointer(currentProgram.vertexPositionAttribute, triangleMesh.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

        if (currentProgram.vertexUVAttribute) {
            gl.bindBuffer(gl.ARRAY_BUFFER, triangleMesh.webgl_uvs_buffer);
            gl.vertexAttribPointer(currentProgram.vertexUVAttribute, triangleMesh.webgl_uvs_buffer.itemSize, gl.FLOAT, false, 0, 0);
        }
        if (currentProgram.vertexNormalAttribute) {
            gl.bindBuffer(gl.ARRAY_BUFFER, triangleMesh.webgl_normal_buffer);
            gl.vertexAttribPointer(currentProgram.vertexNormalAttribute, triangleMesh.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleMesh.webgl_index_buffer);

        gl.drawElements(gl.TRIANGLE_STRIP, triangleMesh.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        /*if (modo!="wireframe"){
            gl.uniform1i(currentProgram.useLightingUniform,(lighting=="true"));
            gl.drawElements(gl.TRIANGLE_STRIP, triangleMesh.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        }

        if (modo!="smooth") {
            gl.uniform1i(currentProgram.useLightingUniform,false);
            gl.drawElements(gl.LINE_STRIP, triangleMesh.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        }*/
    }
}
