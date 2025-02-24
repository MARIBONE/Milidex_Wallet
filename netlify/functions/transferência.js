const mymoneroAutomation = require('./mymonero-automation');

async function realizarTransferencia(valorFinal, enderecoMonero, privateKey) {
  try {
    const result = await mymoneroAutomation.sendMonero(privateKey, enderecoMonero, valorFinal);
    if (result.success) {
      console.log(`Transferência realizada com sucesso. ID: ${result.transactionId}`);
      return result.transactionId; // Retorna o ID da transação
    } else {
      console.error('Transferência falhou.');
      throw new Error('Transferência falhou');
    }
  } catch (error) {
    console.error('Erro ao realizar a transferência: ', error);
    throw new Error('Erro na transferência para a carteira Monero');
  }
}

module.exports = { realizarTransferencia };
