we do develope the imdb-clone app using  https://www.omdbapi.com/ api
App Functionality
-- IMDB clone app in which we can search movies based on OMDB API
--Clicking on a particular movie ,movie card opens a new movie page for more info. 
--On clicking on the favourite button,we can add a movie to the favourite which uses localstorage to store the movies
--we can also delete movies from favourite list.

Implementation:
 suggestionList - an array which contains a list of movies based on searched keywords.
 favMovieArray - an array that gets movies from the local storage.
movieName - local Storage item which contains the name of clicked movie card.
Functions used
•	fetchMovies –fetch the movies from local storage
•	addToSuggestionContainerDOM—add the searched movie results to DOM
•	handleFavBtn –how to put a particular movie to fav list
•	addToFavDOM –adding a particular movie  to fav DOM
•	deleteMovie –delete a movie from fav list
•	notify –notify if movie is already present in fav list
