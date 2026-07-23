"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/**
 * Guarda la atribución de primer contacto (UTMs / fbclid de los anuncios) al
 * aterrizar en la landing: el formulario vive en /analisis y para cuando el
 * usuario llega allí la URL ya no lleva los parámetros de campaña.
 */
export default function CapturaAtribucion() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
