import * as React from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Avatar, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

const contatosIniciais = [
  { id: '1', nome: 'Marcos Andrade', telefone: '81 988553424', email: 'mand@gmail.com' },
  { id: '2', nome: 'Patrícia Tavares', telefone: '81 998765332', email: 'patri@gmail.com' },
  { id: '3', nome: 'Rodrigo Antunes', telefone: '81 987765525', email: 'rodrigo@gmail.com' },
];

function Inicial({ navigation }) {
  return (
    <View style={styles.container}>
      <Avatar rounded icon={{ name: 'home' }} size={'large'} color={'Black'} />
      <Text>Login</Text>
      <TextInput style={styles.input} />
      <Text>Senha</Text>
      <TextInput style={styles.input} secureTextEntry />

      <Button title="Avançar" onPress={() => navigation.navigate('HomeScreen')} />
      <Button title="Cadastrar" onPress={() => navigation.navigate('CadastroUsuario')} />
    </View>
  );
}

function CadastroUsuario({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>nome</Text>
      <TextInput style={styles.input} />
      <Text>cpf</Text>
      <TextInput style={styles.input} />
      <Text>email</Text>
      <TextInput style={styles.input} />
      <Text>senha</Text>
      <TextInput style={styles.input} secureTextEntry />
      <Button title="Salvar" onPress={() => navigation.goBack()} buttonStyle={{ backgroundColor: '#2E73FF' }} />
    </View>
  );
}

function CadastroContato({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Nome</Text>
      <TextInput style={styles.input} />
      <Text>Email</Text>
      <TextInput style={styles.input} />
      <Text>Telefone</Text>
      <TextInput style={styles.input} />
      <Button title="Salvar" onPress={() => navigation.goBack()} buttonStyle={{ backgroundColor: '#2E73FF' }} />
    </View>
  );
}

function EditarContato({ route, navigation }) {
  const { contato } = route.params;
  const [nome, setNome] = React.useState(contato.nome);
  const [email, setEmail] = React.useState(contato.email);
  const [telefone, setTelefone] = React.useState(contato.telefone);

  const excluir = () => {
    Alert.alert('Contato excluído!');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text>Nome</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} />
      <Text>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} />
      <Text>Telefone</Text>
      <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} />
      <Button title="Alterar" buttonStyle={{ backgroundColor: '#2E73FF' }} onPress={() => navigation.goBack()} />
      <Button title="Excluir" buttonStyle={{ backgroundColor: 'red', marginTop: 10 }} onPress={excluir} />
    </View>
  );
}

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={contatosIniciais}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('EditarContato', { contato: item })}>
            <View style={styles.itemContainer}>
              <Avatar rounded icon={{ name: 'user' }} size="medium" containerStyle={{ backgroundColor: '#2E73FF' }} />
              <View style={{ marginLeft: 10 }}>
                <Text style={{ fontWeight: 'bold' }}>{item.nome}</Text>
                <Text>{item.telefone}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Inicial" component={Inicial} />
        <Stack.Screen name="CadastroUsuario" component={CadastroUsuario} options={{ title: 'Usuário' }} />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={({ navigation }) => ({
            title: 'Lista de Contatos',
            headerRight: () => (
              <Icon name="plus" size={25} color="black" onPress={() => navigation.navigate('CadastroContato')} style={{ marginRight: 15 }} />
            ),
          })}
        />
        <Stack.Screen name="CadastroContato" component={CadastroContato} options={{ title: 'Contato' }} />
        <Stack.Screen name="EditarContato" component={EditarContato} options={{ title: 'Contato' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    width: 250,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default App;
