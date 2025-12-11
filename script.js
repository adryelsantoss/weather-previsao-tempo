//-------------- CONFIGURAÇÕES INICIAIS/GLOBAIS ----------------
const key = "31326c75605847caf4ef372ad916b5b0"

const img = document.querySelector(".icon")
const input = document.querySelector(".input")

// ----------------- TECLA ENTER ----------------------
input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        buscar();
    }
});

// ------------------------------------ MOSTRAR NA TELA -------------------------------------------
function showScreen(geodados, dados, period) {
    console.log(geodados, dados, period)

    document.querySelector(".city").innerHTML = geodados[0].name + "/" + geodados[0].state
    document.querySelector(".temp").innerHTML = Math.round(dados.main.temp) + "°C"
    document.querySelector(".humidity").innerHTML = "Umidade: " + dados.main.humidity + "%"
    document.querySelector(".feels-like").innerHTML = "Sensação Térmica: " + Math.round(dados.main.feels_like) + "°C"
    document.querySelector(".description").innerHTML = dados.weather[0].description
    document.querySelector(".icon").style.display = "block"

    //---------------------------- LÓGICA ICONES ------------------------------------------
    const descriptionAPI = dados.weather[0].description.toLowerCase().trim();
    let found = false;

    weatherIcons.forEach(icon => {
        const iconName = icon.name.toLowerCase().trim();

        if (descriptionAPI.includes(iconName) && icon.period === period) {
            img.src = icon.src;
            found = true;
        }
    });

    //--------------------------- ÍCONE API CASO NÃO ENCONRE O PERSONALIZADO--------------------------
    if (!found) {
        img.src = "https://openweathermap.org/img/wn/" + dados.weather[0].icon + ".png"
    }
}

//--------------------------------------------------- BUSCA API --------------------------------------------------
async function searchCity(city) {

    //---------------------------- DADOS CLIMA ----------------------------------------------
    const dados = await fetch(
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        city + "&appid=" + key + "&lang=pt_br" + "&units=metric").then(resposta => resposta.json())

    //------------------------ DADOS GEOLOCALIZAÇÃO ---------------------------------------
    const geodados = await fetch(
        "https://api.openweathermap.org/geo/1.0/direct?q=" +
        city + "&limit=1" + "&lang=pt_br" + "&appid=" + key).then(resposta => resposta.json())

    //------------------------ MENSAGEM ERRO CIDADE ---------------------------------------
    const errorDiv = document.querySelector(".error-message")
    if (dados.cod === "404") {
        errorDiv.textContent = "Cidade não encontrada! Por favor, digite o nome corretamente.";
        document.querySelector(".icon").style.display = "none"; // esconde ícone
        input.classList.add("error")
        return;
    }

    const { period } = isDaytime(dados) // RETORNA isDaytime(dados)

    showScreen(geodados, dados, period)  // CHAMA FUNÇÃO MOSTRAR NA TELA E MANDA OS DADOS
}

//------------------------------------- VALIDAÇÃO INPUT + CHAMADA BUSCA ----------------------------------
function buscar() {
    const city = input.value
    const errorDiv = document.querySelector(".error-message")

    //-------------------------- MENSAGEM ERRO CAMPO VAZIO ---------------------------------------
    if (city === "") {
        errorDiv.textContent = "Por favor, digite uma cidade."
        document.querySelector(".icon").style.display = "none"
        input.classList.add("error")
        return
    } else {                                                
        input.classList.remove("error")
        errorDiv.textContent = ""    // RESETA MENSAGEM
    }

    searchCity(city) // CHAMA FUNÇÃO E MANDA OS DADOS CITY
}

//------------------------------ VERIFICA SE É DIA OU NOITE ----------------------------------------------
function isDaytime(dados) {
    const timezone = dados.timezone
    const nowUTC = Math.floor(Date.now() / 1000) + timezone // Horário atual em UTC ajustado para o fuso

    const sunrise = dados.sys.sunrise + timezone      // HORÁRIO NASCER DO SOL
    const sunset = dados.sys.sunset + timezone       // HORÁRIO PÔR DO SOL

    const isDay = nowUTC >= sunrise && nowUTC <= sunset;   // COMPARA PARA SABER O PERÍODO
    return { period: isDay ? "day" : "night" }
}

//------------------------------- ARRAY ÍCONES PERSONALIZADOS ----------------------------------------
const weatherIcons = [
    { name: 'parcialmente nublado', period: 'day', src: './assets/icons/parcial-nublado-dia.png' },
    { name: 'parcialmente nublado', period: 'night', src: './assets/icons/parcial-nublado-noite.png' },
    { name: 'algumas nuvens', period: 'day', src: './assets/icons/algumas-nuvens-dia.png' },
    { name: 'algumas nuvens', period: 'night', src: './assets/icons/algumas-nuvens-noite.png' },
    { name: 'nuvens dispersas', period: 'day', src: './assets/icons/nuvens-dispersas.png' },
    { name: 'nuvens dispersas', period: 'night', src: './assets/icons/nuvens-dispersas.png' },
    { name: 'céu limpo', period: 'day', src: './assets/icons/céu-limpo-dia.png' },
    { name: 'céu limpo', period: 'night', src: './assets/icons/céu-limpo-noite.png' },
    { name: 'ensolarado', period: 'day', src: './assets/icons/céu-limpo-dia.png' },
    { name: 'nublado', period: 'day', src: './assets/icons/nublado.png' },
    { name: 'nublado', period: 'night', src: './assets/icons/nublado.png' },
    { name: 'tempestade', period: 'day', src: './assets/icons/trovoada.png' },
    { name: 'tempestade', period: 'night', src: './assets/icons/trovoada.png' },
    { name: 'chuva', period: 'day', src: './assets/icons/chuva.png' },
    { name: 'chuva', period: 'night', src: './assets/icons/chuva.png' },
    { name: 'neve', period: 'day', src: './assets/icons/neve.png' },
    { name: 'neve', period: 'night', src: './assets/icons/neve.png' },
    { name: 'névoa', period: 'day', src: './assets/icons/névoa.png' },
    { name: 'névoa', period: 'night', src: './assets/icons/névoa.png' },
    { name: 'vento', period: 'day', src: './assets/icons/vento.png' },
    { name: 'vento', period: 'night', src: './assets/icons/vento.png' }
]