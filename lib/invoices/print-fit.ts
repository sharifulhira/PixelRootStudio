const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

function mmToPx(mm: number) {
  return (mm * 96) / 25.4;
}

let placeholder: Comment | null = null;
let parentEl: HTMLElement | null = null;

function resetTransforms(el: HTMLElement) {
  el.style.transform = "";
  el.style.width = "";
  el.style.height = "";
  el.style.overflow = "";
  const inner = el.querySelector(".invoice-print-scale") as HTMLElement | null;
  if (inner) {
    inner.style.transform = "";
    inner.style.width = "";
  }
}

/** Move invoice to body and strip layout wrappers so print has zero outer margin. */
export function prepareInvoicePrint() {
  const el = document.getElementById("invoice-print");
  if (!el) return;

  if (el.parentElement !== document.body) {
    parentEl = el.parentElement;
    placeholder = document.createComment("invoice-print-anchor");
    parentEl?.insertBefore(placeholder, el);
    document.body.appendChild(el);
  }

  document.documentElement.classList.add("invoice-printing");
  document.body.classList.add("invoice-printing");

  resetTransforms(el);
  fitInvoiceToA4Page();
}

export function cleanupInvoicePrint() {
  const el = document.getElementById("invoice-print");

  document.documentElement.classList.remove("invoice-printing");
  document.body.classList.remove("invoice-printing");

  if (el) resetTransforms(el);

  if (el && placeholder && parentEl) {
    parentEl.insertBefore(el, placeholder);
    placeholder.remove();
  }
  placeholder = null;
  parentEl = null;
}

/** Scale content to fit one A4 page if needed — never widen past 210mm. */
export function fitInvoiceToA4Page() {
  const el = document.getElementById("invoice-print");
  const inner = el?.querySelector(".invoice-print-scale") as HTMLElement | null;
  if (!el || !inner) return;

  resetTransforms(el);

  el.style.width = `${A4_WIDTH_MM}mm`;
  el.style.height = `${A4_HEIGHT_MM}mm`;
  el.style.overflow = "hidden";

  const pageH = mmToPx(A4_HEIGHT_MM);
  const pageW = mmToPx(A4_WIDTH_MM);
  const scale = Math.min(1, pageH / inner.scrollHeight, pageW / inner.scrollWidth);

  if (scale < 0.995) {
    inner.style.transform = `scale(${scale})`;
    inner.style.transformOrigin = "top left";
  }
}

export function resetInvoicePrintFit() {
  cleanupInvoicePrint();
}
