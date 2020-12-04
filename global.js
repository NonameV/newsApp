const apiBody = 'https://jsonplaceholder.typicode.com/' // тело api
const btnOutputusersList = document.querySelector('.output-users-list')
const formColumn = document.querySelector('.right-col')
const createNewUserBtn = document.querySelector('.create-new-user')


document.addEventListener('DOMContentLoaded', function(){
    M.AutoInit();
})

function http(){
    return{
        get(url, cb){
            try{
                console.log(url)
                const xhr = new XMLHttpRequest()
                xhr.open('GET', url)
                xhr.addEventListener('load', ()=>{
                if(Math.floor(xhr.status / 100) !== 2){
                    cb(`Error status code: ${xhr.status}`, xhr)
                    return
                }
                const response = JSON.parse(xhr.responseText)
                cb(null, response)
            })

            xhr.send()
            }catch(error){
                cb(error)
            }            
        },
        post(url, body, headers, cb){
            try{
                const xhr = new XMLHttpRequest()
                xhr.open('POST', url)
                xhr.addEventListener('load', ()=>{
                if(Math.floor(xhr.status / 100) !== 2){
                    cb(`Error status code: ${xhr.status}`, xhr)
                    return
                }
                const response = JSON.parse(xhr.responseText)
                cb(null, response)
                })
                if(headers){
                    Object.entries(headers).forEach(([key, value]) => {
                        xhr.setRequestHeader(key, value)
                    })
                }
                xhr.send(JSON.stringify(body))
            }catch(error){
                cb(error)
            }
            
        }
    }
}
let httpReq =  http()

const newServiceModule = (function(){
    const apiKey = 'd47d4b5885f54652a96d69be5159a3d7'
    const apiUrl = 'https://news-api-v2.herokuapp.com/'
    return {
        topHeadlinesNews(cb, countryValue = 'ua', categoryValue='general'){
            httpReq.get(`${apiUrl}top-headlines?country=${countryValue}&category=${categoryValue}&apiKey=${apiKey}`, cb)
        },
        everythingNews(cb, searchValue){
            httpReq.get(`${apiUrl}everything?q=${searchValue}&apiKey=${apiKey}`, cb)
        }
    }
})()

//функция подгрузки новостей
function loadNews(cb, value, value2 ){
    const newContainer = document.querySelector('.container-for-news')
    newContainer.innerHTML = ''
    cb(getTopHeadlinsNews, value, value2 )
}
//функция получает пользователей
function getTopHeadlinsNews(err,res){
    if(err){
        console.log(err,res)
        return
    }
    const newContainer = document.querySelector('.container-for-news')
    res.articles.forEach((e)=>{newContainer.insertAdjacentHTML('afterbegin', createNewArticle(e))})
}
//функция шаблон одной новости
function createNewArticle({urlToImage, title, description, url} = el){
    return `
        <div class="col s12">
            <div class="card">
            <div class="card-image">
                <img src="${urlToImage || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAGFBMVEXu7u7////x8fH6+vr4+Pjz8/Ps7Oz8/Py4s1XmAAABZ0lEQVR4nO3ay3KCMBiAUUjAvP8b12C5hDBTnHbs4j9n4wgs5JsIiTIMAAAAAAAAAAAAAAAAAAAAAAAA8HtTfkP670/7GWV8w/zfn/Yzyjinm3KcJre/EJMmHU16mvQ0qdpdmgyp3qbzYYMmaRxLflbZt2jymqHlcdq2hG+SxrK8HgZK+Cbz9wApmmyMkwvP68mj7nY92bnvXDA/uWQe+xNNepr0NKnaBpoMdbHTRNCkJml/qY/bJK0nnscyN1HCNklrhlynsE2UqE3S+tdWfs3qj1GCNnkmmWqGR14XOocoMZvUJEuGsq/99ighm7ySLBkOy+EtSsQma5LTpXV7F7DJnuQiSj0oXpNjki5KzHHSJjlHWURrck5yFSVYkz7JRZRgTaY+SR8lWJPh8mxn6+LerEmv2adJT5NeoCZ3j3wEanL7yfISp4lny8/uPlheBUkCAAAAAAAAAAAAAAAAAAAAAADwp74AydkHqoR6X2cAAAAASUVORK5CYII='}">
                <span class="card-title">${title || ''}</span>
            </div>
            <div class="card-content">
                <p>${description || ''}</p>
            </div>
            <div class="card-action">
                <a href="${url || "#"}">Источник</a>
            </div>
            </div>
        </div>

    `
}


const searchBtn = document.querySelector('.search-btn')

searchBtn.addEventListener('click', function(e){
    e.preventDefault()  
    const searchEveryValue = document.querySelector('.search-eveting').value
    const selectValue = document.querySelector('select').value
    const secondSelectValue = document.querySelector('.category-select').value
    
    if(searchEveryValue){
        loadNews(newServiceModule.everythingNews, searchEveryValue )
        return
    }  
    loadNews(newServiceModule.topHeadlinesNews, searchEveryValue, secondSelectValue)
    }    
)




