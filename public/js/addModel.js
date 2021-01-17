function setupComponentButton () { //eslint-disable-line
  const addComponentButton = document.getElementById('addComponentButton')
  const modelComponent = document.getElementById('modelComponent')
  const componentList = document.getElementById('componentList')
  const partsList = document.getElementById('partsList')

  addComponentButton.addEventListener('click', (event) => {
    event.preventDefault()
    componentList.value += `${modelComponent.value}|`
    partsList.innerHTML += `<li>${modelComponent.value}</li>`
    console.log(modelComponent.value)
  })
}
