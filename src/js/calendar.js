import { loadConfig } from './config'
import { getTranslate, getDekatrianNames } from './translates'

const daysPerGregorianMonthGlobal = [
   31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
]

const convertGregorianToDekatrian = (date) => {
   const { year, month, day } = date
   let daysPerGregorianMonth = JSON.parse(
      JSON.stringify(daysPerGregorianMonthGlobal)
   )
   let convertedMonth = 0
   let convertedDay = 0
   let daysFromStart = -1

   if (month === 0) {
      if (1 === day || (2 === day && isLeapYear(year))) {
         return {
            year: year - 1,
            month: -1,
            day: day,
         }
      }
   }

   if (isLeapYear(year)) {
      daysPerGregorianMonth[1] = 29
      daysFromStart -= 1
   }

   daysPerGregorianMonth.some((daysInMonth, index) => {
      if (index === month) {
         daysFromStart += day
         return true
      }
      daysFromStart += daysInMonth
      return false
   })

   while (daysFromStart > 28) {
      if (daysFromStart <= 0) {
         break
      }
      daysFromStart -= 28
      convertedMonth++
   }

   convertedDay = daysFromStart

   return {
      year,
      month: convertedMonth,
      day: convertedDay,
   }
}

const convertDekatrianToGregorian = (year, month, day) => {
   let daysPerGregorianMonth = JSON.parse(
      JSON.stringify(daysPerGregorianMonthGlobal)
   )
   let convertedMonth = 0
   let convertedDay = 0
   let daysFromStart = 1

   if (isLeapYear(year)) {
      daysPerGregorianMonth[1] = 29
      daysFromStart += 1
   }

   if (!Number.isInteger(day)) {
      if (day === 'A') {
         convertedDay = 1
      } else if (day === 'S') {
         convertedDay = 2
      }
   } else {
      daysFromStart += month * 28
      daysFromStart += day

      daysPerGregorianMonth.some((daysInMonth, index) => {
         daysFromStart -= daysInMonth
         if (daysFromStart <= 0) {
            convertedMonth = index
            convertedDay = daysInMonth + daysFromStart
            return true
         }
         return false
      })
   }

   return {
      year,
      month: convertedMonth,
      day: convertedDay,
   }
}

const getDayLines = (year, month, day) => {
   const gregorianDate = convertDekatrianToGregorian(year, month, day)
   const events = JSON.parse(localStorage.getItem('fjb-dekatrian-events'))
   const lang = loadConfig('language')
   let lines = []

   if (loadConfig('showGregorian') === 'yes') {
      const gregorianDay = gregorianDate.day
      const gregorianOf = getTranslate('of', lang)
      const gregorianMonth = getTranslate(
         'gregorianMonths',
         lang,
         gregorianDate.month
      )
      lines.push({
         name: `${gregorianDay} ${gregorianOf} ${gregorianMonth}`,
         type: 'standard',
      })
   }

   if (!events) return lines

   if (!!events.gregorian) {
      for (const key in events.gregorian) {
         if (
            'monthly' === key &&
            events.gregorian.monthly.hasOwnProperty(gregorianDate.day)
         ) {
            lines = lines.concat(
               events.gregorian.monthly[gregorianDate.day]
                  .filter(
                     (event) =>
                        !event.year ||
                        (!!event.year && gregorianDate.year === event.year)
                  )
                  .map((event, index) => {
                     return {
                        ...event,
                        id: index,
                        day: gregorianDate.day,
                        type: 'gregorian',
                        repeat: 'monthly',
                     }
                  })
            )
         } else {
            if (
               key == gregorianDate.month &&
               events.gregorian.hasOwnProperty(gregorianDate.month) &&
               events.gregorian[gregorianDate.month].hasOwnProperty(
                  gregorianDate.day
               )
            ) {
               lines = lines.concat(
                  events.gregorian[gregorianDate.month][gregorianDate.day]
                     .filter(
                        (event) =>
                           !event.year ||
                           (!!event.year && gregorianDate.year === event.year)
                     )
                     .map((event, index) => {
                        return {
                           ...event,
                           id: index,
                           day: gregorianDate.day,
                           month: gregorianDate.month,
                           type: 'gregorian',
                           repeat: 'anual',
                        }
                     })
               )
            }
         }
      }
   }

   if (!!events.dekatrian) {
      for (const key in events.dekatrian) {
         if ('monthly' === key) {
            if (events.dekatrian.monthly.hasOwnProperty(day)) {
               lines = lines.concat(
                  events.dekatrian.monthly[day].map((event, index) => {
                     return {
                        ...event,
                        id: index,
                        day,
                        type: 'dekatrian',
                        repeat: 'monthly',
                     }
                  })
               )
            }
         } else {
            if (events.dekatrian.hasOwnProperty(month)) {
               if (events.dekatrian[month].hasOwnProperty(day)) {
                  lines = lines.concat(
                     events.dekatrian[month][day].map((event, index) => {
                        return {
                           ...event,
                           id: index,
                           day,
                           month,
                           type: 'dekatrian',
                           repeat: 'anual',
                        }
                     })
                  )
               }
            }
         }
      }
   }

   return lines
}

