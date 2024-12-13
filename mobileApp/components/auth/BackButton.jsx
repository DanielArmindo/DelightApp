import { StyleSheet } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { IconButton } from 'react-native-paper'

export default function BackButton({ goBack }) {
  return (
    <IconButton icon="arrow-left" onPress={goBack} size={30} style={styles.container} />
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10 + getStatusBarHeight(),
    left: -2,
  },
  image: {
    width: 24,
    height: 24,
  },
})
