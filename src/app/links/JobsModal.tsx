"use client"

import { useState, useRef, useEffect, useCallback } from 'react'

type Lang = 'ca' | 'es' | 'en' | 'fr'

interface Props {
  open: boolean
  onClose: () => void
  lang: Lang
}

const i18n: Record<Lang, {
  title: string; subtitle: string
  name: string; namePlaceholder: string
  email: string; emailPlaceholder: string
  message: string; messagePlaceholder: string
  uploadCta: string; uploadHint: string; fileSelected: string
  submit: string; sending: string
  success: string; successSub: string
  errorGeneral: string; errorPdfOnly: string; errorTooLarge: string
  errorInvalidPdf: string; errorNotACv: string
}> = {
  ca: {
    title:           "Treballa amb nosaltres",
    subtitle:        "Envia'ns el teu CV i et contactem ben aviat",
    name:            "Nom",
    namePlaceholder: "El teu nom",
    email:           "Email",
    emailPlaceholder:"el.teu@email.com",
    message:         "Missatge",
    messagePlaceholder: "Explica'ns una mica qui ets (opcional)",
    uploadCta:       "Selecciona el teu CV",
    uploadHint:      "PDF · màx. 2 MB",
    fileSelected:    "Fitxer seleccionat",
    submit:          "Enviar candidatura",
    sending:         "Enviant…",
    success:         "Rebut!",
    successSub:      "T'avisarem si hi ha alguna cosa per a tu. Gràcies!",
    errorGeneral:    "Alguna cosa ha fallat. Torna-ho a intentar.",
    errorPdfOnly:    "Només s'accepten fitxers PDF.",
    errorTooLarge:   "El fitxer supera els 2 MB.",
    errorInvalidPdf: "El fitxer no és un PDF vàlid.",
    errorNotACv:     "El document no sembla un CV. Comprova que has adjuntat el fitxer correcte.",
  },
  es: {
    title:           "Trabaja con nosotros",
    subtitle:        "Envíanos tu CV y te contactamos pronto",
    name:            "Nombre",
    namePlaceholder: "Tu nombre",
    email:           "Email",
    emailPlaceholder:"tu@email.com",
    message:         "Mensaje",
    messagePlaceholder: "Cuéntanos un poco quién eres (opcional)",
    uploadCta:       "Selecciona tu CV",
    uploadHint:      "PDF · máx. 2 MB",
    fileSelected:    "Archivo seleccionado",
    submit:          "Enviar candidatura",
    sending:         "Enviando…",
    success:         "¡Recibido!",
    successSub:      "Te avisaremos si hay algo para ti. ¡Gracias!",
    errorGeneral:    "Algo ha fallado. Inténtalo de nuevo.",
    errorPdfOnly:    "Solo se aceptan archivos PDF.",
    errorTooLarge:   "El archivo supera los 2 MB.",
    errorInvalidPdf: "El archivo no es un PDF válido.",
    errorNotACv:     "El documento no parece un CV. Comprueba que has adjuntado el archivo correcto.",
  },
  en: {
    title:           "Work with us",
    subtitle:        "Send us your CV and we'll be in touch",
    name:            "Name",
    namePlaceholder: "Your name",
    email:           "Email",
    emailPlaceholder:"you@email.com",
    message:         "Message",
    messagePlaceholder: "Tell us a bit about yourself (optional)",
    uploadCta:       "Select your CV",
    uploadHint:      "PDF · max 2 MB",
    fileSelected:    "File selected",
    submit:          "Send application",
    sending:         "Sending…",
    success:         "Received!",
    successSub:      "We'll let you know if there's something for you. Thanks!",
    errorGeneral:    "Something went wrong. Please try again.",
    errorPdfOnly:    "Only PDF files are accepted.",
    errorTooLarge:   "File exceeds 2 MB.",
    errorInvalidPdf: "The file is not a valid PDF.",
    errorNotACv:     "The document doesn't look like a CV. Please check you've attached the right file.",
  },
  fr: {
    title:           "Travailler avec nous",
    subtitle:        "Envoyez-nous votre CV et on vous contacte",
    name:            "Nom",
    namePlaceholder: "Votre nom",
    email:           "Email",
    emailPlaceholder:"vous@email.com",
    message:         "Message",
    messagePlaceholder: "Dites-nous un peu qui vous êtes (optionnel)",
    uploadCta:       "Sélectionner votre CV",
    uploadHint:      "PDF · max 2 Mo",
    fileSelected:    "Fichier sélectionné",
    submit:          "Envoyer la candidature",
    sending:         "Envoi…",
    success:         "Reçu !",
    successSub:      "Nous vous contacterons si une opportunité se présente. Merci !",
    errorGeneral:    "Une erreur s'est produite. Réessayez.",
    errorPdfOnly:    "Seuls les fichiers PDF sont acceptés.",
    errorTooLarge:   "Le fichier dépasse 2 Mo.",
    errorInvalidPdf: "Le fichier n'est pas un PDF valide.",
    errorNotACv:     "Le document ne ressemble pas à un CV. Vérifiez que vous avez joint le bon fichier.",
  },
}

