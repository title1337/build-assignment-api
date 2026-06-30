import express from 'express';
import { connectionPool } from './utils/db.mjs';

const app = express();
const port = 4001;

app.use(express.json());

app.get('/test', (req, res) => {
  return res.json('Server API is working 🚀');
});
app.post('/assignments', async (req, res) => {
  const newAssignment = {
    ...req.body,
    created_at: new Date(),
    updated_at: new Date(),
    published_at: new Date(),
  };

  try {
    await connectionPool.query(
      `insert into assignments (user_id, title, content, category, length, created_at, updated_at, published_at, status)
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        1,
        newAssignment.title,
        newAssignment.content,
        newAssignment.category,
        newAssignment.length,
        newAssignment.created_at,
        newAssignment.updated_at,
        newAssignment.published_at,
        newAssignment.status,
      ],
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Server could not create assignment because database connection',
    });
  }

  return res.status(201).json({ message: 'Created assignment sucessfully' });
});

app.get('/assignments', async (req, res) => {
  let results;
  try {
    results = await connectionPool.query('select * from assignments');
  } catch {
    return res.status(500).json({
      message: 'Server could not read assignment because database issue',
    });
  }

  return res.status(200).json({
    data: results.rows,
  });
});

app.get('/assignments/:assignmentId', async (req, res) => {
  const assignmentIdFromClient = req.params.assignmentId;
  const results = await connectionPool.query(
    `
    select * from assignments where assignment_id = $1
  `,
    [assignmentIdFromClient],
  );

  if (!results.rows[0]) {
    return res.status(404).json({
      message: `Server could not find a requested assignment (assignment id: ${assignmentIdFromClient})`,
    });
  }

  return res.status(200).json({
    data: results.rows[0],
  });
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
