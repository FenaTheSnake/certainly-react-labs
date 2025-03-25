
import React, { useLayoutEffect } from 'react';
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AppBar, Toolbar, Button, Container, Box, ThemeProvider, createTheme } from "@mui/material";
import { ParallaxContainer, pageAnimVariants, bgAnimVariants, bgAnimVariants2 } from "./ParallaxContainer.jsx";

export const WASMTest = ({ direction }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
      const initializeRaylib = () => {
        console.log("init");
        if (window.Module) {
          console.log("in module");
          window.Module.locateFile = () => {
            console.log("locate file");
            return "/raylib-proj/game.wasm";
          };
          window.Module.onAbort = () => {
            console.log("abort!!!");
          };

          console.log("Raylib WebAssembly загружен!", window.Module);
          //if (canvasRef.current) {
            // window.Module.canvas = canvasRef.current;
            window.Module.canvas = (function() {
              var canvas = document.querySelector('#canvas');

              // As a default initial behavior, pop up an alert when webgl context is lost.
              // To make your application robust, you may want to override this behavior before shipping!
              // See http://www.khronos.org/registry/webgl/specs/latest/1.0/#5.15.2
              canvas.addEventListener("webglcontextlost", function(e) { console.error('WebGL context lost. You will need to reload the page.'); e.preventDefault(); }, false);
              

              return canvas;
            })();
          //}
        }
      };
      
      if(!window.ModuleLoaded) {
        const script = document.createElement("script");
        script.src = "/raylib-proj/game.js"; // Путь к скомпилированному JS
        script.async = true;
        script.onload = () => {
          window.ModuleLoaded = true;
          initializeRaylib();
        };
        document.body.appendChild(script);

        return () => {
          //document.body.removeChild(script);
        };
      } else {
        initializeRaylib();
      }
    }, []);

    // const containerRef = useRef(null);
    // const [canvas] = useState(() => {
    //   let existingCanvas = document.getElementById("global-raylib-canvas");

    //   if (!existingCanvas) {
    //     existingCanvas = document.createElement("canvas");
    //     existingCanvas.id = "global-raylib-canvas";
    //     existingCanvas.width = 800;
    //     existingCanvas.height = 600;
    //     existingCanvas.style.position = "absolute";
    //     existingCanvas.style.top = "0";
    //     existingCanvas.style.left = "0";
    //     existingCanvas.style.zIndex = "10"; // Можно подстроить под ваш UI
    //     document.body.appendChild(existingCanvas);
    //   }

    //   return existingCanvas;
    // });

    // useEffect(() => {
    //   const initializeRaylib = () => {
    //     if (window.Module) {
    //       window.Module.locateFile = () => "/raylib-proj/game.wasm";
    //       console.log("Raylib WebAssembly загружен!", window.Module);
    //       window.Module.canvas = canvas;
    //     }
    //   };
  
    //   if (!window.Module) {
    //     const script = document.createElement("script");
    //     script.src = "/raylib-proj/game.js";
    //     script.async = true;
    //     script.onload = initializeRaylib;
    //     document.body.appendChild(script);
    //   } else {
    //     initializeRaylib();
    //   }
  
      // return () => {
      //   canvasContainer.removeChild(canvas);
      // };
    //}, [canvas]);

    // useEffect(() => {
    //   if (containerRef.current) {
    //     // ⚡ Вместо изменения родителя просто настраиваем стиль `canvas`
    //     const rect = containerRef.current.getBoundingClientRect();
    //     canvas.style.position = "absolute";
    //     canvas.style.top = `${rect.top}px`;
    //     canvas.style.left = `${rect.left}px`;
    //     canvas.style.width = `${rect.width}px`;
    //     canvas.style.height = `${rect.height}px`;
    //   }
    // }, [containerRef, canvas]);
    
    
    return (
      <Box sx={{
        position: 'relative',
        top: '0%',
        left: '0%',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}>
          <Box sx={{position:'absolute', width:'100%', height:'100%', left:'0%'}}>
            <ParallaxContainer direction={direction} animation={bgAnimVariants}>
              <img src='/bgtest.png'></img>
            </ParallaxContainer>
          </Box>
    
          <Box sx={{position:'absolute', width: '100%', height:'100%', display:'flex', justifyContent: 'center', alignItems: 'center', textAlign: "center"}}>

            <ParallaxContainer direction={direction} animation={pageAnimVariants}>

              {/* {containerRef.current ? createPortal(canvas, containerRef.current) : null} */}

            <canvas ref={canvasRef} id="canvas" width="1280" height="800"></canvas>

            </ParallaxContainer>

          </Box>
      </Box>
)};