function showAchievement() {
    setTimeout(function () {
        $('.achievement').addClass("achievement-show-pos")
        setTimeout(function () {
            $('.achievement').addClass("achievement-fade-away")
        }, 6000)
    }, 1000);
}
