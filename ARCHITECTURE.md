# Gringo Shop — DDD + Clean Architecture

- `src/domain`: entidades y reglas de negocio independientes del framework.
- `src/application`: casos de uso y contratos (puertos) que orquestan el negocio.
- `src/infrastructure`: adaptadores concretos, como el catálogo en memoria y futuras APIs.
- `src/presentation`: componentes y composición de la interfaz.

La interfaz actual es una primera vertical slice del catálogo; los datos de muestra están declarados en la pantalla para permitir una previsualización inmediata. El siguiente paso natural es conectar `InMemoryCatalogRepository` a un backend o CMS real.
