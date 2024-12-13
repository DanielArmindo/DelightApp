import RootLayout from './router/RootLayout'
import { Provider } from "react-redux";
import store from "./stores";
import { getItemAsync } from 'expo-secure-store'
import { useState, useEffect } from 'react'
import { Provider as ProviderPaper } from 'react-native-paper'

import { api } from './api/index'
import { getUser } from './stores/user'
import Loading from './components/Loading'
import Toast, { BaseToast } from 'react-native-toast-message';
import { globalStyles } from './assets/global'

export default function App() {
  const [init, setInit] = useState(false);

  // Config para o Toast
  const toastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={{ ...globalStyles.toastBorder, borderColor: "green" }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={globalStyles.toastText1}
        text2Style={globalStyles.toastText2}
      />
    ),
    error: (props) => (
      <BaseToast
        {...props}
        style={{ ...globalStyles.toastBorder, borderColor: "red" }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={globalStyles.toastText1}
        text2Style={globalStyles.toastText2}
      />
    ),
    info: (props) => (
      <BaseToast
        {...props}
        style={{ ...globalStyles.toastBorder, borderColor: "blue" }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={globalStyles.toastText1}
        text2Style={globalStyles.toastText2}
      />
    ),
  };

  // Para apenas executar a função uma vez
  useEffect(() => {
    (async () => {
      const token = await getItemAsync("token");
      if (token) {
        api.defaults.headers.common.Authorization = "Bearer " + token;
        await store.dispatch(getUser());
      }
      setInit(true);
    })();
  }, [])

  if (!init) {
    return <Loading />;
  }

  return (
    <ProviderPaper>
      <Provider store={store}>
        <RootLayout />
        <Toast config={toastConfig} />
      </Provider>
    </ProviderPaper>
  );
}
