import { useEffect, useRef, useState } from "react";
import { COLORS, LETTER_TEXT } from "../constants";
import Tag from "../shared/Tag";
import Btn from "../shared/Btn";

const DIP_FLY_MS = 550;
const DIP_BOB_MS = 450;

export default function LetterScreen() {
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);
  const [celebrated, setCelebrated] = useState(false);
  // dip: null while writing normally, otherwise { phase, start, end }
  const [dip, setDip] = useState(null);

  const started = useRef(false);
  const textEndRef = useRef(null);
  const scrollBoxRef = useRef(null);
  const parchmentRef = useRef(null);
  const inkwellRef = useRef(null);

  // work out every index right after a paragraph break ("\n\n") once,
  // so the typewriter knows exactly where to pause for a dip
  const breakIndices = useRef(null);
  if (breakIndices.current === null) {
    const set = new Set();
    let idx = LETTER_TEXT.indexOf("\n\n");
    while (idx !== -1) {
      set.add(idx + 2); // pause once the blank line itself has been "typed"
      idx = LETTER_TEXT.indexOf("\n\n", idx + 2);
    }
    breakIndices.current = set;
  }

  // With routing, this component only mounts once the route is actually
  // active, so the typewriter can just start on mount.
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let i = 0;

    const step = () => {
      if (i <= LETTER_TEXT.length) {
        setTyped(LETTER_TEXT.slice(0, i));

        if (i !== 0 && breakIndices.current.has(i)) {
          i++;
          runDip(() => setTimeout(step, 22));
          return;
        }

        i++;
        setTimeout(step, 22);
      } else {
        setDone(true);
      }
    };
    step();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep the "ink point" (and the quill sitting on it) scrolled into view
  // as the letter grows taller than the visible parchment area
  useEffect(() => {
    if (textEndRef.current && scrollBoxRef.current) {
      textEndRef.current.scrollIntoView({ block: "nearest" });
    }
  }, [typed]);

  function getRelativePos(el) {
    if (!el || !parchmentRef.current) return null;
    const parchRect = parchmentRef.current.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    return {
      x: elRect.left - parchRect.left + elRect.width / 2,
      y: elRect.top - parchRect.top + elRect.height / 2,
    };
  }

  function runDip(onComplete) {
    // small delay so the just-typed text (and the scrollIntoView effect
    // it triggers) has actually committed before we measure positions
    setTimeout(() => {
      const start = getRelativePos(textEndRef.current);
      const end = getRelativePos(inkwellRef.current);

      if (!start || !end) {
        // couldn't measure — skip the dip gracefully rather than freezing
        onComplete();
        return;
      }

      setDip({ phase: "to-well", start, end });

      setTimeout(() => {
        setDip((d) => (d ? { ...d, phase: "bobbing" } : d));
        setTimeout(() => {
          setDip((d) => (d ? { ...d, phase: "to-text" } : d));
          setTimeout(() => {
            setDip(null);
            onComplete();
          }, DIP_FLY_MS);
        }, DIP_BOB_MS);
      }, DIP_FLY_MS);
    }, 40);
  }

  const dipStyle = (() => {
    if (!dip) return null;
    const { phase, start, end } = dip;
    let x = start.x, y = start.y, rotate = -30, scale = 1;

    if (phase === "to-well") {
      x = end.x; y = end.y - 6; rotate = -55;
    } else if (phase === "bobbing") {
      x = end.x; y = end.y + 3; rotate = -70; scale = 0.94;
    } else if (phase === "to-text") {
      x = start.x; y = start.y; rotate = -30;
    }

    return {
      position: "absolute",
      left: 0,
      top: 0,
      width: "56px",
      height: "auto",
      transform: `translate(${x - 28}px, ${y - 28}px) rotate(${rotate}deg) scale(${scale})`,
      transition:
        phase === "bobbing"
          ? `transform ${DIP_BOB_MS}ms ease-in-out`
          : `transform ${DIP_FLY_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`,
      pointerEvents: "none",
      filter: "drop-shadow(0 3px 4px rgba(94,70,50,0.35))",
      zIndex: 5,
    };
  })();

  const onFinish = () => {
    window.questBurst && window.questBurst();
    setTimeout(() => setCelebrated(true), 600); // let confetti play a beat first
  };

  return (
    <div className="max-w-md sm:max-w-lg mx-auto w-full">
      {/* <Tag>the last page</Tag>
      <h2 className="mt-8 sm:mt-10 mb-5 italic text-xl sm:text-2xl text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
        a letter for you
      </h2> */}

      {/* parchment scroll — the letter "lives" on this image now */}
      <div ref={parchmentRef} className="relative mx-auto w-full" style={{ maxWidth: "440px", aspectRatio: "1024 / 1536" }}>
        <img
          src="/images/letter-scroll.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
          draggable={false}
        />

        {/* heart-shaped ink puddle — sits in the corner, the pen dips here between paragraphs */}
        <img
          ref={inkwellRef}
          src="/images/heart-inkwell.png"
          alt=""
          aria-hidden="true"
          className="absolute pointer-events-none select-none"
          onError={() => console.warn('[LetterScreen] heart-inkwell.png failed to load — check that it exists at public/images/heart-inkwell.png')}
          style={{
            width: "22%",
            height: "auto",
            top: "13%",
            right: "6%",
          }}
          draggable={false}
        />

        <div
          ref={scrollBoxRef}
          className="absolute overflow-y-auto whitespace-pre-wrap quest-editable letter-scroll-hide"
          style={{
            top: "24%",
            bottom: "23%",
            left: "13%",
            right: "15%",
            paddingTop: "10px",
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontWeight: 600,
            color: "#3a2415",
            fontSize: "0.82rem",
            lineHeight: 1.75,
            textAlign: "left",
          }}
        >
          {typed}
          {/* the quill sits right after the written text; hidden (not removed,
              so layout doesn't jump) while the flying quill is off dipping */}
          {!done && (
            <span ref={textEndRef} className="inline-block align-text-bottom" style={{ opacity: dip ? 0 : 1 }}>
              <img
                src="/images/quill-pen.png"
                alt=""
                aria-hidden="true"
                className={dip ? "inline-block" : "quill-write inline-block"}
                onError={() => console.warn('[LetterScreen] quill-pen.png failed to load — check that it exists at public/images/quill-pen.png')}
                style={{
                  width: "56px",
                  height: "auto",
                  marginLeft: "3px",
                  marginBottom: "-8px",
                  transformOrigin: "10% 90%",
                }}
                draggable={false}
              />
            </span>
          )}
        </div>

        {/* flying quill overlay — only rendered while re-inking between paragraphs */}
        {dip && (
          <img
            src="/images/quill-pen.png"
            alt=""
            aria-hidden="true"
            style={dipStyle}
            draggable={false}
          />
        )}
      </div>

      {done && !celebrated && (
        <div className="flex justify-center">
          <Btn onClick={onFinish} className="mt-6 text-sm px-4 py-1.5 scale-90">
            happy birthday 🎉
          </Btn>
        </div>
      )}

      {celebrated && (
        <div
          className="mt-6 text-center px-4 animate-qs-fade-in"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          <div
            className="italic text-lg sm:text-xl"
            style={{ color: COLORS.rust }}
          >
            with all my heart, happy birthday ♡
          </div>
          <div
            className="mt-1 text-xs sm:text-sm italic"
            style={{ color: COLORS.brownSoft }}
          >
            thank you for being part of this little journey
          </div>
        </div>
      )}

      <style>{`
        @keyframes qs-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-qs-fade-in {
          animation: qs-fade-in 0.6s ease both;
        }

        .letter-scroll-hide {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* old Edge/IE */
        }
        .letter-scroll-hide::-webkit-scrollbar {
          display: none; /* Chrome, Safari, new Edge */
        }

        @keyframes quillWrite {
          0%, 100% { transform: rotate(-30deg) translateY(0) translateX(0); }
          25% { transform: rotate(-34deg) translateY(-2px) translateX(1px); }
          50% { transform: rotate(-27deg) translateY(1px) translateX(-1px); }
          75% { transform: rotate(-33deg) translateY(-1px) translateX(0); }
        }
        .quill-write {
          animation: quillWrite 0.4s ease-in-out infinite;
          filter: drop-shadow(0 3px 4px rgba(94,70,50,0.35));
        }
        @media (prefers-reduced-motion: reduce) {
          .quill-write { animation: none !important; transform: rotate(-30deg); }
        }
      `}</style>
    </div>
  );
}