const MAX_SIZE = 2 * 1024 * 1024

export default function JobsModal({ open, onClose, lang }: Props) {
  const t = i18n[lang]

  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [message, setMessage] = useState('')
  const [file,    setFile]    = useState<File | null>(null)
  const [fileError, setFileError] = useState('')
  const [status, setStatus]   = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const fileRef = useRef<HTMLInputElement>(null)

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Reset form when closed
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setName(''); setEmail(''); setMessage('')
        setFile(null); setFileError('')
        setStatus('idle'); setErrorMsg('')
      }, 300)
    }
  }, [open])

  const handleFile = useCallback((f: File | null) => {
    setFileError('')
    if (!f) { setFile(null); return }
    if (f.type !== 'application/pdf') { setFileError(t.errorPdfOnly); return }
    if (f.size > MAX_SIZE)            { setFileError(t.errorTooLarge); return }
    setFile(f)
  }, [t])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return
    setStatus('sending')
    setErrorMsg('')

    const fd = new FormData()
    fd.append('name',    name)
    fd.append('email',   email)
    fd.append('message', message)
    fd.append('cv',      file)

    try {
      const res  = await fetch('/api/jobs-apply', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok) {
        const msg =
          json.error === 'invalid_pdf' ? t.errorInvalidPdf :
          json.error === 'not_a_cv'    ? t.errorNotACv     :
          t.errorGeneral
        setStatus('error')
        setErrorMsg(msg)
        return
      }
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMsg(t.errorGeneral)
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative w-full max-w-[440px] bg-[#111111] border border-[#2a2a2a] rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-[#1f1f1f]">
          <div>
            <p className="text-sm font-semibold text-neutral-100">{t.title}</p>
            <p className="text-xs text-neutral-500 mt-0.5">{t.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-600 hover:text-neutral-300 transition-colors ml-4 mt-0.5 flex-shrink-0"
            aria-label="Cerrar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5">
          {status === 'success' ? (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="w-12 h-12 rounded-full bg-[#f0fdf4] flex items-center justify-center mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <p className="text-base font-semibold text-neutral-100">{t.success}</p>
              <p className="text-sm text-neutral-500 mt-1 max-w-[280px]">{t.successSub}</p>
              <button
                onClick={onClose}
                className="mt-5 px-5 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-neutral-300 hover:text-neutral-100 transition-colors"
              >
                ✕
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">

              {/* Name */}
              <div>
                <label className="block text-[11px] text-neutral-500 mb-1.5 tracking-wide uppercase">{t.name}</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={t.namePlaceholder}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-[#C9B99A] transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] text-neutral-500 mb-1.5 tracking-wide uppercase">{t.email}</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-[#C9B99A] transition-colors"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-[11px] text-neutral-500 mb-1.5 tracking-wide uppercase">{t.message}</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder={t.messagePlaceholder}
                  rows={3}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-[#C9B99A] transition-colors resize-none"
                />
              </div>

              {/* File upload */}
              <div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={e => handleFile(e.target.files?.[0] ?? null)}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className={`w-full rounded-lg border border-dashed px-4 py-4 text-sm transition-colors text-center ${
                    file
                      ? 'border-[#C9B99A]/50 bg-[#C9B99A]/5'
                      : 'border-[#2a2a2a] bg-[#1a1a1a] hover:border-[#3a3a3a]'
                  }`}
                >
                  {file ? (
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9B99A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                        </svg>
                        <span className="text-[#C9B99A] text-xs truncate">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setFile(null); if (fileRef.current) fileRef.current.value = '' }}
                        className="text-neutral-600 hover:text-neutral-400 flex-shrink-0 transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      <span className="text-neutral-400">{t.uploadCta}</span>
                      <span className="text-neutral-600 text-xs">{t.uploadHint}</span>
                    </div>
                  )}
                </button>
                {fileError && (
                  <p className="text-xs text-red-400 mt-1.5">{fileError}</p>
                )}
              </div>

              {/* Error */}
              {status === 'error' && (
                <p className="text-xs text-red-400">{errorMsg}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'sending' || !file || !name || !email}
                className="w-full py-3 rounded-xl bg-[#C9B99A] text-[#0a0a0a] text-sm font-semibold hover:bg-[#d4c5aa] transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-1"
              >
                {status === 'sending' ? t.sending : t.submit}
              </button>

            </form>
          )}
        </div>
      </div>
    </div>
  )
}
