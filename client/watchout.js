var socket = io.connect('http://localhost');

var data = [];
var currentScore = 0;
var topScore = 0;
var player = null;

var gameBox = d3.select("#gameBox");

var svg = gameBox.append("svg:svg")
  .attr("padding", '100px')
  .attr("width", 800)
  .attr("height", 800);

var playerDot = svg.selectAll('circle .player')
    .data([{x:400, y:400}]);

var updatePlayers = function(data){

  console.log("Update Players: " + data);
  var playerDots = svg.selectAll('circle .player')
    .data(data.data)
    .enter().append('circle')
    .attr("cy", function(d){return d.y})
    .attr("cx", function(d){return d.x})
    .attr("text", function(d){return d.id})
    .attr("r", function(d){return 15})
    .attr('class', 'player')
    .remove();
}


playerDot
    .enter()
    .append('circle')
    .attr('class', "player")
      .attr("cy", function(d){return d.y})
    .attr("cx", function(d){return d.x})
    .attr("r", function(d){return 15})
    .call(d3.behavior.drag().on("drag", move));

function move(){
    this.parentNode.appendChild(this);
    var dragTarget = d3.select(this);
    dragTarget
        .attr("cx", function(){return d3.event.dx + parseInt(dragTarget.attr("cx"))})
        .attr("cy", function(){return d3.event.dy + parseInt(dragTarget.attr("cy"))});
    socket.emit("playerPosition", { x: parseInt(playerDot.attr("cx")) , y: parseInt(playerDot.attr("cy")), player: player})

};

var update = function(data){
  var dots = svg.selectAll('circle:not(.player)')
        .data(data);
  dots.enter().append('circle');
  dots.transition()
    .duration(2000)
    .attr("r", function(d){return 15})
    .tween('custom', tweenCheckCollision); 

}

var tweenCheckCollision = function(dot){
  var d3Dot = d3.select(this);
  //console.log("Dot Number: "+ d3Dot.datum().id)
  return function(t){
    // checkCollision(dot);
    d3.select('.currentScore').text(currentScore);
    var startPos = {
      x: dot.x,
      y: dot.y
    }
    var endPos = {
      x: dot.nextx,
      y: dot.nexty
    }
    var nextPos = {
      x: startPos.x + (endPos.x - startPos.x)*t,
      y: startPos.y + (endPos.y - startPos.y)*t,
      r: parseInt(d3Dot.attr('r'))
    }
    //console.log("moving to x:" + nextPos.x + "moving to y:" + nextPos.y)
    d3Dot.attr('cx', nextPos.x)
      .attr('cy', nextPos.y);
    checkCollision(nextPos);
  }
}
var checkCollision = function(dot){
  var radiidistance = dot.r + parseInt(playerDot.attr("r"));
  var a = (dot.x - playerDot.attr("cx"));
  var b = (dot.y - playerDot.attr("cy"));
  var c = Math.sqrt( (a*a) + (b*b) );
  if(c < radiidistance)
    onCollision();
}

var onCollision = function (){
  if (currentScore > topScore){
    topScore = currentScore;
    d3.select('.topScore').text(topScore);  
  }
  currentScore = 0;
  //console.log("There was a collision")

}
var increaseScore = function(){
  currentScore += 1;
  
}
setInterval(increaseScore, 100);

socket.on('newData', function(d) {
  data = d.data;
  update(data);
  // console.log("X: "+ data[0].x, "Y:"+data[0].y );
  // console.log("nextX: "+ data[0].nextx, "nextY:"+data[0].nexty );

});

socket.on('newPlayer', function(d){
  player = d.player;
  console.log("Player ID: " +player);
})

socket.on("playerPositions", function(data){
  updatePlayers(data);
});



