// https://api.teleport.org/api/urban_areas
// Endpoints for available cities.

const searchForm = document.querySelector('#city-search-form')

const topContainer = document.querySelector('#top-container')
const citiesContainer = document.querySelector('#cities-container')
const cityTray = document.querySelector('#city-tray')
const tokenContainer = document.querySelector('#tray-array')
const randomizerButton = document.querySelector('#randomize')
const trayToggleButton = document.querySelector('#tray-toggle')

let trayToggled = false
let tokenAdded = false
let cityLink = ''

// REFACTORING IDEAS
// Function to fetch x3 and bundle data into city object

// Function to render a city, called by:
// Render city on pageload
// Render city from search submit
// Render city from token click

// Function to create token from currently displayed city

searchForm.addEventListener('submit', (e) => {
  e.preventDefault()
  if (document.querySelector('#save-button')) {
    const oldSaveButton = document.querySelector('#save-button')
    oldSaveButton.remove()
  }

  citiesContainer.innerHTML = ''
  const cityCard = document.createElement('div')
  cityCard.id = 'city-card'

  const cityName = document.createElement('h3')
  const saveButton = document.createElement('button')
  saveButton.id = 'save-button'
  saveButton.className = 'header-button'
  saveButton.innerText = 'Save City'
  if (!document.getElementById('save-button')) {
    cityCard.appendChild(saveButton)
  }
  const cityScore = document.createElement('span')
  const cumulativeMeter = document.createElement('meter')

  const cityImageContainer = document.createElement('div')
  const cityImage = document.createElement('img')
  const cityDescription = document.createElement('span')
  cityImageContainer.id = 'city-image-container'
  cityImage.id = 'city-image'
  cityImageContainer.append(cityDescription, cityImage)

  const scoreList = document.createElement('ul')

  cityCard.append(
    cityName,
    cityScore,
    cumulativeMeter,
    cityImageContainer,
    scoreList
  )

  citiesContainer.append(cityCard)

  let searchString = e.target['city-search'].value
    .split(' ')
    .join('-')
    .toLowerCase()
  fetch(`https://api.teleport.org/api/urban_areas/slug:${searchString}/`)
    .then((r) => r.json())
    .then((data) => {
      cityName.textContent = data.name
      cityLink = `https://api.teleport.org/api/urban_areas/slug:${searchString}/`
    })

  fetch(`https://api.teleport.org/api/urban_areas/slug:${searchString}/scores`)
    .then((r) => r.json())
    .then((scoresData) => {
      cityScore.textContent = `Teleport Total Score: ${Math.floor(scoresData.teleport_city_score)}`
      cumulativeMeter.id = cumulativeMeter
      cumulativeMeter.min = 0
      cumulativeMeter.max = 100
      cumulativeMeter.low = 40
      cumulativeMeter.high = 60
      cumulativeMeter.optimum = 80
      cumulativeMeter.value = Math.floor(scoresData.teleport_city_score)
      scoresData.categories.forEach((category) => {
        const li = document.createElement('li')
        li.textContent = `${category.name}: ${Math.floor(
          category.score_out_of_10
        )}`

        const categoryMeters = document.createElement('meter')
        categoryMeters.id = category.score_out_of_10
        categoryMeters.min = 0
        categoryMeters.max = 10
        categoryMeters.low = 4
        categoryMeters.high = 6
        categoryMeters.optimum = 8
        categoryMeters.value = `${Math.floor(category.score_out_of_10)}`

        scoreList.append(li, categoryMeters)

        cityDescription.innerHTML = scoresData.summary
        cityDescription.style.visibility = 'hidden'
      })
    })

  fetch(`https://api.teleport.org/api/urban_areas/slug:${searchString}/images`)
    .then((r) => r.json())
    .then((imgData) => {
      cityImage.src = imgData.photos[0].image.web
      cityDescription.style.position = 'absolute'
    })

  cityImageContainer.addEventListener('mouseover', () => {
    cityImage.style.opacity = '0.15'
    cityDescription.style.visibility = 'visible'
  })

  cityImageContainer.addEventListener('mouseleave', () => {
    cityImage.style.opacity = '1'
    cityDescription.style.visibility = 'hidden'
  })

  saveButton.addEventListener('click', () => {
    if (!tokenAdded) {
      saveButton.remove()
      cityTray.style.height = '150px'
      const cityToken = document.createElement('div')
      cityToken.className = 'city-token'
      cityToken.id = cityLink
      const tokenOverlay = document.createElement('div')
      tokenOverlay.id = 'token-overlay'
      tokenOverlay.textContent = cityName.textContent
      cityToken.appendChild(tokenOverlay)
      cityToken.style.backgroundImage = `url(${cityImage.src})`
      tokenContainer.append(cityToken)
      trayToggleHandler()

      cityToken.addEventListener('click', () => {
        // if (cityTray.childElementCount <= 1) {
        //   cityTray.style.height = '0px'
        // }

        // cityToken.remove()
        // console.log(tokenAdded)

        citiesContainer.innerHTML = ''
        const cityCard = document.createElement('div')
        cityCard.id = 'city-card'

        const cityName = document.createElement('h3')
        cityName.id = cityName
        const saveButton = document.createElement('button')
        saveButton.id = 'save-button'
        saveButton.className = 'header-button'
        saveButton.innerText = 'Save City'
        if (!document.getElementById('save-button')) {
          cityCard.appendChild(saveButton)
        }

        const cityScore = document.createElement('span')
        const cumulativeMeter = document.createElement('meter')

        const cityImageContainer = document.createElement('div')
        const cityImage = document.createElement('img')
        const cityDescription = document.createElement('span')
        cityImageContainer.id = 'city-image-container'
        cityImage.id = 'city-image'
        cityImageContainer.append(cityDescription, cityImage)

        const scoreList = document.createElement('ul')

        cityCard.append(
          cityName,
          cityScore,
          cumulativeMeter,
          cityImageContainer,
          scoreList
        )

        citiesContainer.append(cityCard)

        cityImageContainer.addEventListener('mouseover', () => {
          cityImage.style.opacity = '0.15'
          cityDescription.style.visibility = 'visible'
        })
      
        cityImageContainer.addEventListener('mouseleave', () => {
          cityImage.style.opacity = '1'
          cityDescription.style.visibility = 'hidden'
        })

        fetch(`${cityToken.id}`)
          .then((r) => r.json())
          .then((tokenCity) => {
            cityName.textContent = tokenCity.name

            fetch(`${cityToken.id}scores`)
              .then((r) => r.json())
              .then((scoresData) => {
                cityScore.textContent = `Teleport Total Score: ${Math.floor(scoresData.teleport_city_score)}`
                cumulativeMeter.id = cumulativeMeter
                cumulativeMeter.min = 0
                cumulativeMeter.max = 100
                cumulativeMeter.low = 40
                cumulativeMeter.high = 60
                cumulativeMeter.optimum = 80
                cumulativeMeter.value = Math.floor(
                  scoresData.teleport_city_score
                )
                scoresData.categories.forEach((category) => {
                  const li = document.createElement('li')
                  li.textContent = `${category.name}: ${Math.floor(
                    category.score_out_of_10
                  )}`

                  const categoryMeters = document.createElement('meter')
                  categoryMeters.id = category.score_out_of_10
                  categoryMeters.min = 0
                  categoryMeters.max = 10
                  categoryMeters.low = 4
                  categoryMeters.high = 6
                  categoryMeters.optimum = 8
                  categoryMeters.value = `${Math.floor(
                    category.score_out_of_10
                  )}`

                  scoreList.append(li, categoryMeters)

                  cityDescription.innerHTML = scoresData.summary
                  cityDescription.style.visibility = 'hidden'
                })
              })

            fetch(`${cityToken.id}images`)
              .then((r) => r.json())
              .then((imgData) => {
                cityImage.src = imgData.photos[0].image.web
                cityDescription.style.position = 'absolute'
              })
          })
      })
    }
    tokenAdded = true
  })

  searchForm.reset()
})

