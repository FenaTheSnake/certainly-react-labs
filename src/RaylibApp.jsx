import { useEffect } from "react";

function RaylibApp() {
  useEffect(() => {
    const loadRaylib = async () => {
      try {
        const module = await import("/my_raylib.js"); // Загружаем скомпилированный JS
        module.default({
          locateFile: (file) => `/my_raylib.wasm`, // Указываем путь к .wasm
        }).then((instance) => {
          console.log("Raylib WebAssembly Loaded!", instance);
          // Можно взаимодействовать с WebAssembly модулем
        });
      } catch (error) {
        console.error("Error loading WebAssembly module:", error);
      }
    };

    loadRaylib();
  }, []);

  return <canvas id="canvas" width="800" height="600"></canvas>;
}

export default RaylibApp;
