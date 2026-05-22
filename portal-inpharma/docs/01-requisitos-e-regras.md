# Requisitos e Regras

## Regras assumidas (validar com RH)
- Contagem de férias: dias úteis (seg-sex).
- Feriados: entram no Calendário Corporativo e não contam como dia útil de férias quando configurados.
- Saldo de férias: armazenado por colaborador (dias disponíveis) e ajustado automaticamente quando um pedido é aprovado.
- Fluxo de aprovação: Colaborador → Gestor → RH → Notificação.
- Estados: rascunho (opcional), submetido, em aprovação gestor, em aprovação RH, aprovado, rejeitado, cancelado.

## Dashboard do colaborador
- Perfil: foto, departamento, função.
- Férias: saldo, histórico, pedidos (com estado), calendário de férias aprovadas.
- Avisos: comunicados importantes e ausências por justificar.
- Assiduidade: mostrar a picagem do dia anterior (dependente de integração por API).

## RH (admin)
- Gestão de colaboradores: criar/editar/ativar/desativar, atribuir gestor e departamento.
- Aprovações: lista de pedidos pendentes com filtros por equipa/estado/período.
- Relatórios: férias por departamento, ausências por período, exportações.

## Notificações
- In-app (base) para todas as alterações de estado.
- Canal futuro: email/Teams/WhatsApp (não incluído no MVP).
