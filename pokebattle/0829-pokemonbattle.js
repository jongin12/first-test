// const getApi = (number,LR) => {
//   const _BASIC_URL = `https://pokeapi.co/api/v2/pokemon/${number}`;
//   const request = new XMLHttpRequest();
//   request.open("GET", _BASIC_URL);
//   request.responseType = "json";
//   request.send();
//   request.addEventListener('load', () => {
//     const _POKEMON_API = request.response;
//     // 상수 _POKEMON_API 데이터가 사장놈이 가져온 데이터이다.
//     LR.children[0].setAttribute('src',_POKEMON_API.sprites.front_default);


//     let monster = new Monster(
//       _POKEMON_API.name,
//       _POKEMON_API.stats[0].base_stat,
//       _POKEMON_API.stats[1].base_stat,
//       _POKEMON_API.stats[2].base_stat,
//     )

//     list.push(monster);
//   });
// }

function getApi(number, LR) {
  return new Promise((resolve,reject) => {
    const _BASIC_URL = `https://pokeapi.co/api/v2/pokemon/${number}`;
    const request = new XMLHttpRequest();
    request.open("GET", _BASIC_URL);
    request.responseType = "json";
    request.send();
    request.addEventListener('load', () => {
      const _POKEMON_API = request.response;
      // 상수 _POKEMON_API 데이터가 사장놈이 가져온 데이터이다.
      LR.children[0].setAttribute('src',_POKEMON_API.sprites.front_default);
    
    
      let monster = new Monster(
        _POKEMON_API.name,
        _POKEMON_API.stats[0].base_stat,
        _POKEMON_API.stats[1].base_stat,
        _POKEMON_API.stats[2].base_stat,
      )
      // list.push(monster);
      resolve(monster);
    });
  })
}




function Monster(name,hp,att,def) {
  this.name = name
  this.hp = hp
  this.att = att
  this.def = def
}
const list = [];
const data = {
  switch : {
    turn : true,
    clickBox : 'main',
  },
  enemy : [],
}

function createTag (target, number, tagname) {
  for (let i = 0; i < number; i++) {
    let createDiv = document.createElement(tagname);
    target.appendChild(createDiv);
  }
  return target.children;
}
function styling(target, style){
  for(const key in style) {
    target.style[key] = style[key];
  }
}

const click = document.getElementById('click');
const left = document.getElementById('left');
const right = document.getElementById('right');

const pickup = (LR) => {
  let randomNumber = Math.floor(Math.random()*890+1);
  getApi(randomNumber,LR).then((result)=>{
    list.push(result);
  });
}
pickup(left);
pickup(right);

setTimeout(function(){
  data.me = list[0];
  data.enemy[0] = list[1];
  console.log(data);
  left.children[1].children[0].textContent = data.me.name;
  left.children[1].children[1].textContent = '체력 : '+ data.me.hp;
  left.children[1].children[2].textContent = '공격력 : '+ data.me.att;
  left.children[1].children[3].textContent = '방어력 : '+ data.me.def;
  right.children[1].children[0].textContent = data.enemy[0].name;
  right.children[1].children[1].textContent = '체력 : '+ data.enemy[0].hp;
  right.children[1].children[2].textContent = '공격력 : '+ data.enemy[0].att;
  right.children[1].children[3].textContent = '방어력 : '+ data.enemy[0].def;
},500)//! Api를 가져오는 시간때문에 setTimeout없으면 값이 안나옴.

const stats = function(LR){
  LR.children[1].style.height = '100px';
  LR.children[1].style.display = 'flex';
  LR.children[1].style.flexWrap = 'wrap';
  for(let i=0;i<4;i++){
    LR.children[1].children[i].style.width = '50%';
    LR.children[1].children[i].style.height = '50%';
    LR.children[1].children[i].style.display = 'flex';
    LR.children[1].children[i].style.justifyContent = 'center';
    LR.children[1].children[i].style.alignItems = 'center';
  }
}
stats(left);
stats(right);

styling(click,{
  display : 'flex',
  flexDirection : 'column',
  justifyContent : 'space-evenly',
  alignItems : 'center',
})

for(let i=0;i<2;i++){
  styling(click.children[i],{
    width : '90%',
    height : '45%',
    backgroundColor : 'blue',
    display : 'flex',
    flexWrap : 'wrap',
    justifyContent : 'space-evenly',
    alignItems : 'center',
  })
}