function getCity() {
  citiesContainer.innerHTML = ''
  const randomIndex = Math.floor(Math.random() * 265)
  const cityCard = document.createElement('div')
  cityCard.id = 'city-card'

  const cityName = document.createElement('h3')
  cityName.id = 'city-name'
  const saveButton = document.createElement('button')
  saveButton.id = 'save-button'
  saveButton.className = 'header-button'
  saveButton.innerText = 'Save City'
  cityCard.append(saveButton)
  const cityScore = document.createElement('span')
  const cumulativeMeter = document.createElement('meter')

  const cityImageContainer = document.createElement('div')
  const cityImage = document.createElement('img')
  const cityDescription = document.createElement('span')
  cityImageContainer.id = 'city-image-container'
  cityImage.id = 'city-image'
  cityImageContainer.append(cityDescription, cityImage)

  const scoreList = document.createElement('ul')

  cityCard.append(
    cityName,
    cityScore,
    cumulativeMeter,
    cityImageContainer,
    scoreList
  )

  citiesContainer.append(cityCard)

  fetch('https://api.teleport.org/api/urban_areas/')
    .then((r) => r.json())
    .then((data) => {
      const cityArray = data._links['ua:item']
      const cityEntry = cityArray[randomIndex]

      cityName.textContent = cityEntry.name

      const cityURL = cityEntry.href
      cityLink = cityEntry.href

      fetch(`${cityURL}scores`)
        .then((r) => r.json())
        .then((scoresData) => {
          cityScore.textContent = `Teleport Total Score: ${Math.floor(scoresData.teleport_city_score)}`
          cumulativeMeter.id = cumulativeMeter
          cumulativeMeter.min = 0
          cumulativeMeter.max = 100
          cumulativeMeter.low = 40
          cumulativeMeter.high = 60
          cumulativeMeter.optimum = 80
          cumulativeMeter.value = Math.floor(scoresData.teleport_city_score)
          scoresData.categories.forEach((category) => {
            const li = document.createElement('li')
            li.textContent = `${category.name}: ${Math.floor(
              category.score_out_of_10
            )}`

            const categoryMeters = document.createElement('meter')
            categoryMeters.id = category.score_out_of_10
            categoryMeters.min = 0
            categoryMeters.max = 10
            categoryMeters.low = 4
            categoryMeters.high = 6
            categoryMeters.optimum = 8
            categoryMeters.value = `${Math.floor(category.score_out_of_10)}`

            scoreList.append(li, categoryMeters)

            cityDescription.innerHTML = scoresData.summary
            cityDescription.style.visibility = 'hidden'
          })
        })

      fetch(`${cityURL}images`)
        .then((r) => r.json())
        .then((imgData) => {
          cityImage.src = imgData.photos[0].image.web
          cityDescription.style.position = 'absolute'
        })
    })
  saveButton.addEventListener('click', () => {
    if (!tokenAdded) {
      saveButton.remove()
      cityTray.style.height = '150px'
      const cityToken = document.createElement('div')
      cityToken.className = 'city-token'
      cityToken.id = cityLink
      const tokenOverlay = document.createElement('div')
      tokenOverlay.id = 'token-overlay'
      tokenOverlay.textContent = cityName.textContent
      cityToken.appendChild(tokenOverlay)
      cityToken.style.backgroundImage = `url(${cityImage.src})`
      tokenContainer.append(cityToken)
      trayToggleHandler()

      cityToken.addEventListener('click', () => {
        // if (cityTray.childElementCount <= 1) {
        //   cityTray.style.height = '0px'
        // }

        // cityToken.remove()
        citiesContainer.innerHTML = ''
        const cityCard = document.createElement('div')
        cityCard.id = 'city-card'

        const cityName = document.createElement('h3')
        cityName.id = cityName
        const saveButton = document.createElement('button')
        saveButton.id = 'save-button'
        saveButton.className = 'header-button'
        saveButton.innerText = 'Save City'
        if (!document.getElementById('save-button')) {
          cityCard.appendChild(saveButton)
        }

        const cityScore = document.createElement('span')
        const cumulativeMeter = document.createElement('meter')

        const cityImageContainer = document.createElement('div')
        const cityImage = document.createElement('img')
        const cityDescription = document.createElement('span')
        cityImageContainer.id = 'city-image-container'
        cityImage.id = 'city-image'
        cityImageContainer.append(cityDescription, cityImage)

        const scoreList = document.createElement('ul')

        cityCard.append(
          cityName,
          cityScore,
          cumulativeMeter,
          cityImageContainer,
          scoreList
        )

        citiesContainer.append(cityCard)

        cityImageContainer.addEventListener('mouseover', () => {
          cityImage.style.opacity = '0.15'
          cityDescription.style.visibility = 'visible'
        })
      
        cityImageContainer.addEventListener('mouseleave', () => {
          cityImage.style.opacity = '1'
          cityDescription.style.visibility = 'hidden'
        })

        fetch(`${cityToken.id}`)
          .then((r) => r.json())
          .then((tokenCity) => {
            cityName.textContent = tokenCity.name

            fetch(`${cityToken.id}scores`)
              .then((r) => r.json())
              .then((scoresData) => {
                cityScore.textContent = `Teleport Total Score: ${Math.floor(scoresData.teleport_city_score)}`
                cumulativeMeter.id = cumulativeMeter
                cumulativeMeter.min = 0
                cumulativeMeter.max = 100
                cumulativeMeter.low = 40
                cumulativeMeter.high = 60
                cumulativeMeter.optimum = 80
                cumulativeMeter.value = Math.floor(
                  scoresData.teleport_city_score
                )
                scoresData.categories.forEach((category) => {
                  const li = document.createElement('li')
                  li.textContent = `${category.name}: ${Math.floor(
                    category.score_out_of_10
                  )}`

                  const categoryMeters = document.createElement('meter')
                  categoryMeters.id = category.score_out_of_10
                  categoryMeters.min = 0
                  categoryMeters.max = 10
                  categoryMeters.low = 4
                  categoryMeters.high = 6
                  categoryMeters.optimum = 8
                  categoryMeters.value = `${Math.floor(
                    category.score_out_of_10
                  )}`

                  scoreList.append(li, categoryMeters)

                  cityDescription.innerHTML = scoresData.summary
                  cityDescription.style.visibility = 'hidden'
                })
              })

            fetch(`${cityToken.id}images`)
              .then((r) => r.json())
              .then((imgData) => {
                cityImage.src = imgData.photos[0].image.web
                cityDescription.style.position = 'absolute'
              })
          })
      })
    }
    tokenAdded = true
  })

  cityImageContainer.addEventListener('mouseover', () => {
    cityImage.style.opacity = '0.15'
    cityDescription.style.visibility = 'visible'
  })

  cityImageContainer.addEventListener('mouseleave', () => {
    cityImage.style.opacity = '1'
    cityDescription.style.visibility = 'hidden'
  })
}

getCity()

randomizerButton.addEventListener('click', () => {
  if (document.getElementById('save-button')) {
    document.getElementById('save-button').remove()
  }
  getCity()
  tokenAdded = false
})

function trayToggleHandler() {
  trayToggled = !trayToggled
  if (trayToggled) {
    trayToggleButton.textContent = 'Close Tray'
    trayToggleButton.style.pointerEvents = 'all'
    trayToggleButton.addEventListener('click', () => {
      if (trayToggled) {
        trayToggled = !trayToggled
        cityTray.style.height = '35px'
        trayToggleButton.textContent = 'Open Tray'
        tokenContainer.style.opacity = 0
      } else {
        trayToggled = !trayToggled
        cityTray.style.height = '150px'
        trayToggleButton.textContent = 'Close Tray'
        tokenContainer.style.opacity = 1
      }
    })
  }
}