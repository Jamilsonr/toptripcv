# Modelo de Dados (inicial)

## Entidades
- users
  - Dados de login e flags (ativo, etc.)
- employees
  - user_id, nome completo, foto, departamento_id, funcao, manager_id, dias_ferias_disponiveis
- departments
  - nome
- vacation_requests
  - employee_id, start_date, end_date, business_days, motivo(opcional), status, approver_manager_id, approver_hr_id
- absence_requests
  - employee_id, tipo, start_at, end_at, motivo, status, approver_manager_id, approver_hr_id
- news_posts
  - titulo, corpo, publicado_em, tipo(comunicado/noticia/evento), audience(opcional)
- calendar_events
  - titulo, tipo(feriado/evento/formacao/reuniao), start_at, end_at, all_day, source

## Notas
- Cálculo de business_days: feito no backend, considerando seg-sex e feriados do calendário.
- Auditoria: registar transições de estado em tabela de logs (fase de hardening).
