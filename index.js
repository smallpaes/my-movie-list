(function () {
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const data = []
  const searchForm = document.getElementById('searchForm')
  const searchInput = document.getElementById('search')
  const modeSwitcher = document.getElementById('mode-switcher')
  const dataPanel = document.getElementById('data-panel')
  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12
  let paginationData = []
  let isListMode = false
  let currentPageNumber = 1

  axios.get(INDEX_URL).then((response) => {
    data.push(...response.data.results)
    // displayDataList(data)
    getTotalPages(data)
    getPageData(1, data)
  }).catch((err) => console.log(err))

  // listen to data panel
  dataPanel.addEventListener('click', event => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id)
    } else if (event.target.matches('.btn-add-favorite')) {
      addFavoriteItem(event.target.dataset.id)
    }
  })

  //listen to pagination click event
  pagination.addEventListener('click', event => {
    //remove pagination active status
    updatePaginationStatus(currentPageNumber)

    switch (event.target.dataset.page) {
      case 'previous':
        currentPageNumber = currentPageNumber - 1 || 1
        break
      case 'next':
        const currentTotalPage = pagination.children.length - 2
        currentPageNumber = Math.min(currentPageNumber + 1, currentTotalPage)
        break
      default:
        currentPageNumber = Number(event.target.dataset.page)
    }

    //display page
    getPageData(currentPageNumber)

    //add pagination active status
    updatePaginationStatus(currentPageNumber)
  })

  //listen to form submit event
  searchForm.addEventListener('submit', event => {
    event.preventDefault()

    //construct regular expression
    const regex = new RegExp(searchInput.value, 'i')

    //get the search results
    let results = data.filter(movie => movie.title.match(regex))

    // displayDataList(results)
    getTotalPages(results)
    getPageData(1, results)

    //clear up the input value
    searchInput.value = ''
  })

  //listen to mode switcher click event
  modeSwitcher.addEventListener('click', event => {
    if (event.target.matches('.fa-bars')) {
      isListMode = true
    } else {
      isListMode = false
    }
    getPageData(currentPageNumber)
  })

  function displayDataList(data) {
    let htmlContent = ''

    //check if data is empty and display mode
    if (data.length === 0) {
      htmlContent += `
        <div class='text-secondary p-3'>
          <h4><i class="far fa-sad-tear pr-2"></i>No movie found!</h4>
        </div>
      `
    } else if (isListMode) {
      data.forEach(item => {
        htmlContent += `
          <div class='col-12 d-flex justify-content-between border-top py-2 mx-3'>
            <h6 class='m-0'>${item.title}</h6>
            <div class='mr-5'>
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <button class='btn btn-info btn-add-favorite' data-id='${item.id}'>+</button>
            </div>
          </div>
        `
      })
    } else {
      data.forEach(function (item, index) {
        htmlContent += `
        <div class="col-sm-12 col-md-6 col-lg-4 col-xl-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h6 class="card-title">${item.title}</h5>
            </div>

            <!-- "More" button -->
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <button class='btn btn-info btn-add-favorite' data-id='${item.id}'>+</button>
            </div>
          </div>
        </div>
      `
      })
    }
    dataPanel.innerHTML = htmlContent
  }

  function showMovie(id) {
    // get elements
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')

    // set request url
    const url = INDEX_URL + id
    console.log(url)

    // send request to show api
    axios.get(url).then(response => {
      const data = response.data.results
      console.log(data)

      // insert data into modal ui
      modalTitle.textContent = data.title
      modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
      modalDate.textContent = `release at : ${data.release_date}`
      modalDescription.textContent = `${data.description}`
    })
  }

  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = data.find(item => item.id === Number(id))

    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite list.`)
    } else {
      list.push(movie)
      alert(`Added ${movie.title} to your favorite list!`)
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
  }

  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''

    //previous page icon
    pageItemContent += `
      <li class="page-item">
        <a class="page-link" href="#" aria-label="Previous" data-page='previous'>&laquo;</a>
      </li>
    `

    //icon of number of the page
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page='${i + 1}'>${i + 1}</a>
        </li>
      `
    }

    //next page icon
    pageItemContent += `
      <li class="page-item">
        <a class="page-link" href="#" aria-label="Next" data-page='next'>&raquo;</a>
      </li>
    `
    pagination.innerHTML = pageItemContent

    //update pagination link status
    updatePaginationStatus(1)
  }

  function getPageData(pageNum, data) {
    currentPageNumber = pageNum || currentPageNumber
    paginationData = data || paginationData
    let offset = (currentPageNumber - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  }

  function updatePaginationStatus(pageNum) {
    pagination.children[pageNum].classList.toggle('active')
  }
})()
