import { Text, Modal, Portal, IconButton, Button } from 'react-native-paper'
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useState, useEffect } from 'react';
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { Formik } from 'formik'
import * as yup from 'yup'
import { useSelector } from 'react-redux'
import Toast from 'react-native-toast-message'
import { useNavigation } from '@react-navigation/native'

import { globalStyles } from '../../assets/global'
import TextInput from '../../components/auth/TextInput'
import { createCategory as createCategoryApi } from '../../api/category'
import store from '../../stores'
import Loading from '../../components/Loading'
import { getCategories, addCategory } from '../../stores/category'


const reviewSchema = yup.object().shape({
  name: yup.string().required().max(100),
  description: yup.string().max(255),
})

export default function Index() {
  const navigation = useNavigation()
  const categories = useSelector((state) => state.categories);
  const displayCategories = categories?.filter(category => category.name !== "default")
  const defaultCategory = categories?.find(category => category.name === "default");

  // Verificar se já existe categorias e carregar no inicio da app
  useEffect(() => {
    (async () => {
      if (categories === null) {
        store.dispatch(getCategories())
      }
    })()
  }, [])

  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const createCategory = async (values, actions) => {
    const category = await createCategoryApi(values)
    if (typeof category === "string") {
      Toast.show({
        type: 'error',
        text2: category,
        visibilityTime: 2000,
      })
      return
    }
    store.dispatch(addCategory(category))
    hideModal()
    Toast.show({
      type: 'success',
      text1: "Categoria criada com sucesso!",
      visibilityTime: 2000,
    })
  }

  if (categories === null) {
    return <Loading />
  }

  return (
    <>
      <Portal>
        <Modal visible={visible} dismissable={false} contentContainerStyle={styles.modal}>
          <View style={styles.modalHeader}>
            <Text variant="titleLarge" style={{ ...styles.title, marginLeft: 1, paddingTop: 5 }}>Criar Categoria</Text>
            <IconButton icon="close" iconColor="red" onPress={hideModal} size={30} style={{
              top: -45 + getStatusBarHeight(),
            }} />
          </View>
          <Formik initialValues={{ name: '', description: '' }}
            validationSchema={reviewSchema}
            onSubmit={createCategory}
          >
            {(props) => (
              <>
                <TextInput
                  label="Nome"
                  returnKeyType="done"
                  onChangeText={props.handleChange('name')}
                  onBlur={props.handleBlur('name')}
                />
                {props.touched.name && props.errors.name && (
                  <Text style={{ ...globalStyles.textError, marginBottom: 15, }}>{props.touched.name && props.errors.name}</Text>
                )}
                <TextInput
                  label="Descrição"
                  returnKeyType="done"
                  onChangeText={props.handleChange('description')}
                  onBlur={props.handleBlur('description')}
                />
                {props.touched.description && props.errors.description && (
                  <Text style={{ ...globalStyles.textError, marginBottom: 15, }}>{props.touched.description && props.errors.description}</Text>
                )}
                <Button mode="contained" style={{ marginTop: 15 }} onPress={props.handleSubmit}>
                  Criar Categoria
                </Button>
              </>
            )}
          </Formik>
        </Modal>
      </Portal>

      <ScrollView style={{ flex: 1, paddingTop: 15 }}>
        <TouchableOpacity style={styles.item} onPress={showModal}>
          <View style={{ ...styles.retangle, backgroundColor: '#8A2BE2' }}></View>
          <View style={styles.content}>
            <Text variant="titleLarge">Criar Nova Categoria</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('CategoryScreen', { id: defaultCategory.id })}>
          <View style={{ ...styles.retangle, backgroundColor: '#8A2BE2' }}></View>
          <View style={styles.content}>
            <Text variant="titleLarge">Todas as Receitas</Text>
            <Text variant="bodyMedium">Mostra todas receitas guardadas</Text>
          </View>
        </TouchableOpacity>

        {displayCategories.map((category) => {
          return (
            <TouchableOpacity onPress={() => navigation.navigate('CategoryScreen', { id: category.id })}
              style={styles.item} key={category.id}>
              <View style={styles.retangle}></View>
              <View style={styles.content}>
                <Text variant="titleLarge">{category.name}</Text>
                {category.description && <Text variant="bodyMedium">{category.description}</Text>}
              </View>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  title: {
    color: 'purple',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  retangle: {
    flex: 1,
    height: '150%',
    maxWidth: 30,
    backgroundColor: '#4B0082',
    left: "auto",
    marginLeft: -5,
    borderRadius: 5,
  },
  item: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 35,
    paddingBottom: 10,
    paddingTop: 10,
    minHeight: 100,
  },
  content: {
    flex: 2,
    marginLeft: 10,
  },
})
