import axios from 'axios'
import { apiKey } from './env'

export const api = axios.create({
  baseURL: 'https://api.spoonacular.com',
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use((config) => {
  if (!config.params) {
    config.params = {};
  }
  config.params['apiKey'] = apiKey;
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const typesOfRecipes = [
  {
    label: "Sem tipo",
    value: '',
  },
  {
    label: "Pratos Principais",
    value: 'main course',
  },
  {
    label: "Acompanhamentos",
    value: 'side dish',
  },
  {
    label: "Sobremesas",
    value: 'dessert',
  },
  {
    label: "Aperitivos",
    value: 'appetizer',
  },
  {
    label: "Saladas",
    value: 'salad',
  },
  {
    label: "Pão",
    value: 'bread',
  },
  {
    label: "Pequeno Almoço",
    value: 'breakfast',
  },
  {
    label: "Sopas",
    value: 'soup',
  },
  {
    label: "Bebidas Alcólicas",
    value: 'beverage',
  },
  {
    label: "Molhos",
    value: 'sauce',
  },
  {
    label: "Pratos Marinados",
    value: 'marinade',
  },
  {
    label: "Petiscos",
    value: 'fingerfood',
  },
  {
    label: "Lanches",
    value: 'snack',
  },
  {
    label: "Bebidas",
    value: 'drink',
  },
]

export async function getRecipes(offset, query, type, number = 10) {
  try {
    const response = await api.get(`/recipes/complexSearch?number=${number}&query=${query}&offset=${offset}&type=${type}`)
    return response.data
  } catch (error) {
    return false
  }
}

export async function getRecipe(id) {
  try {
    const response = await api.get(`/recipes/${id}/information`)
    return response.data
  } catch (error) {
    return false
  }
}

export async function getSuggests() {
  try {
    const response = await api.get(`/mealplanner/generate?timeFrame=day`)
    return response.data
  } catch (error) {
    return false
  }
}
