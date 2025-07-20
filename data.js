// data.js

// Global olarak kullanılacak hikayeler ve sözlük objeleri
window.appData = {
  stories: [
    {
      title: "İlk Hikaye",
      text: "Мальчик увидел собаку и побежал к ней.",
      dictionary: {
        "Мальчик": { translation: "Boy", grammar: "noun, nominative" },
        "увидел": { translation: "saw", grammar: "verb, past tense" },
        "собаку": { translation: "dog", grammar: "noun, accusative" },
        "и": { translation: "and", grammar: "conjunction" },
        "побежал": { translation: "ran", grammar: "verb, past tense" },
        "к": { translation: "to", grammar: "preposition" },
        "ней": { translation: "her", grammar: "pronoun, dative" }
      }
    }
  ],
  dictionary: {
    "Мальчик": { translation: "Boy", grammar: "noun, nominative" },
    "увидел": { translation: "saw", grammar: "verb, past tense" },
    "собаку": { translation: "dog", grammar: "noun, accusative" },
    "и": { translation: "and", grammar: "conjunction" },
    "побежал": { translation: "ran", grammar: "verb, past tense" },
    "к": { translation: "to", grammar: "preposition" },
    "ней": { translation: "her", grammar: "pronoun, dative" }
  }
};
