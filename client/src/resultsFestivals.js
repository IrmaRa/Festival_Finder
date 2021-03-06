var ResultsFestivals = require('./resultsFestivals.js');
var FestivalsList = require("./festivalsList");
var user = require('./userId.js');

var ResultsFestivals = function( fav ) {
  this.userPath = "http://localhost:3000/api/users/festivals/" + user.id + "/";
  this.defaultSliderUrl = "http://localhost:3000/api/festivals/ratings/6";
  this.list = new FestivalsList( null );
  this.isFav =  fav || false;
}

ResultsFestivals.prototype = {

    renderSliderFestivals: function( urlRequest = this.defaultSliderUrl ){
        this.list.url = urlRequest;
        this.list.getData( this.createDetails.bind( this ));
    },

    createDetails: function(){
        var festivalList = document.getElementById('festival-div');
        festivalList.innerHTML = "";

        this.list.festivals.forEach(function( ele ){
            var festival = document.createElement('div');

            var image = document.createElement('img');
            var h3 = document.createElement('h3');
            var country = document.createElement('p');
            var date = document.createElement('p');

            var overlay = document.createElement('div');
            var overlayBody = document.createElement('div');

            var titleOverlay = document.createElement('h3');
            var description = document.createElement('p');
            var countryOverlay = document.createElement('p');
            var dateOverlay = document.createElement('p');
            var favButton = document.createElement('button');

            image.classList.add('festival-image');
            image.src = ele.image;

            h3.classList.add('festival-title');
            h3.innerText = ele.title;

            country.classList.add('festival-country');
            country.innerText = ele.country;

            date.classList.add('festival-date');
            date.innerText = ele.start;

            overlay.classList.add('overlay');
            overlayBody.classList.add('overlay-body');

            titleOverlay.classList.add('overlay-title');
            titleOverlay.innerText = ele.title;

            description.classList.add('overlay-description');
            description.innerText = ele.description;

            countryOverlay.classList.add('overlay-country');
            countryOverlay.innerText = ele.country;

            dateOverlay.classList.add('overlay-date');
            dateOverlay.innerText = ele.start + "/" + ele.end;

            if( this.isFav ){
              favButton.classList.add('fav-button');
              favButton.innerText = "Delete";
              favButton.value = ele._id;
              favButton.addEventListener( 'click', this.handleButtonRemoveFromFavourites.bind( this ) );
            } else {
              favButton.classList.add('fav-button');
              favButton.innerText = "Add to favourites";
              favButton.value = ele._id;
              favButton.addEventListener( 'click', this.handleButtonAddToFavourites.bind( this ) );
            }

            overlayBody.appendChild(favButton);
            overlayBody.appendChild(titleOverlay);
            overlayBody.appendChild(description);
            overlayBody.appendChild(countryOverlay);
            overlayBody.appendChild(dateOverlay);

            festival.classList.add('festival');

            festival.appendChild(image);
            festival.appendChild(h3);
            festival.appendChild(country);
            festival.appendChild(date);

            overlay.appendChild(overlayBody);

            festivalList.appendChild(festival);
            festival.appendChild(overlay);

        }.bind( this ))
    },

    handleButtonAddToFavourites: function ( event ) {
      var request = new XMLHttpRequest();
      request.open('POST', this.userPath );
      request.setRequestHeader("Content-Type", "application/json");

      var modal = document.getElementById('myModal');
      var span = document.getElementsByClassName("close")[0];
      modal.style.display = "block";
      span.onclick = function() {
          modal.style.display = "none";
      }

      request.onreadystatechange = function () {
        //something to do when the information has saved
      }.bind( this )
      request.send(JSON.stringify( { "id": event.target.value }));
    },

    handleButtonRemoveFromFavourites: function ( event ) {
      var festivalId = event.target.value;
      var request = new XMLHttpRequest();
      var apicall = this.userPath;
      apicall += festivalId;
      request.open('DELETE', apicall);
      request.setRequestHeader("Content-Type", "application/json");

      request.onreadystatechange = function () {
        this.renderSliderFestivals( this.userPath );
        //something to do when the information has saved
      }.bind( this )
      request.send();
    }

}

module.exports = ResultsFestivals;
