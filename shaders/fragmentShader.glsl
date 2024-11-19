uniform vec2 u_resolution;
uniform vec3 u_mouse;
uniform float u_time;
uniform sampler2D u_noise;
uniform sampler2D u_buffer;
uniform sampler2D u_environment;
uniform sampler2D u_texture;
uniform bool u_renderpass;
uniform int u_frame;

#define PI 3.141592653589793
#define TAU 6.283185307179586
#define depth 20.0
#define blurStrength 2.98
#define samples 8
#define sigma 2.0
#define bias 0.2
#define scale 10.0
#define power 10.1
const vec2 sampleDist = vec2(0.005, 0.0);

float gaussianWeight(vec2 offset) {
    return exp(-dot(offset, offset) / (2.0 * sigma * sigma)) / (2.0 * PI * sigma * sigma);
}

vec2 hash2(vec2 p) {
    return texture2D(u_noise, (p + 0.5) / 256.0).xy;
}

vec3 hsb2rgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

vec3 blur(sampler2D sp, vec2 uv, vec2 scale) {
    vec3 col = vec3(0.0);
    float accum = 0.0;

    for (int x = -samples / 2; x < samples / 2; ++x) {
        for (int y = -samples / 2; y < samples / 2; ++y) {
            vec2 offset = vec2(x, y);
            float weight = gaussianWeight(offset);
            col += texture2D(sp, uv + scale * offset).rgb * weight;
            accum += weight;
        }
    }
    return col / accum;
}

vec4 renderRipples() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
    vec2 sample = gl_FragCoord.xy / u_resolution.xy;
    vec2 mouse = u_mouse.xy - uv;
    
    vec4 fragcolour = texture2D(u_buffer, sample);
    float shade = 0.0;

    if (u_mouse.z == 1.0) {
        shade = smoothstep(0.02 + abs(sin(u_time * 10.0) * 0.006), 0.0, length(mouse));
    }
    
    if (mod(u_time, 0.1) >= 0.095) {
        vec2 hash = hash2(vec2(u_time * 2.0, sin(u_time * 10.0))) * 3.0 - 1.0;
        shade += smoothstep(0.012, 0.0, length(uv - hash + 0.5));
    }

    float d = shade * 2.0;
    float texcol = texture2D(u_buffer, sample - sampleDist).x;
    d += -(texcol - 0.5) * 2.0;

    fragcolour = vec4(d, fragcolour.x, 0, 0);
    return fragcolour;
}

float bumpMap(vec2 uv, float height) {
    vec2 ps = vec2(1.0) / u_resolution.xy;
    return 1.0 - blur(u_buffer, uv, ps * blurStrength).x * height;
}

vec4 renderPass(vec2 uv, inout float distortion) {
    vec3 surfacePos = vec3(uv, 0.0);
    vec3 ray = normalize(vec3(uv, 1.0));
    vec3 lightPos = vec3(cos(u_time * 0.5) * 2.0, 1.0 + sin(u_time * 0.5) * 2.0, -3.0);
    vec3 normal = vec3(0.0, 0.0, -1.0);

    vec3 colourmap;
    float fx = bumpMap(sampleDist.xy, 0.2);
    float fy = bumpMap(sampleDist.yx, 0.2);
    float f = bumpMap(vec2(0.0), 0.2);
    
    distortion = f;
    fx = (fx - f) / sampleDist.x;
    fy = (fy - f) / sampleDist.x;
    normal = normalize(normal + vec3(fx, fy, 0.0) * 0.2);

    float fresnel = bias + scale * pow(1.0 + dot(normalize(surfacePos - vec3(uv, -3.0)), normal), power);

    vec3 lightV = normalize(lightPos - surfacePos);
    float diffuse = max(dot(normal, lightV), 0.0);
    vec3 tex = texture2D(u_environment, reflect(vec3(uv, 1.0), normal).xy - 0.5).rgb;
    
    vec3 finalColor = (tex * diffuse + lightV) * fresnel;
    return vec4(finalColor, 1.0);
}

void main() {
    vec4 fragcolour;
    
    if (u_renderpass) {
        fragcolour = renderRipples();
    } else {
        vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
        float distortion;
        vec4 reflections = renderPass(uv, distortion);
        
        vec4 texColor = texture2D(u_texture, uv * 1.5 + distortion).rbra;
        fragcolour = texColor * texColor * texColor * 0.4;
        fragcolour += reflections * 0.7;
    }
    
    gl_FragColor = fragcolour;
}
