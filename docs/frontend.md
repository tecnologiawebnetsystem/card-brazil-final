# Padrões de front-end

## Camadas

- `components/ui`: primitives acessíveis e componentes base.
- `components/layout`: sidebar, header, navegação e shell da aplicação.
- `components/shared`: componentes reutilizados em mais de um domínio.
- `components/forms`: campos, máscaras, validações e estados de formulário.
- `components/domain`: componentes específicos de cada domínio.
- `app/dashboard`: composição das telas e roteamento.

## Interface

Usar os tokens de `app/globals.css`, no máximo duas famílias tipográficas, HTML semântico, estados de loading/empty/error, labels acessíveis e layout mobile-first. Evitar cores diretas, estilos duplicados e lógica de negócio dentro de componentes visuais.
