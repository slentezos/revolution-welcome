import { supabase } from "@/integrations/supabase/client";

type Lang = "FR" | "EN";

const CACHE_KEY = "kalimera-translations-en";
const LANG_KEY = "kalimera-lang";

// In-memory cache: original FR -> translated EN
const cache: Map<string, string> = new Map();

// Load cached translations from localStorage
function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const obj = JSON.parse(raw);
      Object.entries(obj).forEach(([k, v]) => cache.set(k, v as string));
    }
  } catch {}
}
loadCache();

function persistCache() {
  try {
    const obj: Record<string, string> = {};
    cache.forEach((v, k) => (obj[k] = v));
    localStorage.setItem(CACHE_KEY, JSON.stringify(obj));
  } catch {}
}

// Map original text per node so we can restore on switching back to FR
const originalTextMap = new WeakMap<Text, string>();
const originalAttrMap = new WeakMap<Element, Map<string, string>>();

function getLang(): Lang {
  return ((localStorage.getItem(LANG_KEY) as Lang | null) ?? "FR");
}

const SKIP_TAGS = new Set([
  "SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "TEXTAREA", "INPUT",
]);
// Don't translate inside the language toggle, the brand logo, etc.
const SKIP_SELECTORS = '[data-no-translate], [aria-label="Language selector"]';

function isTranslatable(text: string): boolean {
  if (!text) return false;
  const trimmed = text.trim();
  if (trimmed.length < 2) return false;
  // skip if no letters
  if (!/[A-Za-zÀ-ÿ]/.test(trimmed)) return false;
  return true;
}

function shouldSkipNode(node: Node): boolean {
  let el: Node | null = node;
  while (el && el !== document.body) {
    if (el.nodeType === Node.ELEMENT_NODE) {
      const e = el as Element;
      if (SKIP_TAGS.has(e.tagName)) return true;
      if (e.matches?.(SKIP_SELECTORS)) return true;
      if ((e as HTMLElement).isContentEditable) return true;
    }
    el = el.parentNode;
  }
  return false;
}

interface PendingItem {
  apply: (translated: string) => void;
  text: string;
}

