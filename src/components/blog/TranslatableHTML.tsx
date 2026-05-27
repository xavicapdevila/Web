"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  html: string;
  className?: string;
}

const BLOCK_TAG_RE =
  /<(p|h[1-6]|li|blockquote|td|th|dt|dd)(\s[^>]*)?>[\s\S]*?<\/\1>/gi;

/**
 * Translate an HTML string block by block (1 API call per paragraph/heading/
 * list-item). Only TOP-LEVEL blocks are processed — nested blocks (e.g. the
 * <p> that Tiptap wraps inside <li>) are filtered out so we never corrupt the
 * index-based reconstruction with overlapping replacements.
 *
 * Fallback for plain-text content (no HTML): split by sentences and translate
 * each one individually.
 */
async function translateHtmlBlocks(
  html: string,
  translateFn: (text: string) => Promise<string>
): Promise<string> {
  // ── Plain-text fallback ───────────────────────────────────────────────────
  if (!html.includes("<")) {
    // Split into sentences so we stay under MyMemory's 5000-char limit
    const sentences = html.split(/(?<=[.!?…])\s+/u).filter(Boolean);
    if (sentences.length === 0) return html;
    const translated = await Promise.all(sentences.map((s) => translateFn(s)));
    return translated.join(" ");
  }

  // ── Block-element approach ────────────────────────────────────────────────
  type BlockMatch = {
    index: number;
    end: number;
    tag: string;
    attrs: string;
    plainText: string;
  };

  const all: BlockMatch[] = [];
  const re = new RegExp(BLOCK_TAG_RE.source, "gi");
  let m: RegExpExecArray | null;

  while ((m = re.exec(html)) !== null) {
    const tag      = m[1];
    const attrs    = m[2] ?? "";
    const fullLen  = m[0].length;
    const openLen  = `<${tag}${attrs}>`.length;
    const closeLen = `</${tag}>`.length;
    const inner    = m[0].slice(openLen, fullLen - closeLen);
    const plainText = inner.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

    if (plainText.length > 2) {
      all.push({
        index: m.index,
        end:   m.index + fullLen,
        tag,
        attrs,
        plainText,
      });
    }
  }

  if (all.length === 0) return html;

  // Keep only TOP-LEVEL blocks — drop any block whose range sits fully inside
  // another match (e.g. the <p> inside a Tiptap <li>).
  const topLevel = all.filter(
    (block) =>
      !all.some(
        (other) =>
          other !== block &&
          other.index <= block.index &&
          other.end >= block.end
      )
  );

  if (topLevel.length === 0) return html;

  // Deduplicate and translate
  const uniqueTexts = [...new Set(topLevel.map((b) => b.plainText))];
  const translations = new Map<string, string>();

  await Promise.all(
    uniqueTexts.map(async (text) => {
      const result = await translateFn(text);
      translations.set(text, result);
    })
  );

  // Rebuild from end → start so earlier indices are not invalidated
  let result = html;
  for (const block of [...topLevel].reverse()) {
    const translated = translations.get(block.plainText) ?? block.plainText;
    const newBlock   = `<${block.tag}${block.attrs}>${translated}</${block.tag}>`;
    result = result.slice(0, block.index) + newBlock + result.slice(block.end);
  }

  return result;
}

export default function TranslatableHTML({ html, className }: Props) {
  const { lang, translate } = useLanguage();
  const [output, setOutput] = useState(html);

  useEffect(() => {
    if (lang === "es") {
      setOutput(html);
      return;
    }
    let cancelled = false;
    translateHtmlBlocks(html, translate)
      .then((translated) => {
        if (!cancelled) setOutput(translated);
      })
      .catch(() => {
        // Keep original on any unexpected error
      });
    return () => {
      cancelled = true;
    };
  }, [html, lang, translate]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: output }}
    />
  );
}
