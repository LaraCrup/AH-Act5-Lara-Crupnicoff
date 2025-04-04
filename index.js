import express, { response } from 'express';
import UserManager from './UserManager.js';

const port = 5000;
const app = express();
const admUser = new UserManager();

app.get('/', (req, res) => {
  console.log(`Cliente conectado`);
  res.send('Hola desde Express');
});

const getUsers = async (req, res) => {
  console.log('GET Users');
  const users = await admUser.getUsers();
  res.json(users);
}

//Rutas de la API
app.get('/api/users', getUsers)

app.get('/api/users/:id', async (req, res) => {
  const id = req.params.id;
  const user = await admUser.getUserById(id);
  if (!user) {
    return res.status(404).json({ error: 'ID no encontrado' });
  } else {
    res.json(user);
  }
})

app.post('/api/users', async (req, res) => {
  try {
    const user = req.body;
    const id = await admUser.setUser(user)
    res.status(200).json({ msg: 'Usuario guardado', data: {id} });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error del servidor. No se pudo guardar el usuario', error });
  }
})

app.listen(port, () => {
  console.log(`Iniciando el servidor en el puerto ${port}`);
});