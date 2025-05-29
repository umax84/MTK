
function calcularPaneles() {
  const costoRecibo = parseFloat(document.getElementById("recibo").value);
  const horasSol = parseFloat(document.getElementById("horas").value);
  const tipoPanel = document.getElementById("tipoPanel").value;
  const periodo = document.getElementById("periodo").value;

  if (isNaN(costoRecibo) || isNaN(horasSol) || costoRecibo <= 0 || horasSol <= 0) {
    document.getElementById("resultado").innerHTML = "<p style='color:red'>Por favor ingresa valores válidos.</p>";
    document.getElementById("botonPDF").style.display = "none";
    return;
  }

  const potencia = parseInt(tipoPanel);
  const costoPorWatt = 8000 / 620;
  const costoPorPanel = potencia * costoPorWatt;
  const costoPorKWh = 2.87;

  let dias, ahorroMensual;
  switch (periodo) {
    case "mensual": dias = 30; ahorroMensual = costoRecibo; break;
    case "bimestral": dias = 60; ahorroMensual = costoRecibo / 2; break;
    case "semestral": dias = 180; ahorroMensual = costoRecibo / 6; break;
    case "anual": dias = 365; ahorroMensual = costoRecibo / 12; break;
  }

  const consumoPeriodo = costoRecibo / costoPorKWh;
  const consumoDiario = consumoPeriodo / dias;
  const produccionPorPanel = (potencia / 1000) * horasSol;
  const cantidadPaneles = Math.ceil(consumoDiario / produccionPorPanel);
  const precio = cantidadPaneles * costoPorPanel;
  const precioConIVA = precio * 1.16;
  const retornoMeses = Math.ceil(precioConIVA / ahorroMensual);

  document.getElementById("resultado").innerHTML = `
    <div style="text-align: left; background-color: #385738; padding: 15px; border-radius: 10px;">
      <h3 style="text-align: center; color: #aaffaa">Cotización estimada</h3>
      <table style="width: 100%; color: #e0ffe0; border-spacing: 10px;">
        <tr><td>Tipo de panel seleccionado:</td><td style="text-align: right;">${potencia}W</td></tr>
        <tr><td>Periodo del recibo:</td><td style="text-align: right;">${periodo}</td></tr>
        <tr><td>Cantidad de paneles:</td><td style="text-align: right;">${cantidadPaneles}</td></tr>
        <tr><td>Costo estimado sin IVA:</td><td style="text-align: right;">${precio.toLocaleString()}</td></tr>
        <tr><td>Costo total con IVA:</td><td style="text-align: right;">${precioConIVA.toLocaleString()}</td></tr>
        <tr><td>Retorno de inversión estimado:</td><td style="text-align: right;">${retornoMeses} mes(es)</td></tr>
      </table>
    </div>
  `;
  document.getElementById("botonPDF").style.display = "block";

  window._datosCotizacion = {
    potencia, periodo, cantidadPaneles, precio, precioConIVA, retornoMeses
  };
}

function descargarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const nombres = ["Raúl García", "Adrián Garza", "Diego Luna"];
  const vendedor = nombres[Math.floor(Math.random() * nombres.length)];
  const datos = window._datosCotizacion;

  if (!datos) {
    alert("Primero realiza una cotización.");
    return;
  }

  const logo = new Image();
  logo.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA5CAYAAABqMUjBAAAcyklEQVR4nO2beZRfRZn3v1V119++9b6m093ZGhLo7BCCBDFIlEWCYR8RUXAYBBGVURFfV0YcwZGRVUTAAQQJyC5bFgJZSdLprN3pvX/dv32/a9X8EdGAQVGQ95z3vHXO/eeeW099P1VPrU9d4P+n/7cT+bALvPe7FzU0VMe8kqbwvEkKp3/uBxMfZvkfKvCvbjjjrNmdtXcwJnlkVeHeQLBIo61nN8y5eN2HpeEDBf7qZScHj67XVs3uPpZ3feI7dwLAzTev1Gfq0WZdFs3CsX7UXBc4hlAGSZHh9fog5MAzXlm9ueDQYcMNDTcvPqcCAM/c9tmVsxd2x9KTlYe6ln85/UFp/ECAr165UJ/R4Ls46GX/5vPKM4I1NRaR/DdkU/F2Ahxnm1aLa1u6aVoomxyuK8AkCl3TUBMLIBYLIRIJl2O1NUNaMPLa2HhqO3PKN9ZMaw+ZFvqyJv/v11/ddMcZl/5H4f868PXnL6lrrVYeifil4ySZgUkSKARKFQfxyRwKRRuGLSCIDIcokGQNkZAM03BBnTwcDmi6Bsd2EPIp6JjagOldnahrbgQ0DyBrgOZDqexszpfJ2fVtywbfj17p/QJ7JRqUKV3kgsAxOcaH4phIGVBVBX6/D1VRDwgjKJgMJUuCR6WwSgW0tTaA2xomMya8XhWRqAeFvIW+cQPbd6+FVyfoXtiF2YsWgimALpG5vb3bGgC8L2D6foFVD5suGNzh0RRe3diHyaIMqkVQtilCoQDiaQu6pkKVJFC4yGYKUBQNe/viyJYIZInBtQFBFTA5gKqAwIzOOoRq27Dh1e2495a7sG/HNnCJOQ3Tuqrfr95/2KUvvnip1qXjGwrsa8biWT1XUQBJQV2IY+rUJvQcyCLqoxBEQkDj8Og6ZNUDQgg4d6B5POCOC8soQ/OGkMpkoakUsIugWhhNTTVwbAGXAnu2H0Tz9HqcuOqski/WdHPffvb9zs5O80MDvnrlwobaELuLOMbyofESKhZFfW0IHt2H0bFRMEVFc30MjBJoCsVEIoN4IoVkOg/DtMBdDkIARZbg92iorwqjfUotWppqIek+pIoEcItobmsBkzwwTQWpxDgmxvtxynmno7Fr/jMjKfuyptjskX868DXnLppe7cHD3LKO6h8zIMkUoYCOdNZAR1MAFZuipioIu5TFrn2D2DOQKGZK5lbX5Rtdjl7bxgST4cgA54TpDG4jo5geVOni1mrP0XO7piiz582GGqxG0ebgrg5VtRCMepFJAr1vbsFxp56Ao07+eG+mopwX8U3b/k8D/srKudNCfukJ7ridfaMWGAO8Hg8YLKiUIxj0ojrAMNA/hJ7+yd7RjHmvYdHVO5LWvrdsCCHUN9f9vN1bUz3Z2XlO4s/Wl0qnTd80u0oRn4762bmzZrQ0dh2/BI4Sw+jgMKbNbkcu5SLWEMXGlzdi6qwmHLfy3KFSRT3D5+vc9oEDf3HV4voa1X1OJqRrz2AJsZAKLlzIRMDhEppqvPCxMnbvHxoZjhd/tGNc+9XeVOpP8+alK+dPiWn+/NyjGm6RNTXc2N60ev+bu0deenTfC10n1jf+281PHnzr2/O7Y3UxuXJ5xC9f2X38/FBT1wKMxXOApGP67A6M7hvAwYND6JzVjPlnntufK8inhEKdfR8Y8JVXLlfDmeTqsK5+rGewgnzFgk8RCAdU5PIVzJtRC2JmcHA4+ci+ieJXHtuWfdvU8akFDQtOP23Jg1D0R1m5fJVpVZSju2cdyGezyaopHXdXe8U3+w8MXbnowlueODzfFYur5gSYcWvr1IYliz95JkbiZSgSQzgaBlN1HNjeixkLZmDmsjNfX7/HPuX4GTP+5sLkbwGTS5fPb4gGcHVdRLpmYNxAssDBKIPgDnyKwIJZNeBGhg9OFr717Uf2fh+AONzA+SfOWDajOXr//DlNtXsPjjrBYFQiQsCjS9BUBYWyXexsq/MpmuSEj1l2bUP7abccnn/lzJm+utDwzXVVgctOvWAV8mUNsuIiUj0NRLawbc3rOGnVaYhMnXvP+GjfTcnk6MicOReV/iHg61YuuFFj7pUenYUNi2LvcA41ET9MW4AKG0dNDcPDyiKZN66+5p433yb0G5d8ZJqjB5PO2ND66Q36tNpaL+JpE2s3DqK5oQqlUhm9/UlMaQzhvJVLkU6lcMJFV9p2KX1BdcdZD79T5xULAjfVVXuvXX7eKiSyNlpnzgIjFEbRxMHdPVhxxWchJL9h23xdb69x+ty5c8tHYnrXhceXzuo+TmPOVxWJhBVZQf9YHlVeDg1F+CQT7U1B+CQD6Zz1vXfCLpzZGMknk4/KmZGfZCfidbbLUV1TBadig3AXI8MTqIt6UVPlx5Zt+7G7bwLhmnrseOJBOcjKS26/7iOLV/90Vc1hJsVtb+SvGxzN3/70bx5FXV0UAz37wR0DwWAAoUg9tjz7DCSJarruPXl6p37Nu3EdEfjK5ctVhfIfUALV61ExljRQMWykK0DRYvB6vIh6OMZSpYe+9Mut33xn/o4q9fx8Jj/LLBQuOmHBlMDMKQE8+/ir2TUb9m3weyUjky/hze19WDy7yU2Wyb7bbludXX3vw+Zg7y7s79m9Ylq19sBRnY0Xvq2JKRMzzv/O1Xv7Ei+9+PiTqK4NYHBfH+xKFp1zpiIxmEBmtA+ABVVjX57MHeg4EtsRXfrSj3edU+uXH5IliqDfi617J6FLFK7giAY86GqLolIuCpPTRyXKJlwBtaE+XKo44qbzbnxi7DOL639aFfJfFQzI8KgEUb+CdBmvSYq+O6C5FySylporWuie2ehOZMrPTqQKEZ1YzY5pNlTVRNBQF4Qeik3asn4rCzfeUhzovY27vBmE8rJp19llY/pxyxaiVJQAZqOhqxt9W3bCsItYcu6FAFGRnhi7N1q75BK8Y0w54uZheCJ/wDGUvbM7aqaNpww4tgtf0IORRBG2XcCx04Ooqw4TXVfPppSCEKC5oRYbNh7o6gZOzWYrz/qDgavOOqETlFIIQSBJZDElZLFlO5hBKGRFAghlHZ2x0wiT4Ng2QCiYqoILQBJOdalsffbp1U9UTlt+7IWh2mpwQUGFg/zoKLa8shaNXfNRtjiUg/tQM7UVu9ZtQCExBqeQcXrWvDj6nlsYAL726Xk/mVIfuHpLbxJlwwJjAposYf9AHJO5IjrqA7jgtKPg9yoQcNHa2oyxoSQeenbLCZteGn7d1+Zf39kQnHfR2cciGvWBSRIS8QL+sL4fvUNZLJhVhws+1Q1vwIvJvI2bfvJ7xMIKvvr18+Grqcbq+5/Gr+5fg5qwih/f9Q14mzsAScUf7n0Q997xW7NSyImPn36yNm/R8ZACOgKxRozu3gdfWEH7oqUbNf/8RQD4O7mO2Ic/uXixP+hTVhRLHPmShXBAhWk6YIQg5CWIZ4wfb+7P/ThXNE1AQAggncmgviGKxqh3xRbAHpgsXLxuT/Kn6XzFFoJDVnSs2xbndz65Pb922yDu/f1OJFJFSDJDogj7sVf2733pjf5sKZsHHAfr3hx68fc9yc995KNzx7xVMcBxkBseNu+99+k7X+hJnFhy6Pe3vb4ZhuPg4N4h5IYOIuhXMDkwAkGljnR6tPFIbEcEbqmzjvLpytTJrAlLUIynilA1BbVRHcK1xwIefHf9HVd8S1PkDABQQlEqlqHpKqpioVNmAspgEbtv+vLHnq2J+CTX4ZBVBTZTNjsujqsKaVsJJSO243BGCFpb67dNujhmRnPoRxQuuGvjc5eeeuM9X+p+atnH5ukQBGBAZiK5+oH1g5dNVvA6JN9d4+OZyWR8BNFAAIQLOJYF1xQw05NhzcuXvmdgnywt8GgKTWZKCOkUsZCO2ogXCnOh6+rj/RnkbvnN634BQYFDo4LruiiWSmioj82as7h+JgAIbl3u8ciEcwEhBE5aOmNnhsg9aUP56IoTZ5wpM2oRAEySHEppJRJU8uAccF0ks3kSrKq5LlobC8PlMFI5nh4Zv+Mtjc/tSY47HL/bvW0HXGFjJD4JvaYJkaZmpIb6IUt8yXsGVmQcZbpAuVyCVxUgENBkBZQIEQr4ngQAC67CuZC5K8DdQ10lmy+gqTEm14Z8y+/72ifafR7pFIe7cAWH7bhIj098+pKTOn9RkWW7szGaEX+qLM5WdNV+S2Lq9Y7lQriuGN07PGtKe9OnIakAJchNJl5/4obVa98mlMhP9h8YhD/gBQEBZ4BlOshPJkCEdcx7Ar5sRXezKkuLyhULlgNkc0VEvAp8XgUejSWDEX0bADDCFQ4uK5oClwtAEFRKZagqha6yTwpUvhLQJJ27gGk5YASwbPFGIpm5PZVKFcu2KRFxaABgFPaGvWMP9o+kE9x1IVzOfQo/f0p7Yx0cB2ASZK937429vdbhWstUbMtkc6lSqQDKfMgMpMGYB8W8AcKtKen03r9o5bcBX7dy4Tl1Afq6JpPphilAmQLOdOSKJvw6QW2NP976kcVpANC4JkEQpno8sG1+yBO5QMUoIxzQ53uo8xkuOEAUN18wHM4FbMs4xqdJx//RjyAACAE4tqUkTByY3hr7OXccEAF29DGdx3l9fsBxAcOA5ouctPa2y8OH6x1jU5LcdseKuRzqW1vhi8QQjFXDsV3AKUWDQem5YnHPDe8KrMj8HEWmdSAEFdOGwhwEVQGFAtGQiukdtcOf//wdNgCYpKgLIWSAom+0ANtxQQAUiyXMndPEIhFdllUV+ZJ42XFEnyIzBMORO3+1buhnAIRpuZRzTlyXA+KQDolR13EcMO6gob4GcAWE60AYRWgetaVlftfbBqLe3l5LohixSkUkUuOYLGUgPIAkAZZZBqVCVyX3E0IIckRguNzrOoeq3eECpYoBxggqtkA04kdnV8eftl8SVQKEEIlRYNuBtEhmDBBCYBoWKHUhSwQup+gbTP2WUWLbrgurYi+6cOnM4wEQBYDDOXFcF0apEjt7TuMPU1njWtN2IGwLqFTAbROTQ0MQtglKLPij1We+00V1VaoIx4AiCYRUIDG4F5w7IOAAbAAuPZzzbcCuAAAOzgVkSYLXoyFfsiCEC0lWAG9Af+tbj0dRCSEgAsgUysnRZHk/IQIQgG25YEzCeKKYeOrFXS8TUNlxBHr6RvN7D4zKAGAB4C4H5y4IhbX7YOLZgbHcZsE5uONAcI50Oodnnt7MXcMAyjmoirys5+GrI4dr9np1pusqhMsRjtUi5K8HJRIYIzi0ruIchy1A3gacr9hvFCsWOBfQVQmWLcAYhcejI18yQSAab3j5BgkAFIUSAkCIQz1xcKL4nGlxcAFwzsGYjD0Hkhse3zE2bLuO6joO5h41NbdiWdckAMCy4LjuW4+YO7c9Om92YyMIh+nYEIRjIpHb+chzO3en4knALEPT5YZwx6wT/qz4BhqOhKvCkRC4yzE23A81rIEQB5IkIzs5gn07d+4khIgjAv/8ye3f3bZ/4uPFijXqUShCfg0Zg6GhqRbZrIFKIlH7accMAoBjWhrEoarzytTb259elyvahUMTjUAuX8HGnqHf3bBiBRGcqwICBw6Odby2df8cAMRlRDiOC9dxQIVg2/cML355w/55+UIFjmvDqJgwK86dO/sSG7Zv2w84FgivQPNon3pL75XnP+Orqatu8Pr8UJiA3ysjN56EpuuwTDf5m1vvOWfWvAu/eDjjO6cl54Wd8WdMW2xSFQbbcVHjZ9i9ewD7B1Po3z1UHd870A4AhDL9EBxByCOzTX3JnlLZ3Cw4h8QY9vQn00+9MfZcuK3sF0LoRADdc2ZsfWbnxG8A8HLFILbtCMd2ILhDdk6Uv7x7tPyvvfvGIVwXo/FMNmNpD1cMPP7axr2w83mgkIWmKydvfuCaGAAcVVfX1tHWVCtAUTSBfMZBpVBCMOQFU9TNV3zvwUcAlP8a8CFvc8VOmREIqiJTOuQek2kDgyM5aWwkcRIAgLkagQCVKGJBndhAPl9xHzNtB47NsX8g9XwZGOdGuYEQ+BwhMDk2fv4Xl838GgDKKBWcc2IaJrhjent+e7V/1Mbz23aNZQr5IiaShWdP/tytEzawfmBgYjgxngDKRegaq62f3rkcAGZ1tCzt7GxVh0eTcIkKonsgaQoC4TAEp28eie2IwKbhbikbFqrDHng0BkUWaGsOY89gHhOJ/NnnnXZ82EP4xyTCQSWK5sYobQA0SeiP50t2aSxRxo4Dk/cBoLGgfplPUyTDMNFx7Kw+01t3NwAeDnpmaQpVi6USqDCrM+ncWQDiI/Hs1p4945hMFe4HgByQjQTVbcJ1AMsEKaWhetQr7/uPL1S3tNSv9Hj9yGRtTI6PopDOYHj/HvgjYViGteE9AxcNsTlbKGeiPgaJUmTyDkZHJzEQL4JQNvvENr6xKszO4xSYGJ3A0V2N8nWXL/nJfU+9alQs9vLAWO7Amv7CugeuO/mxmoh8GYdANpkBc7JzrvqXY5768RdPuqqjSfuxoghUTBvlfIbGQvRnz9181mcT6cJjm3cOjboh9VUA2p1XnfBfl1/60YXRiBfcMoFsGhHFmf+RBU3rAz66cDxRQCgWQ0BVwU0bkaAMSZVTpVJh05HY3nU/fO2Zxzzd1hQ7dd22QQjXAZUoihWBqXUamqsYbBcQXIAAkGQKWRBs7Bm6fsq0mZvGJ5JtzFfT3xEuPqVJruK6h/q1IjNImo5dB9P7ZzVqHY4QIISBUQKPrsBb07jh2fWDV0309S15aMvkT7prlbPPWtr+SOfUGDhnkGUZkqJA0xRU1YQRC9dgy844tKoI/P4IJkbHMbvTh9ajux9jLWd/6khc7xouLTv8YcOonFpfHUIylUPRsJArVbCmJwuNcSTSJYsx+oJESYlRbod1yYyG/Ptv/PW6P8xp8Mxua7JfS486CnctEBDE00WMp8qQFAkyE+2vMIpUyYbCKIK6hMaoF1+79thFi6dmP7Hq4clvAYBEmfX8a/13P7VmvyNAwCFgWG4DZWzFVy5fAa/mIF2swAcLPpmDOVk0tbajZIuN78b1bsDEcUAS6bxorIqSkXgWEiXwqxQlE1B0D2Jh8N6BzA8zDv54P8MEUAIA0tnWcpYwC56W+ii6Z7eiKhbEaLKA+x5ei4msgZiHkDkzW9A7kALhNhrCMo6ZNQVTZs5EOZv4+prbPzO+5LJf/oKQyhMA3nY4v7iJ3X3qsmMRCUWwd+8gZJ8Pg7vGcbBvBEvmNkHiHJpT+PL47t+8UTfj3FfeE/AZy+ZFGErfKRuCGEYZDdUB7OqLQ5EZpjeGkTcEZjaFtM5azy96hjMnbxosx9/Ke1l3tzRUzg0V0tk3M7ly00g8Ff3k8kU4aekCSMTFb1e/AY8m4ROnLob/lU0YGk+DuxY27ehH349+haM7a1+MBXng7psu8QH3vC2S8K1Vx36xJuK5pLW9DT27R6AoHE21AVRFgsilUmhtqUG5UAAK+arhsVLte27h2S9uyox9dPqrCqXnjyfyaG6owmjCDwYL4AIxn4aJrIM5U+pn1Ub9vw7GJs7+w5ZMDgDu2LLFBnD3nDrv0FC+qB+M5+/bcfDJ4CU5E9PrfejqqEUqU4JwXEykckhlijAcB6GgH68+vzmxdh2+tmnMfvOdmvavvvH0fCp+UzJfxo7dE8gbAtnxLFKZPEK+AGbPqAYgYBoljKUqa3/9y6d/dyS2I47SNwK8UOE3VWxesmyBVDqHaS1BFAyBRAmoigWg6xq29uUQqwqffEJ70wOnz24JHW6j1lu3pjrofVXX2DdVieD+B55GIpnDsQuOhWsbeHXtG8iVLczrnmpdfOZ81NWEf099ocWbxpy/gC28+ctV4aB2f7Zsel5avw+BkI5Z02uh+8IoGxKCfhXRqA+5QgGjk5nKwbHMV3/27IEjBsz/aqjlohOnfcej4JtECDTVRzCRBzb2DkNjDmLBMARjYMRBd0cUuUxx/dqt/Z9bM1jcfbgNAZClbfrthMoXQOC1U07sXranZzdyxQq8Pk/hvHOW3SrLZNUzT208+Zbn9g4cnvfgwZe1+vL41zPJketff22btGHrEBLpErKpUbS2NIBqMdQEOY6eFobEKGSZIV/Bt1dc+z83vhvTXwVeubBRN03nQY+q8KBfPalzSn1o10Ae8XQBqiQjFiBQFAWjiSJmtIRhW8bE3oOT331y+8RdAIy37LS3t6sz/YV/T1bEM34ifipcaz4lTspx8dsTT5p910Q85//ZE7tePrzs3NZ7FlPX/MH4yPAJL67Zgv0DWZgOhURdlMoWmKSgqdqHGW0elE334BPPbx/26myylPKf/8g7TkbeM/AfkwzAPnfJ1EtjfuXOtqZa9BzMwKgYAByEgl5QScXAaAZVIRX1UQ8S6fymkfHsz9ftjK/OAdm3DC2bNz2aGh87Bdy5uynqvWKsLHZs6UtuPaws9vlTZnZ3H936hTkzp5wbn0hpm3qGEE8YaKn3IhKNYmAkhbLBEfEzdDTqsB2k43nz49ff8crGP2p9V9j3CvyntPK4qT9qjGjX1VXHsKt/EuWKjZBPgWnb0DQdjmBIZwtorPYj6GEwDKuvWKq8kMwW1+Ty5pvJgpXsKxFerTirAj79pYKpJFuquD+iyzNiIX1hNOA9ORzxdXs9qjyaNJDKWPBoCsBkTMZHEQ17EAxG4No2Wmp1GLZbSJXFuTfc88pT75Xh7wNeCYax1lvrQ/oVjXXV2DuYw2gig4ZqPyCAcECFAEW+ZKNsWAh4FAR9CiQi4LqOwQUvuK4wOHdtVZFAGfMqiuRVFcnHGINpC6TyFnIFCwGfjkq5iEqpgq4ZUzEwPAFBKMIBFU1VCkoVO5m1yEX/5771z/w9DH//LZ6VK9mnRjZ/P+aVr2tvrcZwwkQmW0C5UoFPY4cO/gTg90ooW0CpIqArBCAEqkQhywQSJYfOIkBgORyWzWG7gK4y+Hw60tkCKsUiFFWDzAgAAUoVtNT5EPQCuaK1J2PTf7n5f9544++V/w/f0zpjYcsX/DL5YWtdJEhkDYPjRXCnjJJFEAkwGCZgOgycO2iu8SAQCOPg8DhkpoC7JiLhACoWgWnaaGqI4cDAJMDL8MgETJEQ8mtIFQhyJRM1YQ0NMQVwLWQr7qMGV676z0deP2Kw7J8GDACfnNc21yO7t1QF9MX1NTFUbGAkWUI6V4AqS3A4ASEcPpXAdRz4dQmOAExHAriDaCSAeLKAaVNrkC8KjIzFEfIS5CsAZRJqoz6EfBQKdWHZjlUy8ZUfPrL5ZwARf1vdPwEYAM5Y0Ha8VxZrGRGIBL2ojvjBuYzJnIFM0UTFqEBRCDIFgYBqQxCGmmgY2VwOtkshADiujdpYEBOpCnRVoDbiR9AvgwgHFcOC63D4A978cYsWTl/6+Z+Ovx+97/tyaT5TzCMguT6PwiazZaSyJfh0GWG/jlitCkdoKBgcsSCD5biomA4yxTIkRYNEJciUw6v6IUkCXW0BMCpgWRZy2RJcDhBKoDCGQqFMN+7cpb1fvR/EfWk6d4rvzJhP/3bQp3XJEgOEQK5gQJaYiPg1ousyNFUGZRSUUlBCAXAIDhAiAC7gOjYqhoNsyYSmKVBVCYwIUEJhue5my6HX3/78nhdxhJjvhw0MAAiHEZwWCl4S8MlXBXW5fmiicFW6YGwNBXzzfarUHfSrC4IeeboAQCgFBQGjgOu4yJWNdTZ3NxkVd1c8k98fDQa+N60xcjyIGDI4+c+BuHLXq729xQ9C5wf+z0OLB7VVdeG2zX2Z1w5/v2h6TVdzRN2kyZIGEIAACgVkInY88WL/whGg8mcbntrOVu9y2et59ulNg/G/LOUfTx/qTx6ndTf+q0YxH4RQQSE0RknQIz/03y8cePLD0vC/9xed5B1VA8IAAAAASUVORK5CYII=";
  logo.onload = function () {
    doc.addImage(logo, "PNG", 160, 5, 35, 35);

    doc.setFontSize(14);
    doc.text("Macro Tecnologías Kernel S.A.S. de C.V.", 10, 10);
    doc.setFontSize(11);
    doc.text("Correo: ventas@macrotek.com.mx", 10, 17);
    doc.text("Vendedor: " + vendedor, 10, 24);

    const fechaHoy = new Date();
    const fechaFormateada = fechaHoy.toLocaleDateString();
    const vigencia = new Date(fechaHoy.getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString();
    const numeroCotizacion = Math.floor(800 + Math.random() * 1000);

    doc.text("Fecha: " + fechaFormateada, 10, 31);
    doc.text("Vigencia hasta: " + vigencia, 10, 38);
    doc.text("Cotización No: " + numeroCotizacion, 10, 45);

    const precioUnitario = {
      panel: 5200,
      estructura: 800,
      clamps: 400,
      tornilleria: 300,
      angulo: 200,
      cableado: 600,
      inversor: 500
    };

    const items = Object.entries(precioUnitario).map(([nombre, precio]) => {
      const descripcion = nombre.charAt(0).toUpperCase() + nombre.slice(1);
      return {
        codigo: "PNL-" + nombre.substring(0, 3).toUpperCase(),
        descripcion,
        unidad: "pza",
        cantidad: datos.cantidadPaneles,
        precioUnitario: precio,
        total: datos.cantidadPaneles * precio
      };
    });

    const subtotal = items.reduce((acc, item) => acc + item.total, 0);
    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    const tableData = items.map(item => [
      item.codigo,
      item.descripcion,
      item.unidad,
      item.cantidad.toString(),
      "$" + item.precioUnitario.toLocaleString(),
      "$" + item.total.toLocaleString()
    ]);

    tableData.push(
      ["", "", "", "", "Subtotal:", "$" + subtotal.toLocaleString()],
      ["", "", "", "", "IVA (16%):", "$" + iva.toLocaleString()],
      ["", "", "", "", "Total:", "$" + total.toLocaleString()]
    );

    doc.autoTable({
      head: [["Código", "Descripción", "Unidad", "Cantidad", "Precio Unitario", "Total"]],
      body: tableData,
      startY: 55,
      margin: { left: 10, right: 10 }
    });

    doc.setTextColor(230, 230, 230);
    doc.setFontSize(60);
    doc.text("MTK", 35, 270, { angle: 0 });

    doc.save("cotizacion_mtk.pdf");
  };
}
