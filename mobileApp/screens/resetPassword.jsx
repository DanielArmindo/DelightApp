import Background from '../components/auth/Background'
import BackButton from '../components/auth/BackButton'
import Logo from '../components/auth/Logo'
import Header from '../components/auth/Header'
import TextInput from '../components/auth/TextInput'
import Button from '../components/auth/Button'
import { Text } from 'react-native-paper'
import { Formik } from 'formik'
import * as yup from 'yup'
import Toast from 'react-native-toast-message'
import { globalStyles } from '../assets/global'
import { sendEmail } from '../api/index'

const reviewSchema = yup.object().shape({
  email: yup.string().required().email(),
})

export default function ResetPassword({ navigation }) {

  const submitForm = async (values, actions) => {
    const response = await sendEmail(values)
    if (response !== true) {
      Toast.show({
        type: 'error',
        text2: response,
        visibilityTime: 2000,
      })
      return
    }
    Toast.show({
      type: 'success',
      text1: 'Instruções Enviadas!',
      visibilityTime: 2000,
    })
  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Restore Password</Header>
      <Formik
        initialValues={{ email: '' }}
        validationSchema={reviewSchema}
        onSubmit={submitForm}
      >
        {(props) => (
          <>
            <TextInput
              label="E-mail address"
              returnKeyType="done"
              onChangeText={props.handleChange('email')}
              onBlur={props.handleBlur('email')}
              autoCapitalize="none"
              autoCompleteType="email"
              textContentType="emailAddress"
              keyboardType="email-address"
              description="You will receive email with password reset link."
            />
            {props.touched.email && props.errors.email && (
              <Text style={globalStyles.textError}>{props.touched.email && props.errors.email}</Text>
            )}
            <Button
              mode="contained"
              onPress={props.handleSubmit}
              style={{ marginTop: 16 }}
            >
              Send Instructions
            </Button>
          </>
        )}
      </Formik>

    </Background>
  )
}
