const input = document.querySelector(".search__field");
const searchSection = document.querySelector(".search__block");
const searchDropList = document.querySelector(".search__drop");
const searchRes = document.querySelector(".search__list");

function debounceUrl(fn, time) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, time);
  };
}

function getRep() {
  input.addEventListener(
    "input",
    debounceUrl(async (e) => {
      const value = e.target.value.trim();

      if (value.length === 0) {
        searchDropList.innerHTML = "";
        searchDropList.classList.remove("search__drop-active");
        return;
      }

      try {
        const url = await fetch(
          `https://api.github.com/search/repositories?q=${encodeURIComponent(
            value
          )}`
        );

        if (url.status === 403 || url.status === 405 || url.status === 422) {
          console.log("status 403 or 405 or 422");
        }
        if (!url.ok) throw new Error(`Status${url.status}`);

        const data = await url.json();
        const items = data.items.slice(0, 5);
        searchDropList.innerHTML = "";

        items.forEach((item) => {
          const searchDropItem = document.createElement("li");
          searchDropItem.classList.add("search__drop-item");

          searchDropItem.textContent = item.name;
          searchDropList.classList.add("search__drop-active");
          searchDropList.appendChild(searchDropItem);
          searchSection.appendChild(searchDropList);

          searchDropItem.addEventListener("click", () => {
            const listItem = document.createElement("li");
            listItem.classList.add("search__list-item");

            listItem.innerHTML = `
              <div class="search__list-item-content">
                <p class="name">Name: <span>${item.name}</span></p>
                <p class="owner">Owner: <span>${item.owner.login}</span></p>
                <p class="stars">Stars: <span>${item.stargazers_count}</span></p>
              </div>
              <button class="btn" aria-label="btn close">
                <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.57 8.03564L15.7786 14.2422C16.1692 14.6328 16.1692 15.2661 15.7786 15.6567L15.6565 15.7788C15.2659 16.1689 14.6328 16.1689 14.2422 15.7788L8.03589 9.57227L1.82935 15.7788C1.43872 16.1689 0.805664 16.1689 0.415039 15.7788L0.292969 15.6567C-0.0976562 15.2661 -0.0976562 14.6328 0.292969 14.2422L6.49951 8.03564L0.292969 1.8291C-0.0976562 1.43896 -0.0976562 0.805664 0.292969 0.415039L0.415039 0.292969C0.805664 -0.0976562 1.43872 -0.0976562 1.82935 0.292969L8.03589 6.49951L14.2422 0.292969C14.6328 -0.0976562 15.2659 -0.0976562 15.6565 0.292969L15.7786 0.415039C16.1692 0.805664 16.1692 1.43896 15.7786 1.8291L9.57202 8.03564Z" />
                </svg>
              </button>
            `;

            searchRes.appendChild(listItem);

            searchDropList.classList.remove("search__drop-active");
            input.value = "";

            listItem.querySelector(".btn").addEventListener("click", () => {
              listItem.remove();
            });
          });
        });
      } catch (error) {
        throw new Error(console.log(error));
      }
    }, 300)
  );
}

getRep();
