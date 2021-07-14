class Food {
    constructor() {
        // yemek listesi
        this.foods = [];
        // favorilere eklenen yemeklerin id numaraları
        this.favFoodsIdList = [];
        // Seçilen karta ait bilgiler
        this.activeCard = {
            dom: "",
            id: 0
        }
        this.hasActiveCard = false;
        this.createFoodRoot();
        // Giriş Yapmış Kullanıcı Bilgilerini Al.
        this.getUserInfo();
        // Yemek Listesini AL.
        this.getFoodList();
        // localStorage'e kaydedilmiş favorileri oku.
        this.readFavFoodIdListFromStorage();
    }
    createFoodCard({ id, title }) {
        const card = document.createElement('div');
        const cardHeader = document.createElement('div');
        const cardBody = document.createElement('div');
        const cardFooter = document.createElement('div');
        const headerTitle = document.createElement('h4');
        card.classList.add('card');

        cardHeader.classList.add('cardHeader');
        cardBody.classList.add('cardBody');
        cardFooter.classList.add('cardFooter');

        headerTitle.innerText = title;
        cardHeader.appendChild(headerTitle);
        card.appendChild(cardHeader);
        card.appendChild(cardBody);
        card.appendChild(cardFooter);
        const foodContainer = document.getElementById('foodContainer');
        foodContainer.appendChild(card);

        card.addEventListener("click", (e) => {
            e.stopPropagation();
            if (!this.hasOpenedCard()) {
                foodContainer.classList.add('showCardDetail');
                var target = e.target;
                while (target) {
                    if (target.className === 'card') {
                        this.makeActiveCurrentCard(target, id);
                        break;
                    } else {
                        target = target.parentNode;
                    }
                }
            } else {
                this.disableActiveCard();
            }
        });
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
        root.appendChild(userInfoElement);
        root.appendChild(searchInputDom);
        root.appendChild(foodContainer);

        searchInputDom.addEventListener("keyup", (e) => {
            e.stopPropagation();
            let inputVal = e.target.value;
            if (inputVal.length > 0) {
                this.resetFoodContainer();
                this.foods.forEach(food => {
                    if (food.title.indexOf(inputVal) > -1) {
                        this.createFoodCard(food);
                    }
                })
            }
        });

        const htmlDom = document.getElementsByTagName("html")[0];
        htmlDom.addEventListener("click", (e) => {
            this.disableActiveCard();
        });

        htmlDom.addEventListener("keydown", (e) => {
            if (e.keyCode === 70) {
                if (this.hasOpenedCard()) {
                    const favButton = this.activeCard.dom.querySelector('.favButton');
                    favButton.click();
                }
            }
        });
        this.addLoadingImages();
    }
    resetFoodContainer() {
        const foodContainer = document.getElementById('foodContainer');
        foodContainer.innerHTML = '';
    }
    addLoadingImages() {

        const userInfoElement = document.getElementById('userInfo');
        const foodContainer = document.getElementById('foodContainer');
        const image = this.createImageLoader();
        const imageClone = image.cloneNode();
        userInfoElement.appendChild(image);
        foodContainer.appendChild(imageClone);
    }
    createImageLoader() {
        const image = document.createElement('img');
        image.setAttribute('src', '/images/loading.svg');
        return image;
    }
    addFav(foodId) {
        let findIndex = this.favFoodsIdList.indexOf(foodId);
        if (findIndex === -1) {
            this.favFoodsIdList.push(foodId);
            this.writeFavFoodIdListToStorage();
        }
    }
    removeFav(foodId) {
        let findIndex = this.favFoodsIdList.indexOf(foodId);
        if (findIndex > -1) {
            this.favFoodsIdList.splice(findIndex, 1);
            this.writeFavFoodIdListToStorage();
        }
    }
    readFavFoodIdListFromStorage() {
        const foodIdList = JSON.parse(localStorage.getItem("favFoodsIdList"));
        if (foodIdList && foodIdList.length > 0) {
            this.favFoodsIdList = foodIdList;
        }
    }
    writeFavFoodIdListToStorage() {
        localStorage.setItem("favFoodsIdList", JSON.stringify(this.favFoodsIdList));
    }

    disableActiveCard() {
        if (this.hasOpenedCard()) {
            const activeCard = this.activeCard.dom;
            const foodContainer = document.getElementById('foodContainer');
            foodContainer.classList.remove('showCardDetail');
            activeCard.classList.remove('active');
            const cardBody = activeCard.querySelector('.cardBody');
            cardBody.innerText = '';
            this.hasActiveCard = false;
            this.activeCard.dom = "";
            this.activeCard.id = 0;
        }
    }
    makeActiveCurrentCard = (cardDom, id) => {
        cardDom.classList.add('active');
        this.activeCard.dom = cardDom;
        this.activeCard.id = id;
        this.hasActiveCard = true;
        if (this.isAddedFavById(id)) {
            this.addRemoveFavButtonToActiveCard();
        } else {
            this.addFavButtonToActiveCard();
        }
    }
    isAddedFavById(id) {
        return this.favFoodsIdList.includes(id);
    }
    hasOpenedCard() {
        return this.hasActiveCard;
    }
    addFavButtonToActiveCard() {
        if (this.hasOpenedCard()) {
            const cardBody = this.activeCard.dom.querySelector('.cardBody');
            cardBody.innerText = '';

            const favButton = document.createElement('button');
            favButton.innerText = 'Favorilere Ekle';
            favButton.classList.add('success');
            favButton.classList.add('favButton');
            cardBody.append(favButton);
            favButton.addEventListener("click", (e) => {
                e.stopPropagation();
                this.addFav(this.activeCard.id);
                this.addRemoveFavButtonToActiveCard();
            });
        }
    }
    addRemoveFavButtonToActiveCard() {
        if (this.hasOpenedCard()) {
            const cardBody = this.activeCard.dom.querySelector('.cardBody');
            cardBody.innerText = '';

            const favButton = document.createElement('button');
            favButton.innerText = 'Favorilerden Çıkar';
            favButton.classList.add('danger');
            favButton.classList.add('favButton');
            cardBody.append(favButton);
            favButton.addEventListener("click", (e) => {
                e.stopPropagation();
                this.removeFav(this.activeCard.id);
                this.addFavButtonToActiveCard();
            });
        }
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
                    let newFoodItem = { id: food.id, title: food.title };
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

const food = new Food();