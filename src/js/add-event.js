export const saveEvent = (e) => {
   e.preventDefault()

   const eventData = new FormData(e.currentTarget)
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

   const calendar = eventData.get('calendar-base')
   let month = Number(eventData.get(`${calendar}-month`))
   let day = Number(eventData.get(`${calendar}-day`))
   let repeat = eventData.get('event-repeat')

   if (['A', 'S'].includes(month)) {
      repeat = 'anual'
      day = month
      month = 0
   }

   if (repeat === 'monthly') {
      if (!currentEvents[calendar].hasOwnProperty('monthly'))
         currentEvents[calendar].monthly = {}

      if (!currentEvents[calendar].monthly.hasOwnProperty(day))
         currentEvents[calendar].monthly[day] = []

      currentEvents[calendar].monthly[day].push({
         name: eventData.get('event-name'),
      })
   } else if (repeat === 'anual') {
      if (!currentEvents[calendar].hasOwnProperty(month))
         currentEvents[calendar][month] = {}

      if (!currentEvents[calendar][month].hasOwnProperty(day))
         currentEvents[calendar][month][day] = []

      currentEvents[calendar][month][day].push({
         name: eventData.get('event-name'),
      })
   }

   localStorage.setItem('fjb-dekatrian-events', JSON.stringify(currentEvents))

   e.currentTarget.reset()
}
