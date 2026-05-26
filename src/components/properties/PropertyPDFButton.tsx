"use client";

import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import type { Property } from "@/types/property";
import { formatPrice, formatM2 } from "@/lib/utils";

interface Props {
  property: Property;
  agentName: string;
}

async function loadImageAsBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { mode: "no-cors" });
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export default function PropertyPDFButton({ property, agentName }: Props) {
  const [loading, setLoading] = useState(false);

  const generatePDF = async () => {
    setLoading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      const W = 210;
      const margin = 16;
      const champagne = [201, 185, 154] as [number, number, number];
      const dark = [26, 26, 26] as [number, number, number];
      const mid = [102, 102, 102] as [number, number, number];

      // White background
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, W, 297, "F");

      // Champagne header bar
      doc.setFillColor(...champagne);
      doc.rect(0, 0, W, 7, "F");

      // Logo
      doc.setTextColor(...dark);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("THE VILA HOME", margin, 18);

      doc.setTextColor(...mid);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text("HUMAN REAL ESTATE", margin, 23);

      // Ref
      doc.setTextColor(...mid);
      doc.setFontSize(8);
      doc.text(`Ref. ${property.ref}`, W - margin, 18, { align: "right" });

      // Divider
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, 28, W - margin, 28);

      // Title
      doc.setTextColor(...dark);
      doc.setFontSize(15);
      doc.setFont("helvetica", "bold");
      const titleLines = doc.splitTextToSize(property.titulo, W - margin * 2);
      doc.text(titleLines, margin, 36);

      // Location
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...mid);
      const loc = [property.zona, property.ciudad, property.provincia].filter(Boolean).join(", ");
      doc.text(loc, margin, 44);

      // Price
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...champagne);
      doc.text(formatPrice(property.precio), margin, 56);

      if (property.outlet && property.precioAnterior) {
        doc.setFontSize(11);
        doc.setTextColor(...mid);
        doc.text(formatPrice(property.precioAnterior), margin + 65, 56);
      }

      // Quick features
      const features: string[] = [];
      if (property.habitaciones) features.push(`${property.habitaciones} hab.`);
      if (property.banos) features.push(`${property.banos} baños`);
      if (property.m2Construidos) features.push(formatM2(property.m2Construidos));
      if (property.planta) features.push(`Planta ${property.planta}`);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...dark);
      doc.text(features.join("   ·   "), margin, 63);

      // Photos — first 4 in 2x2 grid
      let photoY = 70;
      const photoUrls = property.imagenes
        .filter((img) => img.eti !== "plano")
        .slice(0, 4)
        .map((img) => img.url);

      if (photoUrls.length > 0) {
        const imgW = (W - margin * 2 - 4) / 2;
        const imgH = imgW * 0.65;

        const base64Images = await Promise.all(
          photoUrls.map((url) => loadImageAsBase64(url))
        );

        base64Images.forEach((b64, idx) => {
          if (!b64) return;
          const col = idx % 2;
          const row = Math.floor(idx / 2);
          const x = margin + col * (imgW + 4);
          const y = photoY + row * (imgH + 4);
          try {
            doc.addImage(b64, "JPEG", x, y, imgW, imgH);
          } catch {
            // skip if image fails
          }
        });

        const rows = Math.ceil(Math.min(photoUrls.length, 4) / 2);
        photoY += rows * (imgH + 4) + 6;
      }

      // Divider
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, photoY, W - margin, photoY);
      photoY += 8;

      // Description
      if (property.descripcion && photoY < 240) {
        const cleanDesc = property.descripcion.replace(/\n\n/g, " ").replace(/\n/g, " ");
        doc.setFontSize(8.5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(60, 60, 60);
        const descLines = doc.splitTextToSize(cleanDesc.substring(0, 500), W - margin * 2);
        const maxDescLines = Math.min(descLines.length, 6);
        doc.text(descLines.slice(0, maxDescLines), margin, photoY);
        photoY += maxDescLines * 4.5 + 6;
      }

      // Characteristics
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, photoY, W - margin, photoY);
      photoY += 8;

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...champagne);
      doc.text("CARACTERÍSTICAS", margin, photoY);
      photoY += 6;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);

      const details: [string, string][] = [];
      if (property.tipo) details.push(["Tipo", property.tipo]);
      if (property.m2Construidos) details.push(["Superficie", `${Math.round(property.m2Construidos)} m²`]);
      if (property.m2Utiles) details.push(["Superficie útil", `${Math.round(property.m2Utiles)} m²`]);
      if (property.habitaciones) details.push(["Habitaciones", String(property.habitaciones)]);
      if (property.banos) details.push(["Baños", String(property.banos)]);
      if (property.calefaccion) details.push(["Calefacción", property.calefaccion]);
      if (property.orientacion) details.push(["Orientación", property.orientacion]);
      if (property.certificadoEnergetico) details.push(["Cert. energético", property.certificadoEnergetico]);
      if (property.ascensor) details.push(["Ascensor", "Sí"]);
      if (property.garaje) details.push(["Garaje", "Sí"]);
      if (property.piscina) details.push(["Piscina", "Sí"]);
      if (property.ibi && property.ibi > 0) details.push(["IBI", formatPrice(property.ibi) + "/año"]);

      details.forEach(([key, val], i) => {
        const col = i % 2;
        const x = col === 0 ? margin : W / 2;
        const y = photoY + Math.floor(i / 2) * 6.5;
        if (y > 270) return;
        doc.setTextColor(...mid);
        doc.text(key + ":", x, y);
        doc.setTextColor(...dark);
        doc.text(val, x + 30, y);
      });

      // Footer
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, 276, W - margin, 276);

      doc.setFontSize(7.5);
      doc.setTextColor(...mid);
      doc.text("The Vila Home · Av. Francesc Macià 48, 08800 Vilanova i la Geltrú", margin, 282);
      doc.text("936 061 800 · info@thevilahome.com · www.thevilahome.com", margin, 287);

      doc.setTextColor(...champagne);
      doc.text(`Agente: ${agentName}`, W - margin, 282, { align: "right" });

      doc.setFillColor(...champagne);
      doc.rect(0, 290, W, 7, "F");

      doc.save(`${property.ref}-${property.tipo}-${property.ciudad}.pdf`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={loading}
      className="flex items-center gap-3 w-full px-4 py-3 border border-[#2a2a2a] text-[#aaa] font-body text-sm tracking-wide hover:border-[#C9B99A]/40 hover:text-white transition-colors disabled:opacity-50"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} />}
      Descargar ficha PDF
    </button>
  );
}
