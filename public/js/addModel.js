function setupComponentButton () { //eslint-disable-line
  const addComponentButton = document.getElementById('addComponentButton')
  const modelComponent = document.getElementById('modelComponent')
  const componentList = document.getElementById('componentList')

  addComponentButton.addEventListener('click', (event) => {
    event.preventDefault()
    componentList.value += `${modelComponent.value}|`
    console.log(componentList.value)
  })
}
