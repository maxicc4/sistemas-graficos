
class Texture {
    constructor(url, colorRGBA) {
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        // Fill the texture with a 1x1 black pixel.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array(colorRGBA));

        if (url !== '') {
            // Asynchronously load an image
            let image = new Image();
            image.src = url;
            image.addEventListener('load', function () {
                // Now that the image has loaded make copy it to the texture.
                gl.bindTexture(gl.TEXTURE_2D, this.texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                if (this.isPowerOf2(image.width) && this.isPowerOf2(image.height)) {
                    // Yes, it's a power of 2. Generate mips.
                    gl.generateMipmap(gl.TEXTURE_2D);
                } else {
                    // No, it's not a power of 2. Turn off mips and set
                    // wrapping to clamp to edge
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                }
                console.log('textura cargada');
            }.bind(this));
        }
    }

    static createTextureFromUrl(url) {
        return new Texture(url, [0, 0, 0, 255]);
    }

    static createTextureFromColor(colorRGBA) {
        return new Texture('', colorRGBA);
    }

    getWebGLTexture() {
        return this.texture;
    }

    isPowerOf2(value) {
        return (value & (value - 1)) === 0;
    }

    getTextureType() {
        return gl.TEXTURE_2D;
    }
}

class CubeMap {
    constructor(faceInfos) {
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);

        faceInfos.forEach((faceInfo) => {
            const {target, url} = faceInfo;

            // Upload the canvas to the cubemap face.
            const level = 0;
            const internalFormat = gl.RGBA;
            const width = 512;
            const height = 512;
            const format = gl.RGBA;
            const type = gl.UNSIGNED_BYTE;

            // setup each face so it's immediately renderable
            gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);

            // Asynchronously load an image
            const image = new Image();
            image.src = url;
            image.addEventListener('load', function() {
                // Now that the image has loaded upload it to the texture.
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
                gl.texImage2D(target, level, internalFormat, format, type, image);
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            }.bind(this));
        });
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    }

    getWebGLTexture() {
        return this.texture;
    }

    getTextureType() {
        return gl.TEXTURE_CUBE_MAP;
    }
}