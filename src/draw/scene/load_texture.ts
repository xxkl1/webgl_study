import { loadTexture } from '../../utils/texture';

const loadCubeTexture = function (gl: WebGLRenderingContext) : WebGLTexture  {
    // Load texture
    const texture = loadTexture(gl, 'cubetexture.png')!;
    // Flip image pixels into the bottom-to-top order that WebGL expects.
    // 上下翻转素材，为什么要翻转，具体看https://jameshfisher.com/2020/10/22/why-is-my-webgl-texture-upside-down/
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    return texture
}

export {
    loadCubeTexture,
}