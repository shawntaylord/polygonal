+function() {
  this.Polygonal = function() {
    this.imageInput = document.getElementById('imageInput');
    this.canvas = document.getElementById('imageDisplay');
    this.context = this.canvas.getContext('2d');
    this.MAX_NUM_POINTS; // use for calculated range
    this.num_points = 200;
    this.BASE_X = 2;
    this.BASE_Y = 3;
    this.PADDING = 200;
  }

  Polygonal.prototype.initialize = function() {
    initializeEvents.call(this);
  }

  Polygonal.prototype.polygonize = function() {
    setPoints.call(this);
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
            _.MAX_NUM_POINTS = img.width * img.height;
            _.context.drawImage(img, 0, 0);
            setPoints.call(_);
          }
          img.src = event.target.result;
      }
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function halton(index, base) {
    var result = 0;
    var f = 1 / base;
    var i = index;
    var count = 1;
    while (i > 0) {
      result = result + f * (i % base);
      i = Math.floor(i / base);
      f = f / base;
      count++;
    }
    return result;
  }

  function setPoints() {
    var x,y;
    for (var i = 1; i <= this.num_points; i++) {
      x = halton(i, this.BASE_X) * (this.canvas.width + this.PADDING) - this.PADDING/2;
      y = halton(i, this.BASE_Y) * (this.canvas.height + this.PADDING) - this.PADDING/2;
      fadeInRectangle.call(this, x, y, 3, 3, 0);
    }
  }

  function fadeInRectangle(x, y, w, h, r, g, b) {
    var _ = this;
    var steps = 50,
        dr = 255 / steps,
        dg = 255 / steps,
        db = 255 / steps,
        i = 0,
        interval = setInterval(function() {
          _.context.fillStyle = 'rgb(' + Math.round(255 - dr * i) + ','
                                       + Math.round(255 - dg * i) + ','
                                       + Math.round(255 - db * i) + ')';
          _.context.fillRect(x, y, w, h);
          i++;
          if(i === steps) {
            clearInterval(interval);
          }
        }, 30);
  }
}();


window.onload = function() {
  var ply = new Polygonal();
  ply.initialize();

  // Give user input to pick number of points and possibly
  // percent darkened? User must hit another button to run
  // polygonize.

}
