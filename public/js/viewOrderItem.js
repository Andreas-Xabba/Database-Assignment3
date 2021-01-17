function initiateAddPartButton () { // eslint-disable-line
  const addPartButton = document.getElementById('addPartButton')
  const orderParts = document.getElementById('orderParts')
  const componentList = document.getElementById('componentList')
  const parts = document.getElementById('parts')

  addPartButton.addEventListener('click', (event) => {
    event.preventDefault()
    console.log(orderParts.value)
    componentList.innerHTML += `<tr><td>${orderParts.value}</td></tr>`
    parts.value += `${orderParts.value}|`
  })
}

function openOrder() { // eslint-disable-line
  console.log('open order')
}

function closeOrder() { // eslint-disable-line
  console.log('close order')
}
