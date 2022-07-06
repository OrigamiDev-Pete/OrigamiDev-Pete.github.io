export const waterSurfaceShader = {
    uniforms: {
        noise1: { value: null },
        noise2: { value: null },
        noise3: { value: null },
        noise3_scale: { value: 1.0 },
        noise3_amount: { value: 0.05 },
        time: { value: 0.0 },
        scroll_speed: { value: 0.2 },
        wave_height: { value: 2.0 },
        intensity: { value: 2.0 },
        refraction: { value: -0.0 },
        refraction_scale: { value: 1.0 },
        refraction_detail: { value: 0.1 },
        framebuffer: { value: null }
    },
    vertexShader: `
            #include <fog_pars_vertex>

            uniform sampler2D noise1;
            uniform sampler2D noise2;
            uniform float time;
            uniform float scroll_speed;
            uniform float wave_height;

            varying vec2 vUv;
            varying vec4 vScreen_uv;
            varying vec3 vNormal;

            vec4 scrolling_noise(float speed, sampler2D tex)
            {
                vec3 uv = vec3(vUv, 1.0);
                float s = time / (1.0 / speed);
                uv = s + uv;

                return texture(tex, uv.xy);
            }

            void main()
            {
                vNormal = normalize(normalMatrix * normal);
                vUv = uv;
                vUv *= 2.0;
                vScreen_uv = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

                // vertex displacement
                vec4 noise1_tex = scrolling_noise(scroll_speed / 2.0, noise1);
                vec4 noise2_tex = scrolling_noise(scroll_speed, noise2);

                noise1_tex *= wave_height;
                noise2_tex *= wave_height;

                // invert waves
                noise1_tex *= -1.0;
                noise2_tex *= -1.0;

                vec4 noise = noise1_tex * noise2_tex;
                noise = mix(noise1_tex, noise2_tex, 0.5);

                #include <begin_vertex>
                #include <project_vertex>

                gl_Position.y += noise.y;

                #include <fog_vertex>
            }
            `,
    fragmentShader: `
            #include <common>
            #include <fog_pars_fragment>

            uniform sampler2D noise1;
            uniform sampler2D noise2;
            uniform sampler2D noise3;
            uniform sampler2D framebuffer;

            uniform float time;
            uniform float scroll_speed;
            uniform float intensity;
            uniform float foam_scale;
            uniform float foam_amount;

            uniform float refraction;
            uniform float refraction_scale;

            varying vec2 vUv;
            varying vec4 vScreen_uv;
            varying vec3 vNormal;

            vec4 scrolling_noise(float speed, sampler2D tex, vec2 uv_p)
            {
                vec3 uv = vec3(uv_p, 1.0);
                float s = time / (1.0 / speed);
                uv = s + uv;

                return texture(tex, uv.xy);
            }

            void main()
            {
                /* ALBEDO */

                // Large waves
                vec4 noise1_tex = scrolling_noise(scroll_speed / 2.0, noise1, vUv);
                vec4 noise2_tex = scrolling_noise(scroll_speed, noise2, vUv);

                vec4 noise = mix(noise1_tex, noise2_tex, 0.5);
                noise *= vec4(0.21, 0.47, 0.87, 1.0);

                // Foam
                vec4 noise3_tex = texture(noise3, vUv);
                vec4 noise4_tex = scrolling_noise((scroll_speed / 3.0) * foam_scale, noise2, vUv * foam_scale);
                vec4 stepped_noise = step(noise4_tex, noise3_tex);
                // stepped_noise = pow(stepped_noise, vec4(0.5));

                noise = mix(noise, stepped_noise, foam_amount);

                /* REFRACTION */

                // Calculate screen UV
                vec2 screen_uv = vScreen_uv.xy;
                screen_uv /= vScreen_uv.w;
                screen_uv += 1.0;
                screen_uv /= 2.0;


                // Calculate refraction offset
                // Simple refraction (first attempt, unused)
                // vec2 ref_offset = screen_uv.xy - vec2(0.0, refraction);
                // vec4 ref_tex = texture(framebuffer, ref_offset); 

                // Complex refraction
                vec3 ref_normal = vNormal;
                vec4 ref_noise1 = scrolling_noise(scroll_speed, noise1, vUv * refraction_scale);
                vec4 ref_noise2 = scrolling_noise((scroll_speed * 5.0) * refraction_scale, noise1, vUv * refraction_scale * 5.0);
                vec4 ref_noise3 = mix(ref_noise1, ref_noise2, 0.1);
                vec2 ref_ofs = screen_uv - ref_normal.xy * dot(ref_noise3, vec4(1.0, 0.0, 0.0, 0.0) * 0.2);
                vec4 ref_tex = texture(framebuffer, ref_ofs) * refraction;

                gl_FragColor = noise * intensity;
                gl_FragColor.rgb += ref_tex.rgb;

                #include <fog_fragment>
            }
        `
}