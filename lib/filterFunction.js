module.exports = (array,queryFilter, queryObject)=>{
    const newArray = array.filter((issue)=>{
        if(queryFilter === 'open' && queryObject[queryFilter] === 'true') queryObject[queryFilter] = true
        if(queryFilter === 'open' && queryObject[queryFilter] === 'false') queryObject[queryFilter] = false
        return issue[queryFilter]  === queryObject[queryFilter]
    })
    return newArray
}