const removeEvent = (event) => {
   let currentEvents = JSON.parse(localStorage.getItem('fjb-dekatrian-events'))
   const key = event.repeat === 'monthly' ? 'monthly' : event.month

   currentEvents[event.type][key][event.day].splice(event.id, 1)

   localStorage.setItem('fjb-dekatrian-events', JSON.stringify(currentEvents))

   renderCalendar()
}

const isLeapYear = (year) =>
   (year % 4 == 0 && year % 100 != 0) || year % 400 == 0

const renderWeek = (year) => {
   const lang = loadConfig('language')
   const firstWeekday = loadConfig('firstDayOfWeek')
   const week = document.getElementById('week')
   week.textContent = ''

   let firstWeekdayOfTheYear = new Date(year, 0, 1).getDay()
   let daysNames = JSON.parse(
      JSON.stringify(getTranslate('weekdaysNames', lang))
   )

   if (firstWeekday === 'flex') {
      firstWeekdayOfTheYear += 1
      if (isLeapYear(year)) {
         firstWeekdayOfTheYear += 1
      }
      while (firstWeekdayOfTheYear > 0) {
         daysNames.push(daysNames[0])
         daysNames.splice(0, 1)
         firstWeekdayOfTheYear--
      }
   } else if (firstWeekday === 'monday') {
      daysNames.push(daysNames[0])
      daysNames.splice(0, 1)
   }

   daysNames.map((dayName) => {
      renderWeekDay(week, dayName.slice(0, 3), {
         dayClass: 'bg-gray-500 text-center',
         titleClass: 'text-white font-semibold uppercase text-sm',
      })
   })
}

const renderWeekDay = (node, name, classes) => {
   let { dayClass, titleClass } = classes

   const dayCell = document.createElement('div')
   dayCell.className = 'py-1 border ' + dayClass

   const title = document.createElement('h3')
   title.className = 'inline-block ' + titleClass
   title.appendChild(document.createTextNode(name))

   dayCell.appendChild(title)

   node.appendChild(dayCell)
}

const startOfTheMonth = (year, month) => {
   const firstWeekday = loadConfig('firstDayOfWeek')
   let firstWeekdayOfTheYear = new Date(year, 0, 1).getDay()
   let day = 1

   if (firstWeekday === 'flex') {
      if (0 === month) {
         day = 23
         if (isLeapYear(year)) {
            day = 24
         }
      }
   } else {
      if (firstWeekdayOfTheYear === 6) {
         if (isLeapYear(year)) {
            day = 28
         }
      } else {
         day = 28 - firstWeekdayOfTheYear
         if (isLeapYear(year)) {
            day -= 1
         }
      }

      if (0 === month) {
         if (firstWeekdayOfTheYear === 0) {
            day = 0
            if (isLeapYear(year)) {
               day -= 1
            }
         } else if (firstWeekdayOfTheYear === 6) {
            day = 23
         } else {
            day += 1
            if (isLeapYear(year)) {
               day += 1
            }
         }
      }
   }

   if (firstWeekday === 'monday') {
      if (isLeapYear(year) && 0 === month) {
         if (day === 28) {
            day = -1
         } else if (day === -1) {
            day = 23
         } else if (day !== 27) {
            day += 2
         }
      } else {
         if (day === 28) {
            day = 1
         } else if (day === 1 || day === 0) {
            day = 23
         } else if (day > 0) {
            day += 1
         }
      }
   }

   return {
      day,
   }
}

