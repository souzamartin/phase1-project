// https://api.teleport.org/api/urban_areas
// Endpoints for available cities.

// fetch("https://api.teleport.org/api/urban_areas/slug:san-francisco-bay-area/scores/")
// .then(r => r.json())
// .then(data => {
//   console.log(data)
// })
// console.log("This worked.")

const citiesContainer = document.querySelector('#cities-container')

// const cityData = {
//   cityFullName: '',
//   totalScore: '',
//   imgUrl: '',
// }

function fetchCity(cityName) {
  const cityData = {
    cityFullName: '',
    totalScore: '',
    imgUrl: '',
  }

  fetch(`https://api.teleport.org/api/urban_areas/slug:${cityName}/`)
    .then((r) => r.json())
    .then((city) => {
      cityData.cityFullName = city.full_name
    })
  fetch(`https://api.teleport.org/api/urban_areas/slug:${cityName}/scores/`)
    .then((r) => r.json())
    .then((scoresData) => {
      cityData.totalScore = scoresData.teleport_city_score
    })
  fetch(`https://api.teleport.org/api/urban_areas/slug:${cityName}/images/`)
    .then((r) => r.json())
    .then((cityImage) => {
      cityData.imgUrl = cityImage.photos[0].image.web
      renderCity(cityData)
    })

  //  console.log(cityData)
}

fetchCity('san-francisco-bay-area')

function renderCity(data) {
  // console.log(data)
  const cityCard = document.createElement('div')

  const cityName = document.createElement('h3')
  cityName.textContent = data.cityFullName

  const cityScore = document.createElement('span')
  cityScore.textContent = data.totalScore

  const cityImage = document.createElement('img')
  cityImage.src = data.imgUrl

  cityCard.append(cityName, cityScore, cityImage)
  citiesContainer.append(cityCard)
}

