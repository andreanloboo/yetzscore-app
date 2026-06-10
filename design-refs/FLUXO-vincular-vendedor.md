# Fluxo "Vincular Vendedor" (node 8433:18708)

Acionado na tabela 2 "Vinculados - Confirmar Vendedor" (status "Aguardando vínculo").
Popover de ações dessa tabela: **Alterar vínculo · Confirmar vínculo · Ver detalhes**.

## A) Wizard Vincular Vendedor (caminho feliz)
1. "Quem deseja vincular?" — texto "Seleciona o funcionário que deseja vincular" · botão **Selecionar**
2. Radios: **Vendedor** / **Gerente / F&I** · botão **Selecionar**
3. "Vincule o Vendedor" — input "Digite o CPF do vendedor".
   - erro: "Dados inválidos, tenta novamente." (vermelho)
   - vazio/sem match: "Nenhum resultado encontrado"
   - botões: **Selecionar** · **Adicionar novo funcionário** · **Sair**
4. CPF encontrado → resultado: "Andrean Rafael Lobo · 893.470.130-72 · Não cadastrado" · **Selecionar**
5. "Andrean Rafael Lobo · 893.470.130-72" · **Vincular** / **Sair**
6. Confirmar: "Andrean Rafael Lobo — Doc: 893.470.130-72 · Deseja confirmar o vínculo do Vendedor?" · **Sim** / **Não**
7. Sucesso: "Contrato vinculado com sucesso! · O contrato foi vinculado com êxito." · **Finalizar** / **Vincular gerente**

## B) Vincular Gerente / F&I (a partir de "Vincular gerente" ou radio)
- "Vincule o Gerente / F&I" — input "Digite o CPF do Gerente / F&I", hint "Digite pelo menos 6 digitos do CPF para buscar" · **Selecionar** · **Adicionar novo funcionário** · **Pular**
- Encontrado: "Eduardo Gomes · 453.470.130-72 · Não cadastrado" · **Selecionar** / **Sair**
- "Eduardo Gomes · 453.470.130-72" · **Vincular** / **Sair**
- Confirmar: "Deseja confirmar o vínculo do Gerente/F&I?" · **Sim** / **Não**
- Sucesso: "Contrato vinculado com sucesso!" · **Finalizar**

## C) Adicionar novo funcionário
- "Adicionar funcionário" — campos **Nome completo**, **CPF ou CNPJ** · **Adicionar** / **Cancelar**
- Confirmar: "Andrean Rafael Lobo — Doc: 893.470.130-72 · Confirma o cadastro desse funcionário?" · **Sim** / **Não**

## D) Alterar vínculo (popover "Alterar vínculo")
- "Alterar vínculo · Andrean Rafael Lobo · 893.470.130-72 · Não cadastrado · Deseja substituir o vínculo atual?" · **Alterar** / **Sair**
- depois segue o mesmo fluxo de busca por CPF.

## E) Confirmação de vínculo (popover "Confirmar vínculo")
- "Atenção · Está ação não pode ser desfeita, deseja continuar?" · **Sim** / **Não**
- Sucesso: "Contrato vinculado com sucesso!" · **Ok**

## F) Confirmação de vínculo — cadastro incompleto
- "Completar dados do vendedor · 893.470.130-72 · R$ 300,00 · Nome do vendedor: Jéssica" · **Confirmar** / **Sair**
- "Confirma a atualização dos dados do vendedor e deseja continuar para vinculação do contrato? A vinculação não pode ser desfeita, como deseja continuar?" · **Atualizar e vincular** / **Atualizar e sair** / **Sair**
- Sucesso: "Contrato atualizado e vinculado com sucesso!" · **Ok**  OU  "Contrato atualizado com sucesso!" · **Ok**

## G) Desvincular Contrato
- "Atenção · Deseja desvincular este contrato?" · **Confirmar** / **Cancelar**
- Sucesso: "Contrato desvinculado com sucesso!" · **Ok**

Padrões visuais: modal centralizado com overlay escuro; ícone no topo; primário verde #00842f; secundário outline verde. Modais de sucesso têm check verde em círculo.
