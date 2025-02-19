import { loadConfig } from './config'
import { doTranslate } from './translates'
import { changeMonth } from './navigation'
import { renderCalendar } from './calendar'
import { saveEvent } from './add-event'
import { importIcs } from './import-ics'
import { preExportJSON, importJSON } from './handle-json'

const doAction = (action) => {
   const actions = {
      goToToday: () => {
         const { year, month } = JSON.parse(
            localStorage.getItem('fjb-dekatrian-today')
         )

         location.hash = `${year}-${month + 1}`
      },
      prevMonth: () => changeMonth(false),
      nextMonth: () => changeMonth(true),
      openAddEvent: () =>
         document.getElementById('add-event').classList.remove('hidden'),
      closeAddEvent: () =>
         document.getElementById('add-event').classList.add('hidden'),
      openConfig: () => {
         preExportJSON()
         document.getElementById('config').classList.remove('hidden')
      },
      closeConfig: () =>
         document.getElementById('config').classList.add('hidden'),
   }

   actions[action]()
}

document.querySelectorAll('[data-action]').forEach((element) => {
   element.addEventListener('click', (e) => {
      doAction(e.currentTarget.dataset.action)
   })
})

const changeConfig = (e) => {
   const { name, value } = e.currentTarget
   let currentConfigs = JSON.parse(localStorage.getItem('fjb-dekatrian-config'))
   currentConfigs[name] = value

   localStorage.setItem('fjb-dekatrian-config', JSON.stringify(currentConfigs))

   doTranslate()
   renderCalendar()
}

document.querySelectorAll('.config').forEach((element) => {
   element.addEventListener('change', changeConfig)
})

document.addEventListener('keyup', (e) => {
   if (
      !document.getElementById('add-event').classList.contains('hidden') ||
      !document.getElementById('config').classList.contains('hidden')
   ) {
      return
   }

   const triggers = {
      ArrowLeft: () => doAction('prevMonth'),
      ArrowRight: () => doAction('nextMonth'),
   }

   if (!triggers[e.key]) {
      return
   }

   triggers[e.key]()
})

document.getElementById('add-date-form').addEventListener('submit', (e) => {
   saveEvent(e)
   doAction('closeAddEvent')
   renderCalendar()
})

document.querySelectorAll('input[name="calendar-base"]').forEach((element) => {
   element.addEventListener('change', (e) => {
      const calendar = e.currentTarget.value

      document.querySelectorAll('.calendar-option').forEach((element) => {
         if (!element.classList.contains('hidden'))
            element.classList.add('hidden')
      })

      document.querySelectorAll('.event-input').forEach((element) => {
         element.required = false
      })

      document.querySelector(`[name="${calendar}-day"]`).required = true
      document.querySelector(`[name="${calendar}-month"]`).required = true

      document.getElementById(`${calendar}-calendar`).classList.remove('hidden')
   })
})

document.getElementById('import-ics').addEventListener('change', (e) => {
   e.preventDefault()
   importIcs(e.target.files).then(() => renderCalendar())
})

document.getElementById('import-json').addEventListener('change', (e) => {
   e.preventDefault()
   importJSON(e.target.files).then(() => renderCalendar())
})

window.addEventListener('hashchange', () => {
   renderCalendar()
})

loadConfig()
doTranslate()
renderCalendar()
