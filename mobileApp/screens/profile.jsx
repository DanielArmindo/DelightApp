import { View, ScrollView, StyleSheet } from 'react-native'
import { Text, Button, Modal, Portal, IconButton } from 'react-native-paper'
import { useState } from 'react'
import { getItemAsync } from 'expo-secure-store'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { Formik } from 'formik'
import * as yup from 'yup'

import TextInput from '../components/auth/TextInput'
import store from '../stores'
import { globalStyles } from '../assets/global'
import { changeCredentials, logout } from '../api/index'
import { clear as clearUser } from '../stores/user'
import Toast from 'react-native-toast-message';
import Statistics from './statistics'
import { useNavigation } from '@react-navigation/native'

const reviewSchema = yup.object().shape({
  password: yup.string().required().min(5),
  current_password: yup.string().required().min(5),
})

export default function Profile() {

  const user = store.getState().user
  const navigation = useNavigation()

  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  //const onToggleSnackBar = async () => {
  //  console.log(user)
  //  console.log(store.getState().categories)
  //  console.log(await getItemAsync('token'))
  //}
  //<Button onPress={onToggleSnackBar} mode="text">ShowKey</Button>

  const changePassword = async (values, actions) => {
    const response = await changeCredentials(values)
    var text, type
    if (response === true) {
      text = 'Credenciais Alteradas!'
      type = "success"
      logout()
      store.dispatch(clearUser())
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
    <>
      <Portal>
        <Modal visible={visible} dismissable={false} contentContainerStyle={styles.modal}>
          <View style={styles.headerModal}>
            <Text variant="titleLarge" style={{ ...styles.title, marginLeft: 1, paddingTop: 5 }}>Alterar Credenciais</Text>
            <IconButton icon="close" iconColor="red" onPress={hideModal} size={30} style={{
              top: -45 + getStatusBarHeight(),
            }} />
          </View>

          <Formik initialValues={{ current_password: '', password: '' }}
            validationSchema={reviewSchema}
            onSubmit={changePassword}
          >
            {(props) => (
              <>
                <TextInput
                  label="Current Password"
                  returnKeyType="done"
                  onChangeText={props.handleChange('current_password')}
                  onBlur={props.handleBlur('current_password')}
                  secureTextEntry
                />
                {props.touched.current_password && props.errors.current_password && (
                  <Text style={{ ...globalStyles.textError, marginBottom: 15, }}>{props.touched.current_password && props.errors.current_password}</Text>
                )}
                <TextInput
                  label="New Password"
                  returnKeyType="done"
                  onChangeText={props.handleChange('password')}
                  onBlur={props.handleBlur('password')}
                  secureTextEntry
                />
                {props.touched.password && props.errors.password && (
                  <Text style={{ ...globalStyles.textError, marginBottom: 15, }}>{props.touched.password && props.errors.password}</Text>
                )}
                <Button mode="contained" style={{ marginTop: 15 }} onPress={props.handleSubmit}>
                  Alterar Credenciais
                </Button>
              </>
            )}
          </Formik>
        </Modal>
      </Portal>

      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <Text variant="titleLarge" style={styles.title}>Nome da conta:</Text>
          <Text variant="bodyLarge">{user.username}</Text>
        </View>
        <View style={styles.card}>
          <Text variant="titleLarge" style={styles.title}>Email Associado:</Text>
          <Text variant="bodyLarge">{user.email}</Text>
        </View>
        <View style={styles.card}>
          <Text variant="titleLarge" style={styles.title}>Password:</Text>
          <Button onPress={showModal} mode="contained" style={styles.button}>Alterar Password</Button>
        </View>
        <View style={styles.card}>
          <Text variant="titleLarge" style={styles.title}>Estatísticas:</Text>
          <Statistics parentStyles={styles} statusBar={getStatusBarHeight} navigation={navigation} />
        </View>
      </ScrollView>
      
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  title: {
    color: 'purple',
  },
  card: {
    margin: 15,
  },
  button: {
    marginTop: 15,
    marginRight: 25,
    marginLeft: 25,
  },
  modal: {
    backgroundColor: 'white',
    padding: 30,
    paddingBottom: 40,
  },
  headerModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
})
