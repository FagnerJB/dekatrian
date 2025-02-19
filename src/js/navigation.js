export const changeMonth = (goForward) => {
   let { year, month } = JSON.parse(
      localStorage.getItem('fjb-dekatrian-current-month')
   )

   if (goForward && month === 12) {
      month = 0
      year++
   } else if (!goForward && month === 0) {
      month = 12
      year--
   } else if (goForward) {
      month++
   } else {
      month--
   }

   location.hash = `${year}-${month + 1}`
}

export const goToMonth = (month) => {
   const { year } = JSON.parse(
      localStorage.getItem('fjb-dekatrian-current-month')
   )

   location.hash = `${year}-${month + 1}`
}
