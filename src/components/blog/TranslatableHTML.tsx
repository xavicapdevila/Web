"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  html: string;
  className?: string;
}

// Block-level tags whose text content we translate as a single unit
const BLOCK_TAG_RE =
  /<(p|h[1-6]|li|blockquote|td|th|dt|dd)(\s[^>]*)?>[\s\S]*?<\/\1>/gi;

/**
 * Translate block elements one request per block.
 * This is far cheaper on the MyMemory free tier than translating individual
 * text nodes (which produced 15–20 calls per article).
 *
 * The inner HTML of each block is replaced with its plain-text translation;
 * inline tags (strong, em, a…) are lost in the translated version — an
 * acceptable trade-off when the goal is readability in another language.
 */
async function translateHtmlBlocks(
  html: string,
  translateFn: (text: string) => Promise<string>
): Promise<string> {
  type BlockMatch = {
    index: number;
    end: number;
    tag: string;
    attrs: string;
    inner: string;
    plainText: string;
  };

  const matches: BlockMatch[] = [];
  let m: RegExpExecArray | null;
  const re = new RegExp(BLOCK_TAG_RE.source, "gi"); // fresh lastIndex

  while ((m = re.exec(html)) !== null) {
    const tag   = m[1];
    const attrs = m[2] ?? "";
    const inner = m[0].slice(`<${tag}${attrs}>`.length, -`</${tag}>`.length);
    // Strip inner HTML to get plain text for translation
    const plainText = inner.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

    if (plainText.length > 2) {
      matches.push({
        index: m.index,
        end: m.index + m[0].length,
        tag,
        attrs,
        inner,
        plainText,
      });
    }
  }

  if (matches.length === 0) return html;

  // Deduplicate and translate
  const uniqueTexts = [...new Set(matches.map((b) => b.plainText))];
  const translations = new Map<string, string>();

  await Promise.all(
    uniqueTexts.map(async (text) => {
      const translated = await translateFn(text);
      translations.set(text, translated);
    })
  );

  // Rebuild HTML from end to start so indices stay valid
  let result = html;
  for (const block of [...matches].reverse()) {
    const translated = translations.get(block.plainText) ?? block.plainText;
    const newBlock = `<${block.tag}${block.attrs}>${translated}</${block.tag}>`;
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
    translateHtmlBlocks(html, translate).then((translated) => {
      if (!cancelled) setOutput(translated);
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
