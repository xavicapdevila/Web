"use client";

interface Props {
  src: string;
  name: string;
}

export default function AgentPhoto({ src, name }: Props) {
  return (
    <img
      src={src}
      alt={name}
      className="w-full h-full object-cover object-top"
      onError={(e) => {
        const el = e.currentTarget;
        el.style.display = "none";
        const parent = el.parentElement;
        if (parent) {
          parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-[#C9B99A] font-serif text-xl">${name.charAt(0)}</div>`;
        }
      }}
    />
  );
}
