import fetch from "node-fetch";
import fs from "fs"; // Pour écrire dans le fichier
import dotenv from "dotenv";

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

const API_KEY = process.env.API_KEY; // Remplacez par votre clé API
const CX = process.env.CX; // Remplacez par votre identifiant du moteur de recherche personnalisé
console.log(API_KEY);

class Meal {
  constructor(
    id,
    categoryIds,
    title,
    affordability,
    complexity,
    imageUrl,
    duration,
    ingredients,
    steps,
    isGlutenFree,
    isVegan,
    isVegetarian,
    isLactoseFree
  ) {
    this.id = id;
    this.categoryIds = categoryIds;
    this.title = title;
    this.imageUrl = imageUrl;
    this.ingredients = ingredients;
    this.steps = steps;
    this.duration = duration;
    this.complexity = complexity;
    this.affordability = affordability;
    this.isGlutenFree = isGlutenFree;
    this.isVegan = isVegan;
    this.isVegetarian = isVegetarian;
    this.isLactoseFree = isLactoseFree;
  }
}

const MEALS = [
  new Meal(
    "m1",
    ["c1", "c2"],
    "Spaghetti with Tomato Sauce",
    "affordable",
    "simple",
    "https://example.com/spaghetti.jpg",
    20,
    [
      "4 tomatoes",
      "1 tablespoon olive oil",
      "1 onion",
      "250g spaghetti",
      "Salt and pepper to taste",
      "Fresh basil or dried basil (optional)",
      "Grated cheese (optional)",
    ],
    [
      "1. Dice the tomatoes and finely chop the onion.",
      "2. In a large pot, bring water to a boil and add a pinch of salt.",
      "3. Cook the spaghetti according to package instructions (usually 10-12 minutes) until al dente.",
      "4. While the pasta is cooking, heat the olive oil in a pan over medium heat.",
      "5. Add the chopped onion and cook until translucent, about 2 minutes.",
      "6. Add the diced tomatoes to the pan. Season with salt, pepper, and basil (if using). Cook until tomatoes are soft and slightly saucy, about 10 minutes.",
      "7. Drain the spaghetti and mix with the tomato sauce. Top with grated cheese if desired.",
    ],
    false,
    true,
    true,
    true
  ),
  new Meal(
    "m2",
    ["c2"],
    "Vegetarian Toast",
    "affordable",
    "simple",
    "https://example.com/vegetarian-toast.jpg",
    10,
    [
      "2 slices whole grain bread",
      "1 ripe avocado",
      "1 tomato",
      "Salt and pepper to taste",
      "Red pepper flakes (optional)",
      "Fresh basil leaves (optional)",
    ],
    [
      "1. Toast the slices of bread to your liking.",
      "2. While the bread is toasting, cut the avocado in half, remove the pit, and scoop the flesh into a bowl.",
      "3. Mash the avocado with a fork until smooth. Season with salt and pepper.",
      "4. Slice the tomato thinly.",
      "5. Spread the mashed avocado evenly over the toasted bread.",
      "6. Top with tomato slices. Season with additional salt, pepper, and red pepper flakes if desired.",
      "7. Garnish with fresh basil leaves if using.",
    ],
    false,
    false,
    false,
    true
  ),
];

async function findValidImageLink(query) {
  const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
    query
  )}&cx=${CX}&searchType=image&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error(`API Error: ${data.error.message}`);
      return null;
    }

    if (data.items && data.items.length > 0) {
      return data.items[0].link;
    } else {
      console.error(`No valid image found for ${query}`);
      return null;
    }
  } catch (error) {
    console.error(`Error finding image link: ${error}`);
    return null;
  }
}

async function updateImageLinks(meals) {
  for (const meal of meals) {
    const imageUrl = await findValidImageLink(meal.title);
    if (imageUrl) {
      meal.imageUrl = imageUrl;
    }
  }

  console.log("Updated MEALS data:", meals);

  // Écriture des données mises à jour dans un fichier JSON
  fs.writeFileSync(
    "updated-meals.json",
    JSON.stringify(meals, null, 2),
    "utf-8"
  );
  console.log("Updated MEALS data has been saved to updated-meals.json");
}

updateImageLinks(MEALS);
