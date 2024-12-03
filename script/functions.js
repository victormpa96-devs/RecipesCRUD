/* var localRecipes = [{
    name: "Macedonia",
    ingredients: [{ name: "Pera", grams: 150 },
    { name: "Melocotón", grams: 250 },
    { name: "Ciruela", grams: 350 }]
},
{
    name: "Pizza de frutas",
    ingredients: [{ name: "Pera", grams: 250 },
    { name: "Uva", grams: 50 },
    { name: "Plátano", grams: 450 },
    { name: "Fresa", grams: 50 }]
},
{
    name: "Pastel de gelatinas de frutas",
    ingredients: [{ name: "Cereza", grams: 150 },
    { name: "Piña", grams: 250 },
    { name: "Fresa", grams: 350 }]
},
{
    name: "Tarta de frutas",
    ingredients: [{ name: "Piña", grams: 150 },
    { name: "Cereza", grams: 250 },
    { name: "Kiwi", grams: 350 },
    { name: "Naranja", grams: 250 }]
}] */

var recipes = (JSON.parse(localStorage.getItem("RECIPES")) || []);

const recipesDOM = document.getElementById("recipes");

displayRecipes();

function Recipe(pName) {
    this.name = pName;
    this.ingredients = [];
}

function Ingredient(pName, pGrams) {
    this.name = pName;
    this.grams = pGrams;
}

// DISPLAY RECIPES
function displayRecipes() {
    recipesDOM.innerHTML = "";

    // COMMUNICATE IF THERE ARE NO RECIPES.
    if (recipes.length < 1) {

        const voidRecipesDOM = document.createElement("h3");
        voidRecipesDOM.insertAdjacentHTML("beforeend", '<em style="color: red;">There are currently no recipes.</em>')

        recipesDOM.appendChild(voidRecipesDOM);
    }

    // DISPLAY INGREDIENTS OF EACH RECIPE
    recipes.forEach(
        function (e) {
            const recipeSectionDOM = document.createElement("section");
            let recipesHTML = "";

            recipesHTML += '<h3>' + e.name + '</h3><ul>';

            if (e.ingredients.length < 1) {
                recipesHTML += '<li><em style="color: red;">Currently without ingredients.</em></li>';
            } else {
                e.ingredients.forEach(
                    function (e) {
                        recipesHTML += '<li>' + e.name + ' - ' + e.grams + 'gr</li>';
                    }
                )
            }

            recipesHTML += '</ul>';
            recipeSectionDOM.innerHTML = recipesHTML;

            recipesDOM.appendChild(recipeSectionDOM);
        }
    );

    // SAVE RECIPES IN THE BROWSER'S LOCAL-STORAGE
    localStorage.setItem("RECIPES", JSON.stringify(recipes));

}

// DISPLAY SPECIFIC RECIPE
function displayRecipe(pRecipe) {
    recipesDOM.innerHTML = "";

    var getRecipeIndex = recipes.findIndex(e => e.name == pRecipe);

    if (getRecipeIndex == -1) {
        notFoundRecipeERROR((
            pRecipe == undefined ||
            pRecipe == "" ||
            pRecipe == " " ||
            pRecipe.toString().trim().length < 1) ? "you indicated" : pRecipe
        );
    } else {
        const recipeSectionDOM = document.createElement("section");
        let recipeHTML = "";

        recipeHTML += '<h3>' + recipes[getRecipeIndex].name + '</h3><ul>';

        if (recipes[getRecipeIndex].ingredients.length < 1) {
            recipeHTML += '<li><em style="color: red;">Currently without ingredients.</em></li>';
        } else {
            recipes[getRecipeIndex].ingredients.forEach(
                function (e) {
                    recipeHTML += '<li>' + e.name + ' - ' + e.grams + 'gr</li>';
                }
            )
        }

        recipeHTML += '</ul>';
        recipeSectionDOM.innerHTML = recipeHTML;

        recipesDOM.appendChild(recipeSectionDOM);
    }
}

