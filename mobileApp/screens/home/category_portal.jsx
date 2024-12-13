import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Text, Modal, Portal, IconButton, Button, RadioButton, FAB } from 'react-native-paper'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { Formik } from 'formik'
import { useState, useEffect } from 'react'
import Toast from 'react-native-toast-message';
import * as yup from 'yup'

import { deleteCategory as deleteCategoryApi, updateCategory as updateCategoryApi } from '../../api/category'
import { removeCategory, updateCategory as updateCategoryStore } from '../../stores/category'
import TextInput from '../../components/auth/TextInput'

const CategoryPortal = ({ navigation, store, categoryId, category }) => {

  const [visible, setVisible] = useState(false)
  const showModal = () => setVisible(true)
  const hideModal = () => setVisible(false)

  const [visible02, setVisible02] = useState(false)
  const showModal02 = () => setVisible02(true)
  const hideModal02 = () => setVisible02(false)

  const [menu, setMenu] = useState({ open: false })
  const [visibleMenu, setVisibleMenu] = useState(true)
  const changeMenu = ({ open }) => setMenu({ open })
  const { open } = menu;

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => setVisibleMenu(true));
    const unsubscribeBlur = navigation.addListener('blur', () => setVisibleMenu(false));

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  const optionsTab = [{
    icon: 'keyboard-backspace',
    label: 'Voltar às categorias',
    onPress: () => navigation.goBack(),
  }]

  if (category.name !== "default") {
    optionsTab.push(
      {
        icon: 'pencil',
        label: 'Editar Categoria',
        onPress: () => {
          changeMenu(false)
          hideModal()
          showModal02()
        },
      },
      {
        icon: 'trash-can',
        label: 'Eliminar Categoria',
        onPress: () => {
          changeMenu(false)
          hideModal02()
          showModal()
        },
      })
  }

  async function updateCategory(values, actions) {
    const response = await updateCategoryApi(categoryId, values)

    if (response !== true) {
      hideModal02()
      Toast.show({
        type: 'error',
        text2: response,
        visibilityTime: 2000,
      })
      return
    }

    hideModal02()
    store.dispatch(updateCategoryStore({ id: categoryId, updatedData: values }))

    Toast.show({
      type: 'success',
      text1: 'Categoria Atualizada!',
      visibilityTime: 2000,
    })
  }

  async function deleteCategory(values, actions) {
    const response = await deleteCategoryApi(categoryId, values.method)

    if (response !== true) {
      hideModal()
      Toast.show({
        type: 'error',
        text1: response,
        visibilityTime: 2000,
      })
      return
    }

    hideModal()
    navigation.goBack()
    store.dispatch(removeCategory(categoryId))

    Toast.show({
      type: 'success',
      text1: 'Categoria eliminada!',
      visibilityTime: 2000,
    })
  }

  return (
    <Portal>
      <Modal visible={visible} dismissable={false} contentContainerStyle={styles.modal}>
        <View style={styles.headerModal}>
          <Text variant="titleLarge" style={{ ...styles.title, marginLeft: 1, paddingTop: 5 }}>Prentede apagar categoria ?</Text>
          <IconButton icon="close" iconColor="red" onPress={hideModal} size={30} style={{
            top: -45 + getStatusBarHeight(),
            right: -15,
          }} />
        </View>
        <Formik initialValues={{ method: 'soft' }}
          onSubmit={deleteCategory}>
          {(props) => (
            <>
              <RadioButton.Group onValueChange={value => props.handleChange('method')(value)} value={props.values.method}>
                <RadioButton.Item label="Eliminar Apenas a categoria" value="soft" />
                <RadioButton.Item label="Eliminar categoria com as receitas" value="all" />
              </RadioButton.Group>
              <Button mode="contained" style={{ marginTop: 15 }} onPress={props.handleSubmit}>
                Eliminar Categoria
              </Button>
            </>
          )}
        </Formik>
      </Modal>
      <Modal visible={visible02} dismissable={false} contentContainerStyle={styles.modal}>
        <View style={styles.headerModal}>
          <Text variant="titleLarge" style={{ ...styles.title, marginLeft: 1, paddingTop: 5 }}>Editar Categoria</Text>
          <IconButton icon="close" iconColor="red" onPress={hideModal02} size={30} style={{
            top: -45 + getStatusBarHeight(),
            right: -15,
          }} />
        </View>
        <Formik initialValues={{ name: category.name, description: category.description }}
          validationSchema={reviewSchema}
          onSubmit={updateCategory}
        >
          {(props) => (
            <>
              <TextInput
                label="Nome"
                returnKeyType="done"
                onChangeText={props.handleChange('name')}
                onBlur={props.handleBlur('name')}
                value={props.values.name}
              />
              {props.touched.name && props.errors.name && (
                <Text style={{ ...globalStyles.textError, marginBottom: 15, }}>{props.touched.name && props.errors.name}</Text>
              )}
              <TextInput
                label="Descrição"
                returnKeyType="done"
                onChangeText={props.handleChange('description')}
                onBlur={props.handleBlur('description')}
                value={props.values.description}
              />
              {props.touched.description && props.errors.description && (
                <Text style={{ ...globalStyles.textError, marginBottom: 15, }}>{props.touched.description && props.errors.description}</Text>
              )}
              <Button mode="contained" style={{ marginTop: 15 }} onPress={props.handleSubmit}>
                Alterar Informação
              </Button>
            </>
          )}
        </Formik>
      </Modal>
      <FAB.Group
        open={open}
        visible
        style={visibleMenu === true ? styles.options : { ...styles.options, display: 'none' }}
        icon={open ? 'menu-open' : 'menu'}
        actions={optionsTab}
        onStateChange={changeMenu}
      />
    </Portal>
  )
}

const reviewSchema = yup.object().shape({
  name: yup.string().required().max(100),
  description: yup.string().max(255),
})

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    padding: 30,
    paddingBottom: 40,
  },
  headerModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: 'purple',
  },
  options: {
    paddingBottom: 50,
  }
})

export default CategoryPortal
