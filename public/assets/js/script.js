$(function() {
    $("#scrape").on("click", function(event) {
        event.preventDefault();
        $.ajax("/scrape", {
            type: "GET"
        }).then(function(data) {

            if (data.data == 0) {
                alert('Scraped : ' + data.data + ' rows. No duplicate data will be imported')
            } else {
                alert('Scraped : ' + data.data + ' rows')
            }
            location.reload();
        });
    });

    $("#addNewComment").on("click", function(event) {
        event.preventDefault();
        console.log(getUrlParameter('id'))
        console.log(parseInt($("#hidethissh").attr('value')))
        var newcomment = {
            activity_id: parseInt($("#hidethissh").attr('value')),
            comment: $("#comment").val().trim(),
        };

        $.ajax("/api/comment", {
            type: "POST",
            data: newcomment,
        }).then(function() {
            console.log("created new comment for Peer !!! ");
            location.reload();
        });
    });
});


$(document).on("click", '.close', function(event) {
    event.preventDefault();
    $.ajax("/:id?", {
        type: "POST",
        data: $(this).attr('data')
    }).then(function(data) {

        alert('Article deleted')
    });
    location.reload();
});