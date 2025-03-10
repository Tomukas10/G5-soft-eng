const gallery = document.getElementById('image-gallery');
const yearInput = document.getElementById('year-input');
let images = [];

// display the initial set of images
updateImages();

// add an event listener to the year input to update the images when the year changes
yearInput.addEventListener('input', function() {
  // update the images array with the new image URLs
  updateImages();
  // redisplay the images
  displayImages();
});

function updateImages() {
  // get the number of images for the selected year
  const year = yearInput.value;
  const numImages = getNumImagesForYear(year);

  // populate the images array with the image URLs
  images = [];
  for (let i = 1; i <= numImages; i++) {
    images.push(`${year}/pantomime${year}_${i}.jpg`);
  }
}

function getNumImagesForYear(year) {
  let numImages;
  switch (year) {
    case '2013':
      numImages = 6;
      break;
    case '2014':
      numImages = 11;
      break;
    case '2015':
      numImages = 11;
      break;
    case '2016':
      numImages = 11;
      break;
    default:
      numImages = 0;
  }
  return numImages;
}

}

function displayImages() {
  // clear the gallery container
  gallery.innerHTML = '';

  // create and add the new image elements to the gallery container
  images.forEach(function(url) {
    const img = document.createElement('img');
    img.src = url;
    gallery.appendChild(img);
  });
}