// DISPLAY ALL RECIPES WHICH MATCH WITH SPECIFIC INGREDIENTS
function displayRecipesByIngredients() {

    recipesDOM.innerHTML = "";

    // GET THE "INGREDIENTS" THAT THE USER PASSED BY PARAMETERS
    var argArray = Array.from(arguments);

    // GET A NEW ARRAY ONLY WITH THE INGREDIENTS OF EACH RECIPE
    const recipeNames = recipes.map(recipe => recipe.ingredients.map(ingredient => ingredient.name));

    // GET RECIPES BY INGREDIENTS
    let recipesByIngredients = [];

    recipeNames.forEach(
        function (recipe) {
            let findSameIngredients = argArray.every(e => recipe.includes(e));

            if (findSameIngredients && argArray.length > 0) {
                recipesByIngredients.push(recipes[recipeNames.findIndex(e => e == recipe)])
            }
        }
    )

    // DISPLAY THE RECIPES
    if (recipesByIngredients.length < 1) {

        const voidRecipesDOM = document.createElement("h3");
        voidRecipesDOM.insertAdjacentHTML("beforeend", '<em style="color: red;">There are currently no recipes with these ingredients.</em>')

        recipesDOM.appendChild(voidRecipesDOM);
    } else {
        recipesByIngredients.forEach(
            function (e) {
                const recipeSectionDOM = document.createElement("section");
                let recipesHTML = "";

                recipesHTML += '<h3>' + e.name + '</h3><ul>';

                if (e.ingredients.length < 1) {
                    recipesHTML += '<li><em style="color: red;">Currently without ingredients.</em></li>';
                } else {
                    e.ingredients.forEach(
                        function (e) {
                            recipesHTML += '<li>' + e.name + ' - ' + e.grams + 'gr</li>';
                        }
                    )
                }

                recipesHTML += '</ul>';
                recipeSectionDOM.innerHTML = recipesHTML;

                recipesDOM.appendChild(recipeSectionDOM);
            }
        );
    }
}

// CREATE NEW RECIPE
function newRecipe(pName, pIndex = recipes.length + 1) {

    // CHECK IF RECIPE NAME IS NOT VOID
    if (pName == "" || pName == " ") {
        pName = undefined;
    }

    if (pName == undefined) {
        voidRecipeNameERROR();
    }

    // CHECK IF RECIPE NAME IS AN INTEGER
    if (!isNaN(pName)) {
        recipeIsANumberERROR();
    }


    var recipeName = pName.trim();

    if (recipeName.length < 1) {
        voidRecipeNameERROR();
    }

    // CHECK IF RECIPE IS NOT REPEATED
    if (recipes.some(e => e.name == recipeName)) {
        currentlyExistRecipeERROR(recipeName);
    }

    // CHECK IF INDEX IS AN INTEGER
    if (isNaN(pIndex)) {
        indexOrWeightAreNotIntegerERROR();
    }

    recipes.splice(pIndex, 0, new Recipe(recipeName));

    displayRecipes();
}

// ADD INGREDIENT TO RECIPE
function addIngredient(
    pRecipeName,
    pIngredientName,
    pWeight,
    pIndex = undefined
) {

    // CHECK IF RECIPE EXISTS
    if (pRecipeName == undefined) {
        notFoundRecipeERROR("you indicated");
    }

    if (pRecipeName.trim().length < 1) {
        notFoundRecipeERROR("you indicated");
    }

    if (recipes.find(e => e.name == pRecipeName) == null) {
        notFoundRecipeERROR(pRecipeName.trim());
    }

    // FIND RECIPE INDEX AND VERIFY IF THE INGREDIENT IS NOT VOID, REPEATED OR IS A NUMBER
    var getPosition = recipes.findIndex(e => e.name == pRecipeName);


    if (!isNaN(pIngredientName)) {

        if (pIngredientName.toString().trim().length < 1) {
            voidIngredientERROR();
        }

        ingredientIsANumberERROR();
    }

    if (pIngredientName == undefined || pIngredientName.trim().length < 1) {
        voidIngredientERROR();
    }

    if (recipes[getPosition].ingredients.some(e => e.name == pIngredientName)) {
        currentlyExistIngredientERROR(pRecipeName, pIngredientName);
    }

    // CHECK IF WEIGHT IS NOT VOID
    if (pWeight == null) {
        voidWeightERROR();
    }

    var pWeightToString = pWeight.toString().trim();

    if (pWeightToString.trim().length < 1) {
        voidWeightERROR();
    }

    // CHECK IF WEIGHT AND INDEX ARE NOT A NUMBER
    if (pIndex == undefined) {
        pIndex = recipes.find(e => e.name == pRecipeName).ingredients.length + 1
    }

    var pIndexToString = pIndex.toString().trim();

    if (pIndexToString.trim().length < 1) {
        indexOrWeightAreNotIntegerERROR();
    }

    if (isNaN(pIndex) || isNaN(pWeight)) {
        indexOrWeightAreNotIntegerERROR()
    }

    recipes[getPosition].ingredients.splice(pIndex, 0, new Ingredient(pIngredientName, pWeight));

    displayRecipes();
}

