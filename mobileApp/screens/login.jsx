import { TouchableOpacity, StyleSheet, View, } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/auth/Background'
import Logo from '../components/auth/Logo'
import Header from '../components/auth/Header'
import Button from '../components/auth/Button'
import TextInput from '../components/auth/TextInput'
import BackButton from '../components/auth/BackButton'
import { colors } from '../assets/global'
import { useNavigation } from '@react-navigation/native'
import store from '../stores'
import { getUser } from '../stores/user'
import { Formik } from 'formik'
import * as yup from 'yup'
import { globalStyles } from '../assets/global'
import { login } from '../api/index'
import Toast from 'react-native-toast-message'

const reviewSchema = yup.object().shape({
  email: yup.string().required().email(),
  password: yup.string().required().min(5),
})

export default function Login() {

  const navigation = useNavigation();

  const submitForm = async (values, actions) => {
    //console.log(store.getState().user)
    //navigation.reset({
    //  index: 0,
    //  routes: [{ name: 'StartScreen' }],
    //})
    const response = await login(values)
    var text, type
    if (response === true) {
      text = 'Login Efetuado'
      type = "success"
      store.dispatch(getUser())
    } else {
      text = response
      type = "error"
    }
    Toast.show({
      type: type,
      text1: text,
      visibilityTime: 2000,
    })
  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Welcome Back</Header>
      <Formik initialValues={{ email: '', password: '' }}
        validationSchema={reviewSchema}
        onSubmit={submitForm}
      >
        {(props) => (
          <>
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
              <Text style={{ ...globalStyles.textError, marginBottom: 15, }}>{props.touched.password && props.errors.password}</Text>
            )}
            <View style={styles.forgotPassword}>
              <TouchableOpacity
                onPress={() => navigation.navigate('ResetPasswordScreen')}
              >
                <Text style={styles.forgot}>Forgot your password?</Text>
              </TouchableOpacity>
            </View>
            <Button mode="contained" onPress={props.handleSubmit}>
              Login
            </Button>
          </>
        )}
      </Formik>
      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: colors.primary,
  },
})

