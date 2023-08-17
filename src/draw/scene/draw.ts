import { clear } from '../../utils/clear'
import { bindSceneBuffers } from './bind_buffer'
import { useSharderProgram } from './program_info'
import { Buffers, ProgramInfo } from './type'

const drawSceneElements= function (gl: WebGLRenderingContext) {
    const vertexCount = 36;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
}

const drawScene = function (
    gl: WebGLRenderingContext,
    programInfo: ProgramInfo,
    buffers: Buffers,
    cubeRotation: number = 0,
    texture: WebGLTexture,
) {
    clear(gl)
    useSharderProgram(gl, programInfo)
    bindSceneBuffers(gl, programInfo, buffers, cubeRotation, texture)
    drawSceneElements(gl)
}

export {
    drawScene,
}