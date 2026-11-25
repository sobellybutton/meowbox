
/* Five original collectible cats now carry their own recognisable accessories. */
const townFigureBefore=bagFigureIcon;
bagFigureIcon=function(v){
 const art=townFigureBefore(v);if(v[5])return art;
 const decorations=[
 '<path d="M16 43l13 5-2 9-14-4z" fill="#a9b9a4" stroke="#657761"/><path d="M19 46l6 2" stroke="#f8f2d8"/>',
 '<path d="M38 44h15l-2 12H40z" fill="#b99773" stroke="#765c43"/><path d="M42 47h8M42 50h6" stroke="#fff2d9"/>',
 '<path d="M40 43l14 3-2 10-14-3z" fill="#e8ce8e" stroke="#987b54"/><path d="M43 47l8 2" stroke="#9b7c5d"/>',
 '<path d="M40 13a9 9 0 1 0 11 12a8 8 0 0 1-11-12" fill="#eed393" stroke="#c79f65"/>',
 '<path d="M22 15l5-8 5 7 6-7 4 9-3 6H25z" fill="#e7c269" stroke="#9e7945"/><circle cx="32" cy="18" r="2" fill="#b8675d"/>'
 ];
 return art.replace('</svg>',(decorations[boxPrizes.findIndex(p=>p[0]===v[0])]||'')+'</svg>')
};
const townNameBefore=drawMeowActorName;
drawMeowActorName=function(a,value,indoorScale=null){
 if(!a||!Number.isFinite(a.x)||!Number.isFinite(a.y))return;
 const q=meowPasserLabels.get(a);if(q?.offset&&Math.hypot(q.offset.x,q.offset.y)>25)q.offset=null;
 return townNameBefore(a,value,indoorScale)
};
const townThreeBefore=threeMove;
threeMove=function(board,expert,random=Math.random){
 if(expert)return townThreeBefore(board,true,random);
 const free=board.flatMap((v,i)=>v?[]:[i]);if(!free.length||threeWinner(board))return -1;
 for(const i of free){board[i]=2;const win=threeWinner(board)?.who===2;board[i]=0;if(win)return i}
 if(random()<.45)return free[Math.min(free.length-1,Math.floor(random()*free.length))];
 return townThreeBefore(board,true,random)
};
const townFinishCss=document.createElement('style');townFinishCss.textContent=`
#page .figureCabinetTile strong{line-height:1.25;min-height:2.5em}
#page .figureCabinetTile button:focus-visible,#page .bagSlot:focus-visible,#game .worldSign:focus-visible{outline:3px solid #d5a55e!important;outline-offset:2px}
#page .bagSlot small{line-height:1.25}
#game #dialogue #choices button{min-height:44px}
#page input[type=search],#page input[type=text],#page textarea{font-size:16px}
@media(prefers-reduced-motion:reduce){#game .worldSign,#game #dialogue,#page .bagSlot,#page .figureCabinetTile{transition:none!important;animation:none!important}}
`;document.head.append(townFinishCss);
