const readingTime = (article) => {
    const noOfWords = article.split(' ').length
    const WPM = noOfWords / 150
    return Math.round(WPM) === 0 ? 1 : Math.round(wordsPerMinute)
}

module.exports = { readingTime }