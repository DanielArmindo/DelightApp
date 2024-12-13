import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native'
import { Searchbar, DataTable, Text, Avatar, Button } from 'react-native-paper';
import { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native'
import Dropdown from 'react-native-input-select';
import { useSelector } from 'react-redux';

import { getRecipes, typesOfRecipes, getSuggests } from '../../api/external'
import Loading from '../../components/Loading'
import IndexPortal from './index_portal'
import { recipesForDay } from './data_day'

const numberOfItemsPerPageList = [2, 5, 10, 20];

export default function Index() {
  const navigation = useNavigation()
  const [searchQuery, setSearchQuery] = useState([]);
  const [type, setType] = useState('')
  const changeType = useCallback((value) => setType(value), []);
  const categories = useSelector((state) => state.categories);

  const [modal, setModal] = useState(false)

  //const [recipes, setRecipes] = useState({
  //  "results": [{
  //    "image": "https://img.spoonacular.com/recipes/642722-312x231.jpg",
  //    "title": "Shrimp, Bacon, Avocado Pasta Salad",
  //    "id": 667704,
  //  }],
  //  "offset": 0,
  //  "totalResults": 1
  //})
  const [recipes, setRecipes] = useState(null)

  //const suggestRecipes = recipesForDay
  const [suggestRecipes, setSuggestRecipes] = useState(null)

  // Para a paginação
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[2]);
  const from = page * numberOfItemsPerPage;
  const to = Math.min((page + 1) * numberOfItemsPerPage, recipes === null ? 0 : recipes?.totalResults);

  useEffect(() => {
    setPage(0);
  }, [numberOfItemsPerPage]);

  // Utilização da API externa
  useEffect(() => {
    getRecipes(page == 0 ? 0 : to - numberOfItemsPerPage, searchQuery, type, numberOfItemsPerPage).then(data => setRecipes(data)).catch(error => setRecipes(null))
  }, [page, numberOfItemsPerPage]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPage(0);
      getRecipes(page == 0 ? 0 : to - numberOfItemsPerPage, searchQuery, type, numberOfItemsPerPage).then(data => setRecipes(data)).catch(error => setRecipes(null))
    }, 700)
    return () => clearTimeout(timeoutId);
  }, [searchQuery, type]);

  const funSuggestRecipes = async () => {
    const response = await getSuggests()
    setSuggestRecipes(response === false ? null : response)
    setModal(true)
  }

  const renderList = (recipe) => {
    return (
      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('RecipeScreen', { id: recipe.id })} >
        <View style={styles.retangle}></View>
        <Avatar.Image size={70} style={styles.avatar} source={{ uri: recipe.image }} />
        <View style={styles.content}>
          <Text variant="titleMedium">{recipe.title}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  if (recipes === null) {
    return <Loading />
  }

  return (
    <>
      <IndexPortal modal={modal} setModal={setModal} categories={categories} data={suggestRecipes} />
      <View style={styles.container}>
        <Searchbar
          placeholder="Search"
          style={styles.searchbar}
          onChangeText={setSearchQuery}
          value={searchQuery}
        />
        <View style={styles.dropdownContainer}>
          <Text variant="titleMedium" style={{ marginRight: 10 }}>Tipo de categoria:</Text>
          <Dropdown
            placeholder=""
            options={typesOfRecipes}
            selectedValue={type}
            onValueChange={changeType}
            primaryColor={'purple'}
            dropdownStyle={styles.dropdown}
            dropdownContainerStyle={{ width: '55%', marginTop: 20 }}
          />
        </View>

        <Button mode="contained"
          onPress={funSuggestRecipes}
          style={{ marginLeft: 40, marginRight: 40 }}>
          Gerar refeições para o dia
        </Button>

        <FlatList
          style={{ paddingLeft: 15, paddingRight: 15 }}
          data={recipes.results}
          renderItem={({ item }) => renderList(item)}
          keyExtractor={item => item.id}
        />
      </View>
      <View style={styles.foot}>
        <DataTable>
          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(recipes.totalResults / numberOfItemsPerPage)}
            onPageChange={page => setPage(page)}
            label={`${from + 1}-${to} of ${recipes.totalResults}`}
            //showFastPaginationControls
            numberOfItemsPerPageList={numberOfItemsPerPageList}
            numberOfItemsPerPage={numberOfItemsPerPage}
            onItemsPerPageChange={onItemsPerPageChange}
            selectPageDropdownLabel={'Por/pg'}
          />
        </DataTable>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  foot: {
    backgroundColor: '#e0e0e0',
  },
  searchbar: {
    backgroundColor: 'white'
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
    marginTop: 20,
    paddingBottom: 10,
    paddingRight: 10,
    paddingTop: 10,
    minHeight: 100,
    borderRadius: 10,
  },
  content: {
    flex: 2,
    marginLeft: 10,
  },
  avatar: {
    marginLeft: 10,
  },
  dropdown: {
    backgroundColor: 'white',
  },
  dropdownContainer: {
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: -10,
    alignItems: 'center',
    alignSelf: 'center',
  },
})
