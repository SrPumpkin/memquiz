import './style.css';

import { useEffect, useRef } from 'react';

const VERTEX_SHADER_SOURCE = `#version 300 es

void main() {
    vec2 position = vec2(
        float((gl_VertexID << 1) & 2),
        float(gl_VertexID & 2)
    );

    gl_Position = vec4(position * 2.0 - 1.0, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SOURCE = `#version 300 es

precision mediump float;
precision highp int;

uniform vec2 u_resolution;
uniform float u_aspect;
uniform int u_frame;

out vec4 fragColor;

float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);

    return fract(p.x * p.y);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int i = 0; i < 5; i++) {
        value += amplitude * noise(p);
        p *= 2.02;
        amplitude *= 0.55;
    }

    return value;
}

vec2 warp(vec2 p, float time) {
    vec2 q = vec2(
        fbm(p + time * 0.08),
        fbm(p + vec2(5.2, 1.3) - time * 0.07)
    );
    vec2 r = vec2(
        fbm(p + 3.0 * q + vec2(1.7, 9.2) + time * 0.05),
        fbm(p + 3.0 * q + vec2(8.3, 2.8) - time * 0.06)
    );

    return r;
}

float grid(vec2 uv, float cell, float thickness) {
    vec2 gridPosition =
        abs(fract(uv * cell - 0.5) - 0.5) / fwidth(uv * cell);
    float line = min(gridPosition.x, gridPosition.y);

    return 1.0 - smoothstep(thickness, thickness + 0.5, line);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = uv - 0.5;
    p.x *= u_aspect;

    float timeOne = float(u_frame) * 0.012;
    float timeTwo = float(u_frame) * 0.007 + 40.0;
    float timeThree = float(u_frame) * 0.02;

    vec2 base = p * 1.5;
    vec2 warpedPosition = warp(base, timeOne);
    float density = fbm(
        base
        + 2.4 * warpedPosition
        + vec2(timeTwo * 0.15, -timeTwo * 0.1)
    );

    float macro = fbm(p * 0.7 - vec2(timeOne * 0.12, timeTwo * 0.09));
    float pulse = 0.5 + 0.5 * sin(timeThree * 0.6 + macro * 6.0);

    float bandA = fbm(
        vec2(
            p.x * 1.1 + warpedPosition.x * 1.8,
            p.y * 0.22 + timeOne * 0.18
        )
    );
    float bandB = fbm(
        vec2(
            p.x * 0.85 - warpedPosition.y * 1.5 + 4.0,
            p.y * 0.3 - timeTwo * 0.15
        )
    );
    float ribbon =
        pow(smoothstep(0.5, 0.93, bandA), 2.0) * 0.55
        + pow(smoothstep(0.55, 0.95, bandB), 2.0) * 0.45;
    ribbon *= 0.6 + 0.4 * pulse;

    vec3 deep = vec3(0.028, 0.018, 0.060);
    vec3 plum = vec3(0.075, 0.040, 0.130);
    vec3 violet = vec3(0.16, 0.075, 0.20);
    vec3 magenta = vec3(0.30, 0.09, 0.26);
    vec3 lilac = vec3(0.40, 0.20, 0.42);

    vec3 color = mix(deep, plum, smoothstep(0.12, 0.65, density));
    color = mix(
        color,
        violet,
        smoothstep(0.4, 0.8, density) * (0.5 + 0.5 * pulse)
    );
    color = mix(color, magenta, smoothstep(0.65, 0.93, density));
    color = mix(color, lilac, ribbon);

    color *= 0.9 + 0.15 * pulse;

    float vignette = 1.0 - smoothstep(-0.546, 3.104, length(p));
    color *= mix(0.130, 1.0, vignette);

    color = pow(color, vec3(0.9));
    color = color / (1.0 + color * 0.3);
    color *= 1.1;

    float grain = fract(
        sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)))
        * 43758.5453
        + timeOne * 3.0
    );
    color += (grain - 0.5) * 0.008;

    float gridLayer = grid(p, 6.0, 0.10);
    float overlayAlpha = gridLayer * 0.06;
    vec3 lineColor = vec3(0.55, 0.5, 0.65);
    color = mix(color, lineColor, overlayAlpha);

    fragColor = vec4(color, 1.0);
}
`;

function createShader(
    gl: WebGL2RenderingContext,
    type: number,
    source: string,
) {
    const shader = gl.createShader(type);

    if (!shader) {
        throw new Error('Не удалось создать WebGL-шейдер.');
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const message =
            gl.getShaderInfoLog(shader) ?? 'Неизвестная ошибка компиляции.';

        gl.deleteShader(shader);
        throw new Error(message);
    }

    return shader;
}

function createProgram(gl: WebGL2RenderingContext) {
    const vertexShader = createShader(
        gl,
        gl.VERTEX_SHADER,
        VERTEX_SHADER_SOURCE,
    );
    const fragmentShader = createShader(
        gl,
        gl.FRAGMENT_SHADER,
        FRAGMENT_SHADER_SOURCE,
    );
    const program = gl.createProgram();

    if (!program) {
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        throw new Error('Не удалось создать WebGL-программу.');
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const message =
            gl.getProgramInfoLog(program) ?? 'Неизвестная ошибка линковки.';

        gl.deleteProgram(program);
        throw new Error(message);
    }

    return program;
}

function getUniformLocations(
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
) {
    const resolution = gl.getUniformLocation(program, 'u_resolution');
    const aspect = gl.getUniformLocation(program, 'u_aspect');
    const frame = gl.getUniformLocation(program, 'u_frame');

    if (resolution === null || aspect === null || frame === null) {
        throw new Error('Не удалось получить uniform-переменные шейдера.');
    }

    return {
        resolution,
        aspect,
        frame,
    };
}

export default function ShaderBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) {
            return undefined;
        }

        const reducedMotionQuery = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        );
        let gl: WebGL2RenderingContext | null = null;
        let program: WebGLProgram | null = null;
        let uniformLocations: ReturnType<typeof getUniformLocations> | null =
            null;
        let animationFrameId = 0;
        let animationStartedAt = performance.now();
        let resizeObserver: ResizeObserver | null = null;

        const resizeCanvas = () => {
            if (!gl) {
                return;
            }

            const bounds = canvas.getBoundingClientRect();
            const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
            const width = Math.max(1, Math.round(bounds.width * pixelRatio));
            const height = Math.max(1, Math.round(bounds.height * pixelRatio));

            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
            }

            gl.viewport(0, 0, width, height);
        };

        const renderScene = (timestamp: number) => {
            if (!gl || !program || !uniformLocations) {
                return;
            }

            resizeCanvas();

            const frame = Math.floor(
                (timestamp - animationStartedAt) / (1000 / 60),
            );

            gl.useProgram(program);
            gl.uniform2f(
                uniformLocations.resolution,
                canvas.width,
                canvas.height,
            );
            gl.uniform1f(
                uniformLocations.aspect,
                canvas.width / canvas.height,
            );
            gl.uniform1i(uniformLocations.frame, frame);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
        };

        const renderFrame = (timestamp: number) => {
            renderScene(timestamp);
            animationFrameId = window.requestAnimationFrame(renderFrame);
        };

        const startRendering = () => {
            window.cancelAnimationFrame(animationFrameId);

            if (reducedMotionQuery.matches) {
                renderScene(animationStartedAt);
                return;
            }

            animationFrameId = window.requestAnimationFrame(renderFrame);
        };

        const initializeWebGL = () => {
            gl = canvas.getContext('webgl2', {
                alpha: false,
                antialias: false,
                depth: false,
                powerPreference: 'high-performance',
                stencil: false,
            });

            if (!gl) {
                canvas.dataset.webglUnavailable = 'true';
                return;
            }

            try {
                program = createProgram(gl);
                uniformLocations = getUniformLocations(gl, program);
                animationStartedAt = performance.now();
                delete canvas.dataset.webglUnavailable;
                startRendering();
            } catch (error) {
                canvas.dataset.webglUnavailable = 'true';
                console.error('Ошибка инициализации ShaderBackground:', error);
            }
        };

        const handleResize = () => {
            if (reducedMotionQuery.matches) {
                renderScene(animationStartedAt);
            }
        };

        const handleMotionPreferenceChange = () => {
            startRendering();
        };

        const handleContextLost = (event: Event) => {
            event.preventDefault();
            window.cancelAnimationFrame(animationFrameId);
            program = null;
            uniformLocations = null;
        };

        const handleContextRestored = () => {
            initializeWebGL();
        };

        initializeWebGL();

        if (typeof ResizeObserver === 'function') {
            resizeObserver = new ResizeObserver(handleResize);
            resizeObserver.observe(canvas);
        } else {
            window.addEventListener('resize', handleResize);
        }

        reducedMotionQuery.addEventListener(
            'change',
            handleMotionPreferenceChange,
        );
        canvas.addEventListener('webglcontextlost', handleContextLost);
        canvas.addEventListener('webglcontextrestored', handleContextRestored);

        return () => {
            window.cancelAnimationFrame(animationFrameId);
            resizeObserver?.disconnect();
            window.removeEventListener('resize', handleResize);
            reducedMotionQuery.removeEventListener(
                'change',
                handleMotionPreferenceChange,
            );
            canvas.removeEventListener('webglcontextlost', handleContextLost);
            canvas.removeEventListener(
                'webglcontextrestored',
                handleContextRestored,
            );

            if (gl && program) {
                gl.deleteProgram(program);
            }
        };
    }, []);

    return (
        <div className={'shader-background'}>
            <canvas
                ref={canvasRef}
                className="shader-background__canvas"
                aria-hidden="true"
            />
        </div>
    );
}
