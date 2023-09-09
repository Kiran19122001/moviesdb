const express = require("express");

const app = express();
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "moviesData.db");

let db = null;
const initializeDBAndSever = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server is running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`DB Error${e.message}`);
  }
};
initializeDBAndSever();

//GET movies list API
app.get("/movies/", async (request, response) => {
  const getAllMoviesQuery = `
    SELECT * FROM movie;
    `;
  const dbRequest = await db.all(getAllMoviesQuery);
  response.send(dbRequest);
});

//POST a movie API
app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const addMovieQuery = `
  INSERT INTO movie (director_id,movie_name,lead_actor) VALUES
  (
      ${directorId},
      '${movieName}',
      '${leadActor}'
  )
  `;
  const dbRequest = await db.run(addMovieQuery);
  response.send("Movie added successfully");
});

// GET a specific movie API
app.get("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `
   SELECT * FROM movie WHERE movie_id=${movieId};
  `;
  const movie = await db.get(getMovieQuery);
  response.send(movie);
});

//PUT a movie API

app.put("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;

  const updateMovieQuery = `
  UPDATE movie SET 
  director_id=${directorId},
  movie_name='${movieName}',
  lead_actor='${leadActor}'
  WHERE movie_id=${movieId};
  `;

  const dbRequest = await db.run(updateMovieQuery);
  response.send("movie updated successfully");
});

// delete a movie API

app.delete("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovieQuery = `
    DELETE FROM movie WHERE movie_id=${movieId};
    `;
  const dbRequest = await db.run(deleteMovieQuery);
  response.send("movie deleted successfully");
});

//GET directors API
app.get("/directors/", async (request, response) => {
  const getDirectorsQuery = `
    SELECT * FROM director;
    `;
  const dbRequest = await db.all(getDirectorsQuery);
  response.send(dbRequest);
});

//GET directed movies API

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const getMoviesQuery = `
  SELECT * FROM movie WHERE director_id=${directorId};
  `;
  const movies = await db.all(getMoviesQuery);
  response.send(movies);
});
