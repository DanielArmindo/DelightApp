import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

// Login/Register Screens
import Main from '../screens/main';
import Login from '../screens/login';
import Register from '../screens/register';
import ResetPassword from '../screens/resetPassword';
import AppLayout from './AppLayout'

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  // Tratar do loading do user
  const user = useSelector((state) => state.user);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={!user ? 'StartScreen' : 'MainApp'}
        screenOptions={{
          headerShown: false,
        }}
      >
        {!user && (
          <>
            <Stack.Screen name="StartScreen" component={Main} />
            <Stack.Screen name="LoginScreen" component={Login} />
            <Stack.Screen name="RegisterScreen" component={Register} />
            <Stack.Screen name="ResetPasswordScreen" component={ResetPassword} />
          </>
        )}

        {user && (
          <Stack.Screen name="MainApp" component={AppLayout} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
