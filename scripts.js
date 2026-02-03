let chaveIa = "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";
const GROQ_API_KEY = process.env.GROQ_API_KEY;

async function cliqueiNoBotao() {
  let cidade = document.querySelector(".input-cidade").value;
  let caixa = document.querySelector(".caixa-media");
  let chave = "89ec9a0d16a9f7ed498a7dd27e447213";

  let endereco = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${chave}&units=metric&lang=pt_br`;

  let respostaServidor = await fetch(endereco);
  let dadosJson = await respostaServidor.json();

  caixa.innerHTML = `
  <h2 class="cidade">${dadosJson.name}</h2>
  <p class="temp">${Math.floor(dadosJson.main.temp)} °C</p>
  <img class="icone" src="https://openweathermap.org/img/wn/${dadosJson.weather[0].icon}.png"></img>
  <p class="umidade">Umidade: ${dadosJson.main.humidity} %</p>
  <button class="botao-ia" onclick="pedirSugestaoRoupa()">Sugestão de Roupa</button>
  <p class="resposta-ia"></p>
  `;
}

function detectaVoz() {
  let reconhecimento = new window.webkitSpeechRecognition();
  reconhecimento.lang = "pt-br";
  reconhecimento.start();

  reconhecimento.onresult = function (evento) {
    let textoTranscrito = evento.results[0][0].transcript;
    document.querySelector(".input-cidade").value = textoTranscrito;
    cliqueiNoBotao();
  };
}

async function pedirSugestaoRoupa() {
  let temperatura = document.querySelector(".temp").textContent;
  let umidade = document.querySelector(".umidade").textContent;
  let cidade = document.querySelector(".cidade").textContent;

  let resposta = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + chaveIa,
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-maverick-17b-128e-instruct",
        messages: [
          {
            role: "user",
            content: `me dê uma sugestão de qual roupa usar hoje.
            estou na cidade de: ${cidade}, a temperatura atual é: ${temperatura} e a umidade está em: ${umidade}.
            me dê sugestão em 2 frases curtas`,
          },
        ],
      }),
    },
  );

  let dados = await resposta.json();
  document.querySelector(".resposta-ia").innerHTML =
    dados.choices[0].message.content;
}
