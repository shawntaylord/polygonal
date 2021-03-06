+function() {
  this.Polygonal = function() {
    this.imageInput = document.getElementById('imageInput');
    this.canvas = document.getElementById('imageDisplay');
    this.context = this.canvas.getContext('2d');
    this.MAX_NUM_POINTS; // use for calculated range
    this.num_points = 250;
    this.BASE_X = 2;
    this.BASE_Y = 3;
    this.PADDING = 300;
    // Array of Triangle objects
    this.triangles = [];
  }

  Polygonal.prototype.initialize = function() {
    initializeEvents.call(this);
  }

  Polygonal.prototype.polygonize = function() {
    // setPoints returns an Array of Arrays with x, y coordinates
    var points = setPoints.call(this);
    // createDelaunayTriangles returns an Array of triplets, where the values
    // represent indices in 'points'
    var triangles = createDelaunayTriangles.call(this, points);
  }

  // Objects
  function Point(x, y) {
    this.x = x;
    this.y = y;
    this.getX = function() {
      return this.x;
    }
    this.getY = function() {
      return this.y;
    }
    this.setX = function(new_x) {
      this.x = new_x;
    }
    this.setY = function(new_y) {
      this.y = new_y;
    }
  }

  function Triangle(point1, point2, point3) {
    this.point1 = point1;
    this.point2 = point2;
    this.point3 = point3;
    this.drawTriangleOnCanvas = function(canvas, context) {
      context.beginPath();
      context.moveTo(this.point1.getX(), this.point1.getY());
      context.lineTo(this.point2.getX(), this.point2.getY());
      context.lineTo(this.point3.getX(), this.point3.getY());
      context.lineTo(this.point1.getX(), this.point1.getY());
      var center = this.getCenterPoint();

      if (center.getX() > canvas.width) {
        center.setX(canvas.width-1);
      } else if (center.getX() < 0) {
        center.setX(0);
      }
      if (center.getY() > canvas.height) {
        // ITS ZERO INDEXED YOOOOMYGAWD
        center.setY(canvas.height-1);
      } else if (center.getY() < 0) {
        center.setY(0);
      }
      var pixel = context.getImageData(center.getX(), center.getY(), 1, 1);
      var data = pixel.data;
      var rgb = 'rgb(' + data[0] + ',' + data[1] + ',' + data[2] + ')';
      context.fillStyle = rgb;
      context.fill();
    }
    this.getCenterPoint = function() {
      var sumX = this.point1.getX() + this.point2.getX() + this.point3.getX();
      var sumY = this.point1.getY() + this.point2.getY() + this.point3.getY();
      return new Point(sumX/3, sumY/3);
    }
  }

  // This should also fill them. Aaaaand randomly change the colors...
  function createDelaunayTriangles(points) {
    // Triangulate returns Array of indices from 'points'. Each group of 3
    // consecutive points represent the 3 indices in points that form a
    // triangle.
    var triangles = Delaunay.triangulate(points);
    var i = 0;
    var point1, point2, point3;
    var index1, index2, index3;
    for (i; i < triangles.length; i+=3) {
      index1 = triangles[i];
      index2 = triangles[i+1];
      index3 = triangles[i+2];

      point1 = new Point(points[index1][0], points[index1][1]);
      point2 = new Point(points[index2][0], points[index2][1]);
      point3 = new Point(points[index3][0], points[index3][1]);
      this.triangles.push(new Triangle(point1, point2, point3));
    }
    drawTriangles.call(this);
    function drawTriangles() {
      var i = this.triangles.length - 1;
      do {
        this.triangles[i].drawTriangleOnCanvas(this.canvas, this.context);
      } while(i--);
    }
  }

  function initializeEvents() {
    this.imageInput.addEventListener('change', handleFile.bind(this), false);
    function handleFile(e) {
      var _ = this;
      var reader = new FileReader();
      reader.onload = function(event){
          var img = new Image();
          img.onload = function(){
            var aspect_ratio = img.width / img.height;
            _.canvas.width = img.width <= 1024 ? img.width : 1024;
            _.canvas.height = _.canvas.width / aspect_ratio;
            _.MAX_NUM_POINTS = img.width * img.height;
            _.context.drawImage(img, 0, 0, img.width, img.height,
                                     0, 0, _.canvas.width, _.canvas.height);
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
    var pointsArray = [];
    for (var i = 1; i <= this.num_points; i++) {
      x = (halton(i, this.BASE_X) * (this.canvas.width + this.PADDING)) - this.PADDING/2;
      y = (halton(i, this.BASE_Y) * (this.canvas.height + this.PADDING)) - this.PADDING/2;
      pointsArray.push([x,y]);
    }
    return pointsArray;
  }
}();


window.onload = function() {
  var ply = new Polygonal();
  ply.initialize();
  var manualStart = document.getElementById('manual-start');
  manualStart.onclick = function() {
    ply.polygonize();
  }
}
