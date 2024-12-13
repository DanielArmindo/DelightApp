import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import ExploreLayout from './ExploreLayout'
import Profile from '../screens/profile'
import HomeLayout from './HomeLayout'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { clear as clearUser } from '../stores/user'
import { clear as clearCategories} from '../stores/category'
import { logout } from '../api/index'
import store from '../stores'


const Tab = createBottomTabNavigator();

const AppLayout = () => {

  const logoutSubmit = async () => {
    await logout()
    store.dispatch(clearUser())
    store.dispatch(clearCategories())
  }

  const optionsNavigator = ({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;

      if (route.name === 'Home') {
        iconName = focused ? 'home' : 'home';
      } else if (route.name === 'Explore') {
        iconName = focused ? 'search' : 'search';
      } else if (route.name === 'Profile') {
        iconName = focused ? 'person' : 'person';
      }
      return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: 'purple',
    //tabBarInactiveTintColor: 'gray',
  })

  return (
    <Tab.Navigator screenOptions={optionsNavigator}>
      <Tab.Screen name="Home" component={HomeLayout} />
      <Tab.Screen name="Explore" component={ExploreLayout} />
      <Tab.Screen name="Profile" component={Profile} options={{
        headerRight: () => (
          <TouchableOpacity onPress={logoutSubmit}>
            <Ionicons style={styles.button} name="log-out" size={35} color="purple" />
          </TouchableOpacity>
        ),
      }} />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  button: {
    marginRight: 15,
  },
})

export default AppLayout
