import { ActivityIndicator, StyleSheet, View } from 'react-native'

const Loading = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator style={styles.loading} size="large" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loading: {
    transform: [{ scaleX: 2.5 }, { scaleY: 2.5 }]
  }
})

export default Loading
