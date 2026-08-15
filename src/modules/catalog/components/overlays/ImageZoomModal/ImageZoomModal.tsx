import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Maximize2,
  X,
} from "lucide-react";

interface ImageZoomModalProps {
  src: string | null;
  title: string;
  onClose: () => void;
}

export function ImageZoomModal({
  src,
  title,
  onClose,
}: ImageZoomModalProps) {
  const [
    scale,
    setScale,
  ] =
    useState(1);

  const [
    pos,
    setPos,
  ] =
    useState({
      x: 0,
      y: 0,
    });

  const panRef =
    useRef({
      panning: false,
      startX: 0,
      startY: 0,
    });

  const containerRef =
    useRef<HTMLDivElement>(
      null,
    );

  const reset =
    useCallback(() => {
      setScale(1);

      setPos({
        x: 0,
        y: 0,
      });
    }, []);

  useEffect(() => {
    reset();
  }, [
    src,
    reset,
  ]);

  useEffect(() => {
    const element =
      containerRef.current;

    if (
      !element ||
      !src
    ) {
      return;
    }

    const handleWheel =
      (
        event:
          WheelEvent,
      ) => {
        event.preventDefault();

        setScale(
          (
            currentScale,
          ) => {
            const nextScale =
              event.deltaY < 0
                ? currentScale *
                  1.1
                : currentScale /
                  1.1;

            const clampedScale =
              Math.max(
                1,
                Math.min(
                  nextScale,
                  5,
                ),
              );

            if (
              clampedScale ===
              1
            ) {
              setPos({
                x: 0,
                y: 0,
              });
            }

            return clampedScale;
          },
        );
      };

    element.addEventListener(
      "wheel",
      handleWheel,
      {
        passive: false,
      },
    );

    return () =>
      element.removeEventListener(
        "wheel",
        handleWheel,
      );
  }, [src]);

  if (!src) {
    return null;
  }

  const handleMouseDown =
    (
      event:
        React.MouseEvent,
    ) => {
      event.preventDefault();

      panRef.current = {
        panning: true,
        startX:
          event.clientX -
          pos.x,
        startY:
          event.clientY -
          pos.y,
      };
    };

  const handleMouseMove =
    (
      event:
        React.MouseEvent,
    ) => {
      if (
        !panRef.current
          .panning
      ) {
        return;
      }

      setPos({
        x:
          event.clientX -
          panRef.current
            .startX,
        y:
          event.clientY -
          panRef.current
            .startY,
      });
    };

  const handleMouseUp =
    () => {
      panRef.current
        .panning =
        false;
    };

  return (
    <div
      className="fixed inset-0 z-[2500] flex flex-col items-center justify-center bg-slate-950/95 p-4 backdrop-blur-md"
      onClick={(
        event,
      ) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
      onMouseMove={
        handleMouseMove
      }
      onMouseUp={
        handleMouseUp
      }
      onMouseLeave={
        handleMouseUp
      }
    >
      <button
        type="button"
        className="absolute right-5 top-5 z-20 rounded-full border border-slate-700 bg-slate-900/90 p-3 text-slate-300 transition hover:border-sky-400/40 hover:text-white md:right-8 md:top-8"
        onClick={
          onClose
        }
        aria-label="Cerrar imagen"
      >
        <X className="h-6 w-6" />
      </button>

      <div className="pointer-events-none absolute left-5 top-5 z-20 flex items-center gap-2 text-slate-500 md:left-8 md:top-8">
        <Maximize2 className="h-5 w-5" />

        <span className="text-[10px] font-bold uppercase tracking-wider md:text-xs">
          Usa la rueda para acercar
        </span>
      </div>

      <div
        ref={
          containerRef
        }
        className="relative mt-8 flex h-[72vh] w-full max-w-4xl items-center justify-center overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40"
      >
        <img
          src={src}
          alt={title}
          className="max-h-full max-w-full origin-center cursor-grab object-contain drop-shadow-2xl active:cursor-grabbing"
          style={{
            transform:
              `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
          }}
          onMouseDown={
            handleMouseDown
          }
          draggable={
            false
          }
        />
      </div>

      <h3 className="z-20 mt-5 text-center text-base font-black tracking-wide text-slate-100 md:text-lg">
        {title}
      </h3>
    </div>
  );
}