async function registerUser() {
  const username = document.getElementById("regUsername").value;
  const password = document.getElementById("regPassword").value;

  try {
    const response = await fetch(
      "https://673469dba042ab85d11a0d3b.mockapi.io/user",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      }
    );

    if (response.ok) {
      console.log("User registered successfully");
      document.getElementById("errorMessage").innerText =
        "Registration successful! You can now log in.";
      document.getElementById("login").style.display = "block";
      document.getElementById("register").style.display = "none";
    } else {
      alert("Failed to register user. Please try again.");
    }
  } catch (error) {
    alert("Error: " + error);
  }
}

async function loginUser() {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const response = await fetch(
      "https://673469dba042ab85d11a0d3b.mockapi.io/user"
    );
    const users = await response.json();

    const user = users.find(
      (user) => user.username === username && user.password === password
    );
    if (user) {
      localStorage.setItem("userId", user.id);
      alert("User logged in sucesfuly");
      document.getElementById("movielibrary").style.display = "block";
      fetchUserMovies();
    } else {
      alert("Invalid username or password");
    }
  } catch (error) {
    alert("Error: " + error);
  }
}

async function fetchUserMovies() {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    console.error("User not logged in");
    return;
  }

  try {
    const response = await fetch(
      `https://673469dba042ab85d11a0d3b.mockapi.io/movies?userId=${userId}`
    );
    const movies = await response.json();
    displayMovies(movies);
  } catch (error) {
    alert("Error fetching movies: " + error);
  }
}

function displayMovies(movies) {
  const moviesContainer = document.getElementById("moviesContainer");
  moviesContainer.innerHTML = ""; // Clear previous movies

  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.className = "movie-card" + (movie.watched ? " watched" : "");
    movieCard.innerHTML = `
            <h3>${movie.title}</h3>
            <p>Genre: ${movie.genre}</p>
            <p>Rating: ${"★".repeat(movie.rating)}${"☆".repeat(
      5 - movie.rating
    )}</p>
            <button onclick="markAsWatched(${
              movie.id
            })">Mark as Watched</button>
            <button onclick="editMovie(${movie.id})">Edit</button>
            <button onclick="deleteMovie(${movie.id})">Delete</button>
        `;
    moviesContainer.appendChild(movieCard);
  });
}

async function addMovie() {
  const userId = localStorage.getItem("userId");
  const title = document.getElementById("movieTitle").value;
  const genre = document.getElementById("movieGenre").value;
  const rating = document.getElementById("movieRating").value;

  if (!validateMovieInput(title, genre, rating)) return;

  try {
    const response = await fetch(
      "https://673469dba042ab85d11a0d3b.mockapi.io/movies",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, title, genre, rating, watched: false }),
      }
    );

    if (response.ok) {
      console.log("Movie added successfully");
      fetchUserMovies(); // Refresh the movie list
    } else {
      alert("Failed to add movie");
    }
  } catch (error) {
    alert("Error: " + error);
  }
}

async function markAsWatched(movieId) {
  try {
    const response = await fetch(
      `https://673469dba042ab85d11a0d3b.mockapi.io/movies/${movieId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ watched: true }),
      }
    );

    if (response.ok) {
      console.log("Movie marked as watched");
      fetchUserMovies(); // Refresh the movie list
    } else {
      alert("Failed to mark movie as watched");
    }
  } catch (error) {
    alert("Error: " + error);
  }
}

async function deleteMovie(movieId) {
  try {
    const response = await fetch(
      `https://673469dba042ab85d11a0d3b.mockapi.io/movies/${movieId}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      console.log("Movie deleted successfully");
      fetchUserMovies(); // Refresh the movie list
    } else {
      alert("Failed to delete movie");
    }
  } catch (error) {
    alert("Error: " + error);
  }
}

function validateMovieInput(title, genre, rating) {
  if (!title || !genre || rating < 1 || rating > 5) {
    alert("Please provide valid movie details.");
    return false;
  }
  return true;
}

function showError(message) {
  const errorMessageDiv = document.getElementById("errorMessage");
  errorMessageDiv.innerText = message;
}

async function filterMovies() {
  const genre = document.getElementById("genreFilter").value;
  const allMovies = await fetchUserMovies();
  const filteredMovies = genre
    ? allMovies.filter((movie) => movie.genre === genre)
    : allMovies;
  displayMovies(filteredMovies);
}

window.onload = function () {
  const userId = localStorage.getItem("userId");
  if (userId) {
    document.getElementById("movieLibrary").style.display = "block";
    fetchUserMovies();
  }
};

function filterMovies() {
  const genre = document.getElementById("genreFilter").value;
  const movieCards = document.querySelectorAll(".movie-card");

  movieCards.forEach((card) => {
    const movieGenre = card.querySelector("p").innerText.split(": ")[1];
    if (genre === "" || movieGenre === genre) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}
