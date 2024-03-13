function previewImage() {
    var input = document.getElementById('imageInput');
    var preview = document.getElementById('imagePreview');
  
    while (preview.firstChild) {
      preview.removeChild(preview.firstChild);
    }
  
    if (input.files && input.files[0]) {
      var reader = new FileReader();
  
      reader.onload = function (e) {
        var image = document.createElement('img');
        image.src = e.target.result;
        image.style.maxWidth = '100%';
        preview.appendChild(image);
      };
  
      reader.readAsDataURL(input.files[0]);
    }
  }


  // Modal initialization code
  var myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'));

    function previewImage(event) {
      var reader = new FileReader();
      reader.onload = function() {
          var output = document.getElementById('imagePreview');
          output.src = reader.result;
      }
      reader.readAsDataURL(event.target.files[0]);
  }

