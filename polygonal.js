+function() {
  this.Polygonal = function() {
    this.imageInput = document.getElementById('imageInput');
    this.canvas = document.getElementById('imageDisplay');
    this.context = this.canvas.getContext('2d');
  }

  Polygonal.prototype.initialize = function() {
    initializeEvents.call(this);
  }

  Polygonal.prototype.polygonize = function() {
    //createHaltonSequence();
    //createDelaunayTriangles();
    //setColors();
    //emphasize();
  }

  function initializeEvents() {
    this.imageInput.addEventListener('change', handleFile.bind(this), false);
    function handleFile(e) {
      var _ = this;
      var reader = new FileReader();
      reader.onload = function(event){
          var img = new Image();
          img.onload = function(){
            _.canvas.width = img.width;
            _.canvas.height = img.height;
            _.context.drawImage(img, 0, 0);
          }
          img.src = event.target.result;
      }
      reader.readAsDataURL(e.target.files[0]);
    }
  }
}();


window.onload = function() {
  var ply = new Polygonal();
  ply.initialize();

  // Give user input to pick number of points and possibly
  // percent darkened? User must hit another button to run
  // polygonize.

}
