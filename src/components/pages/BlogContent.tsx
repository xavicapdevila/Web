"use client";

import Link from "next/link";
import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { formatBlogDate } from "@/lib/utils";
import type { BlogPost } from "@/lib/blog";

interface Props {
  posts: BlogPost[];
}

export default function BlogContent({ posts }: Props) {
  const { t } = useLanguage();

  return (
    <>
      {/* Header */}
      <section className="py-24 border-b border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center gap-4 mb-6">
            <span className="h-px w-10 bg-[#C9B99A]" />
            <span className="text-[#C9B99A] text-xs font-body tracking-[0.3em] uppercase">
              {t("blogLabel")}
            </span>
          </div>
          <h1 className="font-display text-5xl lg:text-6xl text-white font-light leading-tight">
            {t("blogTitle1")}
            <br />
            <span className="text-[#C9B99A] italic">{t("blogTitle2")}</span>
          </h1>
          <p className="text-[#aaa] text-lg mt-4 max-w-xl">{t("blogSubtitle")}</p>
        </div>
      </section>

      {/* Posts grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {posts.length === 0 ? (
            <p className="text-[#555] text-center py-20 font-display text-2xl">
              {t("blogComingSoon")}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, i) => (
                <article
                  key={post.id}
                  className={`group bg-[#111] border border-[#1e1e1e] hover:border-[#C9B99A]/30 transition-all duration-300 overflow-hidden flex flex-col ${
                    i === 0 ? "md:col-span-2" : ""
                  }`}
                >
                  {/* Image */}
                  <Link
                    href={`/blog/${post.slug}`}
                    className={`block relative overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#111] border-b border-[#1e1e1e] ${
                      i === 0 ? "h-72" : "h-52"
                    }`}
                  >
                    {post.imagen ? (
                      <Image
                        src={post.imagen}
                        alt={post.titulo}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes={i === 0 ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
                        loading={i === 0 ? "eager" : "lazy"}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="font-display text-5xl text-[#C9B99A]/15">
                          {post.titulo.charAt(0)}
                        </span>
                      </div>
                    )}
                  </Link>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    {/* Category + tags */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      {post.categoria && (
                        <span className="text-black bg-[#C9B99A] text-xs font-body tracking-widest uppercase px-2.5 py-0.5">
                          {post.categoria}
                        </span>
                      )}
                      {post.etiquetas.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-[#C9B99A] text-xs font-body tracking-wide uppercase border border-[#C9B99A]/20 px-2 py-0.5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Title */}
                    <Link href={`/blog/${post.slug}`} className="flex-1">
                      <h2 className="font-display text-xl text-white group-hover:text-[#C9B99A] transition-colors leading-snug mb-3">
                        {post.titulo}
                      </h2>
                    </Link>

                    {/* Extracto */}
                    {post.extracto && (
                      <p className="text-[#888] text-sm leading-relaxed mb-5 line-clamp-2">
                        {post.extracto}
                      </p>
                    )}

                    {/* Footer: author + date */}
                    <div className="flex items-center justify-between text-[#555] text-xs pt-4 border-t border-[#1a1a1a] mt-auto">
                      <span className="text-[#C9B99A]/70 font-body tracking-wide">
                        The Vila Home
                      </span>
                      <span className="flex items-center gap-1.5">
                        <CalendarDays size={11} />
                        {formatBlogDate(post.fecha)}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
