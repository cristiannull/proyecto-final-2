import Shoop from "../models/Shoop.js";
import VideoGame from "../models/VideoGame.js";

async function create(req, res) {
  try {
    let total = 0;
    for (let videogame of req.body.videogames) {
      const search = await VideoGame.findById(videogame.videogameId);
      const quantity = videogame.quantity;
      total = total += search.price * quantity;
    }
    const newShop = await Shoop.create({
      user: req.auth.sub,
      videogames: req.body.videogames,
      total: total,
      paymentMethod: req.body.paymentMethod,
    });
    res.json(await newShop.populate("user videogames paymentMethod"));
  } catch (err) {
    console.log(err);
    res.status(500).json("error del servidor");
  }
}

async function find(req, res) {
  try {
    const shoopId = req.params.id;
    const shoop = await Shoop.findById(shoopId).populate("videogame user");
    res.status(200).json(shoop);
  } catch (err) {
    res.status(500).json("error del servidor");
  }
}

async function list(req, res) {
  try {
    const shoopList = await Shoop.find().populate("videogame user");
    res.status(200).json(shoopList);
  } catch (err) {
    res.status(500).json("Error del Servidor");
  }
}

async function update(req, res) {
  try {
    const shoopEncontrado = await Shoop.findById(req.params.id);

    shoopEncontrado.user = req.body.user || shoopEncontrado.user;
    shoopEncontrado.videogame = req.body.videogame || shoopEncontrado.videogame;
    shoopEncontrado.total = req.body.total || shoopEncontrado.total;
    shoopEncontrado.paymentMethod =
      req.body.paymentMethod || shoopEncontrado.paymentMethod;
    await shoopEncontrado.save();
    res.json(shoopEncontrado);
  } catch (err) {
    res.status(500).json("Error del Servidor");
  }
}

async function destroy(req, res) {
  try {
    await Shoop.findByIdAndDelete(req.params.id);
    res.json("Compra elimidada");
  } catch (err) {
    res.status(500).json("Error del Servidor");
  }
}

export default {
  create,
  find,
  list,
  update,
  destroy,
};
