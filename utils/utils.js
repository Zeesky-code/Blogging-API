const readingTime = (blog) => {
    const noOfWords = blog.split(' ').length
    const WPM = noOfWords / 150
    return Math.round(WPM) === 0 ? 1 : Math.round(WPM)
}
const filterBy = (req, res, next) => {
    const { author, title, tags } = req.query
    req.findFilter = {}
    if (author){
        req.findFilter.author = new RegExp(`${author}`, 'gi')
    }
    if (title){
        req.findFilter.title = new RegExp(`${title}`, 'gi')
    } 
    if (tags) {
        const tagAttributes = tags.split(',').map(tag => new RegExp(`${tag}`, 'gi'))
        req.findFilter.tags = { $in: tagAttributes }
    }
    next()
}
module.exports = { readingTime, filterBy }