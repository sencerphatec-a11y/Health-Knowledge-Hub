import express from 'express';

const app = express(); // <-- Add this here
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
