export default class Food {
    constructor() {
        this.foods = [];
        this.createFoodRoot();
        this.getUserInfo();
        this.getFoodList();
    }
    createFoodCard({ id, title }) {
        const card = document.createElement('div');
        const cardHeader = document.createElement('div');
        const cardBody = document.createElement('div');
        const cardFooter = document.createElement('div');
        // const favButton = document.createElement('button');
        const headerTitle = document.createElement('h4');
        card.classList.add('card');
        card.setAttribute("data-id", id);

        cardHeader.classList.add('cardHeader');
        cardBody.classList.add('cardBody');
        cardFooter.classList.add('cardFooter');
        // favButton.classList.add('addFavButton');
        // favButton.innerText = 'Favorilere Ekle';
        headerTitle.innerText = title;
        cardHeader.appendChild(headerTitle);
        // cardBody.appendChild(favButton);
        card.appendChild(cardHeader);
        card.appendChild(cardBody);
        card.appendChild(cardFooter);
        const foodContainer = document.getElementById('foodContainer');
        foodContainer.appendChild(card);
    }
    createFoodRoot() {
        const root = document.getElementById('foodRoot');
        const userInfoElement = document.createElement('h1');
        userInfoElement.setAttribute('id', 'userInfo');
        const searchInputDom = document.createElement('input');
        searchInputDom.setAttribute('id', 'searchInput');
        searchInputDom.setAttribute('placeholder', 'Yemek Ara');
        const foodContainer = document.createElement('div');
        foodContainer.setAttribute('id', 'foodContainer');
        const image = this.createImageLoader();
        const imageClone = image.cloneNode();
        userInfoElement.appendChild(image);
        foodContainer.appendChild(imageClone);
        root.appendChild(userInfoElement);
        root.appendChild(searchInputDom);
        root.appendChild(foodContainer);

        searchInputDom.addEventListener("keydown", (e) => {
            e.stopPropagation();
            setTimeout(() => {
                console.log('birşeyler');
            }, 2000)
        });
    }
    resetFoodContainer() {
        const foodContainer = document.getElementById('foodContainer');
        foodContainer.innerHTML = '';
    }
    createImageLoader() {
        const image = document.createElement('img');
        image.setAttribute('src', '/images/loading.svg');
        return image;
    }

    getUserInfo() {
        this.getDatasByUrl("https://jsonplaceholder.typicode.com/users/1")
            .then(data => {
                const userInfoDom = document.getElementById("userInfo");
                userInfoDom.innerText = `Merhaba, ${data.name}`;
            })
            .catch(error => {
                console.error(error);
            });
    }
    getFoodList() {
        this.getDatasByUrl("https://jsonplaceholder.typicode.com/todos")
            .then(foods => {
                this.resetFoodContainer();
                foods.forEach(food => {
                    let newFoodItem = { id: food.id, title: food.title, isFav: false };
                    this.foods.push(newFoodItem);
                    this.createFoodCard(newFoodItem);
                })
            })
            .catch(error => {
                console.error(error);
            });
    }

    getDatasByUrl = (url) => {
        return new Promise(async(resolve, reject) => {
            try {

                let response = await fetch(url);
                if (response.ok) {
                    resolve(response.json());
                } else {
                    reject(`fetching failed - error: ${response.status} ${response.statusText}`);
                }

            } catch (error) {
                reject(error);
            }
        })
    };
}