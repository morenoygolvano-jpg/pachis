
<html>
<body>

<?php

function leerListaJson($nombre) {
    $ruta = __DIR__ . '/' . $nombre;
    if (!is_file($ruta) || !is_readable($ruta)) {
        throw new RuntimeException("No se puede leer el archivo " . $nombre);
    }
    $contenido = file_get_contents($ruta);
    if ($contenido === false) {
        throw new RuntimeException("Error al leer el archivo " . $nombre);
    }
    // JSON utiliza UTF-8: no volver a codificar el contenido.
    $datos = json_decode($contenido);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new RuntimeException("JSON inválido en " . $nombre . ": " . json_last_error_msg());
    }
    if (!is_array($datos)) {
        throw new RuntimeException("El archivo " . $nombre . " debe contener una lista JSON (entre corchetes).");
    }
    foreach ($datos as $indice => $dato) {
        if (!is_object($dato)) {
            throw new RuntimeException("El elemento " . $indice . " de " . $nombre . " debe ser un objeto.");
        }
    }
    return $datos;
}

// Comprobar los tres archivos antes de vaciar las tablas.
try {
    $batidas = leerListaJson('todas.json');
    $cazadores = leerListaJson('cazadores.json');
    $plan = leerListaJson('plan.json');
} catch (RuntimeException $error) {
    http_response_code(400);
    exit(htmlspecialchars($error->getMessage(), ENT_QUOTES, 'UTF-8'));
}

printf("Copiando tabla monterias");

$dbPassword = getenv('PACHIS_DB_PASSWORD');
if ($dbPassword === false) {
    exit('Falta configurar PACHIS_DB_PASSWORD en el servidor.');
}
$mysqli = new mysqli(
    getenv('PACHIS_DB_HOST') ?: 'localhost',
    getenv('PACHIS_DB_USER') ?: 'u474862325_scrofa',
    $dbPassword,
    getenv('PACHIS_DB_NAME') ?: 'u474862325_pachis'
);

if ($mysqli->connect_errno) {
    echo "Falló la conexión a MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
} 
  
 echo ("<p>Conectado</p>");
 

	$result = $mysqli->query("TRUNCATE TABLE  batidas");
	$result = $mysqli->query("TRUNCATE TABLE  cazadores");
	$result = $mysqli->query("TRUNCATE TABLE  plan");
	//lee json

	echo("<p> leido </p>");
	
	forEach($batidas as $batida){
		$tempo = $batida->temporada;
		$anho  = $batida->anho;
		$mes = $batida->mes;
		$dia  = $batida->dia;
		$diasem  = $batida->diasem;
		$cuartel  = $batida->cuartel;
		$festivo  = $batida->festivo;
		$lista  = $batida->lista;
		$batidan  = $batida->batida;
		$remolque = $batida->remolque;
		$remolCoche = $batida->remolCoche;
		$remolque1 = $batida->remolque1;
		$remolque2 = $batida->remolque2;
		$comida  = $batida->comida;
		$pcomida  = $batida->preparaComida;
		$GrupoBatidas  = $batida->soloCoche;
		
		echo("<p>");
		printf("batida del %d de %d ",$dia ,$mes);
		printf("remolque = %s",$remolque);
		echo("</p>");
		/*
			echo("<p>");
		printf("comida %s ",$relleno);
		echo("</p>");
		*/
		$resultado = $mysqli->query("INSERT INTO batidas VALUES('$tempo','$anho','$mes','$dia','$batidan','$diasem','$cuartel','$festivo','$lista','$remolque','$remolque1','$remolque2','$remolCoche','$comida','$pcomida',3,'$GrupoBatidas')");
		
		echo("<p>");printf($resultado);	echo("</p>");
		
	}
	
	echo("<p> leido cazadores</p>");
	$matcaza = array();
	$result = $mysqli->query("SELECT * FROM cazadores");
	$i=0;
	while($row = mysqli_fetch_array($result))
    {
        $matcaza[$i] = $row['cazador'];
        $i++;
    }
	forEach($cazadores as $hunter){
		
		$cazador = $hunter->cazador;
		$coche = $hunter->coche;
		$abrevia = $hunter->abreviatura;
		$clave = $hunter->clave;
		$nivel = $hunter->nivel;
		$grupoBat = $hunter->grupoBat;
		echo($cazador);
		if (in_array($cazador,$matcaza)){
				echo("<p> en matriz </p>");
		}else{
				$resultado = $mysqli->query("INSERT INTO cazadores VALUES('$cazador','$coche','$abrevia','$clave','$nivel','$grupoBat')");
		}
	}	
/*	
	$consulta="select * from tabla where campo=".$campo;
$resultado=mysql_query($consulta) or die (mysql_error());
if (mysql_num_rows($resultado)>0)
	
	
*/	
	echo("<p> leido plan</p>");
	forEach ($plan as $iPlan) {
		$monteria = $iPlan->monteria;
		$cazador = $iPlan->cazador;
		$permiso = $iPlan->permiso;
		$acude = $iPlan->acude;
		$remolque_coche = $iPlan->remolque_coche;
		
		
		$resultado = $mysqli->query("SELECT * FROM plan WHERE cazador = '$cazador' and monteria = '$monteria'");
		if (mysqli_num_rows($resultado)==0){
				$resultado = $mysqli->query("INSERT INTO plan VALUES('$cazador','$monteria','$permiso','$acude','$remolque_coche')");
		}
	}
	
	
	
	
	
	
	
	
	
	
	
	
	echo("<p> Terminado </p>");
$mysqli->close();

?>

</body>
</html>