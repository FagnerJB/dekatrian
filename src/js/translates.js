import { loadConfig } from './config'

const dekatrianNames = {
   days: ['Acronian', 'Sincronian'],
   months: [
      'Auroran',
      'Borean',
      'Coronian',
      'Driadan',
      'Electran',
      'Faian',
      'Gaian',
      'Helian',
      'Irisian',
      'Kaosian',
      'Lunan',
      'Maian',
      'Nixian',
   ],
}

const translates = {
   today: {
      en: 'Today',
      pt: 'Hoje',
      eo: 'Hodiaŭ',
   },
   of: {
      en: 'of',
      pt: 'de',
      eo: 'de',
   },
   settings: {
      en: 'Settings',
      pt: 'Configurações',
      eo: 'Konfiguraĵo',
   },
   weekdaysNames: {
      en: [
         'Sunday',
         'Monday',
         'Tuesday',
         'Wednesday',
         'Thursday',
         'Friday',
         'Saturday',
      ],
      pt: [
         'Domingo',
         'Segunda',
         'Terça',
         'Quarta',
         'Quinta',
         'Sexta',
         'Sábado',
      ],
      eo: [
         'Dimanĉo',
         'Lundo',
         'Mardo',
         'Merkredo',
         'Ĵaŭdo',
         'Vendredo',
         'Sabato',
      ],
   },
   gregorianMonths: {
      en: [
         'January',
         'February',
         'March',
         'April',
         'May',
         'June',
         'July',
         'August',
         'September',
         'October',
         'November',
         'December',
      ],
      pt: [
         'Janeiro',
         'Fevereiro',
         'Março',
         'Abril',
         'Maio',
         'Junho',
         'Julho',
         'Agosto',
         'Setembro',
         'Outubro',
         'Novembro',
         'Dezembro',
      ],
      eo: [
         'Januaro',
         'Februaro',
         'Marto',
         'Aprilo',
         'Majo',
         'Junio',
         'Julio',
         'Aŭgusto',
         'Septembro',
         'Oktobro',
         'Novembro',
         'Decembro',
      ],
   },
   firstDayOfTheWeek: {
      en: 'First day of the week',
      pt: 'Primeiro dia da semana',
      eo: 'Unua tago de la semajno',
   },
   flexible: {
      en: 'Flexible',
      pt: 'Flexível',
      eo: 'Fleksebla',
   },
   initialYear: {
      en: 'Initial year',
      pt: 'Ano inicial',
      eo: 'Komenca jaro',
   },
   commonEra: {
      en: 'Common Era',
      pt: 'Era Comum',
      eo: 'Nia erao',
   },
   holoceneEra: {
      en: 'Holocene Era',
      pt: 'Era Holocena',
      eo: 'Holocena erao',
   },
   language: {
      en: 'Language',
      pt: 'Idioma',
      eo: 'Lingvo',
   },
   addEvent: {
      en: 'Add event',
      pt: 'Adicionar evento',
      eo: 'Aldoni eventon.',
   },
   eventDisclaimer: {
      en: 'Events are only saved locally.',
      pt: 'Eventos são salvos apenas localmente.',
      eo: 'Eventoj nur estas savita loke.',
   },
   // today: {
   //    en: ,
   //    pt: ,
   //    eo: ,
   // },
   // today: {
   //    en: ,
   //    pt: ,
   //    eo: ,
   // },
   // today: {
   //    en: ,
   //    pt: ,
   //    eo: ,
   // },
   // today: {
   //    en: ,
   //    pt: ,
   //    eo: ,
   // },
   // today: {
   //    en: ,
   //    pt: ,
   //    eo: ,
   // },
   // today: {
   //    en: ,
   //    pt: ,
   //    eo: ,
   // },
   // today: {
   //    en: ,
   //    pt: ,
   //    eo: ,
   // },
}

translates.sunday = {
   en: translates.weekdaysNames.en[0],
   pt: translates.weekdaysNames.pt[0],
   eo: translates.weekdaysNames.eo[0],
}
translates.monday = {
   en: translates.weekdaysNames.en[1],
   pt: translates.weekdaysNames.pt[1],
   eo: translates.weekdaysNames.eo[1],
}

export const getDekatrianNames = (key, value) => {
   return dekatrianNames[key][value]
}

export const getTranslate = (key, lang, value = -1) => {
   if (value > -1) {
      return translates[key][lang][value]
   } else {
      return translates[key][lang]
   }
}

export const doTranslate = () => {
   const lang = loadConfig('language')
   document.querySelectorAll('[data-translate]').forEach((element) => {
      if (
         element.dataset.translate &&
         translates[element.dataset.translate][lang]
      )
         element.textContent = translates[element.dataset.translate][lang]
   })

   const listGregorianMonths = document.querySelector(
      'select[name="gregorian-month"]'
   )

   translates.gregorianMonths[lang].map((month, index) => {
      const option = document.createElement('option')
      option.value = index
      option.appendChild(document.createTextNode(month))
      listGregorianMonths.appendChild(option)
   })

   const listDekatrianMonths = document.querySelector(
      'select[name="dekatrian-month"]'
   )

   dekatrianNames.months.map((month, index) => {
      const option = document.createElement('option')
      option.value = index
      option.appendChild(document.createTextNode(month))
      listDekatrianMonths.appendChild(option)
   })

   dekatrianNames.days.map((day) => {
      const option = document.createElement('option')
      option.className = 'text-right'
      option.value = day.slice(0, 1)
      option.appendChild(document.createTextNode(day))
      listDekatrianMonths.appendChild(option)
   })
}
