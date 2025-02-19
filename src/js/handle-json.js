export const preExportJSON = () => {
   let events = localStorage.getItem('fjb-dekatrian-events')
   if (!events) {
      return
   }

   let dataUri =
      'data:application/json;charset=utf-8,' + encodeURIComponent(events)

   document.querySelector('#btn-export-json').setAttribute('href', dataUri)
}

const importJSONFile = (file) => {
   let newEvents = JSON.parse(file)

   if (!newEvents.gregorian || !newEvents.dekatrian || !newEvents.imports) {
      return
   }

   let events = localStorage.getItem('fjb-dekatrian-events')

   if (!events) {
      events = {
         gregorian: {},
         dekatrian: {},
         imports: [],
      }
   } else {
      events = JSON.parse(events)
   }

   const eventsJoined = {
      gregorian: { ...newEvents.gregorian, ...events.gregorian },
      dekatrian: { ...newEvents.dekatrian, ...events.dekatrian },
      imports: [...newEvents.imports, ...events.imports],
   }

   localStorage.setItem('fjb-dekatrian-events', JSON.stringify(eventsJoined))
}

export const importJSON = (files) => {
   return new Promise((resolve, reject) => {
      if (!files.length) {
         reject()
      }
      const reader = new FileReader()
      reader.onload = (e) => resolve(importJSONFile(e.target.result))
      reader.onerror = reject
      reader.readAsText(files[0])
   })
}
