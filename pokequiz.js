let currentPokemon = {};

// 初回ロード時にポケモンを取得する
document.addEventListener('DOMContentLoaded', getRandomPokemon);

async function getRandomPokemon() {
    const randomId = Math.floor(Math.random() * 1010) + 1; // ポケモンのIDをランダムに選択
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    if (response.ok) {
        const data = await response.json();
        currentPokemon = {
            name: data.name,
            imageUrl: data.sprites.front_default, // 通常の画像を使用
            silhouetteUrl: data.sprites.front_default, // シルエット化に使用
            japaneseName: await getPokemonJapaneseName(data.species.url)
        };
        console.log("Current Pokemon Data:", currentPokemon); // デバッグ用
        displaySilhouette(currentPokemon.silhouetteUrl);
        document.getElementById("next-button").style.display = "none"; // 「次の問題」ボタンを非表示
        document.getElementById("result").textContent = ""; // 結果をクリア
    } else {
        console.error("ポケモンデータが取得できませんでした");
    }
}

async function getPokemonJapaneseName(speciesUrl) {
    const response = await fetch(speciesUrl);
    if (response.ok) {
        const speciesData = await response.json();
        const japaneseNameEntry = speciesData.names.find(name => name.language.name === "ja");
        return japaneseNameEntry ? japaneseNameEntry.name : "名前が取得できませんでした";
    } else {
        console.error("ポケモンの日本語名が取得できませんでした");
        return "名前が取得できませんでした";
    }
}

function displaySilhouette(imageUrl) {
    const pokemonImage = document.getElementById("pokemon-image");
    pokemonImage.src = imageUrl;
    pokemonImage.onload = () => {
        pokemonImage.style.filter = "brightness(0%)"; // シルエット化
    };
    pokemonImage.onerror = () => {
        console.error("画像の読み込みに失敗しました");
    };
}

function checkAnswer() {
    const userAnswer = document.getElementById("pokemonInput").value.trim();
    const resultText = document.getElementById("result");
    const pokemonImage = document.getElementById("pokemon-image");

    if (userAnswer === currentPokemon.japaneseName) {
        resultText.textContent = "正解！";
        resultText.style.color = "green";
        pokemonImage.style.filter = "none"; // シルエットを解除
        document.getElementById("next-button").style.display = "block"; // 「次の問題」ボタンを表示
    } else {
        resultText.textContent = `不正解！正しい答えは「${currentPokemon.japaneseName}」です。`;
        resultText.style.color = "red";
        document.getElementById("next-button").style.display = "block"; // 「次の問題」ボタンを表示
    }
}

// 「次の問題」ボタンが押されたときに呼ばれる関数
document.getElementById("next-button").addEventListener("click", function() {
    getRandomPokemon(); // 新しいポケモンを取得
    document.getElementById("result").textContent = ""; // 結果をクリア
});
