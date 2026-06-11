# Delegação de Acessos (seção Figma 8185:14073, página Gerente de Contas)

## Tela "Gerenciamento de Delegações" (nova rota /delegacoes — item "Delegações" da sidebar)
- Header: título "Gerenciamento de Delegações" (ícone de usuários); busca "Buscar por responsável titular";
  dropdown "Status das Delegações" (opções: Todos / Ativa / Agendada / Encerrada — ref 8185:14402);
  botão primário "Nova Delegação" (+).
- Estado vazio (8185:14367): "Nenhum resultado encontrado".
- Tabela (8185:14074/14224): colunas
  - Tipo de usuário: "Gerente de Negócios" | "Gerente de Contas"
  - Responsável titular: Felipe Henrique / Izabela Oliveira / Anderson Golveia / Emiliane Martins
  - Responsável Substituto: nome + chip "+3" (tooltip/hover lista: "Leila Coelho, André Xavier, Celso Coelho")
  - Período: "05/05/2026 - 30/05/2026"
  - Status (badges): Encerrada (cinza) / Ativa (verde) / Agendada (amarelo)
  - Ações por linha: Visualizar / Editar / Excluir
- Rodapé da tabela: "Mostrando 4 itens" + "Página 1 de 3" com paginação.
- Footer padrão Yetz.

## Modal "Cadastrar Nova Delegação" (8185:14414 / 8185:14484, ~390px)
Campos:
- Responsável titular* — "Buscar Usuário" (autocomplete)
- Responsável substituto* — "Buscar Usuário" com CHIPS removíveis (ex.: Kaique ×4); autocomplete
  dropdown enquanto digita (ref 8185:14689: digitando "Joã" → João Carlos / João Miguel / João Cristiano)
- Motivo* — dropdown (ref 8185:14410): Selecionar motivo / Férias / Folga / Atestado médico /
  Licença maternidade/paternidade / Viagem a trabalho / Treinamento
- Período* — range com calendário (reutilizar CalendarPopover); erro possível:
  "Data indisponível. Contate o responsável delegado" (ref 8185:14411)
- Observação (Opcional) — textarea "Observação Adicional"
- Validação: campos obrigatórios marcados com * em vermelho + texto
  "Preencha todas as informações para completar o cadastro." quando tentar salvar incompleto (8185:14484)
- Botões: Salvar (primário) / Voltar
- Sucesso (8185:14640): "Cadastro feito com sucesso!" + "Kaique e Anderson foram definidos como
  responsáveis substitutos." (usar os nomes realmente escolhidos) + Ok

## Modal "Editar Delegação" (8185:14438)
Igual ao cadastro com dados preenchidos (titular fixo "Isabela Oliveira", Motivo "Férias",
Período "10/05/2026 - 30/05/2026", Observação "Férias + folgas").
Sucesso (8185:14658): "Edição realizada com sucesso!" + "Juliano e Felipe foram definidos como
responsáveis substitutos." + Ok

## Modal "Visualizar Delegação" (8185:14532)
Somente leitura (mesmos campos, desabilitados), botão único "Voltar".

## Excluir (8185:14727 / 8185:14710)
Atenção: "Deseja realmente excluir essa delegação" Confirmar/Cancelar →
"Delegação excluída com sucesso" Ok (linha some da tabela).

## Modais para usuário substituto (8241:12529) — exibir APÓS o login (rota /campanhas), uma vez:
- "Você possui uma delegação ativa" (8241:16011): "Você designou como José Aldo responsável
  substituto por uma delegação até 20/06/2026." Botões "Ver delegação" (→ /delegacoes) / "Fechar".
(Os outros 3 — Novo acesso temporário / Acesso temporário alterado / Acesso temporário encerrado —
são variações do mesmo modal; implementar o componente genérico e mostrar a "delegação ativa".)

## Node IDs para get_design_context (fileKey bu9L5wRxqKz0yZjnIy9sOb)
- 8185:14367 (tela vazia), grupo 8185:14074 é a tela com tabela (GROUP — usar get_design_context nele),
- 8185:14414 (cadastrar), 8185:14438 (editar), 8185:14532 (visualizar), 8185:14689 (autocomplete open),
- 8185:14410 (dropdown motivo), 8185:14402 (dropdown status), 8185:14640/14658 (sucessos), 8241:16011 (delegação ativa)
