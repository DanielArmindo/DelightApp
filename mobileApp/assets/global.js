import { StyleSheet } from 'react-native'
import { Feather } from '@expo/vector-icons'

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    marginRight: 10,
    marginLeft: 10,
    minHeight: 130,
    minWidth: 130,
    justifyContent: 'center',
    marginBottom: 10,
  },
  textError: {
    color: 'red',
  },
  card_add: {
    maxHeight: 130,
    minHeight: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastBorder: {
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderBottomWidth: 2
  },
  toastText1: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  toastText2: {
    fontSize: 12,
    fontWeight: 'bold'
  },
})

// Icons
export const icon = {
  index: (props) => <Feather name="home" size={24}  {...props} />,
  explore: (props) => <Feather name="compass" size={24}  {...props} />,
  profile: (props) => <Feather name="user" size={24} {...props} />,
}

export const colors = {
  text: '#000000',
  primary: '#560CCE',
  secondary: '#414757',
  error: '#f13a59',
}

// Generate Colors
const generateRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export const generateUniqueColors = (array) => {
  const colors = new Set();
  while (colors.size < array) {
    colors.add(generateRandomColor());
  }
  return Array.from(colors);
}
