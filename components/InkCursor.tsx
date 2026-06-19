"use client";

import { useEffect } from "react";
export default function InkCursor() {
  useEffect(() => {
    const cursor = document.getElementById("cursor");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!cursor || !finePointer.matches || reducedMotion.matches) return;
    const cursorElement = cursor;

    const amount = 20;
    const sineDots = Math.floor(amount * 0.3);
    const width = 26;
    const idleTimeout = 150;

    let frameID = 0;
    const mousePosition = { x: 0, y: 0 };
    const dots: Dot[] = [];
    let timeoutID: ReturnType<typeof setTimeout>;
    let idle = false;

    class Dot {
      index: number;
      anglespeed = 0.05;
      x = 0;
      y = 0;
      scale: number;
      range: number;
      limit: number;
      element: HTMLSpanElement;
      lockX = 0;
      lockY = 0;
      angleX = 0;
      angleY = 0;

      constructor(index = 0) {
        this.index = index;
        this.scale = 1 - 0.05 * index;
        this.range = width / 2 - (width / 2) * this.scale + 2;
        this.limit = width * 0.75 * this.scale;
        this.element = document.createElement("span");
        this.element.style.transform = `scale(${this.scale})`;
        this.element.style.willChange = "transform";
        cursorElement.appendChild(this.element);
      }

      lock() {
        this.lockX = this.x;
        this.lockY = this.y;
        this.angleX = Math.PI * 2 * Math.random();
        this.angleY = Math.PI * 2 * Math.random();
      }

      draw() {
        if (!idle || this.index <= sineDots) {
          this.element.style.transform = `translate3d(${this.x}px, ${this.y}px, 0) scale(${this.scale})`;
        } else {
          this.angleX += this.anglespeed;
          this.angleY += this.anglespeed;
          this.y = this.lockY + Math.sin(this.angleY) * this.range;
          this.x = this.lockX + Math.sin(this.angleX) * this.range;
          this.element.style.transform = `translate3d(${this.x}px, ${this.y}px, 0) scale(${this.scale})`;
        }
      }
    }

    function buildDots() {
      for (let i = 0; i < amount; i++) {
        dots.push(new Dot(i));
      }
    }

    function startIdleTimer() {
      timeoutID = setTimeout(() => {
        idle = true;
        for (const dot of dots) dot.lock();
      }, idleTimeout);
      idle = false;
    }

    function resetIdleTimer() {
      clearTimeout(timeoutID);
      startIdleTimer();
    }

    const onMouseMove = (event: MouseEvent) => {
      mousePosition.x = event.clientX - width / 2;
      mousePosition.y = event.clientY - width / 2;
      resetIdleTimer();
    };

    const render = () => {
      let x = mousePosition.x;
      let y = mousePosition.y;

      dots.forEach((dot, index, arr) => {
        const nextDot = arr[index + 1] || arr[0];
        dot.x = x;
        dot.y = y;
        dot.draw();

        if (!idle || index <= sineDots) {
          const dx = (nextDot.x - dot.x) * 0.35;
          const dy = (nextDot.y - dot.y) * 0.35;
          x += dx;
          y += dy;
        }
      });

      frameID = requestAnimationFrame(render);
    };

    buildDots();
    window.addEventListener("mousemove", onMouseMove);
    startIdleTimer();
    frameID = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameID);
      clearTimeout(timeoutID);
      window.removeEventListener("mousemove", onMouseMove);
      cursorElement.replaceChildren();
    };
  }, []);

  return <div id="cursor" className="Cursor"></div>;
}