function collectTextNodes(root: Node): { node: Text; text: string }[] {
  const out: { node: Text; text: string }[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      const text = n.nodeValue ?? "";
      if (!isTranslatable(text)) return NodeFilter.FILTER_REJECT;
      if (shouldSkipNode(n)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  let n: Node | null;
  // eslint-disable-next-line no-cond-assign
  while ((n = walker.nextNode())) {
    out.push({ node: n as Text, text: n.nodeValue ?? "" });
  }
  return out;
}

const TRANSLATABLE_ATTRS = ["placeholder", "title", "aria-label", "alt"];

function collectAttrs(root: Node): { el: Element; attr: string; text: string }[] {
  const out: { el: Element; attr: string; text: string }[] = [];
  if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return out;
  const scope = (root as Element).querySelectorAll
    ? (root as Element)
    : document.body;
  const all = scope.querySelectorAll<HTMLElement>("*");
  const handle = (el: Element) => {
    if (shouldSkipNode(el)) return;
    for (const attr of TRANSLATABLE_ATTRS) {
      const v = el.getAttribute(attr);
      if (v && isTranslatable(v)) out.push({ el, attr, text: v });
    }
  };
  if ((root as Element).getAttribute) handle(root as Element);
  all.forEach(handle);
  return out;
}

let inFlight = false;
let scheduled = false;

async function flushQueue(items: PendingItem[]) {
  // Apply cached, queue uncached
  const toFetch: string[] = [];
  const fetchApplies: PendingItem[] = [];
  for (const it of items) {
    const cached = cache.get(it.text);
    if (cached) {
      it.apply(cached);
    } else {
      toFetch.push(it.text);
      fetchApplies.push(it);
    }
  }
  if (toFetch.length === 0) return;

  // Deduplicate
  const uniq = Array.from(new Set(toFetch));
  // batch into chunks of 40
  const CHUNK = 40;
  for (let i = 0; i < uniq.length; i += CHUNK) {
    const batch = uniq.slice(i, i + CHUNK);
    try {
      const { data, error } = await supabase.functions.invoke("translate-text", {
        body: { texts: batch, source: "FR", target: "EN" },
      });
      if (error) throw error;
      const translations: string[] = data?.translations ?? [];
      batch.forEach((src, idx) => {
        const tr = translations[idx];
        if (tr) cache.set(src, tr);
      });
      persistCache();
    } catch (e) {
      console.warn("[i18n] translation batch failed", e);
    }
  }
  // Apply newly-fetched
  for (const it of fetchApplies) {
    const tr = cache.get(it.text);
    if (tr) it.apply(tr);
  }
}

async function translateRoot(root: Node) {
  if (getLang() !== "EN") return;
  const textNodes = collectTextNodes(root);
  const attrs = collectAttrs(root);
  const items: PendingItem[] = [];

  for (const { node, text } of textNodes) {
    if (!originalTextMap.has(node)) originalTextMap.set(node, text);
    const original = originalTextMap.get(node)!;
    items.push({
      text: original.trim(),
      apply: (translated) => {
        // Preserve leading/trailing whitespace
        const leading = original.match(/^\s*/)?.[0] ?? "";
        const trailing = original.match(/\s*$/)?.[0] ?? "";
        node.nodeValue = leading + translated + trailing;
      },
    });
  }
  for (const { el, attr, text } of attrs) {
    let m = originalAttrMap.get(el);
    if (!m) {
      m = new Map();
      originalAttrMap.set(el, m);
    }
    if (!m.has(attr)) m.set(attr, text);
    const original = m.get(attr)!;
    items.push({
      text: original.trim(),
      apply: (translated) => el.setAttribute(attr, translated),
    });
  }

  if (items.length === 0) return;
  await flushQueue(items);
}

function restoreFrench() {
  // Walk all nodes we have originals for
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n: Node | null;
  // eslint-disable-next-line no-cond-assign
  while ((n = walker.nextNode())) {
    const orig = originalTextMap.get(n as Text);
    if (orig != null) (n as Text).nodeValue = orig;
  }
  document.body.querySelectorAll<HTMLElement>("*").forEach((el) => {
    const m = originalAttrMap.get(el);
    if (m) m.forEach((v, k) => el.setAttribute(k, v));
  });
}

let observer: MutationObserver | null = null;

function startObserver() {
  if (observer) return;
  observer = new MutationObserver((mutations) => {
    if (getLang() !== "EN") return;
    if (scheduled) return;
    scheduled = true;
    requestIdleCallback?.(() => {
      scheduled = false;
      const roots = new Set<Node>();
      for (const m of mutations) {
        m.addedNodes.forEach((n) => roots.add(n));
        if (m.type === "characterData" && m.target) roots.add(m.target);
      }
      roots.forEach((r) => translateRoot(r));
    }, { timeout: 500 }) ?? setTimeout(() => {
      scheduled = false;
      translateRoot(document.body);
    }, 200);
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: false,
  });
}

function stopObserver() {
  observer?.disconnect();
  observer = null;
}

export async function applyLanguage(lang: Lang) {
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.lang = lang.toLowerCase();
  if (lang === "EN") {
    startObserver();
    await translateRoot(document.body);
  } else {
    stopObserver();
    restoreFrench();
  }
}

export function initI18n() {
  const lang = getLang();
  document.documentElement.lang = lang.toLowerCase();
  if (lang === "EN") {
    // wait a tick for initial render
    setTimeout(() => applyLanguage("EN"), 100);
  }
  window.addEventListener("languagechange", (e: any) => {
    const next = (e.detail as Lang) ?? getLang();
    applyLanguage(next);
  });
}

export function getCurrentLang(): Lang {
  return getLang();
}
