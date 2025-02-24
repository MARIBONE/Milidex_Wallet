const express = require('express');
const bodyParser = require('body-parser');
const mercadopago = require('mercadopago');
const automacaoMyMonero = require('./mymonero-automacao'); // Importe o módulo

// Instância do Express
const app = express();

// Middleware para interpretar JSON
app.use(bodyParser.json());

// Configure as credenciais do Mercado Pago
mercadopago.configure({
    access_token: 'APP_USR-3563867331568255-021817-a881bf6d52f6b60d59d79498a7645e0a-2251240952' // Substitua pelo seu access token de teste
});

// Rota que o Mercado Pago irá notificar (webhook)
app.post('/webhook', async (req, res) => {
  try {
    const payment = req.body;

    if (payment.type === 'payment') {
        const paymentInfo = await mercadopago.payment.get(payment.data.id);
        const paymentStatus = paymentInfo.body.status;
        const paymentAmount = paymentInfo.body.transaction_amount;
        const paymentId = paymentInfo.body.id;

        if (paymentStatus === 'approved') {
            console.log(`Pagamento aprovado! ID: ${paymentId}, Valor: R$ ${paymentAmount.toFixed(2)}`);

            // Chame a função orquestracao para iniciar a transferência
            await orquestracao(paymentId, paymentAmount);

            // Enviar resposta de sucesso
            res.status(200).send('Pagamento capturado com sucesso');
        } else {
            console.log(`Pagamento não aprovado. Status: ${paymentStatus}`);
            res.status(400).send('Pagamento não aprovado');
        }
    } else {
        res.status(200).send('Notificação recebida'); // Resposta para outros tipos de notificações
    }
  } catch (error) {
    console.error('Erro ao capturar pagamento:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

async function orquestracao(paymentId, paymentAmount) {
    try {
        await automacaoMyMonero.transferirMonero('2300a7444b74b6bd8240bdd793fc8a525372dfffbc46676510b1b6d775955806'); // Substitua pela sua chave privada
        console.log(`Transferência para Monero iniciada para o pagamento ${paymentId}`);
    } catch (error) {
        console.error(`Erro ao iniciar transferência para Monero para o pagamento ${paymentId}:`, error);
    }
}

// Iniciar o servidor na porta 3000
app.listen(3000, () => {
  console.log('Servidor de captura de pagamento em execução na porta 3000');
});
