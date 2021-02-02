
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
                gl.generateMipmap(gl.TEXTURE_2D);
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
}