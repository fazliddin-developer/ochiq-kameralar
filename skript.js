
const cities = [
    {
        name: "Toshkent",
        lat: 41.2995,
        lng: 69.2401,
        region: "Toshkent"
    },
    {
        name: "Samarqand",
        lat: 39.6542,
        lng: 66.9597,
        region: "Samarqand"
    },
    {
        name: "Buxoro",
        lat: 39.7747,
        lng: 64.4286,
        region: "Buxoro"
    },
    {
        name: "Farg‘ona",
        lat: 40.3864,
        lng: 71.7864,
        region: "Farg‘ona"
    },
    {
        name: "Andijon",
        lat: 40.7821,
        lng: 72.3442,
        region: "Andijon"
    },
    {
        name: "Namangan",
        lat: 41.0058,
        lng: 71.6436,
        region: "Namangan"
    },
    {
        name: "Nukus",
        lat: 42.4619,
        lng: 59.6166,
        region: "Nukus"
    },
    {
        name: "Navoiy",
        lat: 40.1039,
        lng: 65.3688,
        region: "Navoiy"
    },
    {
        name: "Qarshi",
        lat: 38.8606,
        lng: 65.7890,
        region: "Qarshi"
    },
    {
        name: "Termiz",
        lat: 37.2242,
        lng: 67.2783,
        region: "Termiz"
    },
    {
        name: "Xiva",
        lat: 41.3783,
        lng: 60.3639,
        region: "Xiva"
    },
    {
        name: "Jizzax",
        lat: 40.1158,
        lng: 67.8422,
        region: "Jizzax"
    },
    {
        name: "Guliston",
        lat: 40.4897,
        lng: 68.7842,
        region: "Guliston"
    }
];

// Xarita yaratish
const map = L.map("map").setView(
    [41.2, 64.5],
    5
);

// Xarita qatlamini yuklash
L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        maxZoom: 18,
        attribution: "&copy; OpenStreetMap"
    }
).addTo(map);

const cityList = document.getElementById("cityList");
const searchInput = document.getElementById("searchInput");
const regionFilter = document.getElementById("regionFilter");

const markers = new Map();
let activeCity = "";

// Shaharni qidirish uchun ochiq manba
function searchCameras(city) {
    const query = encodeURIComponent(
        "public live webcams " + city + " Uzbekistan"
    );

    window.open(
        "https://www.google.com/search?q=" + query,
        "_blank",
        "noopener,noreferrer"
    );
}

// Xaritaga shahar belgilarini qo‘shish
cities.forEach(city => {
    const marker = L.marker([
        city.lat,
        city.lng
    ]).addTo(map);

    marker.bindPopup(`
        <b>${city.name}</b>
        <br>
        Shahar markazi
        <br><br>
        <button
          onclick="searchCameras('${city.name}')">
          Ochiq manbalarni qidirish
        </button>
    `);

    markers.set(city.name, marker);
});

// Shaharni xaritada ko‘rsatish
function focusCity(city) {
    activeCity = city.name;

    map.flyTo(
        [city.lat, city.lng],
        9
    );

    markers.get(city.name).openPopup();

    renderCities();
}

// Ro‘yxatni chiqarish va filtrlash
function renderCities() {
    const query = searchInput.value
        .trim()
        .toLocaleLowerCase("uz");

    const region = regionFilter.value;

    const filtered = cities.filter(city => {
        const matchesName = city.name
            .toLocaleLowerCase("uz")
            .includes(query);

        const matchesRegion =
            region === "all" ||
            city.region === region;

        return matchesName && matchesRegion;
    });

    cityList.innerHTML = "";

    filtered.forEach(city => {
        const button = document.createElement("button");

        button.className =
            "city-item" +
            (activeCity === city.name ? " active" : "");

        button.textContent = "📍 " + city.name;

        button.addEventListener("click", () => {
            focusCity(city);
        });

        cityList.appendChild(button);
    });

    if (filtered.length === 0) {
        cityList.textContent =
            "Bu nomdagi shahar topilmadi.";
    }

    // Filtrga mos kelmaydigan belgilarni yashirish
    cities.forEach(city => {
        const marker = markers.get(city.name);
        const visible = filtered.includes(city);

        if (visible && !map.hasLayer(marker)) {
            marker.addTo(map);
        }

        if (!visible && map.hasLayer(marker)) {
            map.removeLayer(marker);
        }
    });
}

searchInput.addEventListener(
    "input",
    renderCities
);

regionFilter.addEventListener(
    "change",
    renderCities
);

renderCities();
