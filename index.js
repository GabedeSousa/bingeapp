const form = document.getElementsByClassName("input-group")[0]
const myshowbtn= document.getElementById("my-shows")
const parent = document.getElementById("show")
const searchResults = document.getElementsByClassName("div search-result")[0]
const logoutbtn=document.getElementById("logout")

myshowbtn.addEventListener("click", event => showUserShows())
form.addEventListener("submit", event => handleSearch(event))

showUserShows()

//handles the search bar input
function handleSearch(e) {
  e.preventDefault()
  fetch(`http://api.tvmaze.com/search/shows?q=${e.target.title.value}`)
  .then(resp => resp.json())
  .then(resp=> {parent.innerText = ""
    resp.forEach( title =>makeCard(title))
})
}

//--------TO DO------------
//HANDLE CASE OF NO IMAGE AVAILABLE
//FILL IN SHOW DATA
//CONFIRM POPULATION OF CSS ELEMENTS
function makeCard(title) {
  let card = document.createElement('div')
  card.className = "col-md-4 card-tvshow"
  let div1=document.createElement('div')
  div1.className="container-fluid"
  let div2=document.createElement('div')
  div2.className="row"
  div2.innerHTML =`
        <div class="col-sm-12 cardimage">
          <img src="${title.show.image.original}" alt="">
        </div>`
  let div3=document.createElement('div')
  div3.className="container information-box"
  let div4=document.createElement('div')
  div4.className="row"
  div4.innerHTML =`
      <div class="col-sm-6 information-left">
        <h3>${title.show.name}</h3>
        <h6>${title.show.network.name} - ${title.show.premiered}</h6>
      </div>`

  let follow=document.createElement('div')
  follow.className="col-sm-6 information-right"
  follow.innerHTML =`
        <div class="">
          <div class="follow" style= "cursor: pointer">
              <img src="img/plus.png" alt="">
        </div>`

  div4.append(follow)
  div3.appendChild(div4)
  div2.appendChild(div3)
  div1.appendChild(div2)
  card.appendChild(div1)
  parent.appendChild(card)
  follow.addEventListener('click', event => handleFollow(event, title))
}

//TO DO
function handleFollow(e,object){ 
  let data ={ "user_id": sessionStorage.getItem("user"),
                  "api_id": object.show.id,
                  "title": object.show.name
                  }
      fetch('http://localhost:3000/user_shows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then(response => response.json())
      .then(data => {
        showUserShows()
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
      
}

//send a user eventually...
function showUserShows() {
  parent.innerText = ""
  fetch(`http://localhost:3000/user_shows/${sessionStorage.getItem("user")}`)
  .then(resp=> resp.json())
  .then(resp=>{
    resp.forEach(usershow => getAPIshow(usershow))})
}

function getAPIshow(usershow){
  console.log(usershow)
  fetch(`http://api.tvmaze.com/shows/${usershow.show.api_id}`)
  .then(resp => resp.json())
  .then(resp=> makeusercards(resp, usershow))
}

function makeusercards(title, usershow){
  let card = document.createElement('div')
  card.className = "col-md-4 card-tvshow"
  let div1=document.createElement('div')
  div1.className="container-fluid"
  let div2=document.createElement('div')
  div2.className="row"
  div2.innerHTML =`
        <div class="col-sm-12 cardimage">
          <img src="${title.image.original}" alt="">
        </div>`
  let div3=document.createElement('div')
  div3.className="container information-box"
  let div4=document.createElement('div')
  div4.className="row"
  div4.innerHTML =`
      <div class="col-sm-6 information-left">
        <h3>${title.name}</h3>
        <h6>${title.network.name} - ${title.premiered}</h6>
        <img src="img/seo-and-web.png" alt="">
      </div>`

  let follow=document.createElement('div')
  follow.className="col-sm-6 information-right"
  follow.innerHTML =`
        <div class="">
          <div class="follow" style= "cursor: pointer">
              X
        </div>`
  let info=document.createElement('div')
  info.className="col-sm-6 information-right"
  info.innerHTML =`     
      <div class="information-button">
        <a data-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
          <img src="img/Information.png" alt="">
        </a>  
      </div>`

  div4.append(follow,info)
  div3.appendChild(div4)
  div2.appendChild(div3)
  div1.appendChild(div2)
  card.appendChild(div1)
  parent.appendChild(card)
  info.addEventListener('click',event => showInfo(title, usershow))
  follow.addEventListener('click', event => handleDelete(usershow))
}

function handleDelete(usershow){
      fetch(`http://localhost:3000/user_shows/${usershow.id}`, {
        method: 'DELETE',
      })
      .then(showUserShows()) 
}

function showInfo(title, usershow){
  parent.innerText = ""
  makeusercards(title)
  fetch(`http://localhost:3000/episodes/${usershow.show_id}`)
  .then(resp => resp.json())
  .then(resp=> addEpisodes(resp))

}

function addEpisodes(episodes) {
let div= document.getElementsByClassName("col-sm-12")[1]

episodes.forEach(ep => {
  let li =document.createElement('li')
  li.innerText=`name: ${ep.name}- season: ${ep.season}`
  div.appendChild(li)
})
}

//USER LOGIN STUFF
start()
function start() {
//IF NOT SIGNED IN SHOW LOGIN HTML
if (!sessionStorage.getItem("user")){
  let body=document.getElementsByTagName('body')[0]
  body.innerText=""
  let loginbtn=document.createElement('button')
  loginbtn.innerText="LOGIN"
  let signupbtn=document.createElement('button')
  signupbtn.innerText="SIGNUP"
  body.append(loginbtn,signupbtn)
  signupbtn.addEventListener('click', ()=> signuporlogin(event, true))
  loginbtn.addEventListener('click', ()=> signuporlogin(event, false))
}

//SIGN UP
  function signuporlogin(event, signup){
    let body=document.getElementsByTagName('body')[0]
    body.innerHTML=""
    let form=document.createElement("form")
    form.innerHTML=  `<label for="uname"><b>Username</b></label>
    <input type="text" placeholder="Enter Username" name="uname" required>
    <label for="uname"><b>Location</b></label>
    <input type="text" placeholder="Enter Location" name="location" required>
    <button type="submit">Signup</button>`
    body.append(form)
    form.addEventListener('submit', (event)=>{
      event.preventDefault()
      let username=event.target.uname.value
      let location=event.target.location.value
      signup? makeUser(username, location): findUser(username, location)
    })
  }

  function makeUser(uname, loc){
    const data = { username: uname, 
                  location: loc };
                 
    fetch('http://localhost:3000/users', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
      sessionStorage.setItem("user", data.id)
      console.log(data, sessionStorage.getItem("user"))
      console.log('Success:', data)
      location.reload()
    })
    .catch((error) => {
      console.error('Error:', error)
})
  }

  function findUser(uname, loc){
    fetch('http://localhost:3000/users')
    .then(resp=> resp.json())
    .then(resp=>{
      user=resp.find(user => user.username==uname && user.location==loc)
      if (user)
      {
        sessionStorage.setItem("user", user.id)
        location.reload()
      }
      else {
        location.reload()
      }
    })
  }

logoutbtn.addEventListener("click", () => {
  sessionStorage.clear()
  location.reload()
} 
)
}