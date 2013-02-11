exports.generate = function(n){
  var results = [];
  for(var i = 0; i < n; i++){
    results.push({
      id: i,
      x: Math.random() * 550,
      nextx: Math.random() * 550,
      y: Math.random() * 550,
      nexty: Math.random() * 550,
      r: 10
      });
  }
  return results;
}
exports.resetData = function(d){
  var data = d;
  for(var i = 0; i < data.length; i++){
    data[i] = {
      id: i,
      x: data[i].nextx,
      y: data[i].nexty,
      nextx: Math.random() * 550,
      nexty: Math.random() * 550,
      r: 10};
  }
  return data;
}


