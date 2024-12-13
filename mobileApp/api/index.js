import axios from 'axios'
import { setItemAsync, deleteItemAsync } from 'expo-secure-store'
import { apiDomain } from './env'

export const api = axios.create({
  baseURL: apiDomain,
  headers: {
    "Content-Type": "application/json",
  },
})

export async function register(data) {
  try {
    await api.post("/register", data);
    return true;
  } catch (err) {
    if (err.response && err.response.status) {
      return err.response;
    }
    return false;
  }
}

export async function login(credentials) {
  try {
    const response = await api.post("/login", credentials);
    await setItemAsync("token", response.data.access_token);
    api.defaults.headers.common.Authorization =
      "Bearer " + response.data.access_token;
    return true;
  } catch (error) {
    await clearTokken();
    if (error.response && error.response.status) {
      return error.response.data?.msg;
    }
    return false;
  }
}

export async function logout() {
  try {
    await api.post("/logout");
    await clearTokken();
    return true;
  } catch (error) {
    await clearTokken();
    return false;
  }
}

export async function changeCredentials(credentials) {
  try {
    await api.put("/me", credentials);
    await clearTokken();
    return true;
  } catch (error) {
    if (error.response && error.response.status) {
      return error.response.data.error;
    }
    return 'Erro ao alterar credenciais!';
  }
}

export async function sendEmail(email) {
  try {
    await api.post("/send-email", email)
    return true
  } catch (error) {
    if (error.response && error.response.status) {
      return error.response.data.error
    }
    return 'Erro ao enviar email!'
  }
}

async function clearTokken() {
  await deleteItemAsync("token")
  api.defaults.headers.common.Authorization = "";
}
