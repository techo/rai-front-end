<?php

	class GeneradorDeArchivosCsv {

		function bajarCsv($nids){


			header('Content-Type: application/octet-stream');
			header("Content-Transfer-Encoding: UTF-8");
			header("Content-disposition: attachment; filename=\"fichero.csv\"");


			//LINKS DE ARCHIVOS PARA COMPARAR
			$archivoParaBuscarNids2016 = '/r2016.json';
			$archivoParaBuscarNids2013 = '/r2013.json';

			//PARSEO LOS NIDS
			//$jsonNids = file_get_contents($nids);
			$arrayDelJson = json_decode($nids, true);
			//PARSEO NIDS 2016
			$archivoParaBuscarNids2016 = file_get_contents($archivoParaBuscarNids2016);
			$archivoParaBuscarNids2016 = json_decode($archivoParaBuscarNids2016, true);
			//PARSEO NIDS 2013
			$archivoParaBuscarNids2013 = file_get_contents($archivoParaBuscarNids2013);
			$archivoParaBuscarNids2013 = json_decode($archivoParaBuscarNids2013, true);


			//BUSCO NIDS 2013/2016 EN JSON 2013/1016
			$i = 0;
			foreach($arrayDelJson as $barrios => $anios){
				foreach($anios as $keyAnio => $anio){
					foreach($anio as $nodo){
						if($keyAnio == 2016){
							$posicionDelNodo = $nodo["nid"];
							if(isset($archivoParaBuscarNids2016[$posicionDelNodo])){
								$acumuladorDeNidsPorAnio2016["barrios"][$i] = $archivoParaBuscarNids2016[$posicionDelNodo];
								$acumuladorDeNidsPorAnio2016["barrios"][$i]["anio"] = $keyAnio;
								$i++;
							}
						}elseif($keyAnio == 2013){
							$posicionDelNodo = $nodo["nid"];
							if(isset($archivoParaBuscarNids2013["barrios_2013"][$posicionDelNodo])){
								$acumuladorDeNidsPorAnio2016["barrios"][$i] = $archivoParaBuscarNids2013["barrios_2013"][$posicionDelNodo];
								$acumuladorDeNidsPorAnio2016["barrios"][$i]["anio"] = $keyAnio;
								$i++;
							}
						}
					}
				}
			}

			$fp = fopen("php://output", 'w');

			//GENERO EL CSV PARA BAJAR
			$y = 0;
			foreach($acumuladorDeNidsPorAnio2016 as $key => $campos){
		    foreach($campos as $key2 => $campo){
		    	foreach($campo as $keysInternas => $intraCampo){
						if($y == 0){
					    $acumuladorDeKeys[] = $keysInternas;
						}
		    	}
		    	if($y == 0){
		    		fputcsv($fp, $acumuladorDeKeys);
		    	}
			    fputcsv($fp, $campo);
		    	$y++;
		    }
			}

			fclose($fp);

		}

	}

	$nids = $_POST["downloadRequest"];
	$GeneradorDeArchivosCsv = new GeneradorDeArchivosCsv;
	$GeneradorDeArchivosCsv->bajarCsv($nids);
?>
