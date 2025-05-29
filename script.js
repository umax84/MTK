
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
        <tr><td>Costo estimado sin IVA:</td><td style="text-align: right;">$${precio.toLocaleString()}</td></tr>
        <tr><td>Costo total con IVA:</td><td style="text-align: right;">$${precioConIVA.toLocaleString()}</td></tr>
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

  // Marca de agua
  doc.setTextColor(220, 220, 220);
  doc.setFontSize(60);
  doc.text("MTK", 35, 150, { angle: 45 });

  doc.setTextColor(0, 0, 0);
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

  let y = 55;
  doc.setFontSize(12);
  doc.text("Detalle de productos:", 10, y); y += 6;

  doc.setFontSize(10);
  doc.autoTable({
    head: [["Código", "Descripción", "Unidad", "Cantidad", "Precio Unitario", "Total"]],
    body: items.map(item => [
      item.codigo,
      item.descripcion,
      item.unidad,
      item.cantidad.toString(),
      "$" + item.precioUnitario.toLocaleString(),
      "$" + item.total.toLocaleString()
    ]),
    startY: y,
    margin: { left: 10, right: 10 }
  });

  const finalY = doc.lastAutoTable.finalY + 5;
  doc.setDrawColor(0);
  doc.setLineWidth(0.3);
  doc.rect(130, finalY, 70, 20);
  doc.text(`Subtotal: $${subtotal.toLocaleString()}`, 135, finalY + 6);
  doc.text(`IVA (16%): $${iva.toLocaleString()}`, 135, finalY + 12);
  doc.text(`Total: $${total.toLocaleString()}`, 135, finalY + 18);

  doc.save("cotizacion_mtk.pdf");
}
