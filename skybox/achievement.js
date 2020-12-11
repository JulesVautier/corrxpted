function showAchievement() {
    // $('#achievement .circle').removeClass('rotate');
    // Run the animations
    setTimeout(function () {
        $('.achievement').css("display", "block")
        $('.achievement').addClass("achievement-show-pos")
        console.log("done")
        setTimeout(function () {
            $('.achievement').addClass("achievement-fade-away")
            console.log($('.achievement').attr('class'))
        }, 1000)
        // setTimeout(function () {
        //     $('#achievement').addClass('widen');
        //     setTimeout(function () {
        //         $('#achievement .copy').addClass('show');
        //     }, 1000);
        // }, 1000);
    }, 1000);
    // Hide the achievement
    // setTimeout(function () {
    //     hideAchievement();
    // }, 4000);
}

function hideAchievement() {
    setTimeout(function () {
        $('#achievement .copy').removeClass('show');
        setTimeout(function () {
            $('#achievement').removeClass('widen');
            $('#achievement .circle').addClass('rotate');
            setTimeout(function () {
                $('#achievement').removeClass('expand');
                $('.refresh').fadeIn(300);
            }, 1000);
        }, 1000);
    }, 3000);

    $('.refresh').click(function () {
        showAchievement();
        $(this).fadeOut(300);
    });
}

showAchievement();