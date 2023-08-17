type ProgramInfo = {
    program: WebGLProgram
    attribLocations: {
        vertexPosition: number
        textureCoord: number
    }
    uniformLocations: {
        projectionMatrix: WebGLUniformLocation
        modelViewMatrix: WebGLUniformLocation
        uSampler: WebGLUniformLocation
    }
}

type Buffers = {
    position: WebGLBuffer
    textureCoord: WebGLBuffer
    indices: WebGLBuffer
}

export type {
    ProgramInfo,
    Buffers,
}