document.addEventListener("DOMContentLoaded", function() {
    const recipeList = document.querySelector(".recipe-list");
    const recipeDetails = document.querySelector(".recipe-details")
    const navLinks = document.querySelectorAll("nav a");

    navLinks.forEach(link=> {
        link.addEventListener("click", function(e) {
           e.preventDefault()
           const category = this.getAttribute("data-category")
           fetchRecipes(category)

        })
    })
    function fetchRecipes(category){
       recipeList.innerHTML = "loading recipes...."
       console.log('Fetching recipes for category:', category); 

       fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
       .then(response=> response.json())
       .then(data=> {
        if(data && data.meals) {
            displayRecipes(data.meals)
        } else {
            recipeList.ineerHTML = "No recipes found for this category"
        }
        
       })
       .catch(error => {
        recipeList.innerHTML = 'Error fetching recipes';
        console.error('Error', error);
       })
    }
    function displayRecipes(recipes) {
        recipeList.innerHTML = '';
        recipes.forEach(recipe => {
            const recipeCard = document.createElement('div')
            recipeCard.classList.add('recipe-card');
            recipeCard.innerHTML =`
            <h3>${recipe.strMeal}</h3>
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" width="100%">
            <button class="view-recipe-btn">View Recipe</button>
            `;
            recipeList.appendChild(recipeCard);

           const viewButton = recipeCard.querySelector(".view-recipe-btn")
           viewButton.addEventListener('click', () => {
            fetchRecipeDetails(recipe.idMeal)
           })
        })

    }

    function fetchRecipeDetails(id) {
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(response => response.json())
        .then(data => {
            const recipe = data.meals[0];
            recipeDetails.innerHTML= '';
            const recipeDetailsCard = document.createElement('div')
            recipeDetailsCard.classList.add('recipe-details-card');
            recipeDetailsCard.innerHTML = `
            <h2>${recipe.strMeal}</h2>
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" width="200px height="150px>
            <h3>Ingredients:</h3>
            <ul>
                ${getIngredientsList(recipe)}
            </ul>
            <h3>Instructions:</h3>
            <p>${recipe.strInstructions}</p>

            `;
            recipeDetails.appendChild(recipeDetailsCard)
            // alert(`Ingredients:\n${recipe.strIngredient1}, ${recipe.strIngredient2}, ${recipe.strIngredient3}\n\nInstructions:\n${recipe.strInstructions}`)
        })
        .catch(error => console.error('Error', error));
    }

    function getIngredientsList(recipe) {
        let ingredientsHTML = '';
        for (let i=1; i <= 20; i++) {
           const ingredient = recipe[`strIngredient${i}`]
           const measure = recipe[`strMeasure${i}`]
           if (ingredient && ingredient.trim()){
            ingredientsHTML += `<li>${measure} ${ingredient}</li>`
           }
        }
         return ingredientsHTML
    }
})