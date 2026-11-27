/* Read-only planning for Paw Coins. Prices, reward eligibility and ownership
   always come from the existing game ledger. Never grant or deduct coins. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PawEconomy=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const money=n=>Number.isSafeInteger(n)&&n>=0;
 function quote(balance,price,owned=false,available=true){
  if(!money(balance)||!money(price))return null;
  const needed=owned?0:Math.max(0,price-balance);
  return {price,balance,owned:!!owned,available:!!available,affordable:!owned&&available&&needed===0,needed,progress:owned||price===0?1:Math.min(1,balance/price),remaining:!owned&&available&&needed===0?balance-price:balance}
 }
 function rewards(categories,claimed,prizes,checkedIn){
  if(!Array.isArray(categories)||!Array.isArray(claimed)||!Array.isArray(prizes))return null;
  const seen=new Set(),done=new Set(claimed),open=[];
  for(const item of categories){
   if(typeof item?.id!=='string'||!item.id||seen.has(item.id)||!money(item.amount)||item.amount===0)return null;
   seen.add(item.id);if(!done.has(item.id))open.push({id:item.id,amount:item.amount})
  }
  if(!prizes.length||prizes.some(v=>!money(v)))return null;
  const activityMax=open.reduce((n,x)=>n+x.amount,0),wheelMin=checkedIn?0:Math.min(...prizes),wheelMax=checkedIn?0:Math.max(...prizes);
  if(!money(activityMax+wheelMax))return null;
  return {open,activityMax,wheelMin,wheelMax,possible:activityMax+wheelMax}
 }
 function expansionGoals(balance,catalogue,owned){
  if(!money(balance)||!Array.isArray(catalogue)||!Array.isArray(owned))return [];
  const ids=['roomExtension','roomStudio'],has=new Set(owned),out=[];
  for(const id of ids){
   const item=catalogue.find(v=>Array.isArray(v)&&v[0]===id&&v[4]==='extension');
   if(!item||!money(item[3]))continue;
   const q=quote(balance,item[3],has.has(id),id!=='roomStudio'||has.has('roomExtension'));
   out.push({id,...q,requires:id==='roomStudio'&&!has.has('roomExtension')?'roomExtension':null})
  }
  return out
 }
 function afterOptionalRewards(goal,earn){
  if(!goal||!money(goal.needed)||!earn||!money(earn.possible))return null;
  return {neededNow:goal.needed,neededAfterAllAvailable:Math.max(0,goal.needed-earn.possible),couldAffordToday:goal.available&&!goal.owned&&goal.needed<=earn.possible};
 }
 return Object.freeze({quote,rewards,expansionGoals,afterOptionalRewards});
});