const button = createTag(click.children[1],4,'div');
for(let i=0;i<4;i++){
  styling(button[i],{
    width : '40%',
    height : '40%',
    backgroundColor : 'white',
    display : 'flex',
    justifyContent : 'center',
    alignItems : 'center',
  })
}
button[0].textContent = '공격'
button[1].textContent = '기술'
button[2].innerHTML = '가방'
button[3].textContent = '도망간다'


const log = document.getElementById('log');
const message = (message) => {
  let li = document.createElement('li');
  var list = document.createTextNode(message);
  li.appendChild(list);
  log.appendChild(li);
}

const resetHp = function() {
  left.children[1].children[1].textContent = '체력 : '+data.me.hp;
  right.children[1].children[1].textContent = '체력 : '+data.enemy[0].hp;
}

const attack = (attacker, defender) => {
  let damage = Math.floor(attacker.att*(1-(defender.def/(defender.def+100))))
  defender.hp = defender.hp - damage
  message(attacker.name +'가 '+defender.name+'에게 '+damage+'의 피해를 입혔다!' )
  resetHp();
  if(data.me.hp<=0){
    message('패배');
    data.switch.turn = 'end';
    turnbox.textContent = '끝';
  }
  if(data.enemy[0].hp<=0){
    message('승리');
    data.switch.turn = 'end';
    turnbox.textContent = '끝';
  }
}

const heal = (target,value) => {
  let heal = value;
  target.hp += heal;
  message(target.name+'의 체력을 '+value+' 회복했다!')
  resetHp();
}

const animation = (LR) => {
  let move = 0;
  let moves =  setInterval(()=>{
    LR.children[0].style.left = move+'px';
    move += 15;
    if(move>30){
      clearInterval(moves);
      LR.children[0].style.left = '0px';
    }
  },200)
}

const turnbox = click.children[0];
turnbox.style.color = 'white';
turnbox.textContent = '내 턴';

const turnchange =() =>{
  if(data.switch.turn === true){
    data.switch.turn = false;
    turnbox.textContent = '상대 턴';
    setTimeout(()=>{
      turnchange();
      boxChange('main');
      attack(data.enemy[0],data.me);
      animation(left);
    },2000)
  } else if(data.switch.turn === false) {
    data.switch.turn = true;
    turnbox.textContent = '내 턴';
  }
}
//클릭박스 위쪽에 턴 상황 표시

let clickText = {
  main : ['공격','기술','가방','도망간다'],
  skill : ['???','!!!','?!?','뒤로'],
  bag : ['회복약','고급<br>회복약','???','뒤로'],
}

const boxChange = (value) =>{
  data.switch.clickBox = value;
  if(value === 'main'){
    for(let i=0;i<4;i++){
      button[i].innerHTML = clickText.main[i];
    }
  }else if(value === 'skill'){
    for(let i=0;i<4;i++){
      button[i].innerHTML = clickText.skill[i];
    }
  }else if(value === 'bag'){
    for(let i=0;i<4;i++){
      button[i].innerHTML = clickText.bag[i];
    }
  }
}

button[0].addEventListener('click',function(){
  if(data.switch.turn === true && data.switch.clickBox === 'main'){
    animation(right);
    attack(data.me,data.enemy[0]);
    turnchange();
  }else if(data.switch.turn === true && data.switch.clickBox === 'bag'){
    turnchange();
    heal(data.me,15);
    boxChange('main');
  }
})//? 공격

button[1].addEventListener('click',function(){
  if(data.switch.turn === true && data.switch.clickBox === 'main'){
    alert('미구현');
  }else if(data.switch.turn === true && data.switch.clickBox === 'bag'){
    turnchange();
    heal(data.me,30);
    boxChange('main');
  }
})//! 기술(미구현)

button[2].addEventListener('click',function(){
  if(data.switch.turn === true && data.switch.clickBox === 'main'){
    boxChange('bag');
  }else if(data.switch.turn === true && data.switch.clickBox === 'bag'){
    turnchange();
    heal(data.enemy[0],10);
    boxChange('main');
  }
})//? 가방 // 누르면 clickBox 바뀜

button[3].addEventListener('click',function(){
  if(data.switch.turn === true && data.switch.clickBox === 'main'){
    alert('미구현');
  }else if(data.switch.turn === true && data.switch.clickBox === 'bag'){
    boxChange('main');
  }
})//! 도망가기 (미구현)













//(위력x공격력x(레벨x급소x2/5+2)/방어/50+2)x자속보정x타입상성1x타입상성2x랜덤수/255
//레벨 1


