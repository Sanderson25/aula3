import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Avatar, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

const Stack = createNativeStackNavigator();

// Lista simulada de contatos
let contatosMock = [
  { id: '1', nome: 'Marcos Andrade', telefone: '81 988553424', email: 'mand@gmail.com' },
  { id: '2', nome: 'Patrícia Tavares', telefone: '81 998765332', email: 'patri@gmail.com' },
  { id: '3', nome: 'Rodrigo Antunes', telefone: '81 987765525', email: 'rodrigo@gmail.com' },
];

// API simulada com manipulação de dados
const api = {
  getContatos: () => Promise.resolve({ data: contatosMock }),
  postContato: (contato) => {
    contatosMock.push(contato);
    return Promise.resolve({ data: contato });
  },
  putContato: (id, contato) => {
    contatosMock = contatosMock.map((c) => (c.id === id ? contato : c));
    return Promise.resolve({ data: contato });
  },
  deleteContato: (id) => {
    contatosMock = contatosMock.filter((c) => c.id !== id);
    return Promise.resolve({ data: { id } });
  },
};

// TELA LOGIN
function Inicial({ navigation }) {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <View style={styles.container}>
      <Avatar rounded icon={{ name: 'user' }} size={'large'} containerStyle={{ marginBottom: 20 }} />
      <View style={styles.inputContainer}>
        <Text>Login</Text>
        <TextInput style={styles.input} value={login} onChangeText={setLogin} />
        <Text>Senha</Text>
        <TextInput style={styles.input} value={senha} onChangeText={setSenha} secureTextEntry />
      </View>
      <Button title="Login" onPress={() => navigation.navigate('HomeScreen')} buttonStyle={{ backgroundColor: '#4169e1', marginTop: 10 }} />
      <Button title="Cadastre-se" onPress={() => navigation.navigate('CadastroUsuario')} buttonStyle={{ backgroundColor: '#f44336', marginTop: 10 }} />
    </View>
  );
}

// CADASTRO DE USUÁRIO
function CadastroUsuario({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Nome</Text>
      <TextInput style={styles.input} />
      <Text>CPF</Text>
      <TextInput style={styles.input} />
      <Text>Email</Text>
      <TextInput style={styles.input} />
      <Text>Senha</Text>
      <TextInput style={styles.input} secureTextEntry />
      <Button title="Salvar" onPress={() => navigation.goBack()} buttonStyle={{ backgroundColor: '#2E73FF', marginTop: 10 }} />
    </View>
  );
}

// CADASTRO DE CONTATO
function CadastroContato({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');

  const salvar = async () => {
    const novoContato = { id: Date.now().toString(), nome, email, telefone };
    await api.postContato(novoContato);
    Alert.alert('Contato salvo!');
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
      <Button title="Salvar" onPress={salvar} buttonStyle={{ backgroundColor: '#2E73FF', marginTop: 10 }} />
    </View>
  );
}

// EDITAR CONTATO
function EditarContato({ route, navigation }) {
  const { contato } = route.params;
  const [nome, setNome] = useState(contato.nome);
  const [email, setEmail] = useState(contato.email);
  const [telefone, setTelefone] = useState(contato.telefone);

  const alterar = async () => {
    await api.putContato(contato.id, { id: contato.id, nome, email, telefone });
    Alert.alert('Contato alterado!');
    navigation.goBack();
  };

  const excluir = async () => {
    await api.deleteContato(contato.id);
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
      <Button title="Alterar" onPress={alterar} buttonStyle={{ backgroundColor: '#2E73FF', marginTop: 10 }} />
      <Button title="Excluir" onPress={excluir} buttonStyle={{ backgroundColor: 'red', marginTop: 10 }} />
    </View>
  );
}

// LISTA DE CONTATOS
function HomeScreen({ navigation }) {
  const [contatos, setContatos] = useState([]);

  const carregarContatos = async () => {
    const response = await api.getContatos();
    setContatos(response.data);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', carregarContatos);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={contatos}
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

// NAVEGAÇÃO
export default function App() {
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

// ESTILOS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    height: 40,
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