
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      <div className="z-10">
        <h1 className="mb-16 font-mono text-8xl font-black tracking-wider text-white text-shadow-xl sm:text-9xl" style={{
          textShadow: '4px 4px 8px rgba(0, 0, 0, 0.5), 0 0 30px rgba(255, 255, 255, 0.3)'
        }}>
          DENTA<span className="glitch-text">X</span>Y
        </h1>
        <div className="flex justify-center">
          <Button
            onClick={() => navigate("/index")}
            className="relative mt-8 overflow-hidden rounded-xl bg-white px-12 py-8 text-xl font-bold text-black transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_8px_rgba(255,255,255,0.3)]"
            style={{
              boxShadow: '0 8px 32px rgba(255, 255, 255, 0.2)'
            }}
          >
            Acceder a Beta
          </Button>
        </div>
      </div>
    </main>
  );
}
