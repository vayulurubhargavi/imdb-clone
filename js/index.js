"use strict";
(function () {
  const searchKeyword = document.getElementById("search");
  const suggestionsContainer = document.getElementById("card-container");
  const favMoviesContainer = document.getElementById("fav-movies-container");
  const emptyText = document.getElementById("empty-search-text");
  const showFavourites = document.getElementById("favorites-section");
  const emptyFavText = document.getElementById("empty-fav-text");

  addToFavDOM();
  showEmptyText();

// creating suggestion list and also fav-movies array list
  let suggestionList = [];
  let favMovieArray = [];

  //adding eventListener when downarrow is pressed --movie suggestion names will picked up from history and we select one among them and press enter
  searchKeyword.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
      event.preventDefault();
    }
  });

  //styling   the emptyFavText based on items if wishlisted or not
  function showEmptyText() {
    if (favMoviesContainer.innerHTML == "") {
      emptyFavText.style.display = "block";
    } else {
      emptyFavText.style.display = "none";
    }
  }

  // Event listner on search
  searchKeyword.addEventListener("keyup", function () {
    let search = searchKeyword.value;
    if (search === "") {
      emptyText.style.display = "block";
      // suggestionsContainer has no data
      suggestionsContainer.innerHTML = "";
      // clears the previous movies from array
      suggestionList = [];
    } else {
      // disappear the emptySearchText div if the search results of movie appear
      emptyText.style.display = "none";
      // get the search results data and add it to suggestionsContainerDOM
      (async () => {
        // get the search data from api and add it to SuggestionContainerDOM
        let data = await fetchMovies(search);
        addToSuggestionContainerDOM(data);
      })();
      //  styling the SuggestionContainer in grid layout
      suggestionsContainer.style.display = "grid";
    }
  });

  // Fetches data from api and calls function to add it in
  async function fetchMovies(search) {
    const url = `https://www.omdbapi.com/?t=${search}&apikey=d19cd846`;
    try {
      const response = await fetch(url);
      // get the movie data from api
      const data = await response.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  // Shows in suggestion container DOM
  function addToSuggestionContainerDOM(data) {
    emptyFavText.style.display = "none";
    let isPresent = false;

    // to check if the movie is already present in the suggestionList array
    suggestionList.forEach((movie) => {
      if (movie.Title == data.Title) {
        isPresent = true;
      }
    });

    if (!isPresent && data.Title != undefined) {
      
      // push the newly searched movie into suggestions array
      suggestionList.push(data);
      // create a moviecard div and fill the details received from api
      const movieCard = document.createElement("div");
      movieCard.setAttribute("class", "text-decoration");

      movieCard.innerHTML = `
        <div class="card my-2" data-id = " ${data.Title} ">
        <a href="movie.html" >
          <img
            src="${data.Poster} "
            class="card-img-top"
            alt="..."
            data-id = "${data.Title} "
          />
          <div class="card-body text-start">
            <h5 class="card-title" >
              <a href="movie.html" data-id = "${data.Title} "> ${data.Title}  </a>
            </h5>
            <p class="card-text">
              <i class="fa-solid fa-star">
                <span id="rating">&nbsp;${data.imdbRating}</span>
              </i>
              <button class="fav-btn">
                <i class="fa-solid fa-heart add-fav" data-id="${data.Title}"></i>
              </button>
            </p>
          </div>
        </a>
      </div>
    `;
    // fetching and displaying the movie card details in suggestionsContainer
      suggestionsContainer.prepend(movieCard);
    }
  }

  // Add to favourite of localStorage
  async function handleFavBtn(e) {
    const target = e.target;

    let data = await fetchMovies(target.dataset.id);
    //  get the movie from local storage
    let favMoviesLocal = localStorage.getItem("favMoviesList");

    if (favMoviesLocal) {
      // get favourite movie from favMovieslOCAL AND ADD IT to  favmoviesarray  
      favMovieArray = Array.from(JSON.parse(favMoviesLocal));
    } else {
      // if not in local storage add it favMoviesList
      localStorage.setItem("favMoviesList", JSON.stringify(data));
    }

    // to check if movie is already present in the fav list and show alert msg
    let isPresent = false;
    favMovieArray.forEach((movie) => {
      if (data.Title == movie.Title) {

        notify("already added to fav list");
        isPresent = true;
      }
    });
    // ifmovie is not present add it to favmoviesArray
    if (!isPresent) {
      favMovieArray.push(data);
    }

    localStorage.setItem("favMoviesList", JSON.stringify(favMovieArray));
    isPresent = !isPresent;
    addToFavDOM();
  }

  // Add to favourite list DOM
  function addToFavDOM() {
    favMoviesContainer.innerHTML = "";

    let favList = JSON.parse(localStorage.getItem("favMoviesList"));
    if (favList) {
      favList.forEach((movie) => {
        // create a div for favourite items
        const div = document.createElement("div");
        div.classList.add(
          "fav-movie-card",    
          "d-flex",
          "justify-content-between",
          "align-content-center",
          "my-2"
        );
        div.innerHTML = `
   
    <img
      src="${movie.Poster}"
      alt=""
      class="fav-movie-poster"
    />
    <div class="movie-card-details">
      <p class="movie-name mt-3 mb-0">
       <a href = "movie.html" class="fav-movie-name" data-id="${movie.Title}">${movie.Title}<a> 
      </p>
      <small class="text-muted">${movie.Year}</small>
    </div>
    <div class="delete-btn my-4">
        <i class="fa-solid fa-trash-can" data-id="${movie.Title}"></i>
    </div>
    `;
          //add it to dom  
        favMoviesContainer.prepend(div);
      });
    }
  }

  // To notify
  function notify(text) {
    window.alert(text);
  }

  // Delete from favourite list
  function deleteMovie(name) {
    let favList = JSON.parse(localStorage.getItem("favMoviesList"));
    let updatedList = Array.from(favList).filter((movie) => {
      return movie.Title != name;
    });
    //  also update the favlist into localstorage
    localStorage.setItem("favMoviesList", JSON.stringify(updatedList));

    addToFavDOM();
    showEmptyText();
  }

  // Handles click events
  async function handleClickListner(e) {
    const target = e.target;

    if (target.classList.contains("add-fav")) 
    {
      e.preventDefault();
      handleFavBtn(e);
    }
    // if trash can icon  button is clicked
     else if (target.classList.contains("fa-trash-can"))
    {
      deleteMovie(target.dataset.id);
    } 
    // clicking the show fav list  icon
    else if (target.classList.contains("fa-bars")) 
    {
      // when clicked favlist movies disappears and background becomes white
      if (showFavourites.style.display == "flex") 
      {
        document.getElementById("show-favourites").style.color = "orange";
        showFavourites.style.display = "none";
      } 
      else 
      {
        // when items are present and fav bar is cliked the icon color changes to blue 
        document.getElementById("show-favourites").style.color ="blue"
        showFavourites.style.display = "flex";
      }
    }

    localStorage.setItem("movieName", target.dataset.id);
  }

  // Event listner on whole document
  document.addEventListener("click", handleClickListner);
})();