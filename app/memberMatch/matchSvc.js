'use strict';

angular.module('starry').service('matchSvc', matchSvc);

function matchSvc (){
  this.calculateBounding = function (pos, d){
    var r = (d*1.60934)/6371;
    var maxLat = pos.lat +r;
    var minLat = pos.lat -r;
    var deltLon = Math.asin(Math.sin(r)/Math.cos(pos.lat));
    var maxLon = pos.lon + deltLon;
    var minLon = pos.lon - delLon;
    return {
      maxLat: maxLat,
      minLat: minLat,
      maxLon: maxLon,
      minLon: minLon
    }

  }

  this.filterOutLocation = function (pos, members, d){
    return members.filter(function (member){
      var dist = Math.acos(Math.sin(member.lat)*Math.sin(pos.lat)+Math.cos(member.lat)*Math.cos(pos.lat)*Math.cos(member.lon-pos.lon))*6371;
      return dist<=(d*1.60934);
    })
  }
}