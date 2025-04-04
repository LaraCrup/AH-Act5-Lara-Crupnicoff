import fs from 'fs/promises';
const path = './users.json';

class UserManager {
  users = [];
  constructor(users = []) {
    this.users = users;
  }

  randomID() {
    return crypto.randomUUID();
  }
  async setUser(user) {
    try {
      await this.getUsers();
      user.id = this.randomID();
      this.users.push(user);
      const data = JSON.stringify(this.users, null, 2);

      await fs.writeFile(path, data);
      return user.id
    } catch (error) {
      console.error('No pudimos guardar el archivo');
    }
  }
  async getUsers() {
    try {
      const data = await fs.readFile(path, 'utf-8');
      this.users = JSON.parse(data);
      return this.users;
    } catch (error) {
      console.error('No pudimos leer el archivo')
    }
  }
  async getUserById(id) {
    await this.getUsers();
    const user = this.users.find(item => item.id == id);
    return user ? user : null;
  }
}
// las lista es solo a modo ejemplo
// const lista = [1, 2, 3];
// module.exports = { UserManager, lista };
export default UserManager;
/* Versión larga
module.exports =  { 
    userManager: userManager, 
    lista: lista 
};
*/