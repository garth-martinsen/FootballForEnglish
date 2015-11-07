var allArray = [1,2,3,4,5,6,7,8,9,10];
var diminishingArray = allArray.slice(0, allArray.length);

var finalArray=[];
var getNextRandomIndex= function(da){
 return Math.floor((Math.random() * da.length) );
}

var populateFinalArray=function(theDA){
while( theDA.length>0){
  var ndx = getNextRandomIndex(theDA);
  finalArray.push(theDA[ndx]);
  theDA.splice(ndx,1);
//console.log('final: '+ finalArray);
//console.log('diminishingArray: ' + theDA);
}
console.log('finalArray: ' + finalArray); 
}
console.log('put the members of allArray: ' + allArray + '  in random order. ' );
populateFinalArray(diminishingArray);
