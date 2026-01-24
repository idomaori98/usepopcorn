import { useState, useEffect } from "react";
import { KEY, Loader } from "./App";
import StarRating from "./StarRating";

export function MovieDetails({
    selectedId,
    onCloseMovie,
    onAddWatched,
    watched,
}) {
    const [movie, setMovie] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [userRating, setUserRating] = useState("");

    const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
    const watchedUserRating = watched.find(
        (movie) => movie.imdbID === selectedId
    )?.userRating;

    const {
        Title: title,
        Year: year,
        Poster: poster,
        Runtime: runtime,
        imdbRating,
        Plot: plot,
        Released: released,
        Actors: actors,
        Director: director,
        Genre: genre,
    } = movie;

    function handleAdd() {
        const newWatchedMovie = {
            imdbID: selectedId,
            title,
            year,
            poster,
            imdbRating: Number(imdbRating),
            runtime: Number(runtime.split(" ").at(0)),
            userRating,
        };
        onAddWatched(newWatchedMovie);
        onCloseMovie();
    }

    useEffect(
        function () {
            function callback(e) {
                if (e.code === "Escape") {
                    onCloseMovie();
                }
            }
            document.addEventListener("keydown", callback);

            return function () {
                document.removeEventListener("keydown", callback);
            };
        },
        [onCloseMovie]
    );

    useEffect(
        function () {
            async function getMovieDetails() {
                setIsLoading(true);
                const res = await fetch(
                    `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
                );
                const data = await res.json();
                setMovie(data);
                setIsLoading(false);
            }
            getMovieDetails();
        },
        [selectedId]
    );

    useEffect(
        function () {
            if (!title) return;
            document.title = `Movie | ${title}`;

            return function () {
                document.title = "usePopcorn";
            };
        },
        [title]
    );

    return (
        <div className="details">
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <header>
                        <button className="btn-back" onClick={onCloseMovie}>
                            &larr;
                        </button>

                        <img src={poster} alt={`Poster of ${title}`} />

                        <div className="details-overview">
                            <h2>{title}</h2>
                            <p>
                                {released} &bull; {runtime}
                            </p>
                            <p>{genre}</p>
                            <p>
                                <span>⭐️</span>
                                {imdbRating} IMDb rating
                            </p>
                        </div>
                    </header>
                    <section>
                        <div className="rating">
                            {isWatched ? (
                                <p>
                                    You rated this movie {watchedUserRating}{" "}
                                    <span>⭐️</span>
                                </p>
                            ) : (
                                <StarRating
                                    maxRating={10}
                                    size={20}
                                    key={selectedId}
                                    onSetRating={setUserRating}
                                ></StarRating>
                            )}
                            {userRating > 0 && (
                                <button className="btn-add" onClick={handleAdd}>
                                    + Add to list
                                </button>
                            )}
                        </div>
                        <p>
                            <em>{plot}</em>
                        </p>
                        <p>Starring: {actors}</p>
                        <p>Directed by {director}</p>
                    </section>

                    {selectedId}
                </>
            )}
        </div>
    );
}
