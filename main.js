// Fetch the data
fetch('data.json')
.then(res => res.json())
.then(data => renderDesert(data))
.catch(error => {
    console.log("Erro fetching data", error)
})

function renderDesert(desert){
    // lets get the container that will hold our cards
    const container = document.getElementById('.desert-card-container');

    desert.forEach(item => {
     // Lets create a card that will be used to display our desert conatent
    const card = document.createElement('div');
    card.classList.add('desert-card');

    // Creating the actual card
    card.innerHTML = `
       <img src="${item.image.thumbnail}" alt="${item.name}"/>
       <button>Add to Cart</button>
       <p class="category">${item.category}</p>
        <h3>${item.name}</h3>
        <p class="price">$${item.price.toFixed(2)}</p>
    `
    container.appendChild(card);
    });
}