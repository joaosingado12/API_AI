import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ 
  apiKey: API_KEY,
  httpOptions: { apiVersion: 'v1beta' }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ erro: 'O prompt é obrigatório.' });
    }

    // 1. Busca a lista de modelos da sua chave
    const resLista = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const dadosLista = await resLista.json();

    // 2. Filtra TODOS os modelos Flash de texto válidos (cria uma fila de opções)
    const modelosFlash = dadosLista.models?.filter(m => 
      m.name.includes('flash') &&
      !m.name.includes('tts') &&
      !m.name.includes('vision') &&
      !m.name.includes('2.5') &&
      !m.name.includes('image') &&
      m.supportedGenerationMethods?.includes('generateContent')
    ) || [];

    if (modelosFlash.length === 0) {
      return res.status(500).json({ erro: 'Nenhum modelo Flash encontrado.' });
    }

    let ultimoErro = null;

    // 3. Tenta um modelo por vez. Se um estiver com alta demanda (503), tenta o próximo!
    for (const modelo of modelosFlash) {
      const nomeModelo = modelo.name.replace('models/', '');
      try {
        console.log(`Tentando gerar com: ${nomeModelo}...`);
        
        const response = await ai.models.generateContent({
          model: nomeModelo,
          contents: prompt,
        });

        console.log(`Sucesso com o modelo: ${nomeModelo}!`);
        
        // Se deu certo, já retorna a resposta pro Postman/Front e encerra o loop!
        return res.json({ 
          modelo_utilizado: nomeModelo,
          resposta: response.text 
        });

      } catch (err) {
        console.warn(` Falha no modelo ${nomeModelo} (Servidor ocupado ou indisponível). Tentando o próximo...`);
        ultimoErro = err;
      }
    }

    // Se testou todos da fila e todos falharam:
    return res.status(503).json({ erro: ultimoErro?.message || 'Todos os modelos estão ocupados no momento.' });

  } catch (error) {
    console.error('Erro geral:', error);
    res.status(500).json({ erro: error.message });
  }
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));