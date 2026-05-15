import Parse from './back4app';

interface AuthData {
  username?: string;
  email: string;
  password: string;
  telefone?: string;
  profissao?: string;
}

export const signUp = async ({ username, email, password, telefone, profissao }: AuthData) => {
  const user = new Parse.User();

  user.set("username", email); 
  user.set("email", email);
  user.set("password", password);
  
  if(username) user.set("name", username);
  if (telefone) user.set("telefone", telefone);
  if (profissao) user.set("profissao", profissao);

  try {
    const createdUser = await user.signUp();
    return createdUser;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Login
export const signIn = async ({ email, password }: AuthData) => {
  try {
    const user = await Parse.User.logIn(email, password);
    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const logOut = async () => {
  try {
    await Parse.User.logOut();
    return true;
  } catch (error) {
    return false;
  }
};

// Pegar Usuário Atual
export const getCurrentUser = async () => {
  return await Parse.User.currentAsync();
};

export const updateUserProfile = async (data: { 
  name?: string; 
  telefone?: string; 
  profissao?: string; 
  password?: string 
}) => {
  const user = await Parse.User.currentAsync();
  
  if (!user) throw new Error("Usuário não autenticado");

  if (data.name) user.set("name", data.name);
  if (data.telefone) user.set("telefone", data.telefone);
  if (data.profissao) user.set("profissao", data.profissao);
  
  if (data.password && data.password !== "********") {
    user.set("password", data.password);
  }

  try {
    await user.save();
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
};