// MODIFY RECIPE NAME
function modifyRecipeName(pCurrentName, pNewName) {

    // CHECK IF RECIPE EXISTS
    if (pCurrentName == undefined) {
        notFoundRecipeERROR("you indicated");
    }

    if (pCurrentName.trim().length < 1) {
        notFoundRecipeERROR("you indicated");
    }

    var recipe = recipes.find(e => e.name == pCurrentName);

    if (recipe == null) {
        notFoundRecipeERROR(pCurrentName.trim());
    }

    if (pNewName == "" || pNewName == " " || pNewName != undefined && pNewName.trim().length < 1) {
        pNewName = undefined;
    }

    // CHECK IF NEW RECIPE NAME IS AN INTEGER
    if (!isNaN(pNewName)) {
        newRecipeIsANumberERROR();
    }

    // CHECK IF NEW RECIPE NAME IS NOT VOID
    if (pNewName == undefined || pNewName.trim().length < 1) {
        voidNewRecipeNameERROR();
    }

    // CHECK IF THE NEW RECIPE IS NOT REPEATED
    var newRecipeName = pNewName.trim();

    if (recipes.some(e => e.name == newRecipeName)) {
        currentlyExistRecipeERROR(newRecipeName);
    }

    recipe.name = newRecipeName;

    displayRecipes();
}

// MODIFY INGREDIENT
function modifyIngredient(pRecipeName, pCurrentIngredient, pNewIngredient) {

    var recipe = recipes.find(e => e.name == pRecipeName);

    // CHECK IF RECIPE EXISTS
    if (recipe == undefined) {
        notFoundRecipeERROR((
            pRecipeName == undefined ||
            pRecipeName == "" ||
            pRecipeName == " " ||
            pRecipeName.toString().trim().length < 1) ? "you indicated" : pRecipeName
        );
    }

    // CHECK IF CURRENT INGREDIENT IS NOT VOID
    if (pCurrentIngredient == null ||
        pCurrentIngredient == "" ||
        pCurrentIngredient == " " ||
        pCurrentIngredient.toString().trim().length < 1) {

        voidIngredientERROR();
    }

    // CHECK IF CURRENT INGREDIENT EXISTS
    var ingredient = recipe.ingredients.find(e => e.name == pCurrentIngredient);
    if (ingredient == undefined) {
        notFoundIngredientERROR(pCurrentIngredient);
    }

    // FIND RECIPE INDEX AND VERIFY IF THE NEW INGREDIENT IS NOT VOID, REPEATED OR IS A NUMBER
    var getPosition = recipes.findIndex(e => e.name == pRecipeName);

    if (pNewIngredient == null ||
        pNewIngredient == "" ||
        pNewIngredient == " " ||
        pNewIngredient.toString().trim().length < 1) {

        voidNewIngredientERROR();
    }

    if (!isNaN(pNewIngredient)) {
        ingredientIsANumberERROR();
    }

    if (recipes[getPosition].ingredients.some(e => e.name == pNewIngredient.toString().trim())) {
        currentlyExistIngredientERROR(pRecipeName, pNewIngredient.toString().trim());
    }

    ingredient.name = pNewIngredient.toString().trim();

    displayRecipes();
}


