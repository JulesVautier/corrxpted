function showAchievement(id) {
    setTimeout(function () {
        const achievement = document.getElementById(id)
        achievement.classList.add("achievement-show-pos")
        setTimeout(function () {
            achievement.classList.add("achievement-fade-away")
        }, 6000)
    }, 1000);
}
