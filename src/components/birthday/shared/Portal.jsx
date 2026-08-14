import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

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