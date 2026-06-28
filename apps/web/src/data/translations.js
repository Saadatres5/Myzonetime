/**
 * translations.js
 * Core UI translations for Arabic (ar), Hindi (hi), Spanish (es).
 * Used by multilingual landing pages targeting non-English search traffic.
 */

export const TRANSLATIONS = {
  ar: {
    lang: 'ar',
    dir: 'rtl',
    locale: 'ar_AE',
    langName: 'العربية',
    flag: '🇦🇪',
    // Meta
    homeTitle: 'ساعة عالمية ومحول المناطق الزمنية — مجاني | MyZoneTime',
    homeDesc: 'ساعة عالمية مجانية لأكثر من 500 مدينة. تحويل المناطق الزمنية، تخطيط الاجتماعات، التقويم الهجري. بدون تسجيل.',
    // Hero
    heroTitle: 'الساعة العالمية ومحول المناطق الزمنية',
    heroSubtitle: 'أداة مجانية لمعرفة الوقت الحالي في أكثر من 500 مدينة حول العالم',
    // Tools
    tools: 'الأدوات',
    worldClock: 'الساعة العالمية',
    timezoneConverter: 'محول المناطق الزمنية',
    meetingPlanner: 'مخطط الاجتماعات',
    hijriCalendar: 'التقويم الهجري',
    timeDifference: 'فرق التوقيت',
    sunriseSunset: 'وقت الشروق والغروب',
    weekNumber: 'رقم الأسبوع',
    unixTime: 'التوقيت الموحد (Unix)',
    // Cities section
    popularCities: 'المدن الشائعة',
    currentTimeIn: 'الوقت الحالي في',
    // Nav
    home: 'الرئيسية',
    about: 'حول الموقع',
    // Content
    whyUseTitle: 'لماذا تستخدم MyZoneTime؟',
    whyUseText: 'MyZoneTime أداة مجانية بالكامل لا تحتاج إلى تسجيل. نوفر أدوات دقيقة لتحويل المناطق الزمنية، والتقويم الهجري، ووقت الشروق والغروب لأكثر من 500 مدينة حول العالم. مثالية للفرق العالمية والمسافرين ومستخدمي منطقة الخليج العربي.',
    features: [
      'تحديث الوقت كل ثانية — دقيق دائمًا',
      'أكثر من 500 مدينة في كل قارة',
      'التقويم الهجري الإسلامي مدمج',
      'حساب أوقات الصلاة وتوقيت الشروق والغروب',
      'بدون تسجيل، بدون إعلانات مزعجة',
      'يعمل على جميع الأجهزة',
    ],
    // Time differences (popular Gulf queries)
    diffSection: 'فروق التوقيت الشائعة',
    diffs: [
      { label: 'دبي → لندن', path: '/time-difference/dubai-and-london' },
      { label: 'دبي → نيويورك', path: '/time-difference/dubai-and-new-york' },
      { label: 'دبي → الهند', path: '/time-difference/dubai-and-india' },
      { label: 'الرياض → لندن', path: '/time-difference/riyadh-and-london' },
      { label: 'أبوظبي → سنغافورة', path: '/time-difference/abu-dhabi-and-singapore' },
    ],
    // FAQ
    faqs: [
      { question: 'كيف أعرف الوقت الحالي في دبي؟', answer: 'دبي تستخدم توقيت الخليج القياسي (GST) وهو UTC+4 على مدار السنة بدون تغيير للتوقيت الصيفي. يمكنك رؤية الوقت الحالي في دبي على صفحة دبي في MyZoneTime.' },
      { question: 'ما الفرق بين توقيت دبي ولندن؟', answer: 'دبي (UTC+4) تسبق لندن بـ 4 ساعات في الشتاء (GMT)، وبـ 3 ساعات في الصيف (BST). يتغير الفرق مرتين في السنة بسبب التوقيت الصيفي في المملكة المتحدة.' },
      { question: 'كيف أحول الوقت بين المناطق الزمنية؟', answer: 'استخدم محول المناطق الزمنية المجاني في MyZoneTime. أدخل المدينة الأولى والثانية وسيظهر لك الوقت المقابل مع مراعاة التوقيت الصيفي تلقائيًا.' },
      { question: 'ما هو التقويم الهجري اليوم؟', answer: 'يمكنك مشاهدة التاريخ الهجري الحالي على صفحة التقويم الهجري في MyZoneTime، والتي تُحدَّث يوميًا وتدعم التحويل بين التقويم الهجري والميلادي.' },
    ],
  },

  hi: {
    lang: 'hi',
    dir: 'ltr',
    locale: 'hi_IN',
    langName: 'हिन्दी',
    flag: '🇮🇳',
    homeTitle: 'विश्व घड़ी और टाइम ज़ोन कनवर्टर — मुफ़्त | MyZoneTime',
    homeDesc: '500+ शहरों के लिए मुफ़्त विश्व घड़ी। टाइम ज़ोन बदलें, मीटिंग प्लान करें, हिजरी कैलेंडर देखें। कोई साइनअप नहीं।',
    heroTitle: 'विश्व घड़ी और टाइम ज़ोन कनवर्टर',
    heroSubtitle: '500+ शहरों में मौजूदा समय जानने का मुफ़्त टूल',
    tools: 'टूल्स',
    worldClock: 'विश्व घड़ी',
    timezoneConverter: 'टाइम ज़ोन कनवर्टर',
    meetingPlanner: 'मीटिंग प्लानर',
    hijriCalendar: 'हिजरी कैलेंडर',
    timeDifference: 'समय का अंतर',
    sunriseSunset: 'सूर्योदय और सूर्यास्त',
    weekNumber: 'सप्ताह संख्या',
    unixTime: 'Unix टाइम',
    popularCities: 'लोकप्रिय शहर',
    currentTimeIn: 'अभी समय है',
    home: 'होम',
    about: 'हमारे बारे में',
    whyUseTitle: 'MyZoneTime क्यों इस्तेमाल करें?',
    whyUseText: 'MyZoneTime पूरी तरह मुफ़्त है और बिना साइनअप के काम करता है। भारत और दुनिया भर के 500+ शहरों के लिए सटीक समय, IST कनवर्टर, और सूर्योदय-सूर्यास्त की जानकारी पाएं। रिमोट टीम, यात्री और बिज़नेस प्रोफेशनल्स के लिए आदर्श।',
    features: [
      'हर सेकंड अपडेट होने वाला सटीक समय',
      '500+ शहर — हर महाद्वीप पर',
      'IST से किसी भी ज़ोन में तुरंत कनवर्ट करें',
      'DST-aware — ऑटोमेटिक अपडेट',
      'कोई साइनअप नहीं, कोई परेशानी नहीं',
      'मोबाइल और डेस्कटॉप दोनों पर काम करता है',
    ],
    diffSection: 'लोकप्रिय समय अंतर',
    diffs: [
      { label: 'दुबई → मुंबई', path: '/time-difference/dubai-and-india' },
      { label: 'लंदन → दिल्ली', path: '/time-difference/london-and-india' },
      { label: 'न्यूयॉर्क → मुंबई', path: '/time-difference/new-york-and-india' },
      { label: 'सिंगापुर → दिल्ली', path: '/time-difference/singapore-and-india' },
      { label: 'टोक्यो → मुंबई', path: '/time-difference/tokyo-and-india' },
    ],
    faqs: [
      { question: 'दुबई और भारत में कितने घंटे का फ़र्क है?', answer: 'दुबई (UTC+4) भारतीय समय (IST, UTC+5:30) से 1 घंटा 30 मिनट पीछे है। जब दुबई में दोपहर 12 बजे होते हैं, तो भारत में 1:30 बज रहे होते हैं।' },
      { question: 'IST का मतलब क्या है?', answer: 'IST का मतलब India Standard Time है, जो UTC+5:30 है। भारत पूरे साल एक ही टाइम ज़ोन पर रहता है — डेलाइट सेविंग टाइम नहीं बदलता।' },
      { question: 'अभी भारत में क्या समय है?', answer: 'MyZoneTime के India Time पेज पर जाएं जहाँ भारतीय समय लाइव अपडेट होता रहता है। IST हमेशा UTC से 5 घंटे 30 मिनट आगे रहता है।' },
      { question: 'लंदन और भारत में कितने घंटे का अंतर है?', answer: 'सर्दियों में लंदन (GMT) भारत (IST) से 5 घंटे 30 मिनट पीछे होता है। गर्मियों में (BST) यह अंतर 4 घंटे 30 मिनट हो जाता है।' },
    ],
  },

  es: {
    lang: 'es',
    dir: 'ltr',
    locale: 'es_ES',
    langName: 'Español',
    flag: '🇪🇸',
    homeTitle: 'Reloj Mundial y Convertidor de Zonas Horarias — Gratis | MyZoneTime',
    homeDesc: 'Reloj mundial gratuito para 500+ ciudades. Convierte zonas horarias, planifica reuniones, verifica fechas. Sin registro.',
    heroTitle: 'Reloj Mundial y Convertidor de Zonas Horarias',
    heroSubtitle: 'La hora exacta en más de 500 ciudades del mundo — gratis y sin registro',
    tools: 'Herramientas',
    worldClock: 'Reloj Mundial',
    timezoneConverter: 'Convertidor de Zona Horaria',
    meetingPlanner: 'Planificador de Reuniones',
    hijriCalendar: 'Calendario Hijri',
    timeDifference: 'Diferencia Horaria',
    sunriseSunset: 'Amanecer y Atardecer',
    weekNumber: 'Número de Semana',
    unixTime: 'Tiempo Unix',
    popularCities: 'Ciudades Populares',
    currentTimeIn: 'Hora actual en',
    home: 'Inicio',
    about: 'Acerca de',
    whyUseTitle: '¿Por qué usar MyZoneTime?',
    whyUseText: 'MyZoneTime es completamente gratuito y no requiere registro. Ofrecemos herramientas precisas para convertir zonas horarias, planificar reuniones internacionales y consultar la hora actual en más de 500 ciudades. Ideal para equipos remotos, viajeros y profesionales que trabajan con múltiples zonas horarias.',
    features: [
      'Actualizaciones de tiempo en tiempo real — siempre preciso',
      '500+ ciudades en todos los continentes',
      'Conversiones con ajuste automático de horario de verano',
      'Planificador de reuniones con ventanas de horario compartido',
      'Sin registro, sin suscripción, sin coste',
      'Compatible con móvil y escritorio',
    ],
    diffSection: 'Diferencias Horarias Populares',
    diffs: [
      { label: 'Madrid → Nueva York', path: '/time-difference/madrid-and-new-york' },
      { label: 'Madrid → Londres', path: '/time-difference/madrid-and-london' },
      { label: 'Buenos Aires → Madrid', path: '/time-difference/buenos-aires-and-madrid' },
      { label: 'Ciudad de México → Madrid', path: '/time-difference/mexico-city-and-madrid' },
      { label: 'Londres → Tokio', path: '/time-difference/london-and-tokyo' },
    ],
    faqs: [
      { question: '¿Qué hora es en Nueva York ahora mismo?', answer: 'Nueva York usa Eastern Time — EST (UTC−5) en invierno y EDT (UTC−4) en verano. Puedes ver la hora exacta en la página de Nueva York de MyZoneTime, que se actualiza cada segundo.' },
      { question: '¿Cuántas horas de diferencia hay entre España y México?', answer: 'España (CET, UTC+1) está 7 horas por delante de Ciudad de México (CST, UTC−6) en invierno. En verano, con los cambios de horario, la diferencia puede ser de 6 horas.' },
      { question: '¿Cómo convierto una hora entre zonas horarias?', answer: 'Usa el convertidor de zonas horarias gratuito de MyZoneTime. Introduce las dos ciudades y obtendrás el tiempo equivalente al instante, teniendo en cuenta el horario de verano.' },
      { question: '¿Qué es UTC y cómo funciona?', answer: 'UTC (Tiempo Universal Coordinado) es el estándar horario mundial con offset 0. Todas las zonas horarias se expresan como UTC+ o UTC−. Por ejemplo, España en invierno es UTC+1 y en verano UTC+2.' },
    ],
  },
};

export const LANG_PATHS = {
  ar: '/ar',
  hi: '/hi',
  es: '/es',
};
