/* Keep the existing saved room coordinate system. Prevent a selected
 furniture piece from worsening a solid-object collision during a move. */
let pawHomeSuggesting=0;
const pawHomeContactSuggestBefore=pawFurnitureSuggested;
pawFurnitureSuggested=function(...args){
 pawHomeSuggesting++;
 try{return pawHomeContactSuggestBefore.apply(this,args)}finally{pawHomeSuggesting--}
};
function pawHomeContactPosition(candidate,previous,objects,width,kind,gap){
 if(!candidate||!previous||!Array.isArray(objects)||typeof gap!=='function'||!Number.isFinite(width))return candidate;
 if(![previous.x,previous.y,candidate.x,candidate.y].every(Number.isFinite))return candidate;
 // Check each solid object, not only the worst existing overlap. An old
 // save may already overlap; permit recovery without adding a new overlap.
 for(const object of objects){
  const prior=gap(previous,[object],width,kind),next=gap(candidate,[object],width,kind);
  if(next<0&&next<prior-1e-8)return previous
 }
 return candidate
}
const pawHomeContactPlacementBefore=pawFurniturePlacement;
pawFurniturePlacement=function(id,x,y){
 const candidate=pawHomeContactPlacementBefore(id,x,y);
 if(pawHomeSuggesting||!hideoutEditing||id==='rug')return candidate;
 const selected=hideoutFurniture[hideoutSelected];
 if(!selected||selected.id!==id||furnitureZone(selected)!==komorebiZone)return candidate;
 const previous={x:Number(selected.x),y:Number(selected.y)};
 return pawHomeContactPosition(candidate,previous,mbHomeObjects(komorebiZone,hideoutSelected),furnitureWidth(id),mbHomeKind(id),mbHomeGap)
};
