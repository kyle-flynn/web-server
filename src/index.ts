import express, { Request, Response, json, NextFunction } from 'express';
import https from 'https';
import dotenv from 'dotenv';
import compression from 'compression';
import { join } from 'path';
import helmet from 'helmet';
import cors from 'cors';
import { readFileSync } from 'fs';

/* Get our environment variables loaded and make sure they exist. */
dotenv.config({ path: join(__dirname, '../.env') });

/* Environment variables for convinenance */
const PORT = process.env.PORT;
const HOST = process.env.HOST;
const MODE = process.env.NODE_ENV;
const NAME = process.env.NAME;
const DIRECTORY = process.env.DIR || '../public';
const HTTPS_PORT = process.env.SSL_PORT || 443;

/* Initialize and setup express/middleware */
const app = express();
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(json());

// Remember that __dirname is one directory level down than the current one.
app.use(express.static(join(__dirname, DIRECTORY)));

app.listen({ port: PORT }, () => {
  console.log(
    `[HTTP] ${NAME} serving ${DIRECTORY} at ${HOST}:${PORT} in ${MODE} mode.`
  );
});

/* If in production, enable HTTPS */
if (MODE === 'production') {
  const keyFile = process.env.SSL_KEY || '';
  const certFile = process.env.SSL_CERT || '';

  const key = readFileSync(join(__dirname, keyFile));
  const cert = readFileSync(join(__dirname, certFile));

  const appHttps = https.createServer({ key, cert }, app);
  appHttps.listen(HTTPS_PORT, () =>
    console.log(
      `[HTTPS] ${NAME} serving ${DIRECTORY} at ${HOST}:${HTTPS_PORT} in ${MODE} mode.`
    )
  );
}
