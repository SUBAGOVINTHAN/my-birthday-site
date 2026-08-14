import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// Renders its children directly onto document.body, completely
// bypassing any ancestor wrapper (page-transition containers,
// framer-motion `motion.div`s, anything with a transform/filter/
// perspective set) that would otherwise turn `position: fixed`
// children into something that behaves like `position: absolute`.
//
// IMPORTANT: the portal container is inserted as the FIRST child of
// <body> (before your app's #root), with a low z-index. That means
// anything rendered through this Portal sits BEHIND your normal app
// content in the default stacking order — exactly right for
// full-bleed backgrounds and decorative overlays, which should never
// cover real UI. If you ever need a portalled element to sit ABOVE
// everything (e.g. a lightbox/modal), pass a higher zIndex prop.
//
// Usage: wrap ONLY the parts of a screen that must truly be fixed
// to the viewport (full-bleed backgrounds, decorative overlays,
// the falling parachute, etc.) — not the whole page's interactive
// content, since portalled content sits outside your normal
// component tree for DOM purposes (though React events still
// bubble normally through the virtual DOM).
export default function Portal({ children, containerId = "quest-portal-root", zIndex = -1 }) {
  const [container, setContainer] = useState(null);

  useEffect(() => {
    let el = document.getElementById(containerId);
    let createdHere = false;

    if (!el) {
      el = document.createElement("div");
      el.id = containerId;
      el.style.position = "relative";
      // Negative by default: per the CSS stacking spec, a positioned
      // element with a NEGATIVE z-index always paints before (behind)
      // any normal, non-positioned in-flow content — regardless of
      // DOM order and regardless of whether #root happens to be
      // positioned or not. z-index:0 is NOT reliably "behind" (it
      // paints in the same step as other z-index:0/auto positioned
      // content, ordered by DOM position, which is fragile). -1 is
      // the only value that's unconditionally behind normal content.
      // Pass a positive zIndex (e.g. 9999) for anything that should
      // sit ABOVE the app, like a lightbox/modal.
      el.style.zIndex = String(zIndex);
      // Inserted as body's first child so it's the earliest sibling
      // too, reinforcing the same "behind everything" intent.
      document.body.insertBefore(el, document.body.firstChild);
      createdHere = true;
    } else {
      el.style.zIndex = String(zIndex);
    }

    setContainer(el);

    return () => {
      if (createdHere && el && el.childNodes.length === 0) {
        el.remove();
      }
    };
  }, [containerId, zIndex]);

  if (!container) return null;
  return createPortal(children, container);
}