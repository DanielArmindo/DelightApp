import { StyleSheet, View, ScrollView } from 'react-native'
import { Text, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';

import RecipePortal from './recipe_portal'
import { itemExample } from './data'
import { useState, useEffect } from 'react';
import { saveRecipe as saveRecipeApi, getCategoriesByRecipe } from '../../api/recipe'
import { getRecipe } from '../../api/external'
import Loading from '../../components/Loading'

export default function Recipe({ route }) {

  const navigation = useNavigation()
  const recipe_id = route.params?.id
  const categories = useSelector((state) => state.categories);
  const defaultCategory = categories.find(category => category.name === "default")
  const [recipe, setRecipe] = useState(null)
  //const [recipe, setRecipe] = useState(itemExample)
  const [recipeCategories, setRecipeCategories] = useState(null)

  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false)

  useEffect(() => {
    //Carregar Receita
    getRecipe(recipe_id).then(value => setRecipe(value)).catch(err => setRecipe(null))
  }, [])

  useEffect(() => {
    //Verificar a que categorias pertence
    getCategoriesByRecipe(recipe_id).then(values => setRecipeCategories(values)).catch(err => setRecipeCategories(null))
  }, [categories])

  const summary = recipe?.summary.replace(/<[^>]*>/g, '')

  const saveRecipe = async (values) => {

    const requestValues = [...values]

    if (values.length !== 0) {
      if (!requestValues.includes(defaultCategory.id)) {
        requestValues.push(defaultCategory.id);
      }
    }

    const requestData = {
      recipe_id: recipe_id,
      title: recipe.title,
      servings: recipe.servings,
      readyInMinutes: recipe.readyInMinutes,
      imageUrl: recipe.image,
      categories: requestValues,
    }

    const response = await saveRecipeApi(requestData)
    hideModal()

    if (response === true) {
      let msg = 'Receita adicionada às categorias!'

      if (values.length === 0) {
        msg = 'Receita removida das categorias!'
        setRecipeCategories(null)
      } else {
        setRecipeCategories(requestValues)
      }

      Toast.show({
        type: 'success',
        text1: msg,
        visibilityTime: 2000,
      })
      return
    }

    Toast.show({
      type: 'error',
      text2: response,
      visibilityTime: 2000,
    })
  }

  const renderMethods = recipe?.analyzedInstructions[0].steps.map(value => {
    return (
      <Text variant="bodyLarge" style={{ marginTop: 15 }} key={value.number}>
        <Text style={styles.title}>Etapa {value.number}: </Text>
        <Text>{value.step}</Text>
      </Text>
    )
  });

  if (recipe === null) {
    return <Loading />
  }

  return (
    <>
      <RecipePortal styles={styles}
        navigation={navigation}
        route={route}
        recipe={recipe}
        categories={categories}
        recipeCategories={recipeCategories}
        modal={[visible, saveRecipe, hideModal, showModal]}
      />

      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <Text variant="titleLarge" style={styles.title}>Titulo da Receita</Text>
          <Text variant="bodyLarge">{recipe.title}</Text>
          <Text variant="bodyMedium">
            <Text style={styles.title}>Autor: </Text>
            {recipe.author ? recipe.author : 'Desconhecido'}
          </Text>
        </View>
        <Card>
          <Card.Cover source={{ uri: recipe.image }} />
        </Card>
        <View style={styles.card}>
          <Text variant="titleLarge" style={styles.title}>Informações Adicionais</Text>
          <Text variant="bodyLarge">
            <Text style={styles.title}>Tempo de Preparo: </Text>
            {recipe.readyInMinutes} minutos
          </Text>
          <Text variant="bodyLarge">
            <Text style={styles.title}>Porções: </Text>
            {recipe.servings}
          </Text>
        </View>
        <View style={styles.card}>
          <Text variant="titleLarge" style={styles.title}>Síntese</Text>
          <Text variant="bodyLarge">{summary}</Text>
        </View>

        <View style={styles.card}>
          <Text variant="titleLarge" style={styles.title}>Ingredientes</Text>
          <View style={{ flexDirection: 'row', marginBottom: 8, margin: 12 }}>
            <View style={{ flex: 1 }}>
              <Text variant="titleMedium" style={{ ...styles.title, textAlign: 'center' }}>Nome</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="titleMedium" style={{ ...styles.title, textAlign: 'center' }}>Quantidade</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="titleMedium" style={{ ...styles.title, textAlign: 'center' }}>Consistência</Text>
            </View>
          </View>
          {recipe.extendedIngredients.map(item => (
            <View key={item.id} style={{ margin: 12 }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ textAlign: 'center' }}>{item.name}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ textAlign: 'center' }}>{Math.round(item.amount * 100) / 100} {item.measures.metric.unitLong}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ textAlign: 'center' }}>{item.consistency.toLowerCase()}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={{ ...styles.card, marginBottom: 90 }}>
          <Text variant="titleLarge" style={styles.title}>Etapas de Preparo</Text>
          {renderMethods}
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
    paddingTop: 15,
  },
  title: {
    color: 'purple',
  },
  card: {
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 15,
    alignSelf: 'center',
  },
  modal: {
    backgroundColor: 'white',
    padding: 30,
    paddingBottom: 40,
  },
  headerModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  options: {
    paddingBottom: 50,
  }
})
