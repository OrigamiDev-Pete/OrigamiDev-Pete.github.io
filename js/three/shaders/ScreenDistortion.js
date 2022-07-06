export const screenDistortion = {
    uniforms: {
        tDiffuse: { value: null },
        noise1: { value: null },
        time: { value: 0.0 },
        distortion_amount: { value: 1.2 },
        distortion_speed: { value: 0.2 }
    },
    vertexShader: `
        varying vec2 vUv;

        void main()
        {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float time;
        uniform float distortion_amount;
        uniform float distortion_speed;

        uniform sampler2D tDiffuse;
        uniform sampler2D noise1;
        
        varying vec2 vUv;

        vec4 scrolling_noise(float speed, sampler2D tex)
        {
            vec3 uv = vec3(vUv, 1.0) / 3.0;
            float s = time / (1.0 / speed);
            uv = s + uv;

            return texture(tex, uv.xy);
        }
        
        void main()
        {
            vec4 noise_tex = scrolling_noise(distortion_speed, noise1);
            vec4 color_tex = texture(tDiffuse, clamp(vUv + noise_tex.xy / ((1.0 / distortion_amount) * 75.0) - 0.005, 0.0, 1.0));
            vec4 color = color_tex * noise_tex;

            gl_FragColor = color_tex;
            // gl_FragColor = vec4(vUv + noise_tex.xy, 0.0, 1.0);
        }
    `
}