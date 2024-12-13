import { api } from './index.js'

export async function getCategories() {
  try {
    const response = await api.get("/categories")
    return response.data
  } catch (error) {
    return false
  }
}

export async function getRecepiesByCategory(id) {
  try {
    const response = await api.get(`/categories/${id}/recipes`)
    return response.data
  } catch (error) {
    return []
  }
}

export async function createCategory(data) {
  try {
    const response = await api.post("/categories", data)
    return response.data
  } catch (error) {
    if (error.response && error.response.status) {
      return error.response.data?.error
    }
    return 'Erro ao criar criar categoria!'
  }
}

export async function updateCategory(id, data) {
  try {
    await api.put(`/categories/${id}`, data)
    return true
  } catch (error) {
    if (error.response && error.response.status) {
      return error.response.data?.error
    }
    return 'Erro ao atualizar categoria!'
  }
}

export async function deleteCategory(id, method) {
  try {
    await api.delete(`/categories/${id}`,
      {
        headers: {
          'method': method
        }
      })
    return true
  } catch (error) {
    if (error.response && error.response.status) {
      return error.response.data?.error
    }
    return 'Erro ao apagar categoria!'
  }
}

export async function getStatistics() {
  try {
    const response = await api.get('/me/statistics')
    return response.data
  } catch (error) {
    return false
  }
}
