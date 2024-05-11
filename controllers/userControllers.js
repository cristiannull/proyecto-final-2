import User from "../models/users.js";
import Rol from "../models/rols.js";
import bcrypt from "bcryptjs";

async function create(req, res) {
  try {
    const rol = req.body.rol;
    const nameRol = await Rol.findById(rol);
    const password = req.body.password;
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: hash,
      rol: nameRol,
    });
    res.json(newUser);
  } catch (err) {
    console.log(err);
    res.status(500).json("error del servidor");
  }
}

async function find(req, res) {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate("rol");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json("error del servidor");
  }
}

async function list(req, res) {
  try {
    const userList = await User.find().populate("rol");
    res.status(200).json(userList);
  } catch (err) {
    res.status(500).json("Error del Servidor");
  }
}

async function update(req, res) {
  try {
    const usuarioEncontrado = await User.findById(req.params.id);

    usuarioEncontrado.firstname =
      req.body.firstname || usuarioEncontrado.firstname;
    usuarioEncontrado.lastname =
      req.body.lastname || usuarioEncontrado.lastname;
    usuarioEncontrado.email = req.body.email || usuarioEncontrado.email;
    usuarioEncontrado.rol = req.body.rol || usuarioEncontrado.rol;

    await usuarioEncontrado.save();
    res.status(200).json(usuarioEncontrado);
  } catch (err) {
    res.status(500).json("Error del Servidor");
  }
}

async function destroy(req, res) {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json("Usuario elimidado");
  } catch (err) {
    console.log(err);
    res.status(500).json("Error del Servidor");
  }
}

async function login(req, res) {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    const hashValido = await bcrypt.compare(req.body.password, user.password);
    if (hashValido) {
      res.json("Tus credenciales son correctas");
    } else {
      res.json("Tu email o contraseña son INCORRECTOS");
    }
  } else {
    res.json("Tu email o contraseña son INCORRECTOS");
  }
}

export default {
  create,
  find,
  list,
  list,
  update,
  destroy,
  login,
};
