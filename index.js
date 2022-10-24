// https://api.teleport.org/api/urban_areas
// Endpoints for available cities.

fetch("https://api.teleport.org/api/urban_areas")
.then(r => r.json())
.then(data => {
  console.log(data)
})
console.log("This worked.")