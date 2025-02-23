
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

// Instância do Express
const app = express();

// Middleware para interpretar JSON
app.use(bodyParser.json());

// Rota que o Mercado Pago irá notificar (webhook)
app.post('/webhook', async (req, res) => {
  try {
    const { data } = req.body; // Pegando os dados do pagamento

    // Aqui você pode verificar o status do pagamento e o ID da transação
    if (data.status === 'approved') {
      const paymentId = data.id; // ID do pagamento aprovado
      const paymentAmount = data.transaction_amount; // Valor do pagamento aprovado

      console.log(`Pagamento aprovado! ID: ${paymentId}, Valor: R$ ${paymentAmount.toFixed(2)}`);

      // Aqui é onde você chama a função para a próxima etapa (orquestração)
      // Exemplo: Você pode chamar a função para aplicar a fórmula milidex ou preparar para a transferência
      // await orquestracao(paymentId, paymentAmount); // Apenas um exemplo

      // Enviar resposta de sucesso
      res.status(200).send('Pagamento capturado com sucesso');
    } else {
      console.log(`Pagamento não aprovado. Status: ${data.status}`);
      res.status(400).send('Pagamento não aprovado');
    }
  } catch (error) {
    console.error('Erro ao capturar pagamento:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

// Iniciar o servidor na porta 3000
app.listen(3000, () => {
  console.log('Servidor de captura de pagamento em execução na porta 3000');
});