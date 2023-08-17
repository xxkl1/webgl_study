import { loadTexture } from '../../utils/texture';

const loadCubeTexture = function (gl: WebGLRenderingContext) : WebGLTexture  {
    // Load texture
    const texture = loadTexture(gl, 'cubetexture.png')!;
    // Flip image pixels into the bottom-to-top order that WebGL expects.
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    return texture
}

export {
    loadCubeTexture,
}