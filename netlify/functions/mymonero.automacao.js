const puppeteer = require('puppeteer');

async function sendMonero(privateKey, recipientAddress, amount) {
  const browser = await puppeteer.launch({ headless: false }); // `headless: false` para ver o navegador
  const page = await browser.newPage();

  try {
    // 1. Navega até o site da MyMonero
    await page.goto('https://mymonero.com/');

    // 2. Insere a chave privada e faz o login
    await page.type('#privateKey', privateKey);
    await page.click('#loginButton');
    await page.waitForNavigation(); // Espera a página carregar após o login

    // 3. Navega até a página de envio de Monero
    await page.click('#sendTab'); // Adapte o seletor conforme necessário
    await page.waitForNavigation();

    // 4. Preenche os campos de endereço do destinatário e valor
    await page.type('#recipientAddress', recipientAddress);
    await page.type('#amount', amount.toString()); // Converte o valor para string

    // 5. Confirma a transação
    await page.click('#sendButton'); // Adapte o seletor conforme necessário
    await page.waitForNavigation();

    // 6. Extrai o ID da transação
    try {
      const transactionId = await page.$eval('#transactionId', el => el.textContent);
      return { success: true, transactionId };
    } catch (error) {
      // Se não encontrar o ID, tenta extrair mensagens de erro
      const errorMessage = await page.$eval('#errorMessage', el => el.textContent);
      throw new Error(errorMessage || 'Falha na transação. ID da transação não encontrado.');
    }
  } catch (error) {
    // Captura erros gerais durante a automação
    console.error('Erro na automação:', error);
    throw error; // Relança o erro para ser capturado em transferencia.js
  } finally {
    // 7. Fecha o navegador Puppeteer
    await browser.close();
  }
}

module.exports = { sendMonero };
