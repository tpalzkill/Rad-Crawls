import app from './app';

const PORT = process.env.NODE_ENV || 8080;
const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`)); // eslint-disable-line no-console

export default server;
