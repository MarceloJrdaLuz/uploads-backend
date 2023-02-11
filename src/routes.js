const routes = require("express").Router();
const multer = require("multer");
const multerConfig = require("./config/multer");
const Post = require("./models/post");
const Dirigente = require("./models/dirigenteGrupo")

routes.get("/posts", async (req, res) => {
  const posts = await Post.find();

  return res.json(posts);
});

routes.post("/posts", multer(multerConfig).single("file"), async (req, res) => {
  const { originalname: name, size, key, location: url = "" } = req.file;

  const post = await Post.create({
    name,
    size,
    key,
    url
  });

  return res.json(post);
});

routes.delete("/posts/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);

  await post.remove();

  return res.send();
});

routes.post("/dirigentes", async (req, res) => {
  const { name, phone } = req.body

  try {
    const findDirigente = await Dirigente.findOne({ name })

    console.log(findDirigente)

    if (!findDirigente) {
      const novoDirigente = await Dirigente.create({
        name,
        phone
      })
      return res.status(200).send(novoDirigente)
    }
    return res.status(400).send({
      error: "Dirigente já existe"
    })
  } catch (error) {
    res.status(500).send({
      error: "Erro de servidor"
    })
  }
})

routes.get("/dirigentes", async (req, res) => {
  try {
    const dirigentes = await Dirigente.find()
    return res.status(200).send(dirigentes)
  } catch (error) {
    return res.status(500).send({
      error: "Erro no servidor"
    })
  }
})

routes.delete("/dirigente/:id", async (req, res) => {
  const { id } = req.params

  try {
    const dirigente = await Dirigente.findById(id)

    if (dirigente) {
      await dirigente.remove()
      return res.status(200).send({
        message: "Dirigente removido"
      })
    }
    return res.status(400).send({
      error: "Diriginte não existe"
    })

  } catch (error) {
    return res.status(500).send({
      error: "Erro no servidor"
    })
  }
})

routes.put("/dirigente/:id", async (req, res) => {
  const { id } = req.params
  const { name, phone } = req.body

  try {
    const dirigente = await Dirigente.findById(id)

    if (dirigente) {
      const atualizarDirigente = await Dirigente.updateOne({ _id: id },
        {
          $set: {
            name,
            phone
          }
        })
      return res.status(200).send({
        message: "Dirigente atualizado com sucesso"
      })
    }
    return res.status(400).send({
      error: "Dirigente não existe"
    })

  } catch (error) {
    return res.status(500).send({
      error: "Erro no servidor"
    })
  }
})

module.exports = routes; 
