import { Buffers } from './type'

const initPositionBuffer = function (gl: WebGLRenderingContext) {
    // 套路写法
    const positionBuffer = gl.createBuffer()
    // 将ARRAY_BUFFER绑定到positionBuffer，后面读取positionBuffer就相当于读取gl.ARRAY_BUFFER
    // 想要操作gl.ARRAY_BUFFER，不能直接操作positionBuffer，要使用vertexAttribPointer等函数进行操作

    // bindBuffer起到绑定webgl缓冲区上下文的作用
    // 看起来，如果positionBuffer是一个空的buffer，那么会把当前ARRAY_BUFFER的索引绑定到positionBuffer上
    // 如果positionBuffer不是一个空的buffer，会给ARRAY_BUFFER设置索引的起始
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

    // 定义一个正方形，四个顶点，每个顶点两个值
    // const positions = [0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5]
    const positions = [
        // Front face
        -1.0,
        -1.0,
        1.0,
        1.0,
        -1.0,
        1.0,
        1.0,
        1.0,
        1.0,
        -1.0,
        1.0,
        1.0, // xyz xyz xyz xyz
        // Back face
        -1.0,
        -1.0,
        -1.0,
        -1.0,
        1.0,
        -1.0,
        1.0,
        1.0,
        -1.0,
        1.0,
        -1.0,
        -1.0, // xyz xyz xyz xyz
        // Top face
        -1.0,
        1.0,
        -1.0,
        -1.0,
        1.0,
        1.0,
        1.0,
        1.0,
        1.0,
        1.0,
        1.0,
        -1.0, // xyz xyz xyz xyz
        // Bottom face
        -1.0,
        -1.0,
        -1.0,
        1.0,
        -1.0,
        -1.0,
        1.0,
        -1.0,
        1.0,
        -1.0,
        -1.0,
        1.0, // xyz xyz xyz xyz
        // Right face
        1.0,
        -1.0,
        -1.0,
        1.0,
        1.0,
        -1.0,
        1.0,
        1.0,
        1.0,
        1.0,
        -1.0,
        1.0, // xyz xyz xyz xyz
        // Left face
        -1.0,
        -1.0,
        -1.0,
        -1.0,
        -1.0,
        1.0,
        -1.0,
        1.0,
        1.0,
        -1.0,
        1.0,
        -1.0, // xyz xyz xyz xyz
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

    return positionBuffer
}

const initIndexBuffer = function (gl: WebGLRenderingContext) {
    const indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's
    // position.
    const indices = [
        0,
        1,
        2,
        0,
        2,
        3, // front
        4,
        5,
        6,
        4,
        6,
        7, // back
        8,
        9,
        10,
        8,
        10,
        11, // top
        12,
        13,
        14,
        12,
        14,
        15, // bottom
        16,
        17,
        18,
        16,
        18,
        19, // right
        20,
        21,
        22,
        20,
        22,
        23, // left
    ]
    // Now send the element array to GL
    gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices),
        gl.STATIC_DRAW,
    )
    return indexBuffer
}

const initTextureBuffer = function (gl: WebGLRenderingContext) {
    const textureCoordBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer)

    // 一个面有四个顶点，每个顶点是uv坐标，uv取值范围是0-1，所以一个面的uv坐标是8个值
    // uv贴图原理，贴图里面的像素块，可以用范围为0,0 到 1,1 uv坐标来表示，相当于0-1是一个百分比
    /**
     * 根据单面front的例子，分析具体是怎么贴图的
     * 可以从顶点buffer得到，front的顶点信息是 0, 1, 2, 0, 2, 3, 代表两个三角形顶点的索引
     * 先分析第一个三角形0, 1, 2
     * 根据索引值和position buffer，坐标值是 0 -> -1.0, -1.0, 1.0, 1 -> 1.0, -1.0, 1.0, 2 -> 1.0, 1.0, 1.0
     * 即左下角到右下角到右上角
     * 根据texture buffer得到贴图的uv坐标是 0 -> 0, 0, 1 -> 1, 0, 2 -> 1, 1
     * 对应贴图的左上角，右上角，右下角，由于webgl渲染上下颠倒，所以得上下翻转一下，即左下角，右下角，右上角，刚好就和坐标系的顺序一致了
     * 接着就是webgl根据uv进行采样了贴图了
     */
    const textureCoordinates = [
        // Front
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Back
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Top
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Bottom
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Right
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Left
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    ]

    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(textureCoordinates),
        gl.STATIC_DRAW,
    )

    return textureCoordBuffer
}

/**
 * 初始化缓冲区
 * 需要初始化三种缓冲区position，color，indices
 * position存放的是，所有顶点的位置信息，每个面4个顶点，一共6个面，顶点数量是4*6=24，一个顶点的信息是三维，即xyz，所以position数组长度是3*24=72
 * color存放的是，所有顶点的颜色信息，每个面4个顶点，一共6个面，顶点数量是4*6=24，一个顶点的信息是四维，即rgba，所以color数组长度是4*24=96
 * indices 存放的是，由于webgl只能绘制三角形，所以需要将正方形的顶点，那么原本一个正方形需要4个顶点，拆分成两个三角形，需要6个顶点，有6面，即6*6个顶点，所以indices数组长度是6*6=36
 * indices的子元素，对应的是position和color的子元素的索引，例如0就代表，positions的前3个，color的前4个子元素，当然到时应该是对应buffer的索引
 * 初始化完对应的js数组后，需要将js数组的数据，写入到webgl缓冲区中
 * 所以initBuffers最终目的是初始化webgl缓冲区的顶点数据，和图元索引数据
 * @param gl
 * @returns
 */
const initBuffers = function (gl: WebGLRenderingContext): Buffers {
    return {
        position: initPositionBuffer(gl)!,
        textureCoord: initTextureBuffer(gl)!,
        indices: initIndexBuffer(gl)!,
    }
}

export { initBuffers }
