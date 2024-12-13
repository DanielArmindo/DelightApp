import Background from '../components/auth/Background'
import Logo from '../components/auth/Logo'
import Header from '../components/auth/Header'
import Button from '../components/auth/Button'
import Paragraph from '../components/auth/Paragraph'
import { useNavigation } from '@react-navigation/native'

export default function Main() {
  const navigation = useNavigation()
  return (
    <Background>
      <Logo />
      <Header>Delight App</Header>
      <Paragraph>
        The easiest way to start managing your food recipes
      </Paragraph>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('LoginScreen')}
      >
        Login
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('RegisterScreen')}
      >
        Sign Up
      </Button>
    </Background>
  )
}
