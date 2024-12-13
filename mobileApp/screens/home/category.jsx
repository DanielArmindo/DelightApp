import { View, TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import { Text, Avatar, IconButton, Menu } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import Loading from '../../components/Loading'
import CategoryPortal from './category_portal'
import { useSelector } from 'react-redux'
import Toast from 'react-native-toast-message';

import { getRecepiesByCategory } from '../../api/category'
import { deleteRecipe as deleteRecipeApi } from '../../api/recipe'
import store from '../../stores'


const Category = ({ route }) => {
  const categoryId = route.params?.id;
  const navigation = useNavigation()

  const categories = useSelector((state) => state.categories);
  const category = categories.find(category => category.id === categoryId)
  const [recipes, setRecipes] = useState(null)


  //const [recipes, setRecipes] = useState([{
  //  "image": "https://img.spoonacular.com/recipes/642722-312x231.jpg",
  //  "title": "Shrimp, Bacon, Avocado Pasta Salad",
  //  "id": 2,
  //  "servings": 4,
  //  "readyInMinutes": 45,
  //}])

  const [menuOption, setMenuOption] = useState(false)
  const [functionMenu, setFunctionMenu] = useState(null)
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const contentFirst = category.name === 'default' ? styles.contentFirst : { ...styles.contentFirst, marginRight: 0 }

  useEffect(() => {
    getRecepiesByCategory(categoryId).then(value => setRecipes(value)).catch(err => setRecipes([]))
  }, [])

  const deleteRecipe = async (id) => {
    const response = await deleteRecipeApi(id, { category: categoryId })

    if (response !== true) {
      Toast.show({
        type: 'error',
        text1: response,
        visibilityTime: 2000,
      })
      return
    }

    setRecipes(recipes.filter(recipe => recipe.id !== id))
    Toast.show({
      type: 'success',
      text1: 'Categoria Eliminada da Categoria!',
      visibilityTime: 2000,
    })
  }

  const openMenu = (event, itemId) => {
    const { pageX, pageY } = event.nativeEvent;
    setMenuPosition({ x: pageX, y: pageY });
    setMenuOption(true);

    setFunctionMenu(() => () => { 
      setMenuOption(false)
      deleteRecipe(itemId)
    })
  }

  const renderRecipes = () => {
    const renderList = (recipe) => {
      return (
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Explore', { screen: 'RecipeScreen', params: { id: recipe.id, goBack: true } })} >
          <View style={styles.retangle}></View>
          <Avatar.Image size={70} style={styles.avatar} source={{ uri: recipe.image }} />
          <View style={styles.content}>
            <Text variant="titleMedium">{recipe.title}</Text>
          </View>
          <IconButton
            icon="trash-can"
            size={25}
            onPress={(e) => openMenu(e, recipe.id)}
          />
        </TouchableOpacity>
      )
    }

    if (recipes === null) {
      return <Loading />
    } else if (recipes.length === 0) {
      return (
        <View style={styles.itemCenter}>
          <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>Sem Receitas associadas</Text>
        </View>
      )
    } else {
      return (<FlatList
        style={{ padding: 15, marginBottom: 80 }}
        data={recipes}
        renderItem={({ item }) => renderList(item)}
        keyExtractor={item => item.id}
      />)
    }
  }

  return (
    <>
      <CategoryPortal
        navigation={navigation}
        store={store}
        categoryId={categoryId}
        category={category}
      />

      <Menu
        visible={menuOption}
        onDismiss={() => setMenuOption(false)}
        anchor={{ x: menuPosition.x, y: menuPosition.y }}>
        <Menu.Item onPress={functionMenu} title="Eliminar Item" />
      </Menu>

      <TouchableOpacity style={{ ...styles.item, marginTop: 10 }} onPress={() => navigation.goBack()}>
        <View style={{ ...styles.retangle, backgroundColor: '#8A2BE2' }}></View>
        <View style={contentFirst}>
          <Text variant="titleLarge">{category.name === "default" ? "Todas as Receitas" : category.name}</Text>
          {category.description && <Text variant="bodyMedium">{category.description}</Text>}
          {(!category.description && category.name === "default") && <Text variant="bodyMedium">Todas as receitas associadas</Text>}
        </View>
        <View style={styles.retangleRight}></View>
      </TouchableOpacity>
      <View style={{ flex: 1, marginTop: -10 }}>
        {renderRecipes()}
      </View>

    </>
  )
}

const styles = StyleSheet.create({
  retangle: {
    flex: 1,
    height: '100%',
    maxWidth: 30,
    backgroundColor: '#4B0082',
    left: "auto",
    marginLeft: -5,
    borderRadius: 5,
    transform: [{ scaleX: 1 }, { scaleY: 1.55 }],
  },
  retangleRight: {
    flex: 1,
    height: '100%',
    maxWidth: 30,
    backgroundColor: '#8A2BE2',
    right: "auto",
    marginRight: -5,
    borderRadius: 5,
    transform: [{ scaleX: 1 }, { scaleY: 1.55 }]
  },
  item: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 35,
    paddingBottom: 10,
    paddingTop: 10,
    minHeight: 90,
    borderRadius: 10,
  },
  content: {
    flex: 2,
    marginLeft: 10,
  },
  contentFirst: {
    flex: 2,
    alignItems: 'center',
  },
  button: {
    marginLeft: 10,
  },
  itemCenter: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    marginLeft: 40,
    marginRight: 40,
    paddingTop: 40,
    borderRadius: 10,
  },
  avatar: {
    marginLeft: 10,
  },
  itemList: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 35,
    marginRight: 20,
    marginLeft: 20,
    paddingBottom: 10,
    paddingRight: 10,
    paddingTop: 10,
    minHeight: 100,
    borderRadius: 10,
  }
})

export default Category
