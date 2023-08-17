import { drawScene } from './draw';
import { initBuffers } from './init_buffer';
import { getProgramInfo } from './program_info';

/**
 * note1 - 两种缓冲区类型
 * gl.ARRAY_BUFFER和gl.ELEMENT_ARRAY_BUFFER
 * gl.ARRAY_BUFFER: 用于存放，顶点数据，例如顶点的位置、颜色、法线等
 * gl.ELEMENT_ARRAY_BUFFER: 用于存储索引数据的缓冲区绑定点。索引数据指定了如何连接顶点以形成图元（例如三角形）。
 *
 * note2 - 缓冲区
 * 缓冲区buffer的设计，看起来是webgl，不能直接读取js变量，所以将数据通过缓冲区进行转接，c++调用webgl也是这样类似的设计，然后使用js buffer对象来进行webgl缓冲区上下文关联
 * 写入前需要调用一下bindBuffer，读取前，也需要调用bindBuffer一下，实现上下文关联
 */

// 绘制旋转的正方形
const drawSceneRotate = function (gl: WebGLRenderingContext) {
    // 获取sharder和sharder变量索引
    const programInfo = getProgramInfo(gl)
    // 获取缓冲区对象
    const buffers = initBuffers(gl)

    let then = 0
    let cubeRotation = 0.0;
    let deltaTime = 0

    // Draw the scene repeatedly
    function render(now: number) {
        now *= 0.001 // convert to seconds
        deltaTime = now - then
        then = now

        drawScene(gl, programInfo, buffers, cubeRotation)
        cubeRotation += deltaTime;

        requestAnimationFrame(render)
    }
    requestAnimationFrame(render)
}

export {
    drawSceneRotate,
}