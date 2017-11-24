$(document).ready(function() {

    $(document).on('click', '.home', function() {
            $(location).attr('href', '/');
    })

    $(document).on('click', '.scrape', function() {
        console.log('Scraping');
        $.get('/scrape', function(data) {
            $(location).attr('href', '/');
        })
    })

    $(document).on('click', '.favorites', function() {
        console.log('Favorites');
        $.get('/favorites', function(data) {
            $(location).attr('href', '/favorites');
        })
    })

    $(document).on('click', '.add-favorite', function() {
        var id = $(this).attr('favorite-id');
        $.post('/favorites/' + id, function(data) {
            alert('favorite added');
        })
    })

    $(document).on('click', '.remove', function() {
        var id = $(this).attr('remove-id');
        $.post('/remove/' + id, function(data) {
            $(location).attr('href', '/favorites');
        })
    })

    $(document).on('click', '.reviews', function() {
        var id = $(this).attr('data-id');
        $.get('/reviews/' + id, function(data) {
            console.log(data);
            $('.modal').attr('class', 'modal is-active');
            $('.history').attr('data-doc', id);
            $('.save').attr('save-id', id);
            $('.history').empty();
            fillReviews(id, data);
        })
    })

    $(document).on('click', '.save', function() {
        var id = $(this).attr('save-id');
        var review = {
            review: $('.new-review').val()
        }
        $('.new-review').val('');
        console.log(id);
        console.log(review);
        $.post('/reviews/' + id, review, function(data) {
            console.log('post worked');
            console.log(data);
            $('.history').empty();
            fillReviews(id, data);
        })
    })

    $(document).on('click', '.cancel', function() {
        $('.modal').attr('class', 'modal');
        console.log('complete');
        // $.get('/');
    })

    $(document).on('click', '.trash', function() {
        var id = {
            article: $(this).attr('data-art'),
            review: $(this).attr('data-rev')
        }
        $.post('/trash', id, function(data) {
            console.log('trash worked');
            $('.history').empty();
            fillReviews(id.article, data);
        })
    })

    function fillReviews(id, data) {
        for (var i = 0; i < data.reviews.length; i++) {
            var review = $('<div>').html(data.reviews[i].review);
            var reviewFooter = $('<div>').attr('class', 'review-footer');
            var icon = $('<img>').attr('src', 'https://image.flaticon.com/icons/png/128/25/25214.png').attr('class', 'trash').attr('data-art', id).attr('data-rev', data.reviews[i]._id);
            var time = $('<span>').html(data.reviews[i].created);

            var reviewFooter = reviewFooter.append(time).append(icon);

            $('.history').append(review).append(reviewFooter).append('<hr>');
        }
    }
})
