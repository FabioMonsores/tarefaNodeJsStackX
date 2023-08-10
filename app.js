const fs = require("fs");
const readline = require("readline");
const leitor = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const { EventEmitter } = require("events");
const ee = new EventEmitter();

leitor.question("Qual o nome do arquivo a ser lido: ", function (resposta) {
  arquivoResposta(resposta);
});

function arquivoResposta(resposta) {
  const inicioTempo = process.hrtime();
  fs.readFile(resposta, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const lines = data.split(/[\s,]+/);
    console.log(lines);

    let soma = 0;
    const listaNumeros = lines
      .filter((item) => !isNaN(item))
      .map((num) => (soma = soma + parseInt(num)));

    const listaTexto = lines.filter((item) => isNaN(item));

    const fimTempo = process.hrtime(inicioTempo);
    ee.emit("resumo", {
      soma,
      listaNumeros,
      listaTexto,
      fimTempo,
    });
  });
}

ee.on("resumo", (resumo) => {
  console.log("Somente Numeros = ", resumo.listaNumeros.length);
  console.log("Soma Numeros = ", resumo.soma);
  console.log("Somente Texto = ", resumo.listaTexto.length);
  console.log(executarNovamente());
  console.log(
    "Tempo de execução: ",
    resumo.fimTempo[0] + resumo.fimTempo[1] / 1e9,
    " segundos"
  );
});

function executarNovamente() {
  leitor.question("\nDeseja executar novamente? [S/N]: ", (resposta1) => {
    if (resposta1 === "S" || resposta1 === "s") {
      leitor.question("\n Informe o caminho do arquivo: ", (resposta) => {
        arquivoResposta(resposta);
      });
    } else if (resposta1 === "N" || resposta1 === "n") {
      leitor.close();
    }
  });
}
