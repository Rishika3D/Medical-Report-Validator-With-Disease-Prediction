import express from 'express'
import fs from fs;


const app= express();
const PORT= 5050;

app.use(cors());
app.use(express.json())

app.listen(PORT, ()=>{
  console.log(`Server running on port ${PORT}`)
})