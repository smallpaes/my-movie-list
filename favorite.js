(function () {
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const dataPanel = document.getElementById('data-panel')
  const data = JSON.parse(localStorage.getItem('favoriteMovies')) || []

  displayDataList(data)

  dataPanel.addEventListener('click', event => {
    if (event.target.matches('.btn-show-movie')) {
      displayDataList(event.target.dataset.id)
    } else if (event.target.matches('.btn-remove-favorite')) {
      console.log('sdf')
      removeFavoriteItem(event.target.dataset.id)
    }
  })


  function displayDataList(data) {
    let htmlContent = ''
    data.forEach(function (item, index) {
      htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h6 class="card-title">${item.title}</h5>
            </div>

            <!-- "More" button -->
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <button class='btn btn-danger btn-remove-favorite' data-id='${item.id}'>X</button>
            </div>
          </div>
        </div>
      `
    })
    dataPanel.innerHTML = htmlContent
  }

  function removeFavoriteItem(id) {
    //find the movie in data
    const index = data.findIndex(item => item.id === Number(id))
    if (index === -1) return

    //remove the movie from data
    data.splice(index, 1)

    //update data in local storage
    localStorage.setItem('favoriteMovies', JSON.stringify(data))

    displayDataList(data)
  }
})()