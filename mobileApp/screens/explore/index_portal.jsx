import { StyleSheet, View, ScrollView } from 'react-native'
import { Portal, Modal, IconButton, Text, Avatar, Button, Divider } from 'react-native-paper';
import { getStatusBarHeight } from 'react-native-status-bar-height'
import Toast from 'react-native-toast-message'
import { createCategory, deleteCategory } from '../../api/category'
import { saveRecipe } from '../../api/recipe'

import store from '../../stores'
import { addCategory } from '../../stores/category'

const IndexPortal = ({ modal, setModal, categories, data }) => {

  const saveRecipes = async () => {

    let category = categories.find(item => item.name === 'Receitas Atuais')

    if (category !== undefined) {
      await deleteCategory(category.id, 'clean')
    } else {
      category = await createCategory({
        name: 'Receitas Consumo Diário',
        description: 'Receitas para o consumo diário'
      })
      store.dispatch(addCategory(category))
    }

    data.meals.forEach((item) => {
      const requestData = {
        recipe_id: item.id,
        title: item.title,
        servings: item.servings,
        readyInMinutes: item.readyInMinutes,
        imageUrl: `https://img.spoonacular.com/recipes/${item.id}-556x370.jpg`,
        categories: [category.id]
      }
      saveRecipe(requestData)
    })
    setModal(false)
    Toast.show({
      type: 'success',
      text1: "Receitas Salvaguardadas!",
      visibilityTime: 2000,
    })
  }

  return (
    <Portal>
      <Modal visible={modal} dismissable={false} contentContainerStyle={styles.modal}>
        <View style={styles.headerModal}>
          <Text variant="titleLarge" style={{ ...styles.title, marginLeft: 1, paddingTop: 5 }}>
            Menu de Refeições
          </Text>
          <IconButton icon="close" iconColor="red" onPress={() => setModal(false)} size={30} style={{
            top: -45 + getStatusBarHeight(),
            right: -15,
          }} />
        </View>
        <ScrollView>
          {data !== null ? (
            <>
              {data.meals.map((item, index) => (
                <View key={item.id}>
                  <Text variant="titleMedium" style={{ textAlign: 'center' }} >
                    {index === 0 ? 'Pequeno Almoço' :
                      index === 1 ? 'Almoço' : 'Jantar'}
                  </Text>
                  <View style={styles.contentItem}>
                    <Avatar.Image size={85} style={styles.avatar} source={{ uri: `https://img.spoonacular.com/recipes/${item.id}-556x370.jpg` }} />
                    <View>
                      <Text variant="bodyLarge">
                        <Text variant="bodyLarge" style={styles.title}>Nome: </Text>
                        {item.title}
                      </Text>
                      <Text variant="bodyLarge">
                        <Text variant="bodyLarge" style={styles.title}>Tempo de Preparo: </Text>
                        {item.readyInMinutes} minutos
                      </Text>
                      <Text variant="bodyLarge">
                        <Text variant="bodyLarge" style={styles.title}>Porções: </Text>
                        {item.servings}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}

              <Divider />

              <Text variant="titleMedium" style={{ textAlign: 'center', marginTop: 20, marginBottom: 10 }} >Estatísticas Calóricas</Text>

              <View style={{ flexDirection: 'row', flex: 1 }}>
                <Text variant="bodyMedium" style={{ flex: 1 }}>
                  <Text variant="bodyLarge" style={styles.title}>Calorias: </Text>
                  {data.nutrients.calories}
                </Text>
                <Text variant="bodyMedium" style={{ flex: 1 }}>
                  <Text variant="bodyLarge" style={styles.title}>Proteinas: </Text>
                  {data.nutrients.protein}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', flex: 1, marginBottom:20 }}>
                <Text variant="bodyMedium" style={{ flex: 1 }}>
                  <Text variant="bodyLarge" style={styles.title}>Gorduras: </Text>
                  {data.nutrients.fat}
                </Text>
                <Text variant="bodyMedium" style={{ flex: 1 }}>
                  <Text variant="bodyLarge" style={styles.title}>Carbohidratos: </Text>
                  {data.nutrients.carbohydrates}
                </Text>
              </View>

              <Divider />
              <Button mode="contained"
                onPress={saveRecipes}
                style={{ marginTop: 10, marginLeft: 40, marginRight: 40 }}>
                Guardar Refeições
              </Button>
              <Text variant="bodySmall" style={{ textAlign: 'center', marginTop: 10 }}>Será criada uma nova categoria
                <Text variant="bodySmall" style={styles.title}> 'Receitas Atuais' </Text>
                para armazenar estas receitas</Text>
            </>
          ) : (
            <Text variant="bodyLarge" style={{ textAlign: 'center' }}>Procurando sugestões de receitas...</Text>
          )}
        </ScrollView>
      </Modal>
    </Portal>
  )
}

const styles = StyleSheet.create({
  title: {
    color: 'purple',
  },
  avatar: {
    marginRight: 10,
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
  contentItem: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 15,
    marginTop: 15,
    marginBottom: 15,
    borderRadius: 20,
    marginRight: 35,
    marginLeft: 35,
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
  },
})

export default IndexPortal
