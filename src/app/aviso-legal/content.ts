import type { Lang } from "@/lib/i18n";

type AvisoContent = {
  title: string;
  updated: string;
  s1h: string; s1p: string;
  fieldCompany: string; fieldNif: string; fieldAddress: string; fieldPhone: string; fieldEmail: string; fieldWebsite: string;
  s2h: string; s2p: string;
  s3h: string; s3p1: string; s3p2: string;
  s4h: string; s4p1: string; s4p2: string;
  s5h: string; s5p1: string; s5p2: string; s5p3: string;
  s6h: string; s6pre: string; s6privLink: string; s6mid: string; s6cookLink: string; s6post: string;
  s7h: string; s7p: string;
  backPrivacy: string; backCookies: string; backHome: string;
};

const data: Record<Lang, AvisoContent> = {
  es: {
    title: "Aviso Legal",
    updated: "Última actualización: mayo 2026",
    s1h: "1. Datos identificativos del titular",
    s1p: "En cumplimiento de lo dispuesto en el artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa al usuario de los datos del titular del sitio web:",
    fieldCompany: "Denominación social", fieldNif: "NIF", fieldAddress: "Domicilio social", fieldPhone: "Teléfono", fieldEmail: "Correo electrónico", fieldWebsite: "Sitio web",
    s2h: "2. Objeto y ámbito de aplicación",
    s2p: 'El presente Aviso Legal regula el acceso y uso del sitio web thevilahome.com (en adelante, "el Sitio Web"). El acceso y uso del Sitio Web atribuye la condición de usuario e implica la aceptación plena de todas las condiciones incluidas en este Aviso Legal. El titular se reserva el derecho a modificar estas condiciones en cualquier momento, siendo efectiva dicha modificación desde el momento de su publicación en el Sitio Web.',
    s3h: "3. Condiciones de acceso y uso",
    s3p1: "El acceso al Sitio Web es libre y gratuito. El usuario se compromete a utilizar el Sitio Web de conformidad con la ley, el presente Aviso Legal y las buenas costumbres y orden público. Queda prohibido el uso del Sitio Web con finalidades ilícitas o lesivas para terceros.",
    s3p2: "El usuario se abstendrá de obtener o intentar obtener los contenidos del Sitio Web empleando medios distintos de los puestos a su disposición, así como de reproducir, copiar, distribuir, transformar o comunicar públicamente dichos contenidos sin la debida autorización del titular.",
    s4h: "4. Propiedad intelectual e industrial",
    s4p1: "Todos los contenidos del Sitio Web —incluyendo, sin carácter limitativo, textos, fotografías, gráficos, imágenes, tecnología, software, logotipos, marcas y nombres comerciales— están protegidos por las leyes de propiedad intelectual e industrial vigentes.",
    s4p2: "Queda expresamente prohibida la reproducción total o parcial del Sitio Web o de sus contenidos, así como su distribución, comunicación pública, transformación o modificación sin el consentimiento expreso y por escrito del titular. El incumplimiento de esta prohibición podrá dar lugar a las acciones legales pertinentes.",
    s5h: "5. Exclusión de garantías y responsabilidad",
    s5p1: "El titular no garantiza la disponibilidad, continuidad ni infalibilidad del funcionamiento del Sitio Web y, en consecuencia, no se responsabiliza de los daños y perjuicios que puedan derivarse de la falta de disponibilidad o de continuidad del Sitio Web o de sus servicios.",
    s5p2: "La información contenida en el Sitio Web tiene carácter meramente informativo. Las características, precios y disponibilidad de los inmuebles publicados están sujetos a cambios sin previo aviso. La información no constituye oferta vinculante.",
    s5p3: "El Sitio Web puede contener enlaces a sitios de terceros. El titular no controla dichos sitios ni se responsabiliza de sus contenidos o políticas de privacidad.",
    s6h: "6. Política de privacidad y cookies",
    s6pre: "El tratamiento de los datos personales recabados a través del Sitio Web se rige por la",
    s6privLink: "Política de Privacidad",
    s6mid: "y la",
    s6cookLink: "Política de Cookies",
    s6post: ", que forman parte integrante del presente Aviso Legal.",
    s7h: "7. Legislación aplicable y jurisdicción",
    s7p: "El presente Aviso Legal se rige por la legislación española vigente. Para la resolución de cualquier controversia que pudiera derivarse del acceso o uso del Sitio Web, las partes se someten a la jurisdicción de los Juzgados y Tribunales de Vilanova i la Geltrú.",
    backPrivacy: "Política de privacidad →", backCookies: "Política de cookies →", backHome: "← Volver al inicio",
  },
  ca: {
    title: "Avís Legal",
    updated: "Última actualització: maig 2026",
    s1h: "1. Dades identificatives del titular",
    s1p: "En compliment del que disposa l'article 10 de la Llei 34/2002, d'11 de juliol, de Serveis de la Societat de la Informació i de Comerç Electrònic (LSSI-CE), s'informa l'usuari de les dades del titular del lloc web:",
    fieldCompany: "Denominació social", fieldNif: "NIF", fieldAddress: "Domicili social", fieldPhone: "Telèfon", fieldEmail: "Correu electrònic", fieldWebsite: "Lloc web",
    s2h: "2. Objecte i àmbit d'aplicació",
    s2p: 'El present Avís Legal regula l\'accés i ús del lloc web thevilahome.com (d\'ara endavant, "el Lloc Web"). L\'accés i ús del Lloc Web atribueix la condició d\'usuari i implica l\'acceptació plena de totes les condicions incloses en aquest Avís Legal. El titular es reserva el dret a modificar aquestes condicions en qualsevol moment, sent efectiva la modificació des del moment de la seva publicació al Lloc Web.',
    s3h: "3. Condicions d'accés i ús",
    s3p1: "L'accés al Lloc Web és lliure i gratuït. L'usuari es compromet a utilitzar el Lloc Web de conformitat amb la llei, el present Avís Legal i els bons costums i ordre públic. Queda prohibit l'ús del Lloc Web amb finalitats il·lícites o lesives per a tercers.",
    s3p2: "L'usuari s'abstindrà d'obtenir o intentar obtenir els continguts del Lloc Web emprant mitjans diferents dels posats a la seva disposició, així com de reproduir, copiar, distribuir, transformar o comunicar públicament aquests continguts sense la deguda autorització del titular.",
    s4h: "4. Propietat intel·lectual i industrial",
    s4p1: "Tots els continguts del Lloc Web —incloent-hi, sense caràcter limitatiu, textos, fotografies, gràfics, imatges, tecnologia, programari, logotips, marques i noms comercials— estan protegits per les lleis de propietat intel·lectual i industrial vigents.",
    s4p2: "Queda expressament prohibida la reproducció total o parcial del Lloc Web o dels seus continguts, així com la seva distribució, comunicació pública, transformació o modificació sense el consentiment exprés i per escrit del titular. L'incompliment d'aquesta prohibició podrà donar lloc a les accions legals pertinents.",
    s5h: "5. Exclusió de garanties i responsabilitat",
    s5p1: "El titular no garanteix la disponibilitat, continuïtat ni infal·libilitat del funcionament del Lloc Web i, en conseqüència, no es responsabilitza dels danys i perjudicis que puguin derivar-se de la falta de disponibilitat o de continuïtat del Lloc Web o dels seus serveis.",
    s5p2: "La informació continguda al Lloc Web té caràcter merament informatiu. Les característiques, preus i disponibilitat dels immobles publicats estan subjectes a canvis sense previ avís. La informació no constitueix oferta vinculant.",
    s5p3: "El Lloc Web pot contenir enllaços a llocs de tercers. El titular no controla aquests llocs ni es responsabilitza dels seus continguts o polítiques de privacitat.",
    s6h: "6. Política de privacitat i cookies",
    s6pre: "El tractament de les dades personals recollides a través del Lloc Web es regeix per la",
    s6privLink: "Política de Privacitat",
    s6mid: "i la",
    s6cookLink: "Política de Cookies",
    s6post: ", que formen part integrant d'aquest Avís Legal.",
    s7h: "7. Legislació aplicable i jurisdicció",
    s7p: "El present Avís Legal es regeix per la legislació espanyola vigent. Per a la resolució de qualsevol controvèrsia que pogués derivar-se de l'accés o ús del Lloc Web, les parts se sotmeten a la jurisdicció dels Jutjats i Tribunals de Vilanova i la Geltrú.",
    backPrivacy: "Política de privacitat →", backCookies: "Política de cookies →", backHome: "← Tornar a l'inici",
  },
  en: {
    title: "Legal Notice",
    updated: "Last updated: May 2026",
    s1h: "1. Identifying details of the owner",
    s1p: "In compliance with Article 10 of Law 34/2002 of 11 July on Information Society Services and Electronic Commerce (LSSI-CE), users are hereby informed of the details of the website owner:",
    fieldCompany: "Company name", fieldNif: "Tax ID (NIF)", fieldAddress: "Registered address", fieldPhone: "Phone", fieldEmail: "Email address", fieldWebsite: "Website",
    s2h: "2. Purpose and scope",
    s2p: 'This Legal Notice governs access to and use of the website thevilahome.com (hereinafter, "the Website"). Accessing and using the Website confers the status of user and implies full acceptance of all conditions set out in this Legal Notice. The owner reserves the right to modify these conditions at any time, with such modifications taking effect upon publication on the Website.',
    s3h: "3. Conditions of access and use",
    s3p1: "Access to the Website is free of charge. Users agree to use the Website in accordance with the law, this Legal Notice, and generally accepted standards of conduct. Use of the Website for unlawful or harmful purposes is prohibited.",
    s3p2: "Users shall refrain from obtaining or attempting to obtain the contents of the Website by means other than those made available, and from reproducing, copying, distributing, transforming or publicly communicating such contents without the due authorisation of the owner.",
    s4h: "4. Intellectual and industrial property",
    s4p1: "All content on the Website — including, without limitation, texts, photographs, graphics, images, technology, software, logos, trademarks and trade names — is protected by applicable intellectual and industrial property laws.",
    s4p2: "Reproduction, total or partial, of the Website or its contents, as well as their distribution, public communication, transformation or modification without the express written consent of the owner is strictly prohibited. Breach of this prohibition may give rise to the relevant legal action.",
    s5h: "5. Disclaimer of warranties and liability",
    s5p1: "The owner does not guarantee the availability, continuity or infallibility of the Website and, accordingly, accepts no liability for damages that may arise from the unavailability or discontinuity of the Website or its services.",
    s5p2: "Information on the Website is provided for informational purposes only. The features, prices and availability of properties listed are subject to change without notice. The information does not constitute a binding offer.",
    s5p3: "The Website may contain links to third-party sites. The owner does not control those sites and accepts no responsibility for their content or privacy policies.",
    s6h: "6. Privacy policy and cookies",
    s6pre: "The processing of personal data collected through the Website is governed by the",
    s6privLink: "Privacy Policy",
    s6mid: "and the",
    s6cookLink: "Cookie Policy",
    s6post: ", which form an integral part of this Legal Notice.",
    s7h: "7. Applicable law and jurisdiction",
    s7p: "This Legal Notice is governed by Spanish law. For the resolution of any dispute arising from access to or use of the Website, the parties submit to the jurisdiction of the Courts and Tribunals of Vilanova i la Geltrú.",
    backPrivacy: "Privacy policy →", backCookies: "Cookie policy →", backHome: "← Back to home",
  },
  fr: {
    title: "Mentions Légales",
    updated: "Dernière mise à jour : mai 2026",
    s1h: "1. Données d'identification du responsable",
    s1p: "Conformément à l'article 10 de la loi 34/2002 du 11 juillet relative aux services de la société de l'information et au commerce électronique (LSSI-CE), l'utilisateur est informé des données du responsable du site web :",
    fieldCompany: "Dénomination sociale", fieldNif: "NIF", fieldAddress: "Siège social", fieldPhone: "Téléphone", fieldEmail: "Adresse électronique", fieldWebsite: "Site web",
    s2h: "2. Objet et champ d'application",
    s2p: 'Les présentes Mentions Légales régissent l\'accès et l\'utilisation du site web thevilahome.com (ci-après, "le Site Web"). L\'accès et l\'utilisation du Site Web confèrent la qualité d\'utilisateur et impliquent l\'acceptation pleine et entière de toutes les conditions énoncées dans ces Mentions Légales. Le responsable se réserve le droit de modifier ces conditions à tout moment, les modifications prenant effet dès leur publication sur le Site Web.',
    s3h: "3. Conditions d'accès et d'utilisation",
    s3p1: "L'accès au Site Web est libre et gratuit. L'utilisateur s'engage à utiliser le Site Web conformément à la loi, aux présentes Mentions Légales et aux bonnes mœurs. L'utilisation du Site Web à des fins illicites ou portant préjudice à des tiers est interdite.",
    s3p2: "L'utilisateur s'abstiendra d'obtenir ou de tenter d'obtenir les contenus du Site Web par des moyens autres que ceux mis à sa disposition, ainsi que de reproduire, copier, distribuer, transformer ou communiquer publiquement ces contenus sans l'autorisation expresse du responsable.",
    s4h: "4. Propriété intellectuelle et industrielle",
    s4p1: "Tous les contenus du Site Web — incluant, sans limitation, les textes, photographies, graphiques, images, technologies, logiciels, logos, marques et noms commerciaux — sont protégés par les lois applicables en matière de propriété intellectuelle et industrielle.",
    s4p2: "La reproduction totale ou partielle du Site Web ou de ses contenus, ainsi que leur distribution, communication publique, transformation ou modification sans le consentement exprès et écrit du responsable est strictement interdite. Le non-respect de cette interdiction pourra donner lieu aux actions légales appropriées.",
    s5h: "5. Exclusion de garanties et responsabilité",
    s5p1: "Le responsable ne garantit pas la disponibilité, la continuité ni l'infaillibilité du fonctionnement du Site Web et, en conséquence, n'est pas responsable des dommages pouvant résulter de l'indisponibilité ou de l'interruption du Site Web ou de ses services.",
    s5p2: "Les informations contenues sur le Site Web sont fournies à titre indicatif uniquement. Les caractéristiques, prix et disponibilités des biens publiés sont susceptibles de modification sans préavis. Ces informations ne constituent pas une offre contraignante.",
    s5p3: "Le Site Web peut contenir des liens vers des sites tiers. Le responsable ne contrôle pas ces sites et n'est pas responsable de leurs contenus ou politiques de confidentialité.",
    s6h: "6. Politique de confidentialité et cookies",
    s6pre: "Le traitement des données personnelles collectées via le Site Web est régi par la",
    s6privLink: "Politique de Confidentialité",
    s6mid: "et la",
    s6cookLink: "Politique de Cookies",
    s6post: ", qui font partie intégrante des présentes Mentions Légales.",
    s7h: "7. Droit applicable et juridiction",
    s7p: "Les présentes Mentions Légales sont régies par le droit espagnol en vigueur. Pour la résolution de tout litige pouvant résulter de l'accès ou de l'utilisation du Site Web, les parties se soumettent à la juridiction des tribunaux de Vilanova i la Geltrú.",
    backPrivacy: "Politique de confidentialité →", backCookies: "Politique de cookies →", backHome: "← Retour à l'accueil",
  },
};

export function getAvisoContent(lang: Lang): AvisoContent {
  return data[lang] ?? data.es;
}
