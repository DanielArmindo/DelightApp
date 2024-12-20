import { StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import { colors } from '../../assets/global'

export default function Header(props) {
  return <Text style={styles.header} {...props} />
}

const styles = StyleSheet.create({
  header: {
    fontSize: 21,
    color: colors.primary,
    fontWeight: 'bold',
    paddingVertical: 12,
  },
})
