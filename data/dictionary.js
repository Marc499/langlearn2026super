/**
 * Thai Language Learning Dictionary
 * Contains: German/English -> Thai translations, phonetics, word-by-word back-translations
 *
 * Structure per entry:
 *   de: German sentence
 *   en: English sentence
 *   th: Thai script (with spaces between words)
 *   phonetic: Thai phonetic transcription (with spaces)
 *   wordByWord: German word-by-word back-translation (with spaces)
 */

const DICTIONARY = {
  // ==================== GREETINGS / BEGRÜSSUNGEN ====================
  phrases: [
    {
      de: "hallo",
      en: "hello",
      th: "สวัสดี",
      phonetic: "sà-wàt-dii",
      wordByWord: "Hallo"
    },
    {
      de: "guten morgen",
      en: "good morning",
      th: "สวัสดี ตอน เช้า",
      phonetic: "sà-wàt-dii dtɔɔn cháo",
      wordByWord: "Hallo Zeit Morgen"
    },
    {
      de: "guten abend",
      en: "good evening",
      th: "สวัสดี ตอน เย็น",
      phonetic: "sà-wàt-dii dtɔɔn yen",
      wordByWord: "Hallo Zeit Abend"
    },
    {
      de: "gute nacht",
      en: "good night",
      th: "ราตรี สวัสดิ์",
      phonetic: "raa-dtrii sà-wàt",
      wordByWord: "Nacht gut"
    },
    {
      de: "wie geht es ihnen",
      en: "how are you",
      th: "คุณ สบาย ดี ไหม",
      phonetic: "khun sà-baai dii mǎi",
      wordByWord: "Sie wohl gut Frage"
    },
    {
      de: "mir geht es gut",
      en: "i am fine",
      th: "ฉัน สบาย ดี",
      phonetic: "chǎn sà-baai dii",
      wordByWord: "Ich wohl gut"
    },
    {
      de: "auf wiedersehen",
      en: "goodbye",
      th: "ลา ก่อน",
      phonetic: "laa gɔ̀ɔn",
      wordByWord: "Abschied vorher"
    },
    {
      de: "tschüss",
      en: "bye",
      th: "บาย บาย",
      phonetic: "baai baai",
      wordByWord: "Tschüss Tschüss"
    },
    {
      de: "bis später",
      en: "see you later",
      th: "แล้ว พบ กัน ใหม่",
      phonetic: "lɛ́ɛo phóp gan mài",
      wordByWord: "dann treffen zusammen neu"
    },

    // ==================== POLITE PHRASES / HÖFLICHKEIT ====================
    {
      de: "danke",
      en: "thank you",
      th: "ขอบ คุณ",
      phonetic: "khɔ̀ɔp khun",
      wordByWord: "Dank Sie"
    },
    {
      de: "vielen dank",
      en: "thank you very much",
      th: "ขอบ คุณ มาก",
      phonetic: "khɔ̀ɔp khun mâak",
      wordByWord: "Dank Sie viel"
    },
    {
      de: "bitte",
      en: "please",
      th: "กรุณา",
      phonetic: "gà-rú-naa",
      wordByWord: "Bitte"
    },
    {
      de: "entschuldigung",
      en: "excuse me",
      th: "ขอ โทษ",
      phonetic: "khɔ̌ɔ thôot",
      wordByWord: "bitten Strafe"
    },
    {
      de: "es tut mir leid",
      en: "i am sorry",
      th: "ฉัน ขอ โทษ",
      phonetic: "chǎn khɔ̌ɔ thôot",
      wordByWord: "Ich bitten Strafe"
    },
    {
      de: "kein problem",
      en: "no problem",
      th: "ไม่ เป็น ไร",
      phonetic: "mâi bpen rai",
      wordByWord: "nicht sein was"
    },
    {
      de: "bitte schön",
      en: "you are welcome",
      th: "ยินดี",
      phonetic: "yin-dii",
      wordByWord: "erfreut"
    },
    {
      de: "gern geschehen",
      en: "my pleasure",
      th: "ด้วย ความ ยินดี",
      phonetic: "dûai khwaam yin-dii",
      wordByWord: "mit Eigenschaft erfreut"
    },

    // ==================== SELF INTRODUCTION / VORSTELLUNG ====================
    {
      de: "ich heiße",
      en: "my name is",
      th: "ฉัน ชื่อ",
      phonetic: "chǎn chʉ̂ʉ",
      wordByWord: "Ich Name"
    },
    {
      de: "wie heißen sie",
      en: "what is your name",
      th: "คุณ ชื่อ อะไร",
      phonetic: "khun chʉ̂ʉ à-rai",
      wordByWord: "Sie Name was"
    },
    {
      de: "freut mich",
      en: "nice to meet you",
      th: "ยินดี ที่ ได้ รู้จัก",
      phonetic: "yin-dii thîi dâi rúu-jàk",
      wordByWord: "erfreut dass bekommen kennen"
    },
    {
      de: "ich komme aus deutschland",
      en: "i come from germany",
      th: "ฉัน มา จาก เยอรมนี",
      phonetic: "chǎn maa jàak yəə-rá-má-nii",
      wordByWord: "Ich kommen von Deutschland"
    },
    {
      de: "ich bin deutscher",
      en: "i am german",
      th: "ฉัน เป็น คน เยอรมัน",
      phonetic: "chǎn bpen khon yəə-rá-man",
      wordByWord: "Ich sein Person deutsch"
    },
    {
      de: "ich lerne thai",
      en: "i am learning thai",
      th: "ฉัน เรียน ภาษา ไทย",
      phonetic: "chǎn riian phaa-sǎa thai",
      wordByWord: "Ich lernen Sprache Thai"
    },

    // ==================== NUMBERS / ZAHLEN ====================
    {
      de: "eins",
      en: "one",
      th: "หนึ่ง",
      phonetic: "nʉ̀ng",
      wordByWord: "eins"
    },
    {
      de: "zwei",
      en: "two",
      th: "สอง",
      phonetic: "sɔ̌ɔng",
      wordByWord: "zwei"
    },
    {
      de: "drei",
      en: "three",
      th: "สาม",
      phonetic: "sǎam",
      wordByWord: "drei"
    },
    {
      de: "vier",
      en: "four",
      th: "สี่",
      phonetic: "sìi",
      wordByWord: "vier"
    },
    {
      de: "fünf",
      en: "five",
      th: "ห้า",
      phonetic: "hâa",
      wordByWord: "fünf"
    },
    {
      de: "sechs",
      en: "six",
      th: "หก",
      phonetic: "hòk",
      wordByWord: "sechs"
    },
    {
      de: "sieben",
      en: "seven",
      th: "เจ็ด",
      phonetic: "jèt",
      wordByWord: "sieben"
    },
    {
      de: "acht",
      en: "eight",
      th: "แปด",
      phonetic: "bpɛ̀ɛt",
      wordByWord: "acht"
    },
    {
      de: "neun",
      en: "nine",
      th: "เก้า",
      phonetic: "gâo",
      wordByWord: "neun"
    },
    {
      de: "zehn",
      en: "ten",
      th: "สิบ",
      phonetic: "sìp",
      wordByWord: "zehn"
    },
    {
      de: "hundert",
      en: "hundred",
      th: "ร้อย",
      phonetic: "rɔ́ɔi",
      wordByWord: "hundert"
    },
    {
      de: "tausend",
      en: "thousand",
      th: "พัน",
      phonetic: "phan",
      wordByWord: "tausend"
    },

    // ==================== FOOD & DRINKS / ESSEN & TRINKEN ====================
    {
      de: "ich habe hunger",
      en: "i am hungry",
      th: "ฉัน หิว",
      phonetic: "chǎn hǐu",
      wordByWord: "Ich hungrig"
    },
    {
      de: "ich habe durst",
      en: "i am thirsty",
      th: "ฉัน หิว น้ำ",
      phonetic: "chǎn hǐu náam",
      wordByWord: "Ich hungrig Wasser"
    },
    {
      de: "ich möchte essen",
      en: "i want to eat",
      th: "ฉัน อยาก กิน",
      phonetic: "chǎn yàak gin",
      wordByWord: "Ich wollen essen"
    },
    {
      de: "ich möchte trinken",
      en: "i want to drink",
      th: "ฉัน อยาก ดื่ม",
      phonetic: "chǎn yàak dʉ̀ʉm",
      wordByWord: "Ich wollen trinken"
    },
    {
      de: "wasser",
      en: "water",
      th: "น้ำ",
      phonetic: "náam",
      wordByWord: "Wasser"
    },
    {
      de: "reis",
      en: "rice",
      th: "ข้าว",
      phonetic: "khâao",
      wordByWord: "Reis"
    },
    {
      de: "gebratener reis",
      en: "fried rice",
      th: "ข้าว ผัด",
      phonetic: "khâao phàt",
      wordByWord: "Reis gebraten"
    },
    {
      de: "nudeln",
      en: "noodles",
      th: "ก๋วยเตี๋ยว",
      phonetic: "gǔai-dtǐao",
      wordByWord: "Nudeln"
    },
    {
      de: "suppe",
      en: "soup",
      th: "ซุป",
      phonetic: "súp",
      wordByWord: "Suppe"
    },
    {
      de: "huhn",
      en: "chicken",
      th: "ไก่",
      phonetic: "gài",
      wordByWord: "Huhn"
    },
    {
      de: "schweinefleisch",
      en: "pork",
      th: "หมู",
      phonetic: "mǔu",
      wordByWord: "Schwein"
    },
    {
      de: "rindfleisch",
      en: "beef",
      th: "เนื้อ",
      phonetic: "nʉ́a",
      wordByWord: "Fleisch"
    },
    {
      de: "fisch",
      en: "fish",
      th: "ปลา",
      phonetic: "bplaa",
      wordByWord: "Fisch"
    },
    {
      de: "garnele",
      en: "shrimp",
      th: "กุ้ง",
      phonetic: "gûng",
      wordByWord: "Garnele"
    },
    {
      de: "gemüse",
      en: "vegetables",
      th: "ผัก",
      phonetic: "phàk",
      wordByWord: "Gemüse"
    },
    {
      de: "obst",
      en: "fruit",
      th: "ผลไม้",
      phonetic: "phǒn-lá-máai",
      wordByWord: "Obst"
    },
    {
      de: "bier",
      en: "beer",
      th: "เบียร์",
      phonetic: "biia",
      wordByWord: "Bier"
    },
    {
      de: "kaffee",
      en: "coffee",
      th: "กาแฟ",
      phonetic: "gaa-fɛɛ",
      wordByWord: "Kaffee"
    },
    {
      de: "tee",
      en: "tea",
      th: "ชา",
      phonetic: "chaa",
      wordByWord: "Tee"
    },
    {
      de: "lecker",
      en: "delicious",
      th: "อร่อย",
      phonetic: "à-rɔ̀i",
      wordByWord: "lecker"
    },
    {
      de: "scharf",
      en: "spicy",
      th: "เผ็ด",
      phonetic: "phèt",
      wordByWord: "scharf"
    },
    {
      de: "nicht scharf",
      en: "not spicy",
      th: "ไม่ เผ็ด",
      phonetic: "mâi phèt",
      wordByWord: "nicht scharf"
    },
    {
      de: "die rechnung bitte",
      en: "the bill please",
      th: "เก็บ เงิน ด้วย",
      phonetic: "gèp ngən dûai",
      wordByWord: "sammeln Geld auch"
    },

    // ==================== DIRECTIONS / RICHTUNGEN ====================
    {
      de: "wo ist",
      en: "where is",
      th: "อยู่ ที่ ไหน",
      phonetic: "yùu thîi nǎi",
      wordByWord: "sein Ort wo"
    },
    {
      de: "links",
      en: "left",
      th: "ซ้าย",
      phonetic: "sáai",
      wordByWord: "links"
    },
    {
      de: "rechts",
      en: "right",
      th: "ขวา",
      phonetic: "khwǎa",
      wordByWord: "rechts"
    },
    {
      de: "geradeaus",
      en: "straight ahead",
      th: "ตรง ไป",
      phonetic: "dtrong bpai",
      wordByWord: "gerade gehen"
    },
    {
      de: "toilette",
      en: "toilet",
      th: "ห้องน้ำ",
      phonetic: "hɔ̂ɔng-náam",
      wordByWord: "Zimmer-Wasser"
    },
    {
      de: "hotel",
      en: "hotel",
      th: "โรงแรม",
      phonetic: "roong-rɛɛm",
      wordByWord: "Hotel"
    },
    {
      de: "flughafen",
      en: "airport",
      th: "สนาม บิน",
      phonetic: "sà-nǎam bin",
      wordByWord: "Feld fliegen"
    },
    {
      de: "bahnhof",
      en: "train station",
      th: "สถานี รถไฟ",
      phonetic: "sà-thǎa-nii rót-fai",
      wordByWord: "Station Zug"
    },
    {
      de: "krankenhaus",
      en: "hospital",
      th: "โรง พยาบาล",
      phonetic: "roong phá-yaa-baan",
      wordByWord: "Gebäude Krankenhaus"
    },
    {
      de: "markt",
      en: "market",
      th: "ตลาด",
      phonetic: "dtà-làat",
      wordByWord: "Markt"
    },
    {
      de: "strand",
      en: "beach",
      th: "หาด ทราย",
      phonetic: "hàat saai",
      wordByWord: "Strand Sand"
    },
    {
      de: "tempel",
      en: "temple",
      th: "วัด",
      phonetic: "wát",
      wordByWord: "Tempel"
    },

    // ==================== SHOPPING / EINKAUFEN ====================
    {
      de: "wie viel kostet das",
      en: "how much does this cost",
      th: "นี่ ราคา เท่า ไหร่",
      phonetic: "nîi raa-khaa thâo rài",
      wordByWord: "dies Preis gleich wieviel"
    },
    {
      de: "zu teuer",
      en: "too expensive",
      th: "แพง เกิน ไป",
      phonetic: "phɛɛng gəən bpai",
      wordByWord: "teuer über gehen"
    },
    {
      de: "können sie billiger machen",
      en: "can you make it cheaper",
      th: "ลด ราคา ได้ ไหม",
      phonetic: "lót raa-khaa dâi mǎi",
      wordByWord: "reduzieren Preis können Frage"
    },
    {
      de: "ich möchte das kaufen",
      en: "i want to buy this",
      th: "ฉัน อยาก ซื้อ นี่",
      phonetic: "chǎn yàak sʉ́ʉ nîi",
      wordByWord: "Ich wollen kaufen dies"
    },
    {
      de: "groß",
      en: "big",
      th: "ใหญ่",
      phonetic: "yài",
      wordByWord: "groß"
    },
    {
      de: "klein",
      en: "small",
      th: "เล็ก",
      phonetic: "lék",
      wordByWord: "klein"
    },

    // ==================== TRANSPORT / VERKEHR ====================
    {
      de: "taxi",
      en: "taxi",
      th: "แท็กซี่",
      phonetic: "thɛ́k-sîi",
      wordByWord: "Taxi"
    },
    {
      de: "bus",
      en: "bus",
      th: "รถ เมล์",
      phonetic: "rót mee",
      wordByWord: "Auto Post"
    },
    {
      de: "zug",
      en: "train",
      th: "รถไฟ",
      phonetic: "rót-fai",
      wordByWord: "Auto-Feuer"
    },
    {
      de: "ich möchte nach bangkok fahren",
      en: "i want to go to bangkok",
      th: "ฉัน อยาก ไป กรุงเทพ",
      phonetic: "chǎn yàak bpai grung-thêep",
      wordByWord: "Ich wollen gehen Bangkok"
    },
    {
      de: "bitte halten sie hier",
      en: "please stop here",
      th: "กรุณา จอด ที่ นี่",
      phonetic: "gà-rú-naa jɔ̀ɔt thîi nîi",
      wordByWord: "Bitte stoppen Ort hier"
    },

    // ==================== TIME / ZEIT ====================
    {
      de: "heute",
      en: "today",
      th: "วัน นี้",
      phonetic: "wan níi",
      wordByWord: "Tag dies"
    },
    {
      de: "morgen",
      en: "tomorrow",
      th: "พรุ่ง นี้",
      phonetic: "phrûng níi",
      wordByWord: "morgen dies"
    },
    {
      de: "gestern",
      en: "yesterday",
      th: "เมื่อ วาน",
      phonetic: "mʉ̂a waan",
      wordByWord: "als gestern"
    },
    {
      de: "jetzt",
      en: "now",
      th: "ตอน นี้",
      phonetic: "dtɔɔn níi",
      wordByWord: "Zeit dies"
    },
    {
      de: "wie spät ist es",
      en: "what time is it",
      th: "กี่ โมง แล้ว",
      phonetic: "gìi moong lɛ́ɛo",
      wordByWord: "wieviel Uhr schon"
    },

    // ==================== WEATHER / WETTER ====================
    {
      de: "es ist heiß",
      en: "it is hot",
      th: "อากาศ ร้อน",
      phonetic: "aa-gàat rɔ́ɔn",
      wordByWord: "Wetter heiß"
    },
    {
      de: "es regnet",
      en: "it is raining",
      th: "ฝน ตก",
      phonetic: "fǒn dtòk",
      wordByWord: "Regen fallen"
    },
    {
      de: "es ist kalt",
      en: "it is cold",
      th: "อากาศ หนาว",
      phonetic: "aa-gàat nǎao",
      wordByWord: "Wetter kalt"
    },

    // ==================== EMERGENCIES / NOTFÄLLE ====================
    {
      de: "hilfe",
      en: "help",
      th: "ช่วย ด้วย",
      phonetic: "chûai dûai",
      wordByWord: "helfen auch"
    },
    {
      de: "ich brauche einen arzt",
      en: "i need a doctor",
      th: "ฉัน ต้องการ หมอ",
      phonetic: "chǎn dtɔ̂ɔng-gaan mɔ̌ɔ",
      wordByWord: "Ich brauchen Arzt"
    },
    {
      de: "rufen sie die polizei",
      en: "call the police",
      th: "เรียก ตำรวจ",
      phonetic: "rîak dtam-rùat",
      wordByWord: "rufen Polizei"
    },
    {
      de: "ich bin krank",
      en: "i am sick",
      th: "ฉัน ไม่ สบาย",
      phonetic: "chǎn mâi sà-baai",
      wordByWord: "Ich nicht wohl"
    },
    {
      de: "ich habe mich verlaufen",
      en: "i am lost",
      th: "ฉัน หลง ทาง",
      phonetic: "chǎn lǒng thaang",
      wordByWord: "Ich verlieren Weg"
    },

    // ==================== FEELINGS / GEFÜHLE ====================
    {
      de: "ich bin glücklich",
      en: "i am happy",
      th: "ฉัน มี ความ สุข",
      phonetic: "chǎn mii khwaam sùk",
      wordByWord: "Ich haben Eigenschaft Glück"
    },
    {
      de: "ich bin traurig",
      en: "i am sad",
      th: "ฉัน เศร้า",
      phonetic: "chǎn sâo",
      wordByWord: "Ich traurig"
    },
    {
      de: "ich bin müde",
      en: "i am tired",
      th: "ฉัน เหนื่อย",
      phonetic: "chǎn nʉ̀ai",
      wordByWord: "Ich müde"
    },
    {
      de: "ich liebe dich",
      en: "i love you",
      th: "ฉัน รัก คุณ",
      phonetic: "chǎn rák khun",
      wordByWord: "Ich lieben Sie"
    },
    {
      de: "ich vermisse dich",
      en: "i miss you",
      th: "ฉัน คิดถึง คุณ",
      phonetic: "chǎn khít-thʉ̌ng khun",
      wordByWord: "Ich denken-erreichen Sie"
    },

    // ==================== COMMON VERBS / HÄUFIGE VERBEN ====================
    {
      de: "ich gehe",
      en: "i go",
      th: "ฉัน ไป",
      phonetic: "chǎn bpai",
      wordByWord: "Ich gehen"
    },
    {
      de: "ich komme",
      en: "i come",
      th: "ฉัน มา",
      phonetic: "chǎn maa",
      wordByWord: "Ich kommen"
    },
    {
      de: "ich sehe",
      en: "i see",
      th: "ฉัน เห็น",
      phonetic: "chǎn hěn",
      wordByWord: "Ich sehen"
    },
    {
      de: "ich verstehe",
      en: "i understand",
      th: "ฉัน เข้าใจ",
      phonetic: "chǎn khâo-jai",
      wordByWord: "Ich verstehen"
    },
    {
      de: "ich verstehe nicht",
      en: "i do not understand",
      th: "ฉัน ไม่ เข้าใจ",
      phonetic: "chǎn mâi khâo-jai",
      wordByWord: "Ich nicht verstehen"
    },
    {
      de: "ich spreche kein thai",
      en: "i do not speak thai",
      th: "ฉัน พูด ภาษา ไทย ไม่ ได้",
      phonetic: "chǎn phûut phaa-sǎa thai mâi dâi",
      wordByWord: "Ich sprechen Sprache Thai nicht können"
    },
    {
      de: "ich spreche ein wenig thai",
      en: "i speak a little thai",
      th: "ฉัน พูด ภาษา ไทย ได้ นิด หน่อย",
      phonetic: "chǎn phûut phaa-sǎa thai dâi nít nɔ̀i",
      wordByWord: "Ich sprechen Sprache Thai können wenig bisschen"
    },
    {
      de: "sprechen sie englisch",
      en: "do you speak english",
      th: "คุณ พูด ภาษา อังกฤษ ได้ ไหม",
      phonetic: "khun phûut phaa-sǎa ang-grìt dâi mǎi",
      wordByWord: "Sie sprechen Sprache Englisch können Frage"
    },
    {
      de: "bitte sprechen sie langsam",
      en: "please speak slowly",
      th: "กรุณา พูด ช้า ช้า",
      phonetic: "gà-rú-naa phûut cháa cháa",
      wordByWord: "Bitte sprechen langsam langsam"
    },
    {
      de: "ich warte",
      en: "i wait",
      th: "ฉัน รอ",
      phonetic: "chǎn rɔɔ",
      wordByWord: "Ich warten"
    },
    {
      de: "ich arbeite",
      en: "i work",
      th: "ฉัน ทำ งาน",
      phonetic: "chǎn tham ngaan",
      wordByWord: "Ich machen Arbeit"
    },
    {
      de: "ich schlafe",
      en: "i sleep",
      th: "ฉัน นอน",
      phonetic: "chǎn nɔɔn",
      wordByWord: "Ich schlafen"
    },

    // ==================== QUESTIONS / FRAGEN ====================
    {
      de: "was",
      en: "what",
      th: "อะไร",
      phonetic: "à-rai",
      wordByWord: "was"
    },
    {
      de: "wer",
      en: "who",
      th: "ใคร",
      phonetic: "khrai",
      wordByWord: "wer"
    },
    {
      de: "wann",
      en: "when",
      th: "เมื่อ ไหร่",
      phonetic: "mʉ̂a rài",
      wordByWord: "als wann"
    },
    {
      de: "warum",
      en: "why",
      th: "ทำไม",
      phonetic: "tham-mai",
      wordByWord: "warum"
    },
    {
      de: "wie",
      en: "how",
      th: "อย่าง ไร",
      phonetic: "yàang rai",
      wordByWord: "Art welche"
    },
    {
      de: "was ist das",
      en: "what is this",
      th: "นี่ คือ อะไร",
      phonetic: "nîi khʉʉ à-rai",
      wordByWord: "dies sein was"
    },

    // ==================== YES/NO / JA/NEIN ====================
    {
      de: "ja",
      en: "yes",
      th: "ใช่",
      phonetic: "châi",
      wordByWord: "ja"
    },
    {
      de: "nein",
      en: "no",
      th: "ไม่",
      phonetic: "mâi",
      wordByWord: "nein"
    },
    {
      de: "vielleicht",
      en: "maybe",
      th: "อาจ จะ",
      phonetic: "àat jà",
      wordByWord: "vielleicht werden"
    },
    {
      de: "richtig",
      en: "correct",
      th: "ถูก ต้อง",
      phonetic: "thùuk dtɔ̂ɔng",
      wordByWord: "richtig müssen"
    },

    // ==================== THAI FOOD DISHES / THAI GERICHTE ====================
    {
      de: "pad thai",
      en: "pad thai",
      th: "ผัด ไทย",
      phonetic: "phàt thai",
      wordByWord: "braten Thai"
    },
    {
      de: "tom yum suppe",
      en: "tom yum soup",
      th: "ต้ม ยำ",
      phonetic: "dtôm yam",
      wordByWord: "kochen mischen"
    },
    {
      de: "grünes curry",
      en: "green curry",
      th: "แกง เขียว หวาน",
      phonetic: "gɛɛng khǐao wǎan",
      wordByWord: "Curry grün süß"
    },
    {
      de: "rotes curry",
      en: "red curry",
      th: "แกง แดง",
      phonetic: "gɛɛng dɛɛng",
      wordByWord: "Curry rot"
    },
    {
      de: "papaya salat",
      en: "papaya salad",
      th: "ส้ม ตำ",
      phonetic: "sôm dtam",
      wordByWord: "sauer stampfen"
    },
    {
      de: "mango mit klebreis",
      en: "mango sticky rice",
      th: "ข้าว เหนียว มะม่วง",
      phonetic: "khâao nǐao má-mûang",
      wordByWord: "Reis klebrig Mango"
    },

    // ==================== ACCOMMODATION / UNTERKUNFT ====================
    {
      de: "ich möchte ein zimmer",
      en: "i want a room",
      th: "ฉัน อยาก ได้ ห้อง",
      phonetic: "chǎn yàak dâi hɔ̂ɔng",
      wordByWord: "Ich wollen bekommen Zimmer"
    },
    {
      de: "wie viel kostet eine nacht",
      en: "how much per night",
      th: "คืน ละ เท่า ไหร่",
      phonetic: "khʉʉn lá thâo rài",
      wordByWord: "Nacht je gleich wieviel"
    },
    {
      de: "haben sie freie zimmer",
      en: "do you have rooms available",
      th: "มี ห้อง ว่าง ไหม",
      phonetic: "mii hɔ̂ɔng wâang mǎi",
      wordByWord: "haben Zimmer frei Frage"
    },

    // ==================== DAYS OF WEEK / WOCHENTAGE ====================
    {
      de: "montag",
      en: "monday",
      th: "วัน จันทร์",
      phonetic: "wan jan",
      wordByWord: "Tag Montag"
    },
    {
      de: "dienstag",
      en: "tuesday",
      th: "วัน อังคาร",
      phonetic: "wan ang-khaan",
      wordByWord: "Tag Dienstag"
    },
    {
      de: "mittwoch",
      en: "wednesday",
      th: "วัน พุธ",
      phonetic: "wan phút",
      wordByWord: "Tag Mittwoch"
    },
    {
      de: "donnerstag",
      en: "thursday",
      th: "วัน พฤหัสบดี",
      phonetic: "wan phá-rʉ́-hàt-sà-bɔɔ-dii",
      wordByWord: "Tag Donnerstag"
    },
    {
      de: "freitag",
      en: "friday",
      th: "วัน ศุกร์",
      phonetic: "wan sùk",
      wordByWord: "Tag Freitag"
    },
    {
      de: "samstag",
      en: "saturday",
      th: "วัน เสาร์",
      phonetic: "wan sǎo",
      wordByWord: "Tag Samstag"
    },
    {
      de: "sonntag",
      en: "sunday",
      th: "วัน อาทิตย์",
      phonetic: "wan aa-thít",
      wordByWord: "Tag Sonntag"
    },

    // ==================== COLORS / FARBEN ====================
    {
      de: "rot",
      en: "red",
      th: "แดง",
      phonetic: "dɛɛng",
      wordByWord: "rot"
    },
    {
      de: "blau",
      en: "blue",
      th: "น้ำ เงิน",
      phonetic: "náam ngən",
      wordByWord: "Wasser Silber"
    },
    {
      de: "grün",
      en: "green",
      th: "เขียว",
      phonetic: "khǐao",
      wordByWord: "grün"
    },
    {
      de: "gelb",
      en: "yellow",
      th: "เหลือง",
      phonetic: "lʉ̌ang",
      wordByWord: "gelb"
    },
    {
      de: "weiß",
      en: "white",
      th: "ขาว",
      phonetic: "khǎao",
      wordByWord: "weiß"
    },
    {
      de: "schwarz",
      en: "black",
      th: "ดำ",
      phonetic: "dam",
      wordByWord: "schwarz"
    },

    // ==================== BODY / KÖRPER ====================
    {
      de: "kopf",
      en: "head",
      th: "หัว",
      phonetic: "hǔa",
      wordByWord: "Kopf"
    },
    {
      de: "auge",
      en: "eye",
      th: "ตา",
      phonetic: "dtaa",
      wordByWord: "Auge"
    },
    {
      de: "mund",
      en: "mouth",
      th: "ปาก",
      phonetic: "bpàak",
      wordByWord: "Mund"
    },
    {
      de: "hand",
      en: "hand",
      th: "มือ",
      phonetic: "mʉʉ",
      wordByWord: "Hand"
    },
    {
      de: "fuß",
      en: "foot",
      th: "เท้า",
      phonetic: "tháo",
      wordByWord: "Fuß"
    },

    // ==================== FAMILY / FAMILIE ====================
    {
      de: "mutter",
      en: "mother",
      th: "แม่",
      phonetic: "mɛ̂ɛ",
      wordByWord: "Mutter"
    },
    {
      de: "vater",
      en: "father",
      th: "พ่อ",
      phonetic: "phɔ̂ɔ",
      wordByWord: "Vater"
    },
    {
      de: "bruder",
      en: "brother",
      th: "พี่ ชาย",
      phonetic: "phîi chaai",
      wordByWord: "älter männlich"
    },
    {
      de: "schwester",
      en: "sister",
      th: "พี่ สาว",
      phonetic: "phîi sǎao",
      wordByWord: "älter weiblich"
    },
    {
      de: "kind",
      en: "child",
      th: "เด็ก",
      phonetic: "dèk",
      wordByWord: "Kind"
    },
    {
      de: "freund",
      en: "friend",
      th: "เพื่อน",
      phonetic: "phʉ̂an",
      wordByWord: "Freund"
    },

    // ==================== USEFUL PHRASES / NÜTZLICHE SÄTZE ====================
    {
      de: "ich weiß nicht",
      en: "i do not know",
      th: "ฉัน ไม่ รู้",
      phonetic: "chǎn mâi rúu",
      wordByWord: "Ich nicht wissen"
    },
    {
      de: "es ist schön",
      en: "it is beautiful",
      th: "สวย",
      phonetic: "sǔai",
      wordByWord: "schön"
    },
    {
      de: "thailand ist schön",
      en: "thailand is beautiful",
      th: "ประเทศ ไทย สวย",
      phonetic: "bprà-thêet thai sǔai",
      wordByWord: "Land Thai schön"
    },
    {
      de: "ich mag thailand",
      en: "i like thailand",
      th: "ฉัน ชอบ ประเทศ ไทย",
      phonetic: "chǎn chɔ̂ɔp bprà-thêet thai",
      wordByWord: "Ich mögen Land Thai"
    },
    {
      de: "ich bin tourist",
      en: "i am a tourist",
      th: "ฉัน เป็น นัก ท่อง เที่ยว",
      phonetic: "chǎn bpen nák thɔ̂ɔng thîao",
      wordByWord: "Ich sein Person durchstreifen reisen"
    },
    {
      de: "können sie mir helfen",
      en: "can you help me",
      th: "คุณ ช่วย ฉัน ได้ ไหม",
      phonetic: "khun chûai chǎn dâi mǎi",
      wordByWord: "Sie helfen Ich können Frage"
    },
    {
      de: "ich möchte das nicht",
      en: "i do not want this",
      th: "ฉัน ไม่ เอา",
      phonetic: "chǎn mâi ao",
      wordByWord: "Ich nicht nehmen"
    },
    {
      de: "noch einmal bitte",
      en: "one more time please",
      th: "อีก ครั้ง หนึ่ง",
      phonetic: "ìik khráng nʉ̀ng",
      wordByWord: "noch Mal eins"
    },
    {
      de: "was bedeutet das",
      en: "what does that mean",
      th: "นั่น แปล ว่า อะไร",
      phonetic: "nân bplɛɛ wâa à-rai",
      wordByWord: "das übersetzen sagen was"
    },
    {
      de: "wie sagt man",
      en: "how do you say",
      th: "พูด ว่า อย่างไร",
      phonetic: "phûut wâa yàang-rai",
      wordByWord: "sprechen sagen wie"
    }
  ],

  // ==================== SINGLE WORD LOOKUP TABLE ====================
  words: {
    // Pronouns
    "ich": { th: "ฉัน", phonetic: "chǎn", de: "Ich" },
    "i": { th: "ฉัน", phonetic: "chǎn", de: "Ich" },
    "du": { th: "คุณ", phonetic: "khun", de: "Du" },
    "you": { th: "คุณ", phonetic: "khun", de: "Du" },
    "er": { th: "เขา", phonetic: "khǎo", de: "Er" },
    "he": { th: "เขา", phonetic: "khǎo", de: "Er" },
    "sie": { th: "เธอ", phonetic: "thəə", de: "Sie" },
    "she": { th: "เธอ", phonetic: "thəə", de: "Sie" },
    "wir": { th: "เรา", phonetic: "rao", de: "Wir" },
    "we": { th: "เรา", phonetic: "rao", de: "Wir" },
    "sie_plural": { th: "พวก เขา", phonetic: "phûak khǎo", de: "Sie(Plural)" },
    "they": { th: "พวก เขา", phonetic: "phûak khǎo", de: "Sie(Plural)" },

    // Common verbs
    "sein": { th: "เป็น", phonetic: "bpen", de: "sein" },
    "be": { th: "เป็น", phonetic: "bpen", de: "sein" },
    "is": { th: "เป็น", phonetic: "bpen", de: "ist" },
    "am": { th: "เป็น", phonetic: "bpen", de: "bin" },
    "are": { th: "เป็น", phonetic: "bpen", de: "sind" },
    "haben": { th: "มี", phonetic: "mii", de: "haben" },
    "have": { th: "มี", phonetic: "mii", de: "haben" },
    "gehen": { th: "ไป", phonetic: "bpai", de: "gehen" },
    "go": { th: "ไป", phonetic: "bpai", de: "gehen" },
    "kommen": { th: "มา", phonetic: "maa", de: "kommen" },
    "come": { th: "มา", phonetic: "maa", de: "kommen" },
    "essen": { th: "กิน", phonetic: "gin", de: "essen" },
    "eat": { th: "กิน", phonetic: "gin", de: "essen" },
    "trinken": { th: "ดื่ม", phonetic: "dʉ̀ʉm", de: "trinken" },
    "drink": { th: "ดื่ม", phonetic: "dʉ̀ʉm", de: "trinken" },
    "sprechen": { th: "พูด", phonetic: "phûut", de: "sprechen" },
    "speak": { th: "พูด", phonetic: "phûut", de: "sprechen" },
    "sehen": { th: "เห็น", phonetic: "hěn", de: "sehen" },
    "see": { th: "เห็น", phonetic: "hěn", de: "sehen" },
    "wollen": { th: "อยาก", phonetic: "yàak", de: "wollen" },
    "want": { th: "อยาก", phonetic: "yàak", de: "wollen" },
    "können": { th: "ได้", phonetic: "dâi", de: "können" },
    "can": { th: "ได้", phonetic: "dâi", de: "können" },
    "wissen": { th: "รู้", phonetic: "rúu", de: "wissen" },
    "know": { th: "รู้", phonetic: "rúu", de: "wissen" },
    "lieben": { th: "รัก", phonetic: "rák", de: "lieben" },
    "love": { th: "รัก", phonetic: "rák", de: "lieben" },
    "kaufen": { th: "ซื้อ", phonetic: "sʉ́ʉ", de: "kaufen" },
    "buy": { th: "ซื้อ", phonetic: "sʉ́ʉ", de: "kaufen" },
    "lernen": { th: "เรียน", phonetic: "riian", de: "lernen" },
    "learn": { th: "เรียน", phonetic: "riian", de: "lernen" },
    "arbeiten": { th: "ทำ งาน", phonetic: "tham ngaan", de: "arbeiten" },
    "work": { th: "ทำ งาน", phonetic: "tham ngaan", de: "arbeiten" },
    "schlafen": { th: "นอน", phonetic: "nɔɔn", de: "schlafen" },
    "sleep": { th: "นอน", phonetic: "nɔɔn", de: "schlafen" },

    // Common nouns
    "haus": { th: "บ้าน", phonetic: "bâan", de: "Haus" },
    "house": { th: "บ้าน", phonetic: "bâan", de: "Haus" },
    "auto": { th: "รถ", phonetic: "rót", de: "Auto" },
    "car": { th: "รถ", phonetic: "rót", de: "Auto" },
    "mann": { th: "ผู้ชาย", phonetic: "phûu-chaai", de: "Mann" },
    "man": { th: "ผู้ชาย", phonetic: "phûu-chaai", de: "Mann" },
    "frau": { th: "ผู้หญิง", phonetic: "phûu-yǐng", de: "Frau" },
    "woman": { th: "ผู้หญิง", phonetic: "phûu-yǐng", de: "Frau" },
    "geld": { th: "เงิน", phonetic: "ngən", de: "Geld" },
    "money": { th: "เงิน", phonetic: "ngən", de: "Geld" },
    "land": { th: "ประเทศ", phonetic: "bprà-thêet", de: "Land" },
    "country": { th: "ประเทศ", phonetic: "bprà-thêet", de: "Land" },
    "stadt": { th: "เมือง", phonetic: "mʉang", de: "Stadt" },
    "city": { th: "เมือง", phonetic: "mʉang", de: "Stadt" },
    "straße": { th: "ถนน", phonetic: "thà-nǒn", de: "Straße" },
    "street": { th: "ถนน", phonetic: "thà-nǒn", de: "Straße" },
    "schule": { th: "โรงเรียน", phonetic: "roong-riian", de: "Schule" },
    "school": { th: "โรงเรียน", phonetic: "roong-riian", de: "Schule" },
    "telefon": { th: "โทรศัพท์", phonetic: "thoo-rá-sàp", de: "Telefon" },
    "phone": { th: "โทรศัพท์", phonetic: "thoo-rá-sàp", de: "Telefon" },
    "tag": { th: "วัน", phonetic: "wan", de: "Tag" },
    "day": { th: "วัน", phonetic: "wan", de: "Tag" },

    // Adjectives
    "gut": { th: "ดี", phonetic: "dii", de: "gut" },
    "good": { th: "ดี", phonetic: "dii", de: "gut" },
    "schlecht": { th: "ไม่ ดี", phonetic: "mâi dii", de: "schlecht" },
    "bad": { th: "ไม่ ดี", phonetic: "mâi dii", de: "schlecht" },
    "schön": { th: "สวย", phonetic: "sǔai", de: "schön" },
    "beautiful": { th: "สวย", phonetic: "sǔai", de: "schön" },
    "neu": { th: "ใหม่", phonetic: "mài", de: "neu" },
    "new": { th: "ใหม่", phonetic: "mài", de: "neu" },
    "alt": { th: "เก่า", phonetic: "gào", de: "alt" },
    "old": { th: "เก่า", phonetic: "gào", de: "alt" },
    "schnell": { th: "เร็ว", phonetic: "reo", de: "schnell" },
    "fast": { th: "เร็ว", phonetic: "reo", de: "schnell" },
    "langsam": { th: "ช้า", phonetic: "cháa", de: "langsam" },
    "slow": { th: "ช้า", phonetic: "cháa", de: "langsam" },

    // Misc
    "nicht": { th: "ไม่", phonetic: "mâi", de: "nicht" },
    "not": { th: "ไม่", phonetic: "mâi", de: "nicht" },
    "und": { th: "และ", phonetic: "lɛ́", de: "und" },
    "and": { th: "และ", phonetic: "lɛ́", de: "und" },
    "oder": { th: "หรือ", phonetic: "rʉ̌ʉ", de: "oder" },
    "or": { th: "หรือ", phonetic: "rʉ̌ʉ", de: "oder" },
    "mit": { th: "กับ", phonetic: "gàp", de: "mit" },
    "with": { th: "กับ", phonetic: "gàp", de: "mit" },
    "ohne": { th: "โดย ไม่", phonetic: "dooi mâi", de: "ohne" },
    "without": { th: "โดย ไม่", phonetic: "dooi mâi", de: "ohne" },
    "hier": { th: "ที่ นี่", phonetic: "thîi nîi", de: "hier" },
    "here": { th: "ที่ นี่", phonetic: "thîi nîi", de: "hier" },
    "dort": { th: "ที่ นั่น", phonetic: "thîi nân", de: "dort" },
    "there": { th: "ที่ นั่น", phonetic: "thîi nân", de: "dort" },
    "dies": { th: "นี่", phonetic: "nîi", de: "dies" },
    "this": { th: "นี่", phonetic: "nîi", de: "dies" },
    "das": { th: "นั่น", phonetic: "nân", de: "das" },
    "that": { th: "นั่น", phonetic: "nân", de: "das" },
    "thailand": { th: "ประเทศ ไทย", phonetic: "bprà-thêet thai", de: "Thailand" },
    "bangkok": { th: "กรุงเทพ", phonetic: "grung-thêep", de: "Bangkok" },
    "deutsch": { th: "เยอรมัน", phonetic: "yəə-rá-man", de: "Deutsch" },
    "german": { th: "เยอรมัน", phonetic: "yəə-rá-man", de: "Deutsch" },
    "englisch": { th: "อังกฤษ", phonetic: "ang-grìt", de: "Englisch" },
    "english": { th: "อังกฤษ", phonetic: "ang-grìt", de: "Englisch" },
    "thai": { th: "ไทย", phonetic: "thai", de: "Thai" },
    "sprache": { th: "ภาษา", phonetic: "phaa-sǎa", de: "Sprache" },
    "language": { th: "ภาษา", phonetic: "phaa-sǎa", de: "Sprache" }
  }
};

// Export for use in app
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DICTIONARY;
}