const renderDay = (node, date, classes, lines = []) => {
   const today = JSON.parse(localStorage.getItem('fjb-dekatrian-today'))

   let { year, month, day, spot } = date
   let { dayClass, titleClass } = classes
   let type
   if (classes.type) {
      type = classes.type
   }

   const dayCell = document.createElement('div')
   dayCell.className =
      'h-full overflow-hidden py-1 px-1 md:px-2 border border-t-0 '
   if (spot % 7 !== 0) {
      dayCell.className += 'border-r-0 '
   }

   const title = document.createElement('h4')
   title.appendChild(document.createTextNode(day))
   title.className =
      titleClass + ' inline-block rounded-full p-1 h-7 aspect-square '
   dayCell.className += dayClass

   if (month === -1) {
      year -= 1
   }

   if (year === today.year && month === today.month && day === today.day) {
      title.className += 'bg-blue-700 text-white '
   } else if (type === 'holiday') {
      title.className += 'bg-red-500 text-white '
   } else {
      title.className += 'text-gray-500 '
   }

   dayCell.appendChild(title)

   lines = lines.concat(getDayLines(year, month, day))

   const calendarColors = {
      standard: 'bg-teal-100',
      gregorian: 'bg-blue-100',
      dekatrian: 'bg-orange-100',
   }

   lines.map((event) => {
      const line = document.createElement('div')
      line.className =
         'mt-1 py-1 px-2 rounded text-xs text-left text-black ' +
         calendarColors[event.type]

      if ('standard' !== event.type) {
         const close = document.createElement('i')
         close.className = 'fa-solid fa-xmark float-right cursor-pointer'
         close.addEventListener('click', () => removeEvent(event))
         line.appendChild(close)
      }

      line.appendChild(document.createTextNode(event.name))
      dayCell.appendChild(line)
   })

   node.appendChild(dayCell)
}

const getToday = () => {
   let todayGregorian = new Date()

   const todayDekatrian = convertGregorianToDekatrian({
      year: todayGregorian.getFullYear(),
      month: todayGregorian.getMonth(),
      day: todayGregorian.getDate(),
   })

   localStorage.setItem('fjb-dekatrian-today', JSON.stringify(todayDekatrian))

   return todayDekatrian
}

export const renderCalendar = (year = null, month = null) => {
   const savedTodayDekatrian = getToday()
   if (!year && !month) {
      if (location.hash) {
         const dateHash = location.hash.slice(1).split('-')
         year = Number(dateHash[0])
         month = Number(dateHash[1]) - 1
      } else {
         year = savedTodayDekatrian.year
         month = savedTodayDekatrian.month
      }
   }

   localStorage.setItem(
      'fjb-dekatrian-current-month',
      JSON.stringify({
         year,
         month,
      })
   )

   const firstYear = loadConfig('firstYear')
   const calendar = document.getElementById('calendar')

   calendar.textContent = ''

   document.getElementById('currentYear').textContent =
      firstYear === 'human' ? 10000 + year : year
   document.getElementById('currentMonth').textContent = getDekatrianNames(
      'months',
      month
   )

   renderWeek(year)

   let spot = 1
   let { day } = startOfTheMonth(year, month)

   while (day <= 28 && spot <= 35) {
      let flexYear = year
      let flexMonth = month

      if (spot <= 7 && day >= 22) flexMonth -= 1
      else if (spot > 28 && day <= 7) flexMonth += 1

      if (flexMonth === -1) {
         flexMonth = 12
         flexYear -= 1
      } else if (flexMonth === 13) {
         flexMonth = 0
         flexYear += 1
      }

      if (flexMonth === 0 && day < 1) {
         if ((day === 0 && !isLeapYear(flexYear)) || day === -1) {
            renderDay(
               calendar,
               {
                  year: flexYear,
                  month: flexMonth,
                  day: getDekatrianNames('days', 0).slice(0, 1),
                  spot,
               },
               {
                  dayClass:
                     'text-center bg-indigo-200 opacity-50 hover:opacity-100',
                  titleClass: 'font-number font-bold uppercase text-sm ',
                  type: 'holiday',
               },
               [{ name: getDekatrianNames('days', 0), type: 'standard' }]
            )
         }
         if (day === 0 && isLeapYear(flexYear)) {
            renderDay(
               calendar,
               {
                  year: flexYear,
                  month: flexMonth,
                  day: getDekatrianNames('days', 1).slice(0, 1),
                  spot,
               },
               {
                  dayClass:
                     'text-center bg-indigo-200 opacity-50 hover:opacity-100',
                  titleClass: 'font-number font-bold uppercase text-sm',
                  type: 'holiday',
               },
               [{ name: getDekatrianNames('days', 1), type: 'standard' }]
            )
         }
      } else {
         renderDay(
            calendar,
            { year: flexYear, month: flexMonth, day, spot },
            {
               dayClass:
                  'text-center' +
                  (year !== flexYear || month !== flexMonth
                     ? ' opacity-50 hover:opacity-100'
                     : ''),
               titleClass: 'font-number font-bold uppercase text-sm',
            }
         )
      }

      day++
      spot++

      if (29 === day && 12 === flexMonth) {
         day = 0
         if (isLeapYear(flexYear + 1)) {
            day = -1
         }
      }
      if (29 === day) {
         day = 1
      }
   }
}
