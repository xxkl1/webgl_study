import { loadTexture } from '../../utils/texture';

const loadCubeTexture = function (gl: WebGLRenderingContext) : WebGLTexture  {
    // Load texture
    const texture = loadTexture(gl, 'cubetexture.png')!;
    // Flip image pixels into the bottom-to-top order that WebGL expects.
    // 上下翻转素材，为什么要翻转，具体看https://jameshfisher.com/2020/10/22/why-is-my-webgl-texture-upside-down/
    // 控制图像的加载和渲染方式，
    // 在 WebGL 中，图像的 Y 轴默认方向与通常的图像坐标方向（原点在左上角）相反，需要通过下面的代码，加载完图像后，将图像y轴翻转，准备好素材，待渲染。
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    return texture
}

export {
    loadCubeTexture,
}