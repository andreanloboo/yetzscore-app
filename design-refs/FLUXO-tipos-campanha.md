# Seletor de campanha + particularidades por tipo

## Seletor (input "Campanha Dezembro [Ativo] × ˅" no cabeçalho de Contratos)
Deve permitir selecionar campanhas de 3 tipos. Ao trocar, a tela de contratos assume o
comportamento daquele tipo. O "×" limpa a seleção (estado vazio: placeholder "Selecionar campanha"
e tabela vazia com "Nenhum resultado encontrado"); o chevron abre o dropdown com a lista de
campanhas (nome + badge Ativo/Inativo + tipo). Campanhas mock (mín. 1 por tipo):
- "Campanha Dezembro" — tipo `financiamento` (Campanha Valor / Campanha Financiamento) — Ativo
- "Campanha Dezembro Valor Fixo" — tipo `valor-fixo` — Ativo
- "Campanha Sorte Premiada 2026" — tipo `numero-sorte` (Valor Fixo - Número da Sorte) — Ativo
- + 1-2 inativas para preencher a lista

## Particularidades do wizard "Vincular" por tipo (fonte: Figma)

### financiamento (seção 8433:18708) — JÁ IMPLEMENTADO no VincularWizard
- Popover linha "Aguardando vínculo": Alterar vinculo / Confirmar vinculo / Ver detalhes
- Wizard com etapa "Quem deseja vincular?" (Vendedor / Gerente F&I)
- Resultado CPF: nome + CPF + badge "Não cadastrado"
- Sucesso com botão extra "Vincular gerente"
- Completar dados: CPF + R$ 300,00 + Nome do vendedor

### valor-fixo (seção 8435:9853, frames 8435:10249..10436)
- Popover de linha "Aguardando vínculo" tem opção "Vincular" + "Ver detalhes" (popover 8435:10258)
  (linhas já vinculadas mantêm Alterar/Confirmar/Ver detalhes)
- SEM etapa "Quem deseja vincular?" — vai direto a "Vincule o Vendedor"
- Resultado CPF (8435:10272): nome "Jéssica Silva Luz" + CPF + **"R$ 300,00"** (em vez do badge)
- Card (8435:10285): label "Vendedor" + nome + CPF + **R$ 300,00**
- Confirmação (8435:10302): "Deseja confirmar o vínculo do Vendedor?\n**No valor: R$ 300,00**"
- Sucesso (8435:10311): só "Finalizar" (sem "Vincular gerente")
- Completar dados (8435:10378): CPF + R$ 300,00 + Nome do vendedor

### numero-sorte (seção 8433:16744, frames 8428:18470..18792)
- Igual ao valor-fixo, porém **SEM nenhum valor R$** em nenhuma etapa:
- Resultado CPF (8428:18518): nome + CPF apenas
- Card (8428:18569): "Vendedor" + nome + CPF
- Confirmação (8428:18638): "Deseja confirmar o vínculo do Vendedor?" (sem valor)
- Completar dados (8428:18531): CPF + Nome (sem R$)

## Tela principal por tipo
As 3 telas (8428:18867, 8435:9854, 8428:19091) são iguais em estrutura: tabela única com colunas
Código da revenda / Grupo econômico / CNPJ do Cliente / Número da proposta / Vendedor / Gerente /
Status / Ação; estatuses Aguardando vínculo (×2), Aprovado, Aguardando aprovação. Apenas o nome
da campanha no seletor muda. Painel "Detalhes do contrato" idêntico nos 3 tipos.

## Node IDs para get_design_context (fileKey bu9L5wRxqKz0yZjnIy9sOb)
- Seletor + header: dentro de 8428:18867 (tela principal financiamento)
- valor-fixo wizard: 8435:10272 (resultado), 8435:10285 (card), 8435:10302 (confirmação), 8435:10258 (popover Vincular)
- numero-sorte wizard: 8428:18518, 8428:18569, 8428:18638
