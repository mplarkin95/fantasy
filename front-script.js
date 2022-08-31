// ==UserScript==
// @name        ASD - espn.com
// @namespace   Violentmonkey Scripts
// @match       https://fantasy.espn.com/football/team
// @grant       none
// @version     1.0
// @author      -
// @description 8/30/2022, 11:12:47 PM
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js 
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1
// @require https://cdnjs.cloudflare.com/ajax/libs/axios/0.27.2/axios.min.js
// ==/UserScript==
const DATAURL = 'http://localhost:3000/user';
const LINEUPSIZE = 9;
const getValues = (element) => {

  const children = $(element).children();
  const position = $(children[0]).children()[0].title;
  
  const name = $(children[1]).children()[0].title;
  const button = $(children[2]).find('button');
  const proj = $(children[5]).find('span');
  const projValue = parseFloat(proj.text());
  
  return {
    position, 
    name, 
    button, 
    proj,
    projValue
  }
  
};

const buildPlayerArray = () => {
  const mainTable = $('.Table__TBODY');
  const players = [];
  mainTable.children().each(function(){
    players.push({...getValues(this), element: this})
  });
  
  return players.filter(player => player.name && player.name !== 'Player')
}


//helper to replace with actual axios calls

const getUpdatedData = () => new Promise((resolve, reject) => {
 axios.get(DATAURL).then(res => { 
   resolve(res.data);
 })
});


const mainScript = async () => {
  
  await clearBench();
  
  
  const players = buildPlayerArray();
  
  const values = await getUpdatedData();
  players.forEach(player => {
    if(values[player.name]){
      player.projValue = values[player.name]
      $(player.proj).text(player.projValue);
    }
  });
  
  // create array that represents the position
  // organize the players based on value
  // update 
   
  
 
  

};

const clearBench = async() => {
  for(let i=LINEUPSIZE -1 ; i>=0; i--){
    await moveToBench(i);
  }
}

const moveToBench = async (value) => {

  try{
    

 $('.Table__TBODY').find(`[data-idx="${value}"]`).find('button')[0].click();
   const buttons = $('.Table__TBODY').find(`button`)
   $(buttons[buttons.length -1]).click()
  
  //wait for request
   return new Promise((resolve) => {setTimeout(() => {resolve()}, 2000)});
  }
  catch(e){
    console.log({value,error: e})
    return 
  }
  
}

VM.shortcut.register('c-i', () => {mainScript()});


