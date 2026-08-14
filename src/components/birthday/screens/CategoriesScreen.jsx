import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { COLORS, CATEGORIES } from "../constants";
import { useQuestProgress } from "../hooks/useQuestProgress";
import Tag from "../shared/Tag";
import Btn from "../shared/Btn";
import BackButton from "../shared/BackButton";
import Portal from "../shared/Portal";
import roseBouquet from "../../../assets/decor/rose-bouquet.png";
import babysBreath from "../../../assets/decor/babys-breath.png";
import singleRose from "../../../assets/decor/single-rose.png";

// Auto-discovers every photo/video dropped into src/assets/media/<categoryId>/
const mediaModules = import.meta.glob(
  "/src/assets/media/*/*.{png,jpg,jpeg,gif,webp,mp4,mov,webm,PNG,JPG,JPEG,GIF,WEBP,MP4,MOV,WEBM}",
  { eager: true, import: "default" }
);

function parseMeta(filename) {
  const base = filename.replace(/\.[^.]+$/, "");
  const m = base.match(/^(\d{4})_(.+)$/);
  const year = m ? m[1] : null;
  const slug = m ? m[2] : base;
  const title = slug.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return { year, title };
}

const VIDEO_EXTS = ["mp4", "mov", "webm"];

const mediaByCategory = Object.entries(mediaModules).reduce((acc, [path, url]) => {
  const match = path.match(/\/media\/([^/]+)\/([^/]+)$/);
  if (!match) return acc;
  const [, categoryId, filename] = match;
  const ext = filename.split(".").pop().toLowerCase();
  const isVideo = VIDEO_EXTS.includes(ext);
  const { year, title } = parseMeta(filename);
  (acc[categoryId] ||= []).push({
    id: `${categoryId}/${filename}`,
    url,
    isVideo,
    name: filename,
    year,
    title,
  });
  return acc;
}, {});

// newest year first, then alphabetical filename as a tiebreaker
Object.values(mediaByCategory).forEach((list) =>
  list.sort((a, b) => {
    if (a.year && b.year && a.year !== b.year) return b.year.localeCompare(a.year);
    if (a.year && !b.year) return -1;
    if (!a.year && b.year) return 1;
    return a.name.localeCompare(b.name);
  })
);

const QUOTES = {
  childhood: "Those were the days… pure, simple and unforgettable.",
  college: "The years that quietly shaped who we became.",
  office: "The people who turned ordinary days into something worth keeping.",
};

const PAGE_SIZE = 9;

