import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Index from '../screens/home/index'
import Category from '../screens/home/category'

const Tab = createNativeStackNavigator();

const HomeLayout = () => {
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
    }}>
      <Tab.Screen name="HomeScreen" component={Index} />
      <Tab.Screen name="CategoryScreen" component={Category} />
    </Tab.Navigator>
  )
}

export default HomeLayout
