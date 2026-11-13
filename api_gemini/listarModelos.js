import dotenv from 'dotenv';
dotenv.config();

async function descobrirModelos() {
  const apiKey = process.env.GEMINI_API_KEY;
  // Fazemos um GET simples (igual ao ViaCEP!), mas passando a chave na URL
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  try {
    const resposta = await fetch(url);
    const dados = await resposta.json();
    
    console.log("Modelos disponíveis para esta chave:");
    // Percorre o JSON e imprime só os nomes
    dados.models.forEach(modelo => console.log(modelo.name));
  } catch (erro) {
    console.error("Erro ao buscar modelos:", erro);
  }
}

descobrirModelos();