// https://api.teleport.org/api/urban_areas
// Endpoints for available cities.

// fetch("https://api.teleport.org/api/urban_areas/slug:san-francisco-bay-area/scores/")
// .then(r => r.json())
// .then(data => {
//   console.log(data)
// })
// console.log("This worked.")

const topContainer = document.querySelector('#top-container')
const citiesContainer = document.querySelector('#cities-container')
const cityTray = document.querySelector('#city-tray')
const randomizerButton = document.querySelector('#randomize')

let tokenAdded = false
let cityLink = ''

function getCity() {
  citiesContainer.innerHTML = ''
  const randomIndex = Math.floor(Math.random() * 265)
  const cityCard = document.createElement('div')
  cityCard.id = 'city-card'

  const cityName = document.createElement('h3')
  cityName.id = 'city-name'
  const saveButton = document.createElement('button')
  saveButton.id = 'save-button'
  saveButton.innerText = 'Save City'
  topContainer.appendChild(saveButton)
  const cityScore = document.createElement('span')

  const cityImageContainer = document.createElement('div')
  const cityImage = document.createElement('img')
  const cityDescription = document.createElement('span')
  cityImageContainer.id = 'city-image-container'
  cityImage.id = 'city-image'
  cityImageContainer.append(cityDescription, cityImage)

  const scoreList = document.createElement('ul')

  cityCard.append(cityName, cityScore, cityImageContainer, scoreList)

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
          cityScore.textContent = Math.floor(scoresData.teleport_city_score)
          scoresData.categories.forEach((category) => {
            const li = document.createElement('li')
            li.textContent = `${category.name}: ${Math.floor(
              category.score_out_of_10
            )}`
            scoreList.appendChild(li)

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
      cityTray.append(cityToken)

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
        saveButton.innerText = 'Save City'
        if (!document.getElementById('save-button')) {
          topContainer.appendChild(saveButton)
        }

        const cityScore = document.createElement('span')

        const cityImageContainer = document.createElement('div')
        const cityImage = document.createElement('img')
        const cityDescription = document.createElement('span')
        cityImageContainer.id = 'city-image-container'
        cityImage.id = 'city-image'
        cityImageContainer.append(cityDescription, cityImage)

        const scoreList = document.createElement('ul')

        cityCard.append(cityName, cityScore, cityImageContainer, scoreList)

        citiesContainer.append(cityCard)

        fetch(`${cityToken.id}`)
          .then((r) => r.json())
          .then((tokenCity) => {
            cityName.textContent = tokenCity.name

            fetch(`${cityToken.id}scores`)
              .then((r) => r.json())
              .then((scoresData) => {
                cityScore.textContent = Math.floor(
                  scoresData.teleport_city_score
                )
                scoresData.categories.forEach((category) => {
                  const li = document.createElement('li')
                  li.textContent = `${category.name}: ${Math.floor(
                    category.score_out_of_10
                  )}`
                  scoreList.appendChild(li)

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

// function fetchCity(cityName) {
//   const cityCard = document.createElement('div')

//   fetch(`https://api.teleport.org/api/urban_areas/slug:${cityName}/`)
//     .then((r) => r.json())
//     .then((city) => {
//       const cityName = document.createElement('h3')
//       cityName.textContent = city.full_name
//       cityCard.append(cityName)
//     })
//   fetch(`https://api.teleport.org/api/urban_areas/slug:${cityName}/scores/`)
//     .then((r) => r.json())
//     .then((scoresData) => {
//       const cityScore = document.createElement('span')
//       cityScore.textContent = scoresData.teleport_city_score
//       cityCard.append(cityScore)
//     })
//   fetch(`https://api.teleport.org/api/urban_areas/slug:${cityName}/images/`)
//     .then((r) => r.json())
//     .then((imgData) => {
//       const cityImage = document.createElement('img')
//       cityImage.src = imgData.photos[0].image.web
//       cityCard.append(cityImage)
//     })

//   citiesContainer.append(cityCard)
//   //  console.log(cityData)
// }

// fetchCity('san-francisco-bay-area')
