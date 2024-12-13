import { api } from './index'

export async function saveRecipe(data) {
  try {
    await api.post('/recipes', data)
    return true
  } catch (error) {
    if (err.response && err.response.status) {
      return err.response.data?.error
    }
    return 'Erro ao salvar receita nas categorias!'
  }
}

export async function deleteRecipe(id, data) {
  try {
    await api.delete(`/recipes/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    })
    return true
  } catch (err) {
    console.log(err.response.data)
    return 'Erro ao eliminar receita da categoria!'
  }
}

export async function getCategoriesByRecipe(id) {
  try {
    const response = await api.get(`/recipes/${id}/categories`)
    return response.data
  } catch (error) {
    return false
  }
}
