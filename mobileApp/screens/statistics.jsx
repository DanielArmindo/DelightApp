import { useEffect, useState } from 'react'
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native'
import { Text, Button, Modal, Portal, IconButton } from 'react-native-paper'
import { BarChart, PieChart } from 'react-native-chart-kit'

import { getStatistics } from '../api/category'
import { generateUniqueColors } from '../assets/global'

const Statistics = ({ navigation, parentStyles, statusBar }) => {

  const screenWidth = Dimensions.get("window").width;

  const [statistics, setStatistics] = useState(null)

  const [modal, setModal] = useState(false)
  const showModal = () => setModal(true)
  const hideModal = () => setModal(false)

  const uniqueColors = generateUniqueColors(statistics?.category_statistics.length);
  const colorLabels = []

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => getStatistics().then(data => setStatistics(data)));

    return () => {
      unsubscribeFocus();
    };
  }, [navigation]);

  const firstData = {
    labels: [statistics?.min_category?.category_name, statistics?.max_category?.category_name],
    datasets: [
      {
        data: [statistics?.min_category?.num_recipes, statistics?.max_category?.num_recipes]
      }
    ]
  };

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientFromOpacity: 0.5,
    backgroundGradientTo: "#ffffff",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    barPercentage: 2,
    decimalPlaces: 0,
    propsForLabels: {
      fontWeight: 500,
    },
  };

  const secondData = statistics?.category_statistics.map((category, index) => {
    colorLabels.push({
      name: category.category_name,
      total: category.num_recipes / statistics?.total_recipes * 100,
      color: uniqueColors[index],
    })

    return {
      name: category.category_name,
      value: category.num_recipes,
      color: uniqueColors[index],
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    }
  })

  if (statistics === null) {
    return (
      <View style={styles.container}>
        <Text variant="titleMedium" style={{ ...parentStyles.title, textAlign: 'center' }}>Carregando estatísticas...</Text>
      </View>
    )
  }

  if (statistics === false) {
    return (
      <View style={styles.container}>
        <Text variant="titleMedium" style={{ ...parentStyles.title, textAlign: 'center' }}>Erro ao sicronizar estatísticas</Text>
      </View>
    )
  }


  const renderOptions = () => {
    if (statistics?.total_recipes <= 0 ) {
      return <Text variant="titleMedium" style={{ ...parentStyles.title, textAlign: 'center' }}>Dados insuficientes para demonstração</Text>
    }

    if (statistics?.category_statistics.length === 0 || statistics?.max_category === null || statistics?.min_category === null) {
      return <Text variant="titleMedium" style={{ ...parentStyles.title, textAlign: 'center' }}>Sem dados para listar</Text>
    }

    return (
      <>
        <Text variant="titleMedium" style={{ ...parentStyles.title, textAlign: 'center', marginBottom: 10 }}>Categoria com mais e menos receitas</Text>
        <BarChart
          style={{ borderRadius: 20, paddingBlock: 10 }}
          data={firstData}
          width={screenWidth - 60}
          height={250}
          paddingTop={"20"}
          chartConfig={chartConfig}
          withInnerLines={false}
          showValuesOnTopOfBars={true}
        />
        <Text variant="titleMedium" style={{ ...parentStyles.title, textAlign: 'center', marginBottom: 10 }}>Balanço geral das categorias</Text>
        <PieChart
          data={secondData}
          width={screenWidth - 60}
          height={250}
          accessor={"value"}
          chartConfig={chartConfig}
          backgroundColor={"transparent"}
          paddingLeft={screenWidth / 5}
          hasLegend={false}
        />
        <View style={{ ...styles.row, flexWrap: 'wrap', justifyContent: 'center', alignSelf: 'center' }}>
          {colorLabels.map(label => (
            <View style={styles.item} key={label.name}>
              <View style={styles.firstLine}>
                <View style={{ ...styles.retangle, backgroundColor: label.color }}></View>
                <Text variant="bodyLarge" style={{ paddingLeft: 10 }}>{label.total.toFixed(2)} %</Text>
              </View>
              <Text variant="bodyLarge" style={{ paddingTop: 5 }}>{label.name}</Text>
            </View>
          ))}
        </View>
      </>
    )
  }

  return (
    <>
      <Portal>
        <Modal visible={modal} dismissable={false} contentContainerStyle={parentStyles.modal}>
          <ScrollView>
            <View style={parentStyles.headerModal}>
              <Text variant="titleLarge" style={{ ...styles.title, marginLeft: 1, paddingTop: 5 }}>Gráfico das Categorias</Text>
              <IconButton icon="close" iconColor="red" onPress={hideModal} size={30} style={{
                top: -45 + statusBar(),
              }} />
            </View>
            {renderOptions()}
          </ScrollView>
        </Modal >
      </Portal >

      <View style={styles.container}>
        <View style={styles.row}>
          <Text variant="titleMedium" style={parentStyles.title}>Total de categorias:</Text>
          <Text variant="bodyLarge"> {statistics.total_categories}</Text>
        </View>
        <View style={styles.row}>
          <Text variant="titleMedium" style={parentStyles.title}>Total de receitas:</Text>
          <Text variant="bodyLarge"> {statistics.total_recipes}</Text>
        </View>
        <View style={styles.row}>
          <Text variant="titleMedium" style={parentStyles.title}>Média de receitas por categoria:</Text>
          <Text variant="bodyLarge"> {parseFloat(statistics.average_recipes_per_category.toFixed(2))}</Text>
        </View>
        <View style={styles.row}>
          <Text variant="titleMedium" style={parentStyles.title}>Categorias com receitas:</Text>
          <Text variant="bodyLarge"> {statistics.categories_with_recipes}</Text>
        </View>
        <View style={styles.row}>
          <Text variant="titleMedium" style={parentStyles.title}>Categorias sem receitas:</Text>
          <Text variant="bodyLarge"> {statistics.categories_without_recipes}</Text>
        </View>
        <View style={styles.containerButton}>
          <Button onPress={showModal} mode="contained" style={{ flexGrow: 1 }}>Visualizar Gráfico</Button>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  row: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerButton: {
    margin: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 15,
  },
  firstLine: {
    width: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  retangle: {
    height: 30,
    width: 30,
    borderRadius: 20,
  },
})

export default Statistics
