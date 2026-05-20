/* ============================================================
   Tile chrome — universal SVG decoration shared by every IG tile.
   Two shapes (chosen via picker in editor.html, "none" returns
   empty so the tile shows no chrome at all):

     • curve — soft S-curve sweeps from upper-left edge across
       to mid-right, painted in the tile's accent color
     • diag  — single bold diagonal accent line cutting from
       lower-left up toward upper-right, plus a thin echo

   Output: an absolutely-positioned <svg> sized 1080×1080,
   z-index 3 (above background, below .stage content z=4).
   Color: uses currentColor so it inherits --chrome from the
   tile's accent class.
   ============================================================ */
window.tileChrome = function(kind) {
  if (kind === 'none' || !kind) return '';

  if (kind === 'curve') {
    // S-curve: enters left edge near top, eases across, dives out bottom-mid.
    // Mirrored echo at lower opacity to keep it from feeling like a single stripe.
    return `
      <svg class="tile-chrome" viewBox="0 0 1080 1080"
           style="position:absolute; inset:0; width:100%; height:100%;
                  z-index:3; pointer-events:none; color:var(--chrome);"
           preserveAspectRatio="none" aria-hidden="true">
        <path d="M 0,180 C 340,180 380,520 700,520 C 940,520 1020,820 1080,820"
              fill="none" stroke="currentColor" stroke-width="2"
              stroke-opacity="0.85" stroke-linecap="round"/>
        <path d="M 0,140 C 340,140 380,480 700,480 C 940,480 1020,780 1080,780"
              fill="none" stroke="currentColor" stroke-width="1"
              stroke-opacity="0.25" stroke-linecap="round"/>
      </svg>
    `;
  }

  if (kind === 'diag') {
    // Two parallel diagonals running from lower-left to upper-right.
    return `
      <svg class="tile-chrome" viewBox="0 0 1080 1080"
           style="position:absolute; inset:0; width:100%; height:100%;
                  z-index:3; pointer-events:none; color:var(--chrome);"
           preserveAspectRatio="none" aria-hidden="true">
        <line x1="0" y1="900" x2="1080" y2="220"
              stroke="currentColor" stroke-width="2" stroke-opacity="0.85"/>
        <line x1="0" y1="960" x2="1080" y2="280"
              stroke="currentColor" stroke-width="1" stroke-opacity="0.25"/>
      </svg>
    `;
  }

  return '';
};
