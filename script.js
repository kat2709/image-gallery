const searchInput = document.querySelector(".input-search");
const imagesContainer = document.querySelector(".images-container");
const closeBtn = document.querySelector(".close-icon");
const searchBtn = document.querySelector(".search-icon");
const footer = document.querySelector(".footer");
const errTooManyRequests = "Too many requests, please try later";

searchInput.addEventListener("keyup", async (e) => {
  const searchQuery = e.target.value.trim();
  if (searchQuery != "") {
    closeBtn.classList.add("show-icon");
  }

  if (searchQuery == "") {
    closeBtn.classList.remove("show-icon");
  }

  if (e.key === "Enter" && searchQuery != "") {
    try {
      drawLoader();
      const images = await getImages(searchQuery);
      drawImages(images);
    } catch (err) {
      imagesContainer.innerHTML = errTooManyRequests;
    }
  }
});

searchBtn.addEventListener("click", async () => {
  const searchQuery = searchInput.value.trim();
  if (searchQuery.length != 0) {
    try {
      drawLoader();
      const images = await getImages(searchQuery);
      drawImages(images);
    } catch (err) {
      imagesContainer.innerHTML = errTooManyRequests;
    }
  }
});

async function drawImages(images) {
  if (!images || images.length === 0) {
    imagesContainer.innerHTML = `Unfortunately, the word '${searchInput.value}' does not match, try again!`;
    return;
  }
  imagesContainer.innerHTML = "";
  for (let i = 0; i < images.length; i++) {
    const image = document.createElement("img");
    image.classList.add("image");
    image.src = images[i].urls.small;
    image.onclick = () => window.open(images[i].urls.full, "_blank");
    imagesContainer.appendChild(image);
  }
}

closeBtn.addEventListener("click", () => {
  searchInput.value = "";
  closeBtn.classList.remove("show-icon");
});

async function getImages(search) {
  if (!search) {
    search = "fjord";
  }
  const res = await fetch(
    `https://api.unsplash.com/search/photos/?query=${encodeURIComponent(
      search
    )}&per_page=30&orientation=landscape&client_id=08Q3Xpn-KcMiUfuxRiC4-sY3nJckC40Ck7O9XlnP9-I`
  );
  const data = await res.json();
  return data.results;
}

function drawLoader() {
  imagesContainer.innerHTML = "";
  const loader = document.createElement("div");
  loader.classList.add("loader");
  imagesContainer.appendChild(loader);
}

async function main() {
  try {
    drawLoader();
    const images = await getImages();
    drawImages(images);
  } catch (err) {
    imagesContainer.innerHTML = errTooManyRequests;
  }
}

main();
