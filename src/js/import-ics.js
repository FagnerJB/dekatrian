import icsToJson from 'ics-to-json'

const convertIcs = (rawFile) => {
   let currentEvents = localStorage.getItem('fjb-dekatrian-events')

   if (!currentEvents) {
      currentEvents = {
         gregorian: {},
         dekatrian: {},
         imports: [],
      }
   } else {
      currentEvents = JSON.parse(currentEvents)
   }

   const events = icsToJson(rawFile)
   const nowHash = new Date().getTime()

   events.map((event) => {
      const month = Number(event.startDate.slice(4, 6)) - 1
      const day = Number(event.startDate.slice(6, 8))

      if (!currentEvents.gregorian.hasOwnProperty(month))
         currentEvents.gregorian[month] = {}

      if (!currentEvents.gregorian[month].hasOwnProperty(day))
         currentEvents.gregorian[month][day] = []

      currentEvents.gregorian[month][day].push({
         name: event.summary,
         year: Number(event.startDate.slice(0, 4)),
         import: nowHash,
      })
   })

   currentEvents.imports.push({
      count: events.length,
      import: nowHash,
   })

   localStorage.setItem('fjb-dekatrian-events', JSON.stringify(currentEvents))
}

export const importIcs = (files) => {
   return new Promise((resolve, reject) => {
      if (!files.length) {
         reject()
      }

      const reader = new FileReader()
      reader.onload = (e) => resolve(convertIcs(e.target.result))
      reader.onerror = reject
      reader.readAsText(files[0])
   })
}
