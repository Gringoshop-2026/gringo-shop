# BACK

API local sin dependencias externas, organizada para evolucionar a un backend real.

- `domain/`: reglas de negocio.
- `application/`: casos de uso.
- `infrastructure/`: persistencia y adaptadores.
- `server.mjs`: adaptador HTTP actual.
- `data/db.json`: persistencia local temporal.

Endpoints: `GET /api/products`, `POST /api/quotes`, `POST /api/orders`, `GET /api/orders`.
