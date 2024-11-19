// components/ThreeBackground.js
import React, { useEffect } from "react";
import * as THREE from "three";

// Import shaders
import vertexShader from "../shaders/vertexShader.glsl";
import fragmentShader from "../shaders/fragmentShader.glsl";

const ThreeBackground = () => {
  useEffect(() => {
    let renderer, scene, camera, uniforms;
    let rtTexture, rtTexture2;

    const init = () => {
      const container = document.getElementById("three-background");

      camera = new THREE.Camera();
      camera.position.z = 1;
      scene = new THREE.Scene();

      renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);

      // Set up geometry and material with shaders
      const geometry = new THREE.PlaneGeometry(1, 1);
      uniforms = {
        u_time: { value: 1.0 },
        u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        u_mouse: { value: new THREE.Vector3() },
        u_frame: { value: -1 },
        u_renderpass: { value: false },
        u_buffer: { value: null }, // Initialize u_buffer
      };

      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Set up render targets
      rtTexture = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
        type: THREE.FloatType,
        minFilter: THREE.NearestFilter,
      });
      rtTexture2 = rtTexture.clone();

      // Handle resizing
      window.addEventListener("resize", onWindowResize);

      animate();
    };

    const onWindowResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
    };

    const animate = () => {
      requestAnimationFrame(animate);
      renderRippleEffect();
      renderer.render(scene, camera);
    };

    const renderRippleEffect = () => {
      uniforms.u_time.value += 0.05;
      uniforms.u_frame.value++;
      uniforms.u_renderpass.value = true;

      // Swap textures for each frame
      const temp = rtTexture;
      rtTexture = rtTexture2;
      rtTexture2 = temp;

      uniforms.u_buffer.value = rtTexture.texture; // Assign swapped texture
      uniforms.u_renderpass.value = false;
    };

    init();

    return () => {
      renderer.dispose();
      renderer.forceContextLoss(); // Ensure the WebGL context is lost and cleaned up
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);

  return <div id="three-background" style={{ position: "absolute", width: "100%", height: "100%", zIndex: -1 }} />;

};

export default ThreeBackground;
