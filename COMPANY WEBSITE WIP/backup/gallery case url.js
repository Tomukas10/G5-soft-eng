const links = document.querySelectorAll('a[href*="?="]');
const images = [];
// Get a reference to the photoDescription element
const photoDescription = document.getElementById("photoDescription");

// Get references to all the images in the gallery
const imageGallery = document.querySelectorAll("#imageGallery img");

// Add a "mouseover" event listener to each image
imageGallery.forEach((img) => {
  console.log(img);

});

links.forEach(function(link) {
  const year = new URLSearchParams(link.search).get('');
  for (let i = 1; i <= getImagesForYear(year); i++) {
    images.push(`images/pantomime/${year}/pantomime${year}_${i}.jpg`);
  }
});

// display the initial set of images
displayImages();

// add an event listener to update the images when a year link is clicked
links.forEach(function(link) {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      const year = new URLSearchParams(link.search).get('');
      // update the images array with the new image URLs
      images.length = 0; // clears the array
      for (let i = 1; i <= getImagesForYear(year); i++) {
        images.push(`images/Pantomime/${year}/pantomime${year}_${i}.jpg`);
      }
      // redisplay the images
      displayImages();
    });
  });

  function displayImages() {
    console.log("displaying");
    const gallery = document.getElementById('imageGallery');
    // clear the gallery container
    gallery.innerHTML = '';
  
  // get the images and alt text for the selected year
  const year = new URLSearchParams(window.location.search).get('year');
  const images = getImagesForYear(year);

  // create and add the new image elements to the gallery container
  images.forEach(function(image, index) {
    const img = document.createElement('img');
    img.src = image.url;
    img.alt = image.alt;
      img.addEventListener("mouseover", () => {
        // Get the "alt" attribute of the image being hovered over
        const alt = img.getAttribute("alt");
        console.log("hovering");
    
       // Fade out the photoDescription element, then set its content to the "alt" attribute, and fade it back in
    photoDescription.style.opacity = 0;
    setTimeout(() => {
      photoDescription.textContent = alt;
      photoDescription.style.opacity = 1;
    }, 180);
      });
      gallery.appendChild(img);
    });
  }
  
  

  function getImagesForYear(year) {
    let images = [];
    switch (year) {
      case '2013':
        images = [
          { url: 'images/Pantomime/2013/pantomime2013_1.jpg', alt: 'Alt text for image 1 in 2013' },
          { url: 'images/Pantomime/2013/pantomime2013_2.jpg', alt: 'Alt text for image 2 in 2013' },
          { url: 'images/Pantomime/2013/pantomime2013_3.jpg', alt: 'Alt text for image 3 in 2013' },
          { url: 'images/Pantomime/2013/pantomime2013_4.jpg', alt: 'Alt text for image 4 in 2013' },
          { url: 'images/Pantomime/2013/pantomime2013_5.jpg', alt: 'Alt text for image 5 in 2013' },
          { url: 'images/Pantomime/2013/pantomime2013_6.jpg', alt: 'Alt text for image 6 in 2013' }
        ];
        break;
      case '2014':
        images = [
          { url: 'images/Pantomime/2014/pantomime2014_1.jpg', alt: 'Alt text for image 1 in 2014' },
          { url: 'images/Pantomime/2014/pantomime2014_2.jpg', alt: 'Alt text for image 2 in 2014' },
          { url: 'images/Pantomime/2014/pantomime2014_3.jpg', alt: 'Alt text for image 3 in 2014' },
          { url: 'images/Pantomime/2014/pantomime2014_4.jpg', alt: 'Alt text for image 4 in 2014' },
          { url: 'images/Pantomime/2014/pantomime2014_5.jpg', alt: 'Alt text for image 5 in 2014' },
          { url: 'images/Pantomime/2014/pantomime2014_6.jpg', alt: 'Alt text for image 6 in 2014' },
          { url: 'images/Pantomime/2014/pantomime2014_7.jpg', alt: 'Alt text for image 7 in 2014' },
          { url: 'images/Pantomime/2014/pantomime2014_8.jpg', alt: 'Alt text for image 8 in 2014' },
          { url: 'images/Pantomime/2014/pantomime2014_9.jpg', alt: 'Alt text for image 9 in 2014' },
          { url: 'images/Pantomime/2014/pantomime2014_10.jpg', alt: 'Alt text for image 10 in 2014' },
          { url: 'images/Pantomime/2014/pantomime2014_11.jpg', alt: 'Alt text for image 11 in 2014' }
        ];
      case '2015':
        images = [
          { url: 'images/Pantomime/2015/pantomime2015_1.jpg', alt: 'Alt text for image 1 in 2015' },
          { url: 'images/Pantomime/2015/pantomime2015_2.jpg', alt: 'Alt text for image 2 in 2015' },
          { url: 'images/Pantomime/2015/pantomime2015_3.jpg', alt: 'Alt text for image 3 in 2015' },
          { url: 'images/Pantomime/2015/pantomime2015_4.jpg', alt: 'Alt text for image 4 in 2015' },
          { url: 'images/Pantomime/2015/pantomime2015_5.jpg', alt: 'Alt text for image 5 in 2015' },
          { url: 'images/Pantomime/2015/pantomime2015_6.jpg', alt: 'Alt text for image 6 in 2015' },
          { url: 'images/Pantomime/2015/pantomime2015_7.jpg', alt: 'Alt text for image 7 in 2015' },
          { url: 'images/Pantomime/2015/pantomime2015_8.jpg', alt: 'Alt text for image 8 in 2015' },
          { url: 'images/Pantomime/2015/pantomime2015_9.jpg', alt: 'Alt text for image 9 in 2015' },
          { url: 'images/Pantomime/2015/pantomime2015_10.jpg', alt: 'Alt text for image 10 in 2015' },
          { url: 'images/Pantomime/2015/pantomime2015_11.jpg', alt: 'Alt text for image 11 in 2015' }
        ];
      case '2016':
        images = [
          { url: 'images/Pantomime/2016/pantomime2016_1.jpg', alt: 'Alt text for image 1 in 2016' },
          { url: 'images/Pantomime/2016/pantomime2016_2.jpg', alt: 'Alt text for image 2 in 2016' },
          { url: 'images/Pantomime/2016/pantomime2016_3.jpg', alt: 'Alt text for image 3 in 2016' },
          { url: 'images/Pantomime/2016/pantomime2016_4.jpg', alt: 'Alt text for image 4 in 2016' },
          { url: 'images/Pantomime/2016/pantomime2016_5.jpg', alt: 'Alt text for image 5 in 2016' },
          { url: 'images/Pantomime/2016/pantomime2016_6.jpg', alt: 'Alt text for image 6 in 2016' },
          { url: 'images/Pantomime/2016/pantomime2016_7.jpg', alt: 'Alt text for image 7 in 2016' },
          { url: 'images/Pantomime/2016/pantomime2016_8.jpg', alt: 'Alt text for image 8 in 2016' },
          { url: 'images/Pantomime/2016/pantomime2016_9.jpg', alt: 'Alt text for image 9 in 2016' },
          { url: 'images/Pantomime/2016/pantomime2016_10.jpg', alt: 'Alt text for image 10 in 2016' },
          { url: 'images/Pantomime/2016/pantomime2016_11.jpg', alt: 'Alt text for image 11 in 2016' }
        ];
    }
    return images;
  }

