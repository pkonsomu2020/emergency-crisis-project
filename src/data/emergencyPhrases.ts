
export type EmergencyCategory = 'medical' | 'police' | 'fire' | 'general';

export type EmergencyPhrase = {
  id: string;
  category: EmergencyCategory;
  icon: string;
  translations: {
    [languageCode: string]: string;
  };
};

export const emergencyPhrases: EmergencyPhrase[] = [
  {
    id: 'help',
    category: 'general',
    icon: '🆘',
    translations: {
      en: 'I need help!',
      es: '¡Necesito ayuda!',
      fr: "J'ai besoin d'aide !",
      de: 'Ich brauche Hilfe!',
      it: 'Ho bisogno di aiuto!',
      ja: '助けが必要です！',
      ko: '도움이 필요합니다!',
      zh: '我需要帮助！',
      ru: 'Мне нужна помощь!',
      ar: 'أحتاج مساعدة!',
      hi: 'मुझे मदद चाहिए!',
      pt: 'Eu preciso de ajuda!',
      tr: 'Yardıma ihtiyacım var!',
    }
  },
  {
    id: 'emergency',
    category: 'general',
    icon: '🚨',
    translations: {
      en: 'This is an emergency!',
      es: '¡Esto es una emergencia!',
      fr: "C'est une urgence !",
      de: 'Das ist ein Notfall!',
      it: "È un'emergenza!",
      ja: '緊急事態です！',
      ko: '긴급 상황입니다!',
      zh: '这是紧急情况！',
      ru: 'Это чрезвычайная ситуация!',
      ar: 'هذه حالة طوارئ!',
      hi: 'यह एक आपात स्थिति है!',
      pt: 'Isto é uma emergência!',
      tr: 'Bu bir acil durum!',
    }
  },
  {
    id: 'ambulance',
    category: 'medical',
    icon: '🚑',
    translations: {
      en: 'I need an ambulance!',
      es: '¡Necesito una ambulancia!',
      fr: "J'ai besoin d'une ambulance !",
      de: 'Ich brauche einen Krankenwagen!',
      it: "Ho bisogno di un'ambulanza!",
      ja: '救急車が必要です！',
      ko: '구급차가 필요합니다!',
      zh: '我需要救护车！',
      ru: 'Мне нужна скорая помощь!',
      ar: 'أحتاج سيارة إسعاف!',
      hi: 'मुझे एम्बुलेंस चाहिए!',
      pt: 'Eu preciso de uma ambulância!',
      tr: 'Ambulansa ihtiyacım var!',
    }
  },
  {
    id: 'police',
    category: 'police',
    icon: '👮',
    translations: {
      en: 'I need police!',
      es: '¡Necesito la policía!',
      fr: "J'ai besoin de la police !",
      de: 'Ich brauche die Polizei!',
      it: 'Ho bisogno della polizia!',
      ja: '警察が必要です！',
      ko: '경찰이 필요합니다!',
      zh: '我需要警察！',
      ru: 'Мне нужна полиция!',
      ar: 'أحتاج الشرطة!',
      hi: 'मुझे पुलिस चाहिए!',
      pt: 'Eu preciso da polícia!',
      tr: 'Polise ihtiyacım var!',
    }
  },
  {
    id: 'fire',
    category: 'fire',
    icon: '🔥',
    translations: {
      en: 'There\'s a fire!',
      es: '¡Hay un incendio!',
      fr: 'Il y a un incendie !',
      de: 'Es brennt!',
      it: "C'è un incendio!",
      ja: '火事です！',
      ko: '화재가 발생했습니다!',
      zh: '着火了！',
      ru: 'Пожар!',
      ar: 'هناك حريق!',
      hi: 'आग लगी है!',
      pt: 'Há um incêndio!',
      tr: 'Yangın var!',
    }
  },
  {
    id: 'injured',
    category: 'medical',
    icon: '🤕',
    translations: {
      en: 'I\'m injured!',
      es: '¡Estoy herido!',
      fr: 'Je suis blessé !',
      de: 'Ich bin verletzt!',
      it: 'Sono ferito!',
      ja: '怪我をしています！',
      ko: '저는 다쳤습니다!',
      zh: '我受伤了！',
      ru: 'Я ранен!',
      ar: 'أنا مصاب!',
      hi: 'मैं घायल हूँ!',
      pt: 'Estou ferido!',
      tr: 'Yaralandım!',
    }
  },
  {
    id: 'lost',
    category: 'general',
    icon: '🧭',
    translations: {
      en: 'I\'m lost!',
      es: '¡Estoy perdido!',
      fr: 'Je suis perdu !',
      de: 'Ich habe mich verirrt!',
      it: 'Mi sono perso!',
      ja: '道に迷っています！',
      ko: '길을 잃었습니다!',
      zh: '我迷路了！',
      ru: 'Я заблудился!',
      ar: 'أنا ضائع!',
      hi: 'मैं खो गया हूँ!',
      pt: 'Estou perdido!',
      tr: 'Kayboldum!',
    }
  },
  {
    id: 'stolen',
    category: 'police',
    icon: '💼',
    translations: {
      en: 'I\'ve been robbed!',
      es: '¡Me han robado!',
      fr: "Je me suis fait voler !",
      de: 'Ich wurde bestohlen!',
      it: 'Sono stato derubato!',
      ja: '盗まれました！',
      ko: '도둑맞았습니다!',
      zh: '我被抢劫了！',
      ru: 'Меня обокрали!',
      ar: 'لقد تعرضت للسرقة!',
      hi: 'मेरा सामान चोरी हो गया है!',
      pt: 'Fui roubado!',
      tr: 'Soyuldum!',
    }
  }
];

export const getEmergencyPhrasesByCategory = (category: EmergencyCategory | 'all'): EmergencyPhrase[] => {
  if (category === 'all') {
    return emergencyPhrases;
  }
  return emergencyPhrases.filter(phrase => phrase.category === category);
};

export const translatePhrase = (phrase: EmergencyPhrase, languageCode: string): string => {
  return phrase.translations[languageCode] || phrase.translations.en;
};
