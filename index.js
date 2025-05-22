const express = require("express");
const { connectDatabase } = require("./db/db.connect");
const Recipe = require("./models/recipe.models");
const app = express();
app.use(express.json());
connectDatabase();

app.get("/", (req, res) => {
  res.status(200).json({ message: "Recipe API is running." });
});

async function createRecipe(recipe) {
  try {
    const newRecipe = new Recipe(recipe);
    const savedRecipe = await newRecipe.save();
    return savedRecipe;
  } catch (error) {
    throw error;
  }
}

app.post("/recipes", async (req, res) => {
  try {
    const savedRecipe = await createRecipe(req.body);
    if (savedRecipe) {
      res
        .status(201)
        .json({ message: "recipe saved succussfully.", recipe: savedRecipe });
    }
  } catch (error) {
    console.error("Error saving recipe:", error);
    res.status(500).json({ error: "Failed to fetch recipe." });
  }
});

// get all the recipes in the database as a response.

async function readAllRecipes() {
  try {
    const recipe = await Recipe.find();
    return recipe;
  } catch (error) {
    throw error;
  }
}

app.get("/recipes", async (req, res) => {
  try {
    const recipe = await readAllRecipes();
    if (recipe.length != 0) {
      res.status(201).json(recipe);
    } else {
      res.status(404).json({ error: "Recipe not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipe." });
  }
});

// get a recipe's details by its title.

async function readRecipeByTitle(recipeTitle) {
  try {
    const recipe = await Recipe.findOne({ title: recipeTitle });
    return recipe;
  } catch (error) {
    throw error;
  }
}

app.get("/recipes/:recipeTitle", async (req, res) => {
  try {
    const recipe = await readRecipeByTitle(req.params.recipeTitle);
    if (recipe) {
      res.status(201).json(recipe);
    } else {
      res.status(404).json({ error: "recipe not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipes." });
  }
});

//get details of all the Recipes by an author.

async function readAllRecipeByAuthor(RecipeAuthor) {
  try {
    const recipe = await Recipe.find({ author: RecipeAuthor });
    return recipe;
  } catch (error) {
    throw error;
  }
}

app.get("/recipes/author/:recipeAuthor", async (req, res) => {
  try {
    const recipe = await readAllRecipeByAuthor(req.params.recipeAuthor);
    if (recipe.length != 0) {
      res.status(201).json(recipe);
    } else {
      res.status(404).json({ error: "Recipe not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Recipes." });
  }
});

// get all the recipes that are of "Easy" difficulty level.

async function readAllRecipeBydifficulty(recipedifficulty) {
  try {
    const recipe = await Recipe.find({ difficulty: recipedifficulty });
    return recipe;
  } catch (error) {
    throw error;
  }
}

app.get("/recipes/difficulty/:difficultyLevel", async (req, res) => {
  try {
    const recipe = await readAllRecipeBydifficulty(req.params.difficultyLevel);
    if (recipe.length != 0) {
      res.status(201).json(recipe);
    } else {
      res.status(404).json({ error: "Recipe not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Recipes." });
  }
});

// update a recipe's difficulty level with the help of its id.

async function updateAllRecipeById(recipeId, recipeToUpdate) {
  try {
    const recipe = await Recipe.findByIdAndUpdate(recipeId, recipeToUpdate, {
      new: true,
    });
    return recipe;
  } catch (error) {
    throw error;
  }
}

app.post("/recipes/:recipeId", async (req, res) => {
  try {
    const updatedRecipe = await updateAllRecipeById(
      req.params.recipeId,
      req.body
    );
    if (updatedRecipe) {
      res.status(201).json({
        message: "Recipe updated succussfully",
        recipe: updatedRecipe,
      });
    } else {
      res.status(404).json({ error: "Recipe not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Recipes." });
  }
});

//update a recipe's prep time and cook time with the help of its title.

async function updateAllRecipeByTitle(recipeTitle, recipeToUpdate) {
  try {
    const recipe = await Recipe.findOneAndUpdate(
      { title: recipeTitle },
      recipeToUpdate,
      {
        new: true,
      }
    );
    return recipe;
  } catch (error) {
    throw error;
  }
}

app.post("/recipes/title/:recipeTitle", async (req, res) => {
  try {
    const updatedRecipe = await updateAllRecipeByTitle(
      req.params.recipeTitle,
      req.body
    );
    if (updatedRecipe) {
      res.status(201).json({
        message: "Recipe updated succussfully",
        recipe: updatedRecipe,
      });
    } else {
      res.status(404).json({ error: "Recipe not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Recipes." });
  }
});

//API to delete a recipe with the help of a recipe id.

async function deleteRecipeById(RecipeId) {
  try {
    const recipe = await Recipe.findByIdAndDelete(RecipeId);
    return recipe;
  } catch (error) {
    throw error;
  }
}

app.delete("/recipes/:recipeId", async (req, res) => {
  try {
    const deletedRecipe = await deleteRecipeById(req.params.recipeId);
    if (deletedRecipe) {
      res.status(201).json({
        message: "Recipe deleted succussfully",
        Recipe: deletedRecipe,
      });
    } else {
      res.status(404).json({ error: "Recipe not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Recipes." });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log("Server running on port ", PORT);
});
