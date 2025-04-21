$(document).ready(function() {
    $("#searchForm").submit(function(event) {
        event.preventDefault();
        const title = $("#searchInput").val();

        $.ajax({
            url: `/movies?title=${encodeURIComponent(title)}`,
            method: "GET",
            success: function(data) {
                $("#results").empty();
                if (data.length === 0) {
                    $("#results").append("<p>No se encontraron películas.</p>");
                    return;
                }

                data.forEach(movie => {
                    $("#results").append(`
                        <div>
                            <h3>${movie.title} (${movie.year})</h3>
                            <p>Género: ${movie.genre}</p>
                            <p>Director: ${movie.director}</p>
                            <p>Trama: ${movie.plot}</p>
                            <img src="${movie.poster}" alt="${movie.title}" width="200">
                            <hr>
                        </div>
                    `);
                });
            },
            error: function(err) {
                $("#results").html(`<p>Error al obtener las películas: ${err.responseJSON.message}</p>`);
            }
        });
    });
});
