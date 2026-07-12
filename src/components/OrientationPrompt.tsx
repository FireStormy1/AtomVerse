import { useEffect, useState } from "react";
import { RotateCw } from "lucide-react";

export default function OrientationPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const isMobile = window.innerWidth <= 768;
      const isPortrait = window.innerHeight > window.innerWidth;

      setShow(isMobile && isPortrait);
    };

    checkOrientation();

    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-lg flex items-center justify-center p-6">
      <div className="max-w-sm w-full rounded-3xl border border-cyan-500/30 bg-zinc-900 p-8 text-center shadow-2xl">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/10">
          <RotateCw className="h-10 w-10 text-cyan-400 animate-spin" />
        </div>

        <h2 className="text-2xl font-bold text-white">
          Rotate Your Device
        </h2>

        <p className="mt-4 text-zinc-300 leading-relaxed">
          AtomVerse is designed for a wider viewing experience.
          Please rotate your phone to <span className="font-semibold text-cyan-400">Landscape Mode</span> for the best animations and interaction.
        </p>

        <div className="mt-6 rounded-xl bg-cyan-500/10 border border-cyan-500/20 p-3 text-sm text-cyan-300">
          The page will continue automatically once you rotate your device.
        </div>
      </div>
    </div>
  );
}
