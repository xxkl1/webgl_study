import { Buffers } from './type';

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
        -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, // xyz xyz xyz xyz
        // Back face
        -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, // xyz xyz xyz xyz
        // Top face
        -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, // xyz xyz xyz xyz
        // Bottom face
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0, // xyz xyz xyz xyz
        // Right face
        1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, // xyz xyz xyz xyz
        // Left face
        -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, // xyz xyz xyz xyz
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

    return positionBuffer
}

const initColorBuffer = function (gl: WebGLRenderingContext) {
    // 传入buffer的colors，是动态拼接的
    // initPositionBuffer不是动态拼接的原因是，initPositionBuffer中的24个顶点信息，数据不一样的
    // 而对于colors，每个面的颜色是一样的，即colors中只有6种不同的数据，所以可以动态拼接
    const faceColors = [
        [1.0, 1.0, 1.0, 1.0], // Front face: white
        [1.0, 0.0, 0.0, 1.0], // Back face: red
        [0.0, 1.0, 0.0, 1.0], // Top face: green
        [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
        [1.0, 1.0, 0.0, 1.0], // Right face: yellow
        [1.0, 0.0, 1.0, 1.0], // Left face: purple
      ];

      // Convert the array of colors into a table for all the vertices.
      let colors : number[] = [];

      for (var j = 0; j < faceColors.length; ++j) {
        const c = faceColors[j];
        // Repeat each color four times for the four vertices of the face
        // 重复四次，是因为一个面有四个顶点，每个点颜色都一样
        colors = colors.concat(c, c, c, c);
    }


    const colorBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)

    return colorBuffer
}

const initIndexBuffer = function (gl: WebGLRenderingContext) {
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's
    // position.
    const indices = [
      0, 1, 2, 0, 2, 3, // front
      4, 5, 6, 4, 6, 7, // back
      8, 9, 10, 8, 10, 11, // top
      12, 13, 14, 12, 14, 15, // bottom
      16, 17, 18, 16, 18, 19, // right
      20, 21, 22, 20, 22, 23, // left
    ];
    // Now send the element array to GL
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW,
    );
    return indexBuffer;
}

/**
 * 初始化缓冲区
 * 需要初始化三种缓冲区position，color，indices
 * position存放的是，所有顶点的位置信息，每个面4个顶点，一共6个面，顶点数量是4*6=24，一个顶点的信息是三维，即xyz，所以position数组长度是3*24=72
 * color存放的是，所有顶点的颜色信息，每个面4个顶点，一共6个面，顶点数量是4*6=24，一个顶点的信息是四维，即rgba，所以color数组长度是4*24=96
 * indices 存放的是，由于webgl只能绘制三角形，所以需要将正方形的顶点，那么原本一个正方形需要4个顶点，拆分成两个三角形，需要6个顶点，有6面，即6*6个顶点，所以indices数组长度是6*6=36
 * indices的子元素，对应的是position和color的子元素的索引，例如0就代表，positions的前3个，color的前4个子元素，当然到时应该是对应buffer的索引
 *
 * 初始化完对应的js数组后，需要将js数组的数据，写入到webgl缓冲区中
 * 所以initBuffers最终目的是初始化webgl缓冲区的顶点数据，和图元索引数据
 * @param gl
 * @returns
 */
const initBuffers = function (gl: WebGLRenderingContext): Buffers {
    return {
        position: initPositionBuffer(gl)!,
        color: initColorBuffer(gl)!,
        indices: initIndexBuffer(gl)!,
    }
}

export {
    initBuffers,
}