function formatDuration(sec) {
  if (sec == null || !Number.isFinite(sec) || sec < 0) return "";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function CategoryPills({ active, onChange }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 px-3">
      {CATEGORIES.map((c) => (
        <button
          key={c.id}
          onClick={() => onChange && onChange(c.id)}
          className="shrink-0 text-xs sm:text-sm font-semibold px-4 py-2.5 sm:py-2 rounded-full transition-all duration-200 active:scale-95"
          style={{
            minHeight: 40,
            ...(active === c.id
              ? {
                  background: COLORS.rust,
                  color: COLORS.cream,
                  border: `1.5px solid ${COLORS.rust}`,
                  boxShadow: "0 3px 10px rgba(168,65,46,0.28)",
                }
              : {
                  background: "#ffffff",
                  color: COLORS.brown,
                  border: `1.5px solid ${COLORS.line}`,
                }),
          }}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}

export default function CategoriesScreen() {
  const navigate = useNavigate();
  const { unlock } = useQuestProgress();
  const [active, setActive] = useState("childhood");
  const [page, setPage] = useState(1);
  const [durations, setDurations] = useState({});
  const [broken, setBroken] = useState({});
  const [loaded, setLoaded] = useState({});
  const [lightbox, setLightbox] = useState(null);

  const cat = CATEGORIES.find((c) => c.id === active);
  const allItems = mediaByCategory[active] || [];

  const totalPages = Math.max(1, Math.ceil(allItems.length / PAGE_SIZE));
  const pageItems = allItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const photoCount = allItems.filter((i) => !i.isVideo).length;
  const videoCount = allItems.filter((i) => i.isVideo).length;

  const changeCategory = (id) => {
    setActive(id);
    setPage(1);
  };

  const markBroken = (id) => setBroken((b) => ({ ...b, [id]: true }));
  const markLoaded = (id) => setLoaded((l) => ({ ...l, [id]: true }));

  const onContinue = () => {
    unlock("balloons");
    navigate("/quest/balloons");
  };

  return (
    <>
      
      <div className="min-h-[100dvh] w-full flex items-center justify-center relative overflow-hidden animate-qs-fade-in">
        <div
          className="fixed inset-0 pointer-events-none -z-10"
          style={{
            background:
              "radial-gradient(circle at 15% 15%, rgba(255,255,255,0.5), transparent 45%), " +
              "radial-gradient(circle at 85% 85%, rgba(255,255,255,0.35), transparent 50%), " +
              "linear-gradient(135deg, #ecdfc4 0%, #e3cda3 45%, #d8bd8e 100%)",
          }}
        />

        {/* paper grain */}
        <div
          className="fixed inset-0 pointer-events-none -z-10"
          style={{
            opacity: 0.15,
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(94,70,50,0.4) 0px, transparent 1px, transparent 3px), repeating-linear-gradient(90deg, rgba(94,70,50,0.3) 0px, transparent 1px, transparent 3px)",
            mixBlendMode: "multiply",
          }}
        />

        {/* vignette so the texture doesn't fight the card */}
        <div
          className="fixed inset-0 pointer-events-none -z-10"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(60,40,20,0.2) 100%)",
          }}
        />

        {/* left decoration cluster */}
        <div className="hidden lg:block fixed top-8 left-8 w-52 pointer-events-none select-none z-0">
          <img src="/images/dried-flowers.png" alt="" className="w-full drop-shadow-lg" />
          <p
            className="mt-4 text-xl leading-snug"
            style={{ fontFamily: "'Caveat', cursive", color: "#6b4a34" }}
          >
            Some moments become memories
            <br />
            that last forever <span style={{ color: "#a8412e" }}>♥</span>
          </p>
          <img
            src="/images/memory-1.jpg"
            alt=""
            className="w-32 mt-5 rotate-[-6deg] border-[8px] border-white shadow-xl"
          />
        </div>

        {/* right decoration cluster */}
        <div className="hidden lg:block fixed top-8 right-8 w-52 pointer-events-none select-none text-right z-0">
          <img
            src="/images/dried-roses.png"
            alt=""
            className="w-full drop-shadow-lg scale-x-[-1]"
          />
          <img
            src="/images/memory-2.jpg"
            alt=""
            className="w-32 mt-5 ml-auto rotate-[6deg] border-[8px] border-white shadow-xl"
          />
          <p
            className="mt-5 text-xl leading-snug"
            style={{ fontFamily: "'Caveat', cursive", color: "#6b4a34" }}
          >
            little moments,
            <br />
            big memories <span style={{ color: "#a8412e" }}>♥</span>
          </p>
        </div>

        <style>{`
          @keyframes qs-fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-qs-fade-in {
            animation: qs-fade-in .45s ease both;
          }

          @keyframes qg-in {
            from { opacity: 0; transform: translateY(14px) scale(.96); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          .qg-item {
            animation: qg-in .5s cubic-bezier(.22,1,.36,1) both;
          }
          .qg-item:hover .qg-media {
            transform: scale(1.06);
          }
          .qg-item:active .qg-media {
            transform: scale(1.02);
          }
          .qg-item:hover .qg-tile {
            box-shadow: 0 8px 20px rgba(94,70,50,0.18);
          }
          .qg-item:active .qg-tile {
            box-shadow: 0 3px 10px rgba(94,70,50,0.22);
          }

          .qg-media {
            opacity: 0;
            transition: opacity .45s ease, transform .3s ease;
          }
          .qg-media.is-loaded {
            opacity: 1;
          }
        `}</style>

        {/* ── THE CARD: your original screen, untouched in behavior ── */}
        <div
          className="relative z-10 w-full h-[100dvh] lg:h-auto lg:max-h-[92vh] lg:max-w-[420px] lg:rounded-2xl flex flex-col overflow-hidden"
          style={{
            background: COLORS.cream,
            boxShadow: "0 20px 60px rgba(60,40,20,0.35)",
          }}
        >
          <BackButton onClick={() => navigate(-1)} />

          {/* ── FIXED TOP ── */}
          <div
            className="shrink-0 pt-12 sm:pt-14 pb-2"
            style={{
              background: COLORS.cream,
              boxShadow: "0 2px 8px rgba(94,70,50,0.06)",
            }}
          >
            <div className="text-center px-3">
              <Tag>a little archive of us</Tag>
              <h2
                className="mt-1 sm:mt-1.5 italic text-base sm:text-2xl leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                through the years
              </h2>
              <div
                className="flex items-center justify-center gap-1.5 mt-0.5 sm:mt-1 text-xs"
                style={{ color: COLORS.rust }}
              >
                <img
                  src={singleRose}
                  alt=""
                  aria-hidden="true"
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain opacity-70"
                />
                <span
                  style={{
                    width: 16,
                    height: 1,
                    background: COLORS.line,
                    display: "inline-block",
                  }}
                />
                <span>♥</span>
                <span
                  style={{
                    width: 16,
                    height: 1,
                    background: COLORS.line,
                    display: "inline-block",
                  }}
                />
                <img
                  src={singleRose}
                  alt=""
                  aria-hidden="true"
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain opacity-70"
                  style={{ transform: "scaleX(-1)" }}
                />
              </div>
            </div>

            <div className="mt-2 max-w-sm sm:max-w-md mx-auto">
              <CategoryPills active={active} onChange={changeCategory} />
            </div>
          </div>

          {/* ── SCROLLABLE MIDDLE ── */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 pt-1">
            {active === "song" ? (
              <div className="mt-4 pb-4">
                <div
                  className="w-36 h-36 sm:w-52 sm:h-52 mx-auto rounded-xl flex flex-col items-center justify-center text-center p-4 text-xl sm:text-3xl font-mono"
                  style={{
                    background:
                      "repeating-linear-gradient(135deg, rgba(94,70,50,0.06), rgba(94,70,50,0.06) 10px, rgba(94,70,50,0.02) 10px, rgba(94,70,50,0.02) 20px)",
                    border: `1px solid ${COLORS.line}`,
                    color: COLORS.brownSoft,
                  }}
                >
                  🎵
                  <span className="quest-editable text-xs sm:text-sm mt-1">
                    [his favorite song name]
                  </span>
                </div>
                <p
                  className="mt-3 text-xs sm:text-sm text-center px-4"
                  style={{ color: COLORS.brown }}
                >
                  add his favorite track at public/audio/soft-bgm.mp3
                </p>
                <audio controls className="mt-2.5 w-full max-w-xs mx-auto block">
                  <source src="/audio/soft-bgm.mp3" type="audio/mpeg" />
                </audio>
              </div>
            ) : (
              <div className="mt-4 pb-3">
                <div className="flex items-end justify-between gap-2 flex-wrap">
                  <div>
                    {/* <h3
                      className="text-sm sm:text-base font-bold flex items-center gap-1.5"
                      style={{ color: COLORS.brown }}
                    >
                      <span>📷</span> {cat?.label} 
                    </h3> */}
                    <p
                      className="text-[11px] sm:text-xs mt-0.5"
                      style={{ color: COLORS.brownSoft }}
                    >
                      <span className="quest-editable">{cat?.caption}</span>
                    </p>
                  </div>
                  <span
                    className="text-[10px] sm:text-[11px] shrink-0"
                    style={{ color: COLORS.brownSoft }}
                  >
                    {photoCount} photos • {videoCount} videos
                  </span>
                </div>

                {pageItems.length === 0 ? (
                  <div
                    className="mt-5 rounded-xl p-6 text-center text-xs font-mono leading-relaxed"
                    style={{
                      border: `1px dashed ${COLORS.line}`,
                      color: COLORS.brownSoft,
                    }}
                  >
                    drop photos/videos in src/assets/media/{active}/ — name them like
                    <br />
                    1998_my-first-toy.jpg to show a title and year
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mt-5">
                    {pageItems.map((item, i) => (
                      <div
                        key={item.id}
                        className="qg-item"
                        style={{ animationDelay: `${i * 55}ms` }}
                      >
                        <div
                          onClick={() => !broken[item.id] && setLightbox(item)}
                          className="qg-tile relative block w-full aspect-square rounded-xl overflow-hidden cursor-pointer transition-shadow duration-300 active:scale-[0.97]"
                          style={{
                            border: `1px solid ${COLORS.line}`,
                            background: "rgba(94,70,50,0.04)",
                            transition: "transform .15s ease",
                          }}
                        >
                          {broken[item.id] ? (
                            <div
                              className="w-full h-full flex flex-col items-center justify-center gap-1 text-center px-2"
                              style={{ color: COLORS.brownSoft }}
                            >
                              <span className="text-lg">🖼️</span>
                              <span className="text-[10px]">couldn't load this file</span>
                            </div>
                          ) : item.isVideo ? (
                            <video
                              src={item.url}
                              preload="metadata"
                              className={`qg-media w-full h-full object-cover ${
                                loaded[item.id] ? "is-loaded" : ""
                              }`}
                              muted
                              playsInline
                              onLoadedMetadata={(e) => {
                                const d = e.currentTarget.duration;
                                setDurations((prev) => ({
                                  ...prev,
                                  [item.id]: Number.isFinite(d) ? d : null,
                                }));
                                markLoaded(item.id);
                              }}
                              onError={() => markBroken(item.id)}
                            />
                          ) : (
                            <img
                              src={item.url}
                              alt=""
                              loading="lazy"
                              className={`qg-media w-full h-full object-cover ${
                                loaded[item.id] ? "is-loaded" : ""
                              }`}
                              onLoad={() => markLoaded(item.id)}
                              onError={() => markBroken(item.id)}
                            />
                          )}
                          {item.isVideo && !broken[item.id] && (
                            <>
                              <span className="absolute inset-0 flex items-center justify-center text-white text-lg sm:text-xl bg-black/15">
                                ▶
                              </span>
                              {durations[item.id] != null && (
                                <span className="absolute bottom-1.5 right-1.5 text-[10px] px-1.5 py-0.5 rounded bg-black/60 text-white">
                                  {formatDuration(durations[item.id])}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                        <p
                          className="mt-1.5 text-[11px] sm:text-xs font-semibold leading-tight"
                          style={{
                            color: COLORS.brown,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {item.title}
                        </p>
                        {item.year && (
                          <p className="text-[10px]" style={{ color: COLORS.brownSoft }}>
                            {item.year}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {totalPages > 1 && (
                  <div
                    className="flex items-center justify-center gap-1.5 mt-4 text-sm"
                    style={{ color: COLORS.brown }}
                  >
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                      className="disabled:opacity-30 w-9 h-9 flex items-center justify-center text-lg active:scale-90 transition-transform"
                      aria-label="Previous page"
                    >
                      ‹
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className="w-9 h-9 rounded-full text-xs transition-colors active:scale-90"
                        style={
                          p === page
                            ? { background: COLORS.rust, color: COLORS.cream }
                            : { color: COLORS.brownSoft }
                        }
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => p + 1)}
                      className="disabled:opacity-30 w-9 h-9 flex items-center justify-center text-lg active:scale-90 transition-transform"
                      aria-label="Next page"
                    >
                      ›
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── FIXED BOTTOM ── */}
          <div
            className="shrink-0 px-3 pt-2 pb-4"
            style={{
              background: COLORS.cream,
              boxShadow: "0 -2px 8px rgba(94,70,50,0.05)",
            }}
          >
            {QUOTES[active] && (
              <p
                className="text-center italic text-xs sm:text-sm px-2 leading-snug"
                style={{ color: COLORS.brown }}
              >
                "<span className="quest-editable">{QUOTES[active]}</span>"
              </p>
            )}

            <div className="flex items-center justify-center gap-5 mt-2 opacity-90">
              <img
                src={babysBreath}
                alt=""
                aria-hidden="true"
                className="w-7 h-9 sm:w-10 sm:h-12 object-contain"
                style={{ transform: "rotate(-6deg)" }}
              />
              <img
                src={roseBouquet}
                alt=""
                aria-hidden="true"
                className="w-7 h-9 sm:w-10 sm:h-12 object-contain"
                style={{ transform: "rotate(6deg)" }}
              />
            </div>

            <div className="flex justify-center mt-2">
              <Btn onClick={onContinue}>continue →</Btn>
            </div>

            <p
              className="text-center text-[10px] sm:text-[11px] italic mt-2"
              style={{ color: COLORS.brownSoft }}
            >
              collecting memories, one moment at a time{" "}
              <span style={{ color: COLORS.rust }}>♥</span>
            </p>
          </div>
        </div>
      </div>

      {/* Lightbox — full screen overlay regardless of card size.
          Also portalled so it always covers the true viewport,
          not just whatever transformed ancestor it might sit inside. */}
      {lightbox && (
        <Portal containerId="quest-lightbox-root" zIndex={9999}>
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
            style={{ background: "rgba(0,0,0,0.88)" }}
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              aria-label="Close"
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 rounded-full bg-white/15 text-white text-lg flex items-center justify-center active:bg-white/25 sm:hover:bg-white/25 transition-colors"
            >
              ✕
            </button>
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-full flex flex-col items-center"
            >
              {lightbox.isVideo ? (
                <video
                  src={lightbox.url}
                  controls
                  autoPlay
                  playsInline
                  className="max-w-full max-h-[75vh] sm:max-h-[80vh] rounded-lg"
                />
              ) : (
                <img
                  src={lightbox.url}
                  alt=""
                  className="max-w-full max-h-[75vh] sm:max-h-[80vh] rounded-lg"
                />
              )}
              <p className="text-white/90 text-xs sm:text-sm mt-2.5 sm:mt-3 text-center px-4">
                {lightbox.title}
                {lightbox.year && (
                  <span className="text-white/60"> · {lightbox.year}</span>
                )}
              </p>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}