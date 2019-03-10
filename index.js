const BASE_URL = "https://movie-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/movies/";
const POSTER_URL = BASE_URL + "/posters/";

const moviePanel = document.getElementById("movie-list");
const dataPanel = document.getElementById("data-panel");
const genres = {
  "1": "Action",
  "2": "Adventure",
  "3": "Animation",
  "4": "Comedy",
  "5": "Crime",
  "6": "Documentary",
  "7": "Drama",
  "8": "Family",
  "9": "Fantasy",
  "10": "History",
  "11": "Horror",
  "12": "Music",
  "13": "Mystery",
  "14": "Romance",
  "15": "Science Fiction",
  "16": "TV Movie",
  "17": "Thriller",
  "18": "War",
  "19": "Western"
};

// add movieList
function addList(text) {
  let newItem = document.createElement("li");
  newItem.classList.add("nav-item");
  newItem.innerHTML += `
    <div class="card genres-list">
      <a class="nav-link" href="#">${text}</a>
    </div>
  `;
  moviePanel.appendChild(newItem);
}

for (let genre in genres) {
  addList(genres[genre]);
}

// display card
function displayDataList(data) {
  let htmlContent = "";
  data.forEach(function (item, index) {
    htmlContent += `
      <div class="col-sm-3">
        <div class="card mb-2">
          <img class="card-img-top " src="${POSTER_URL}${
      item.image
      }" alt="Card image cap">
          <div class="card-body movie-item-body">
            <h6 class="card-title">${item.title}</h6>
            <div class="card-genres">${convGenreNumArrToStr(item.genres)}</div>
          </div>
        </div>
      </div>
    `;
  });
  dataPanel.innerHTML = htmlContent;
}

// convert
function convGenreNumToStr(genreNum) {
  return genres[genreNum];
}

function convGenreNumArrToStr(genreNumArr) {
  let genreStr = "";
  genreNumArr.forEach(function (genreNum) {
    genreStr += `
      <p class="genreStr">${convGenreNumToStr(genreNum)}</p>
    `;
  });
  return genreStr;
}

// movies 有自己 genres 陣列，而且是用數字表示
function checkMovieIsGenre(movie, target) {
  let res = false;
  for (let movieGenre of movie.genres) {
    // 將 movie genres 作轉換成字串，這樣才能做比較
    if (convGenreNumToStr(movieGenre) === target) {
      res = true;
      break;
    }
  }
  return res;
}

// get API
function showMovieByGenre(genreStr) {
  axios
    .get(INDEX_URL)
    .then(response => {
      const movieList = response.data.results;
      const data = [];

      for (let movie of movieList) {
        if (checkMovieIsGenre(movie, genreStr)) {
          // 比較成功，表示這是要顯示的 movie，需放到 data 去
          data.push(movie);
        }
      }
      displayDataList(data);
    })
    .catch(err => console.log(err));
}

// listen to movie panel
moviePanel.addEventListener("click", event => {
  // Remove all active class first
  let listItem = document.querySelectorAll(".nav-link");
  listItem.forEach(item => {
    item.classList.remove("active");
  });

  // Check the target item
  event.target.classList.add("active");

  // show movies
  showMovieByGenre(event.target.innerHTML);
});