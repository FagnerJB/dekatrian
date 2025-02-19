export const loadConfig = (key = '') => {
   let currentConfigs = localStorage.getItem('fjb-dekatrian-config')
   if (!!currentConfigs) {
      currentConfigs = JSON.parse(currentConfigs)
   } else {
      currentConfigs = {
         firstDayOfWeek: 'flex',
         firstYear: 'human',
         language: 'en',
         showGregorian: 'yes',
      }
      localStorage.setItem(
         'fjb-dekatrian-config',
         JSON.stringify(currentConfigs)
      )
   }

   if (key) {
      return currentConfigs[key]
   }

   Object.entries(currentConfigs).forEach(([key, value]) => {
      document.querySelector(
         `input[name="${key}"][value="${value}"]`
      ).checked = true
   })
}
