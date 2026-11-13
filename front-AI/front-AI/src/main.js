import axios from 'axios'

export const app = axios.create({
  baseURL: 'http://localhost:3000/',
})


const form = document.getElementById('form-chat');
const inputPrompt = document.getElementById('input-prompt');
const btnEnviar = document.getElementById('btn-enviar');
const areaResposta = document.getElementById('area-resposta');
const badgeModelo = document.getElementById('badge-modelo');
const loading = document.getElementById('loading');

// 2. Evento de envio do formulário:
form.addEventListener('submit', async (event) => {
  event.preventDefault(); // Evita que a página recarregue

  // TODO:
  // - Capturar o valor digitado no inputPrompt.value

  let promptIn = inputPrompt.value

  // - Mostrar o loading (remover a classe 'hidden' do elemento loading)
  loading.classList.remove("hidden")

  // - Fazer o axios.post('http://localhost:3000/api/chat', { prompt: ... })
  try {
    const response = app.post('/api/chat', {
      prompt: promptIn
    })
    areaResposta.value = response.

  } catch (error) {
     if (error.response && error.response.data) {
      msgErro.innerText = error.response.data.erro; // Exibe o erro do back-end
    } else {
      msgErro.innerText = 'Erro ao conectar com o servidor.';
    }
    msgErro.classList.remove('oculta');
  }


  // - Pegar response.data.resposta e jogar no areaResposta.textContent
  // - Pegar response.data.modelo_utilizado e jogar no badgeModelo.textContent
  // - Tratar possíveis erros no catch e esconder o loading no finally!

});
