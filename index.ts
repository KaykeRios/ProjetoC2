import express, { Request, Response } from 'express';
import { PrismaClient } from './generated/prisma'
import path from 'path';

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/users/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({
    where: { id },
    include: { posts: true }
  });
  res.json(user);
});

app.get('/users/name/:name', async (req: Request, res: Response) => {
  const name = req.params.name;
  const user = await prisma.user.findFirst({
    where: { name },
    include: { posts: true }
  });
  res.json(user);
});

app.post('/users', async (req: Request, res: Response) => {
  const { name, email } = req.body;
  const user = await prisma.user.create({
    data: { name, email }
  });
  res.json(user);
});

app.delete('/users/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await prisma.post.deleteMany({ where: { authorId: id } });
  await prisma.user.delete({ where: { id } });
  res.json({ message: "Usuário apagado com sucesso." });
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
