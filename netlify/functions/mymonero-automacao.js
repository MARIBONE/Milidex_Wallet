const puppeteer = require('puppeteer');

async function sendMonero(privateKey, recipientAddress, amount) {
  const browser = await puppeteer.launch({
    headless: false,  // `headless: false` para ver o navegador
    executablePath: '/data/data/com.android.chrome/files/chrome',  // Caminho do Chrome no seu dispositivo
  });
  const page = await browser.newPage();

  try {
    // ... (código existente)
  } catch (error) {
    console.error('Erro na automação:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

module.exports = { sendMonero };
