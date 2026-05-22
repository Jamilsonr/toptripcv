# Segurança (base)

## Autenticação e sessões
- Laravel com autenticação padrão e proteção CSRF (Inertia).
- Política de password e reset.

## Controlo de acessos
- RBAC com perfis: Colaborador, Gestor, RH.
- Policies por recurso (férias, ausências, colaboradores, notícias).

## Proteção de dados
- Princípio de menor privilégio.
- Logs de auditoria (fase de hardening).

## Backups
- Estratégia dependente do ambiente (MySQL dumps + storage).
