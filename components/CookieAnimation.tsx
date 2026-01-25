import { cn } from "@/app/lib/utils"

type Stage = "idle" | "breaking" | "broken" | "reveal"

type CookieAnimationProps = {
  stage: Stage
  idleFrame: number
  crackFrame: number
  onTap: () => void
}

export function CookieAnimation({
  stage,
  idleFrame,
  crackFrame,
  onTap,
}: CookieAnimationProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-40 bg-amber-50 pointer-events-none">
      {/* Cookie pieces flying off */}
      {(stage === "broken" || stage === "reveal") && (
        <>
          {/* Left piece */}
          <div
            className={cn(
              "absolute overflow-hidden transition-all ease-out",
              stage === "reveal" ? "duration-700" : "duration-2000",
            )}
            style={{
              width: "200px",
              height: "400px",
              transform:
                stage === "reveal"
                  ? "translateX(max(-100vw, -800px)) rotate(-45deg)"
                  : "translateX(max(-60vw, -400px)) rotate(-25deg)",
            }}
          >
            <div
              style={{
                width: "400px",
                height: "400px",
                backgroundImage: "url(/fortune/cookie.png)",
                backgroundPosition: "0 -3600px",
                backgroundSize: "400px 4000px",
                backgroundRepeat: "no-repeat",
                imageRendering: "crisp-edges",
              }}
            />
            <div
              className="absolute top-0 left-0"
              style={{
                width: "400px",
                height: "400px",
                backgroundImage: "url(/fortune/crack.png)",
                backgroundPosition: "0 -3600px",
                backgroundSize: "400px 4000px",
                backgroundRepeat: "no-repeat",
                imageRendering: "crisp-edges",
              }}
            />
          </div>

          {/* Right piece */}
          <div
            className={cn(
              "absolute overflow-hidden transition-all ease-out",
              stage === "reveal" ? "duration-700" : "duration-2000",
            )}
            style={{
              width: "200px",
              height: "400px",
              transform:
                stage === "reveal"
                  ? "translateX(min(100vw, 800px)) rotate(45deg)"
                  : "translateX(min(60vw, 400px)) rotate(25deg)",
            }}
          >
            <div
              style={{
                width: "400px",
                height: "400px",
                backgroundImage: "url(/fortune/cookie.png)",
                backgroundPosition: "-200px -3600px",
                backgroundSize: "400px 4000px",
                backgroundRepeat: "no-repeat",
                imageRendering: "crisp-edges",
              }}
            />
            <div
              className="absolute top-0 left-0"
              style={{
                width: "400px",
                height: "400px",
                backgroundImage: "url(/fortune/crack.png)",
                backgroundPosition: "-200px -3600px",
                backgroundSize: "400px 4000px",
                backgroundRepeat: "no-repeat",
                imageRendering: "crisp-edges",
              }}
            />
          </div>
        </>
      )}

      {/* Main cookie */}
      {stage !== "broken" && stage !== "reveal" && (
        <button
          onClick={onTap}
          className={cn(
            "relative cursor-pointer focus:outline-none transition-transform pointer-events-auto",
            "hover:scale-105 active:scale-95",
          )}
          style={{
            width: "400px",
            height: "400px",
            backgroundImage: "url(/fortune/cookie.png)",
            backgroundPosition: `0 -${stage === "breaking" ? crackFrame * 400 : idleFrame * 400}px`,
            backgroundSize: "400px 4000px",
            backgroundRepeat: "no-repeat",
            imageRendering: "crisp-edges",
          }}
          aria-label="Tap to break fortune cookie"
        >
          {/* Crack overlay during breaking */}
          {stage === "breaking" && (
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "url(/fortune/crack.png)",
                backgroundPosition: `0 -${crackFrame * 400}px`,
                backgroundSize: "400px 4000px",
                backgroundRepeat: "no-repeat",
                imageRendering: "crisp-edges",
              }}
            />
          )}
        </button>
      )}
    </div>
  )
}
