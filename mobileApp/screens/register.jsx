import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/auth/Background'
import Logo from '../components/auth/Logo'
import Header from '../components/auth/Header'
import Button from '../components/auth/Button'
import TextInput from '../components/auth/TextInput'
import BackButton from '../components/auth/BackButton'
import { colors } from '../assets/global'
import { useNavigation } from '@react-navigation/native'
import { Formik } from 'formik'
import * as yup from 'yup'
import { globalStyles } from '../assets/global'
import { register, login } from '../api/index'
import store from '../stores'
import { getUser } from '../stores/user'
import Toast from 'react-native-toast-message'

const reviewSchema = yup.object().shape({
  username: yup.string().required().min(3),
  email: yup.string().required().email(),
  password: yup.string().required().min(5),
})

export default function Register() {
  const navigation = useNavigation()

  const submitForm = async (values, actions) => {
    var text, type, text2
    const response = await register(values)
    if (response === true) {
      text = 'Utilizador Registado!'
      type = "success"
      const success = await login({
        email: values.email,
        password: values.password
      })

      if (success === true) {
        store.dispatch(getUser())
      } else {
        text2 = 'Ocorreu erro ao efetuar login!'
        type = "error"
      }
    }
    Toast.show({
      type: type,
      text1: text,
      text2: text2,
      visibilityTime: 2000,
    })
  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Create Account</Header>
      <Formik
        initialValues={{ username: '', email: '', password: '' }}
        validationSchema={reviewSchema}
        onSubmit={submitForm}
      >
        {(props) => (
          <>
            <TextInput
              label="Name"
              returnKeyType="next"
              onChangeText={props.handleChange('username')}
              onBlur={props.handleBlur('username')}
            />
            {props.touched.username && props.errors.username && (
              <Text style={globalStyles.textError}>{props.touched.username && props.errors.username}</Text>
            )}
            <TextInput
              label="Email"
              returnKeyType="next"
              onChangeText={props.handleChange('email')}
              onBlur={props.handleBlur('email')}
              autoCapitalize="none"
              autoCompleteType="email"
              textContentType="emailAddress"
              keyboardType="email-address"
            />
            {props.touched.email && props.errors.email && (
              <Text style={globalStyles.textError}>{props.touched.email && props.errors.email}</Text>
            )}
            <TextInput
              label="Password"
              returnKeyType="done"
              onChangeText={props.handleChange('password')}
              onBlur={props.handleBlur('password')}
              secureTextEntry
            />
            {props.touched.password && props.errors.password && (
              <Text style={globalStyles.textError}>{props.touched.password && props.errors.password}</Text>
            )}
            <Button
              mode="contained"
              onPress={props.handleSubmit}
              style={{ marginTop: 24 }}
            >
              Sign Up
            </Button>
          </>
        )}
      </Formik>

      <View style={styles.row}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: colors.primary,
  },
})
