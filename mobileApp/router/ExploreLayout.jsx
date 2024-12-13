import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Index from '../screens/explore/index'
import Recipe from '../screens/explore/recipe'

const Tab = createNativeStackNavigator();

const ExploreLayout = () => {
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
    }}>
      <Tab.Screen name="ExploreScreen" component={Index} />
      <Tab.Screen name="RecipeScreen" component={Recipe} />
    </Tab.Navigator>
  )
}

export default ExploreLayout
