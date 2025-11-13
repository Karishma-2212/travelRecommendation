// Function to fetch data from JSON file
async function fetchData() {
    try {
      const response = await fetch('travel_Recommendation_api.json');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  
  // Function to display results
  function displayResults(items, type) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = `<h2>${type.toUpperCase()} Recommendations</h2>`;
  
    items.forEach(item => {
      // For countries, show cities; otherwise show item directly
      if (item.cities) {
        item.cities.forEach(city => {
          resultsDiv.innerHTML += `
            <div class="place">
              <h3>${city.name}</h3>
              <img src="${city.imageUrl}" alt="${city.name}">
              <p>${city.description}</p>
              <p><strong>Local Time:</strong> ${getCountryTime(item.name)}</p>
            </div>
          `;
        });
      } else {
        resultsDiv.innerHTML += `
          <div class="place">
            <h3>${item.name}</h3>
            <img src="${item.imageUrl}" alt="${item.name}">
            <p>${item.description}</p>
            ${type === 'countries' ? `<p><strong>Local Time:</strong> ${getCountryTime(item.name)}</p>` : ""}
          </div>
        `;
      }
    });
  }
  
  // Function to show local time (optional task)
  function getCountryTime(countryName) {
    const countryTimeZones = {
      "Australia": "Australia/Sydney",
      "Japan": "Asia/Tokyo",
      "Brazil": "America/Sao_Paulo",
      "Cambodia": "Asia/Phnom_Penh",
      "India": "Asia/Kolkata",
      "French Polynesia": "Pacific/Tahiti"
    };
  
    const tz = countryTimeZones[countryName];
    if (!tz) return "Timezone not available";
  
    const options = { timeZone: tz, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const localTime = new Date().toLocaleTimeString('en-US', options);
    return localTime;
  }
  
  // Function to search by keyword
  async function searchPlaces() {
    const keyword = document.getElementById("searchInput").value.toLowerCase().trim();
    const data = await fetchData();
  
    if (!keyword) {
      alert("Please enter a keyword such as 'beach', 'temple', or 'country name'.");
      return;
    }
  
    let results = [];
  
    if (keyword.includes("beach")) {
      results = data.beaches;
      displayResults(results, "beaches");
    } else if (keyword.includes("temple")) {
      results = data.temples;
      displayResults(results, "temples");
    } else {
      // Match country name
      results = data.countries.filter(c => c.name.toLowerCase().includes(keyword));
      if (results.length > 0) {
        displayResults(results, "countries");
      } else {
        document.getElementById("results").innerHTML = "<p>No matches found. Try 'beach', 'temple', or a country name.</p>";
      }
    }
  }
  
  // Function to clear results
  function clearResults() {
    document.getElementById("results").innerHTML = "";
    document.getElementById("searchInput").value = "";
  }
  
