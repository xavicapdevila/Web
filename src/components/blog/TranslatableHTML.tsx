"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  html: string;
  className?: string;
}

/**
 * Splits HTML into tag segments and text node segments.
 * Translates only the text nodes (preserving all HTML tags and inline markup).
 * Identical text nodes are deduplicated so the API is only called once per unique string.
 */
async function translateHtmlNodes(
  html: string,
  translateFn: (text: string) => Promise<string>
): Promise<string> {
  // Split alternating: tag (<...>) vs text
  const parts = html.split(/(<[^>]+>)/);

  // Collect unique non-whitespace text segments
  const uniqueTexts = new Map<string, string>(); // original → translated (starts as identity)
  const textIndices: number[] = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (!part.startsWith("<") && part.trim().length > 0) {
      uniqueTexts.set(part, part);
      textIndices.push(i);
    }
  }

  if (uniqueTexts.size === 0) return html;

  // Translate all unique segments in parallel
  await Promise.all(
    Array.from(uniqueTexts.keys()).map(async (text) => {
      try {
        const translated = await translateFn(text);
        uniqueTexts.set(text, translated);
      } catch {
        // keep original on error
      }
    })
  );

  // Reconstruct HTML with translated text nodes
  const result = [...parts];
  for (const i of textIndices) {
    result[i] = uniqueTexts.get(parts[i]) ?? parts[i];
  }

  return result.join("");
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
    translateHtmlNodes(html, translate).then((translated) => {
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
