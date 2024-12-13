import { Button, Modal, Portal, IconButton, FAB, Text } from 'react-native-paper'
import { View } from 'react-native'
import { useState, useEffect, useCallback } from 'react'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import Dropdown from 'react-native-input-select';

const RecipePortal = ({ navigation, route, styles, modal, recipe, categories, recipeCategories }) => {

  const [visible, saveRecipe, hideModal, showModal] = modal

  const formattedCategories = categories.map(category => ({
    label: category.name === 'default' ? 'Todas as Receitas' : category.name,
    value: category.id
  }));

  const [inputModal, setInputModal] = useState([]);
  const changeInputModal = useCallback((value) => setInputModal(value), []);

  const [modal2, setModal2] = useState(false)
  const showModal2 = () => setModal2(true)
  const hideModal2 = () => setModal2(false)

  const [menu, setMenu] = useState({ open: false })
  const [visibleMenu, setVisibleMenu] = useState(true)
  const changeMenu = ({ open }) => setMenu({ open })
  const { open } = menu;

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => setVisibleMenu(true));
    const unsubscribeBlur = navigation.addListener('blur', () => navigation.goBack());

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  useEffect(() => {
    if (recipeCategories !== null) {
      setInputModal(recipeCategories);
    }
  }, [recipeCategories]);

  const optionsTab = [{
    icon: 'keyboard-backspace',
    label: 'Pesquisar receitas',
    onPress: () => navigation.goBack(),
  }]

  if (route.params?.goBack === true) optionsTab.push({
    icon: 'archive',
    label: 'Voltar à categoria',
    onPress: () => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'ExploreScreen' }]
      })
      navigation.navigate('Home')
    },
  })

  optionsTab.push({
    icon: 'eye',
    label: 'Categorias Associadas',
    onPress: () => {
      changeMenu(false)
      hideModal()
      showModal2()
    },
  })

  if (recipe !== null) optionsTab.push({
    icon: recipeCategories?.length !== 0 && recipeCategories !== null
      ? 'pencil'
      : 'plus',
    label: recipeCategories?.length !== 0 && recipeCategories !== null
      ? 'Editar categorias da receita'
      : 'Adicionar receita às bibliotecas',
    onPress: () => {
      changeMenu(false)
      hideModal2()
      showModal()
    },
  })

  const renderRecipeInCategories = () => {
    if (recipeCategories === null || recipeCategories?.length === 0) {
      return (
        <Text variant="bodyLarge" style={{ fontWeight: 'bold', marginTop: 20, textAlign: 'center' }}>Sem categoria Associada</Text>
      )
    }

    return recipeCategories.map(value => {
      const category = categories.find(category => category.id === value);
      return (
        <Text variant="bodyLarge" style={{ fontWeight: 'bold', textAlign: 'center' }} key={category?.id}>{category?.name === 'default' ? 'Todas as Receitas' : category?.name}</Text>
      )
    })
  }

  return (
    <Portal>
      <Modal visible={visible} dismissable={false} contentContainerStyle={styles.modal}>
        <View style={styles.headerModal}>
          <Text variant="titleLarge" style={{ ...styles.title, marginLeft: 1, paddingTop: 5 }}>
            {recipeCategories?.length !== 0 && recipeCategories !== null ? 'Editar Categorias:' : 'Adicionar Categorias:'}
          </Text>
          <IconButton icon="close" iconColor="red" onPress={hideModal} size={30} style={{
            top: -45 + getStatusBarHeight(),
            right: -15,
          }} />
        </View>
        <Dropdown
          label="A quais categorias deseja adicionar a receita ?"
          placeholder="Selecione as categorias..."
          options={formattedCategories}
          isMultiple
          selectedValue={inputModal}
          onValueChange={changeInputModal}
          primaryColor={'purple'}
        />
        <Button mode="contained" style={{ marginTop: 15 }} onPress={() => saveRecipe(inputModal)}>
          Salvar Receita
        </Button>
      </Modal>
      <Modal visible={modal2} dismissable={false} contentContainerStyle={styles.modal}>
        <View style={styles.headerModal}>
          <Text variant="titleLarge" style={{ ...styles.title, marginLeft: 1, paddingTop: 5 }}>Categorias Associadas</Text>
          <IconButton icon="close" iconColor="red" onPress={hideModal2} size={30} style={{
            top: -45 + getStatusBarHeight(),
            right: -15,
          }} />
        </View>
        <View style={{ marginLeft: 10 }}>
          {renderRecipeInCategories()}
        </View>
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

export default RecipePortal
