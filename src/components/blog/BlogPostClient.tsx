"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CalendarDays, Check, Copy, Eye, Share2, Tag } from "lucide-react";
import { useLanguage, useAutoTranslate } from "@/context/LanguageContext";
import { formatBlogDate } from "@/lib/utils";
import TranslatableHTML from "@/components/blog/TranslatableHTML";
import type { BlogPost } from "@/lib/blog";

const BASE_URL = "https://www.thevilahome.com";

// ── Share button ──────────────────────────────────────────────────────────────

function ShareButton({
  url,
  title,
  direction = "up",
  shareCount,
  onShare,
}: {
  url: string;
  title: string;
  direction?: "up" | "down";
  shareCount?: number | null;
  onShare?: () => void;
}) {
  const { t } = useLanguage();
  const [open, setOpen]     = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    // Use native share sheet only on touch devices (mobile/tablet).
    // On desktop the OS share panel lacks social links, so always use the
    // custom dropdown there.
    const isTouch =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;
    if (isTouch && typeof navigator !== "undefined" && "share" in navigator) {
      navigator.share({ title, url })
        .then(() => onShare?.())
        .catch(() => {});
    } else {
      setOpen((o) => !o);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("input");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    onShare?.();
    setTimeout(() => setCopied(false), 2500);
  };

  const enc  = encodeURIComponent(url);
  const encT = encodeURIComponent(title);

  const platforms = [
    {
      label: "WhatsApp",
      color: "#25D366",
      href: `https://wa.me/?text=${encT}%20${enc}`,
    },
    {
      label: "Twitter / X",
      color: "#1DA1F2",
      href: `https://twitter.com/intent/tweet?text=${encT}&url=${enc}`,
    },
    {
      label: "LinkedIn",
      color: "#0A66C2",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc}`,
    },
    {
      label: "Facebook",
      color: "#1877F2",
      href: `https://www.facebook.com/sharer/sharer.php?u=${enc}`,
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className="flex items-center gap-2 text-xs font-body tracking-widest uppercase text-[#888] hover:text-[#C9B99A] transition-colors border border-[#1e1e1e] hover:border-[#C9B99A]/30 px-4 py-2"
      >
        <Share2 size={12} />
        {t("blogShare")}
        {shareCount != null && shareCount > 0 && (
          <span className="ml-1 text-[#555] normal-case tracking-normal font-normal">
            · {shareCount >= 1000 ? `${(shareCount / 1000).toFixed(1)}K` : shareCount}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          {/* Dropdown */}
          <div className={`absolute ${direction === "down" ? "top-full mt-2" : "bottom-full mb-2"} right-0 z-50 bg-[#0f0f0f] border border-[#2a2a2a] shadow-2xl min-w-[190px] overflow-hidden`}>
            {platforms.map((p) => (
              <a
                key={p.label}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => { setOpen(false); onShare?.(); }}
                className="flex items-center gap-3 px-4 py-2.5 text-[#999] hover:text-white hover:bg-[#1a1a1a] text-xs font-body transition-colors"
              >
                <span style={{ color: p.color }} className="text-base leading-none select-none">
                  ●
                </span>
                {p.label}
              </a>
            ))}
            <div className="border-t border-[#1e1e1e]" />
            <button
              onClick={copyLink}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-[#999] hover:text-white hover:bg-[#1a1a1a] text-xs font-body transition-colors text-left"
            >
              {copied ? (
                <>
                  <Check size={11} className="text-[#C9B99A] shrink-0" />
                  <span className="text-[#C9B99A]">{t("blogShareCopied")}</span>
                </>
              ) : (
                <>
                  <Copy size={11} className="shrink-0" />
                  {t("blogShareCopy")}
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ── Related-post card ─────────────────────────────────────────────────────────

function RelatedCard({ post }: { post: BlogPost }) {
  const translatedTitle = useAutoTranslate(post.titulo);
  return (
    <article className="group bg-[#111] border border-[#1e1e1e] hover:border-[#C9B99A]/30 transition-all duration-300 overflow-hidden">
      <div className="relative aspect-video bg-gradient-to-br from-[#1a1a1a] to-[#111] overflow-hidden border-b border-[#1e1e1e]">
        {post.imagen ? (
          <Image
            src={post.imagen}
            alt={post.imagenAlt || post.titulo}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="300px"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="font-display text-3xl text-[#C9B99A]/20">
              {post.titulo.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <div className="p-5">
        {post.categoria && (
          <span className="text-[#C9B99A] text-xs font-body tracking-widest uppercase mb-2 block">
            {post.categoria}
          </span>
        )}
        <Link href={`/blog/${post.slug}`}>
          <h3 className="font-display text-base text-white group-hover:text-[#C9B99A] transition-colors leading-snug mb-2 line-clamp-2">
            {translatedTitle}
          </h3>
        </Link>
        <p className="text-[#555] text-xs">{formatBlogDate(post.fecha)}</p>
      </div>
    </article>
  );
}

// ── Main client component ────────────────────────────────────────────────────

interface Props {
  post: BlogPost;
  related: BlogPost[];
}

export default function BlogPostClient({ post, related }: Props) {
  const { t } = useLanguage();
  const translatedTitle   = useAutoTranslate(post.titulo);
  const translatedExcerpt = useAutoTranslate(post.extracto ?? "");
  const [visitCount, setVisitCount]   = useState<number | null>(null);
  const [shareCount, setShareCount]   = useState<number | null>(null);

  const articleUrl = `${BASE_URL}/blog/${post.slug}`;

  // Increment visit counter once per day per article per browser.
  // Uses localStorage to deduplicate; also fetches initial share count.
  useEffect(() => {
    const lsKey = `blog-visit-${post.slug}`;
    const today  = new Date().toDateString(); // e.g. "Thu May 29 2026"
    let alreadyCounted = false;
    try { alreadyCounted = localStorage.getItem(lsKey) === today; } catch {}

    if (!alreadyCounted) {
      fetch("/api/blog/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: post.slug, referrer: document.referrer }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.count > 0) setVisitCount(data.count);
          if (typeof data.shareCount === "number") setShareCount(data.shareCount);
        })
        .catch(() => {});
      try { localStorage.setItem(lsKey, today); } catch {}
    } else {
      // Already counted today — just fetch current counts without incrementing
      fetch(`/api/blog/visit/count?slug=${encodeURIComponent(post.slug)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.count > 0) setVisitCount(data.count);
          if (typeof data.shareCount === "number") setShareCount(data.shareCount);
        })
        .catch(() => {});
    }
  }, [post.slug]);

  // Called when user actually shares — increments counter and updates state
  const handleShare = () => {
    fetch("/api/blog/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: post.slug }),
    })
      .then((r) => r.json())
      .then((data) => { if (typeof data.count === "number") setShareCount(data.count); })
      .catch(() => {});
  };

  return (
    <article className="max-w-3xl mx-auto px-6 lg:px-0 py-16">
      {/* Back */}
      <Link
        href="/blog"
        className="flex items-center gap-2 text-[#666] hover:text-[#C9B99A] transition-colors text-sm mb-10"
      >
        <ArrowLeft size={14} />
        {t("blogBackToList")}
      </Link>

      {/* Category + tags */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {post.categoria && (
          <span className="text-black bg-[#C9B99A] text-xs font-body tracking-widest uppercase px-3 py-1">
            {post.categoria}
          </span>
        )}
        {post.etiquetas.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-[#C9B99A] text-xs font-body tracking-wide uppercase border border-[#C9B99A]/20 px-2 py-0.5"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h1 className="font-display text-4xl lg:text-5xl text-white font-normal leading-tight mb-6">
        {translatedTitle}
      </h1>

      {/* Meta: author · date · visits · share */}
      <div className="flex flex-wrap items-center gap-6 text-[#555] text-sm mb-8 pb-8 border-b border-[#1a1a1a]">
        <span className="text-[#C9B99A] text-xs font-body tracking-widest uppercase">
          The Vila Home
        </span>
        <span className="flex items-center gap-2">
          <CalendarDays size={13} className="text-[#C9B99A]" />
          {formatBlogDate(post.fecha)}
        </span>
        <div className="flex items-center gap-4 ml-auto">
          {visitCount !== null && (
            <span className="flex items-center gap-1.5 text-[#444] text-xs">
              <Eye size={12} className="text-[#C9B99A]/50" />
              {visitCount.toLocaleString("es")}
            </span>
          )}
          <ShareButton url={articleUrl} title={post.titulo} direction="down" shareCount={shareCount} onShare={handleShare} />
        </div>
      </div>

      {/* Featured image */}
      {post.imagen && (
        <div className="relative aspect-video overflow-hidden mb-10 border border-[#1a1a1a]">
          <Image
            src={post.imagen}
            alt={post.imagenAlt || post.titulo}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      )}

      {/* Excerpt */}
      {post.extracto && (
        <p className="text-[#ccc] text-lg leading-relaxed mb-8 font-light italic border-l-2 border-[#C9B99A] pl-5">
          {translatedExcerpt}
        </p>
      )}

      {/* Content */}
      {post.contenido && (
        <TranslatableHTML
          html={post.contenido}
          className="prose prose-invert prose-base max-w-none
            prose-p:text-[#aaa] prose-p:leading-relaxed
            prose-headings:text-white prose-headings:font-display prose-headings:font-normal
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-strong:text-white prose-em:text-[#ccc]
            prose-ul:text-[#aaa] prose-ol:text-[#aaa]
            prose-li:marker:text-[#C9B99A]
            prose-a:text-[#C9B99A] prose-a:no-underline hover:prose-a:underline
            prose-hr:border-[#2a2a2a]"
        />
      )}

      {/* Tags + Share */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-12 pt-8 border-t border-[#1a1a1a]">
        {post.etiquetas.length > 0 && (
          <div className="flex items-center gap-3">
            <Tag size={13} className="text-[#C9B99A] shrink-0" />
            <div className="flex flex-wrap gap-2">
              {post.etiquetas.map((tag) => (
                <span
                  key={tag}
                  className="text-[#666] text-xs font-body border border-[#1e1e1e] px-2 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        <ShareButton url={articleUrl} title={post.titulo} shareCount={shareCount} onShare={handleShare} />
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="mt-16 pt-12 border-t border-[#1a1a1a]">
          <h2 className="font-display text-2xl text-white font-normal mb-8">
            {t("blogRelatedTitle")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((rel) => (
              <RelatedCard key={rel.id} post={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <div className="mt-16 pt-12 border-t border-[#1a1a1a] bg-[#111] border border-[#1e1e1e] p-8">
        <h3 className="font-display text-2xl text-white font-normal mb-3">
          {t("blogCtaTitle")}
        </h3>
        <p className="text-[#888] text-sm mb-5">
          {t("blogCtaText")}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="tel:936061800"
            className="px-6 py-3 bg-[#C9B99A] text-black font-body text-sm tracking-wide hover:bg-[#DDD0BB] transition-colors text-center"
          >
            {t("blogCtaCall")}
          </a>
          <Link
            href="/contacto"
            className="px-6 py-3 border border-[#2a2a2a] text-[#aaa] font-body text-sm tracking-wide hover:border-[#C9B99A] hover:text-white transition-colors text-center"
          >
            {t("blogCtaContact")}
          </Link>
        </div>
      </div>
    </article>
  );
}
