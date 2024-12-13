import { ImageBackground, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { colors } from '../../assets/global'

export default function Background({ children }) {
  return (
    <ImageBackground
      source={require('../../assets/images/background.jpg')}
      resizeMode="cover"
      style={styles.background}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          {children}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.surface,
  },
  container: {
    flex: 1,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
