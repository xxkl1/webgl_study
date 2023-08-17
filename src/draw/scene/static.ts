import { drawScene } from './draw'
import { initBuffers } from './init_buffer'
import { loadCubeTexture } from './load_texture'
import { getProgramInfo } from './program_info'

// 绘制静态的正方形
const drawSceneStatic = function (gl: WebGLRenderingContext) {
    // 获取sharder和sharder变量索引
    const programInfo = getProgramInfo(gl)
    const buffers = initBuffers(gl)
    const texture = loadCubeTexture(gl)
    drawScene(gl, programInfo, buffers, 30, texture)
}

export {
    drawSceneStatic,
}