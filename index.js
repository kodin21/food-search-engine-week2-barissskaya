class Food {
    constructor() {
        this.foods = [];
        this.favFoodsIdList = [];
        this.activeCardDom = "";
        this.hasActiveCard = false;
        this.createFoodRoot();
        this.getUserInfo();
        this.getFoodList();
    }
    createFoodCard({ id, title, isFav }) {
        const card = document.createElement('div');
        const cardHeader = document.createElement('div');
        const cardBody = document.createElement('div');
        const cardFooter = document.createElement('div');
        const favButton = document.createElement('button');
        const headerTitle = document.createElement('h4');
        card.classList.add('card');
        card.setAttribute("data-id", id);

        cardHeader.classList.add('cardHeader');
        cardBody.classList.add('cardBody');
        cardFooter.classList.add('cardFooter');
        favButton.classList.add('addFavButton');

        if (isFav) {
            favButton.innerText = 'Favorilerden Çıkar';
            favButton.classList.add('danger');
        } else {
            favButton.innerText = 'Favorilere Ekle';
            favButton.classList.add('success');
        }
        headerTitle.innerText = title;
        cardHeader.appendChild(headerTitle);
        cardBody.appendChild(favButton);
        card.appendChild(cardHeader);
        card.appendChild(cardBody);
        card.appendChild(cardFooter);
        const foodContainer = document.getElementById('foodContainer');
        foodContainer.appendChild(card);

        card.addEventListener("click", (e) => {
            e.stopPropagation();
            const activeCard = document.querySelector(".card.active");
            if (activeCard === null) {
                foodContainer.classList.add('showCardDetail');
                var target = e.target;
                while (target) {
                    if (target.className === 'card') {
                        this.makeActiveCurrentCard(target);
                        break;
                    } else {
                        target = target.parentNode;
                    }
                }
            } else {
                this.disableActiveCard();
            }
        });

        favButton.addEventListener("click", (e) => {
            e.stopPropagation();
            console.log('clicked button')
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

        searchInputDom.addEventListener("keydown", (e) => {
            e.stopPropagation();
        });

        const htmlDom = document.getElementsByTagName("html")[0];
        htmlDom.addEventListener("click", (e) => {
            this.disableActiveCard();
        });

        htmlDom.addEventListener("keydown", (e) => {
            if (e.keyCode === 70) {
                if (this.hasOpenedCard()) {
                    console.log('pressed F');
                }
            }
        });
        this.addLoadingImages();
    }
    addLoadingImages() {

        const userInfoElement = document.getElementById('userInfo');
        const foodContainer = document.getElementById('foodContainer');
        const image = this.createImageLoader();
        const imageClone = image.cloneNode();
        userInfoElement.appendChild(image);
        foodContainer.appendChild(imageClone);
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

    disableActiveCard() {
        if (this.hasOpenedCard()) {
            const activeCard = this.activeCardDom;
            const foodContainer = document.getElementById('foodContainer');
            foodContainer.classList.remove('showCardDetail');
            activeCard.classList.remove('active');
            this.hasActiveCard = false;
            this.activeCardDom = "";
        }
    }
    makeActiveCurrentCard = (cardDom) => {
        cardDom.classList.add('active');
        this.activeCardDom = cardDom;
        this.hasActiveCard = true;
    }
    hasOpenedCard() {
        return this.hasActiveCard;
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

const food = new Food();


//  const htmlDom = document.getElementsByTagName("html")[0];
//  const searchInputDom = document.getElementById('searchInput');
//  const foodContainerDom = document.getElementById("foodContainer");
//  htmlDom.addEventListener("keydown", (e) => {
//      if (e.keyCode === 70) {
//          if (isActiveCard()) {
//              console.log('added fav');
//          } else {
//              console.log('not found active card');
//          }
//      }
//  });
//  htmlDom.addEventListener("click", (e) => {
//      disableActiveCard();
//  });
//  searchInputDom.addEventListener("keydown", (e) => {
//      e.stopPropagation();
//  });

//  const createLoadingImageDom = () => {
//      const image = document.createElement('img');
//      image.setAttribute('src', '/images/loading.svg');
//      return image;
//  }

//  const disableActiveCard = () => {
//      if (isActiveCard()) {
//          const activeCard = getActiveCard();
//          foodContainerDom.classList.remove('showCardDetail');
//          activeCard.classList.remove('active');
//          console.log("disabled active card");
//      }
//  }
//  const getActiveCard = () => {
//      const activeCard = document.querySelector(".card.active");
//      return activeCard;
//  }
//  const getCardId = (cardElement) => {

//  }
//  const isActiveCard = () => {
//      const activeCard = document.querySelector(".card.active");
//      return activeCard === null ? false : true;
//  }

//  const getDatasByUrl = (url) => {
//      return new Promise(async(resolve, reject) => {
//          try {

//              let response = await fetch(url);
//              if (response.ok) {
//                  resolve(response.json());
//              } else {
//                  reject(`fetching failed - error: ${response.status} ${response.statusText}`);
//              }

//          } catch (error) {
//              reject(error);
//          }
//      })
//  };

//  getDatasByUrl("https://jsonplaceholder.typicode.com/users/1")
//      .then(data => {
//          const userInfoDom = document.getElementById("userInfo");
//          userInfoDom.innerText = `Merhaba, ${data.name}`;
//      })
//      .catch(error => {
//          console.error(error);
//      });

//  var b = getDatasByUrl("https://jsonplaceholder.typicode.com/todos")
//      .then(data => {
//          return data.map(food => {
//              return { title, id } = food;
//          })
//      })
//      .then(foods => {
//          foodContainerDom.innerText = '';
//          foods.forEach(item => {
//              const card = document.createElement('div');
//              const cardHeader = document.createElement('div');
//              const cardBody = document.createElement('div');
//              const cardFooter = document.createElement('div');
//              const favButton = document.createElement('button');
//              const headerTitle = document.createElement('h4');
//              card.classList.add('card');
//              card.setAttribute("card-id", item.id);

//              cardHeader.classList.add('cardHeader');
//              cardBody.classList.add('cardBody');
//              cardFooter.classList.add('cardFooter');
//              favButton.classList.add('addFavButton');
//              favButton.innerText = 'Favorilere Ekle';
//              headerTitle.innerText = item.title;
//              cardHeader.appendChild(headerTitle);
//              cardBody.appendChild(favButton);
//              card.appendChild(cardHeader);
//              card.appendChild(cardBody);
//              card.appendChild(cardFooter);


//              card.addEventListener("click", (e) => {
//                  e.stopPropagation();
//                  const activeCard = document.querySelector(".card.active");
//                  if (activeCard === null) {
//                      foodContainerDom.classList.add('showCardDetail');
//                      var target = e.target;
//                      while (target) {
//                          if (target.className === 'card') {
//                              target.classList.add('active');
//                              break;
//                          } else {
//                              target = target.parentNode;
//                          }
//                      }
//                  } else {
//                      disableActiveCard();
//                  }
//              });


//              favButton.addEventListener("click", (e) => {
//                  e.stopPropagation();
//                  console.log("clicked button");
//              });

//              foodContainerDom.appendChild(card);
//          })
//      })
//      .catch(error => {
//          console.error(error);
//      });