// MODIFY INGREDIENT'S WEIGHT
function modifyIngredientWeight(pRecipeName, pIngredient, pNewWeight) {

    // CHECK IF RECIPE EXISTS
    if (pRecipeName == undefined) {
        notFoundRecipeERROR("you indicated");
    }

    if (pRecipeName.toString().trim().length < 1) {
        notFoundRecipeERROR("you indicated");
    }

    var recipe = recipes.find(e => e.name == pRecipeName);

    if (recipe == null) {
        notFoundRecipeERROR(pRecipeName);
    }

    // CHECK IF INGREDIENT IS NOT VOID
    if (pIngredient == null ||
        pIngredient == "" ||
        pIngredient == " " ||
        pIngredient.toString().trim().length < 1) {

        voidIngredientERROR();
    }

    // CHECK IF INGREDIENT EXISTS
    var ingredient = recipe.ingredients.find(e => e.name == pIngredient);
    if (ingredient == undefined) {
        notFoundIngredientERROR(pIngredient);
    }

    // CHECK NEW WEIGHT (GRAMS) IS NOT VOID
    if (pNewWeight == null ||
        pNewWeight == "" ||
        pNewWeight == " " ||
        pNewWeight.toString().trim().length < 1) {

        voidWeightERROR();
    }

    // CHECK NEW WEIGHT (GRAMS) IS A NUMBER
    if (isNaN(pNewWeight)) {
        indexOrWeightAreNotIntegerERROR()
    }

    ingredient.grams = pNewWeight;

    displayRecipes();
}


// DELETE RECIPE
function deleteRecipe(pRecipeName) {

    // CHECK IF RECIPE EXISTS
    if (pRecipeName == undefined) {
        notFoundRecipeERROR("you indicated");
    }

    if (pRecipeName.toString().trim().length < 1) {
        notFoundRecipeERROR("you indicated");
    }

    var recipe = recipes.find(e => e.name == pRecipeName);

    if (recipe == null) {
        notFoundRecipeERROR(pRecipeName);
    }

    recipes.splice(recipe, 1);

    displayRecipes();
}

// DELETE INGREDIENT
function deleteIngredient(pRecipeName, pIngredient) {

    // CHECK IF RECIPE EXISTS
    if (pRecipeName == undefined) {
        notFoundRecipeERROR("you indicated");
    }

    if (pRecipeName.toString().trim().length < 1) {
        notFoundRecipeERROR("you indicated");
    }

    var recipe = recipes.findIndex(e => e.name == pRecipeName);

    if (recipe == -1) {
        notFoundRecipeERROR(pRecipeName);
    }

    // CHECK IF INGREDIENT IS NOT VOID
    if (pIngredient == null ||
        pIngredient == "" ||
        pIngredient == " " ||
        pIngredient.toString().trim().length < 1) {

        voidIngredientERROR();
    }

    var indexIngredient = recipes[recipe].ingredients.findIndex(e => e.name == pIngredient);

    // CHECK IF INGREDIENT EXISTS
    if (indexIngredient == -1) {
        notFoundIngredientERROR(pIngredient);
    }

    recipes[recipe].ingredients.splice(indexIngredient, 1);

    displayRecipes();
}


// ERRORES //

function currentlyExistRecipeERROR(pRecipeName) {
    throw (new Error("The recipe " + pRecipeName + " already exists."));
}

function currentlyExistIngredientERROR(pRecipeName, pCurrentIngredient) {
    throw (new Error("The ingredient " + pCurrentIngredient + " already exists in the recipe " + pRecipeName));
}

function notFoundRecipeERROR(pRecipeName) {
    throw (new Error("The recipe " + pRecipeName + " doesn't exist"));
}

function notFoundIngredientERROR(pCurrentIngredient) {
    throw (new Error("The ingredient " + pCurrentIngredient + " doesn't exist"));
}

function indexOrWeightAreNotIntegerERROR() {
    throw (new Error("Index and Weight parameters must be Integers"));
}

function voidRecipeNameERROR() {
    throw (new Error("The recipe name parameter is void"));
}

function voidIngredientERROR() {
    throw (new Error("The ingredient parameter is void"));
}

function voidNewRecipeNameERROR() {
    throw (new Error("The new recipe name parameter is void"));
}

function voidNewIngredientERROR() {
    throw (new Error("The new ingredient parameter is void"));
}

function voidWeightERROR() {
    throw (new Error("The weight parameter is void"));
}

function recipeIsANumberERROR() {
    throw (new Error("The recipe parameter mustn't be an Integer"));
}

function newRecipeIsANumberERROR() {
    throw (new Error("The new recipe name parameter mustn't be an Integer"));
}

function ingredientIsANumberERROR() {
    throw (new Error("The ingredient parameter mustn't be an Integer"));
}

