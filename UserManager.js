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

  validateUser(user) {
    const errors = [];
    
    if (!user.name || typeof user.name !== 'string' || user.name.trim().length < 3) {
      errors.push('El nombre debe tener al menos 3 caracteres');
    }
    
    if (!user.email || typeof user.email !== 'string') {
      errors.push('El email es requerido');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(user.email)) {
        errors.push('El formato del email no es válido');
      }
    }
    
    return errors;
  }

  async setUser(user) {
    const errors = this.validateUser(user);
    if (errors.length > 0) {
      throw { status: 400, errors };
    }
    try {
      await this.getUsers();
      user.id = this.randomID();
      this.users.push(user);
      const data = JSON.stringify(this.users, null, 2);

      await fs.writeFile(path, data);
      return user.id
    } catch (error) {
      throw { status: 500, error: 'No pudimos guardar el archivo' };
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

  async deleteUserById(id) {
    await this.getUsers();
    const index = this.users.findIndex(u => u.id == id);
    if (index != -1) {
      this.users.splice(index, 1);
      const data = JSON.stringify(this.users, null, 2);
      await fs.writeFile(path, data);
      return true;
    } else {
      return false;
    }
  }

  async updateUserById(id, user) {
    const errors = this.validateUser(user);
    if (errors.length > 0) {
      throw { status: 400, errors };
    }
    await this.getUsers();
    const index = this.users.findIndex(u => u.id == id);
    if (index != -1) {
      this.users[index].name = user.name;
      this.users[index].email = user.email;
      const data = JSON.stringify(this.users, null, 2);
      await fs.writeFile(path, data);
      return true;
    } else {
      return false;
    }
  }
}

export default UserManager;