import { drawLine } from './draw/line'
import { drawScene } from './draw/scene'

const getGl = function () {
    const canvas = document.querySelector('#glcanvas') as HTMLCanvasElement
    const gl = canvas.getContext('webgl')
    return gl
}

const reset = function (gl: WebGLRenderingContext) {
    // 使用完全不透明的黑色清除所有图像
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    // 用上面指定的颜色清除缓冲区
    gl.clear(gl.COLOR_BUFFER_BIT)
}

const main = function () {
    const gl = getGl()
    if (gl) {
        reset(gl)
        // drawLine(gl)
        drawScene(gl)
    }
}

main()
