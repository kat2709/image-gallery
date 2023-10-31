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

console.log(`
1.Вёрстка +10
- на странице есть несколько фото и строка поиска +5
- в футере приложения есть ссылка на гитхаб автора приложения, год создания приложения, логотип курса со ссылкой на курс +5
2.При загрузке приложения на странице отображаются полученные от API изображения +10
3.Если в поле поиска ввести слово и отправить поисковый запрос, на странице отобразятся изображения соответствующей тематики, если такие данные предоставляет API +10
4.Поиск +30
- при открытии приложения курсор находится в поле ввода +5
- есть placeholder +5
- автозаполнение поля ввода отключено (нет выпадающего списка с предыдущими запросами) +5
- поисковый запрос можно отправить нажатием клавиши Enter +5
- после отправки поискового запроса и отображения результатов поиска, поисковый запрос продолжает отображаться в поле ввода +5
- в поле ввода есть крестик при клике по которому поисковый запрос из поля ввода удаляется и отображается placeholder +5
5.Очень высокое качество оформления приложения и/или дополнительный не предусмотренный в задании функционал, улучшающий качество приложения +10
 - добавлен "loader", который срарабывает при новом поиске
 - добавлен "favicon"
 - если изображения не найдены, на экране выводит текст "изображения не найдены"
 - если при запросе произошла ошибка, то будет показано сообщение "повторите попытку поиска позже"
`);
