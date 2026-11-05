var myObj,  txt ;
var diasem_1=["L","M","X","J","V","S","D"];
var diasem_2=["Lun","Mar","Mie","Jue","Vie","Sab","Dom"];
var diasem3,hayGraf;
var cazador;
var clave;
var nivel;
var anhoHoy,diaHoy,mesHoy;
var fechaHoy;
var idHoy;
var batida = [];
var coche ="";
var conductor = false;
var abreviaEsteCaz = "";
var cazadores=[];
var abrevia=[];
var cazAcude = {};
var newBat = {};
var esAdmin;
var batidaEditada;
var indiceEditado;
var temporada;

function carga(){	
	fechaHoy = new Date();
	anhoHoy = fechaHoy.getFullYear();
	mesHoy = fechaHoy.getMonth();
	temporada = anhoHoy;
	if (mesHoy < 3) temporada--; //el mes va de 0 a 11
	//alert(temporada);
	cazador = localStorage.getItem("cazador"); 
	//alert(cazador);
	clave = localStorage.getItem("claveCazador"); 
	if ((cazador==null) || (clave==null)){		
		window.location="input1.html"; 	
	}else{
		$.post("susCaz.php",
        {
		  cazador: cazador,
          clave: clave		
        },
		function(data,status){
			if (data == "true"){				
				//alert(data);
				cargaLista();
				 	
			}else{
				//alert(data);
				window.location="input1.html"; 	
				
			}
		});		
	}	
}
function cargaSinUsuario(){	
	fechaHoy = new Date();
	anhoHoy = fechaHoy.getFullYear();
	mesHoy = fechaHoy.getMonth();
	temporada = anhoHoy;
	if (mesHoy < 3) temporada--; //el mes va de 0 a 11
	//alert(temporada);
	cazador = localStorage.getItem("NoCaza"); 
	clave = localStorage.getItem("NoClave"); 
	if ((cazador==null) || (clave==null)){		
		window.location="input1.html"; 	
	}else{
		$.post("susCaz.php",
        {
		  cazador: cazador,
          clave: clave		
        },
		function(data,status){
			if (data == "true"){				
				//alert(data);
				cargaLista();
				 	
			}else{
				//alert(data);
				window.location="input1.html"; 	
				
			}
		});		
	}	
}
function entradaCazador(){	
	_cazador = document.getElementById("cazador").value;
	//alert(_cazador);
	_clave = document.getElementById("clave").value;
	//alert("enviando");
	$.post("susCaz.php",
        {
		  cazador: _cazador,
          clave: _clave		
        },
        function(data,status){
			//alert(data);
			if (data == "true"){
				cazador = _cazador;    clave = _clave ;
				
				localStorage.setItem("cazador",_cazador);
				localStorage.setItem("claveCazador",_clave);
				window.location="index.html"; 	
			}else{
				//alert(data);
			}
		});
	
}
function cargaLista(){
		$.post("sus.php",
        {
		  cazador: cazador,
          clave: clave		
        },
        function(data,status){			
			muestraLista(data);	
			
			window.location.hash = "#" + idHoy;	
		
		});
}
function listaCazadores(){
		$.post("susListaCaz.php",
        {
		  cazador: cazador,
          clave: clave		
        },
        function(data,status){			
			alert(data);
		});
}

function muestraLista(data){
	//alert(data);
	myObj = JSON.parse(data);
	txt = "";
	hayGraf = false;
	idHoy = "";
	
	//********************lee cazadores**********************
	c = myObj.length-1
	coche = myObj[c].coche;
	nivel = myObj[c].nivel;
	conductor = ((nivel & 2) == 2);
	esAdmin = ((nivel & 4) == 4);
	for (l=0;l<myObj[c].caza.length;l++){	
		abrevia[l] = myObj[c].abrevia[l];
		cazadores[l] = myObj[c].caza[l];
		if (cazadores[l].toLowerCase() == cazador.toLowerCase()){
			abreviaEsteCaz = abrevia[l];
		}
	}
	//alert(cazador + "_" +abreviaEsteCaz);
	//***********************************************************			
	txt= "<div class='w3-panel w3-lime'>" +
		"<input class='w3-button w3-round w3-white' type='button' value='Nueva batida' onClick = 'nuevaOutOfPachis()'>" +
			
		"</div>";		
	for (c = 0; c <myObj.length-1;c++){
		batida[c] = myObj[c].bat;
		dtB = new Date(myObj[c].anho ,myObj[c].mes-1 , myObj[c].dia );
		//alert(dtB);
		esteId = "bat"+c;
		if (dtB < fechaHoy){
				txt = txt + "<div class='w3-panel w3-white'";
		}else{
			if (idHoy == "") idHoy = esteId;						
			
			var l = myObj[c].acuden.length;
			var acudoYo = false;
			for (h = 0; h <l;h++){
				if (myObj[c].acuden[h] == abreviaEsteCaz) acudoYo = true;
				
			}
			
			if (acudoYo){				
				if (dtB.getDay() == 0){					
					txt = txt + "<div class='w3-panel w3-orange'";
				}else{					
					if (myObj[c].festivo == 1){
						txt = txt + "<div class='w3-panel w3-orange'";
					}else{
						txt = txt + "<div class='w3-panel w3-khaki'";
					}
				}
			}else{
				if (myObj[c].privado) {
					txt = txt + "<div class='w3-panel w3-lime";
				}else{
					txt = txt + "<div class='w3-panel w3-light-grey'";
				}
			}
		}
		
		txt = txt + " id='"+esteId+"'";
		
		st = " onclick=\"pulsaLista('" +esteId + "')\">";				
		//alert(st);
		txt = txt + st;
		
		switch(myObj[c].lista){
			case "1":
				txt = txt + "<img src = 'images/l_18rojo.png'>";
				hayGraf = true;
				break;
			case "2":
				txt = txt + "<img src = 'images/l_18_2.png'>";
				hayGraf = true;
				break;
		}
		if (myObj[c].remolque_coche == "1"){
			txt = txt + "<img src = 'images/r_18.png'>";
			hayGraf = true;
		}
		if (hayGraf) txt = txt + "<br>";
		txt = txt+ "<font color = 'black' ><b>";
		if (myObj[c].mes != 6){
			txt = txt + myObj[c].dia + "/" + myObj[c].mes ;
			diasem3 = diasem_1.indexOf(myObj[c].diasem);
			if (diasem3 != -1){
				txt = txt + " " +  diasem_2[diasem3];
			}
		}else{
		txt = txt + "Aplazada";	
		}
		txt = txt + "</b></font><br>";			
		txt = txt + myObj[c].cuartel+ "<br>";
		
		l = myObj[c].acuden.length;					
		for (h = 0; h <l;h++){
			txt = txt +"<span class='w3-tag w3-small w3-round w3-light-green'>" +
			myObj[c].acuden[h]+ "</span>"
		}				
		txt = txt + "</div>" ;					
	}
		//alert(txt);	
	document.getElementById("conten").innerHTML = txt;
}

function editFec(){
	if (esAdmin){
		c = indiceEditado;
		txt = "<h2>" + myObj[c].cuartel + "</h2>" ;
		
		document.getElementById('cuartelFec').innerHTML = txt;
		
		document.getElementById('cuartelcambia').value = myObj[c].cuartel;
		tempo2 = temporada + 1;
		//alert(tempo2)
		txt ="<br><input type='date' name ='fecha'  min ='" + temporada.toString() +
		"-09-01' max = '" + tempo2.toString() +"-02-28' value = '"+
		myObj[c].anho.toString() + "-" 
		st = myObj[c].mes.toString();
		if (st.length == 1)st = "0" + st;
		txt = txt+ st + "-";
		st = myObj[c].dia.toString();
		if (st.length == 1)st = "0" + st;
		txt = txt+ st + "' + id = 'campoFecha'><br>";		
		//alert (txt)
		document.getElementById('panelFecha').innerHTML = txt;			
		document.getElementById('unaBatida').style.display='none';
		document.getElementById('fechaBatida').style.display='block';	
	}

}
function fechaCambia(){	
	fecst = document.getElementById('campoFecha').value;
	fecMat = fecst.split("-");
	var fecha = new Date(fecMat[0],fecMat[1]-1,fecMat[2]);
	fechaUpdate(fecha);
	
}
function fechaUpdate(fecha){
	//alert("fechaupdate");
	cazAcude["batida"] =  myObj[indiceEditado].batida;
	
	cazAcude["cuartel"] = document.getElementById('cuartelcambia').value;
	
	//alert(cazAcude["cuartel"]);
	cazAcude["anho"] = fecha.getFullYear();
	cazAcude["mes"] = fecha.getMonth() + 1;
	cazAcude["dia"] = fecha.getDate();	
	diaSem = fecha.getDay();
	festivo = 0;
	if (diaSem == 0){
		diaSem = 7;
		festivo = 1;
	} 
	cazAcude["diasem"] = diasem_1[diaSem-1];
	cazAcude["festivo"] = festivo;
	
	var myJSON = JSON.stringify(cazAcude,2);
	//alert(myJSON);
	$.post("susFec.php",myJSON,function(data,status){			
			//alert(data);
		});	
	document.getElementById('fechaBatida').style.display='none';
	cargaLista();	
}
function suspende(){
	
	
	document.getElementById('campoFecha').style.display='none';
	var fecha = new Date(temporada+1,5,1);
	fechaUpdate(fecha);
	
	
	
	
}
function pulsaLista(vId){	
		c = parseInt(vId.substring(3));	
		indiceEditado = c;
		batidaEditada = myObj[c].batida;
		cazAcude["batida"] =  myObj[c].batida;
		txt = "";
		//txt = "<DIV id = 'dateBat' onClick = 'editFec()'>";
		txt = txt +"<h2>" + myObj[c].dia + "/" + myObj[c].mes ;
		diasem3 = diasem_1.indexOf(myObj[c].diasem);
				if (diasem3 != -1){
					txt = txt + " " +  diasem_2[diasem3];
				}
		//txt = txt + "</DIV>";
		txt = txt + "<br>" +  myObj[c].cuartel + "</h2>";
		if (myObj[c].privado == 0){
			txt = txt + "<p>Remolq: " +  myObj[c].remolque + "&nbsp;" + myObj[c].remolque2 + "</p>";
			document.getElementById('cuartel').innerHTML = txt;
			txt = "";
			for(a=0;a<abrevia.length;a++ ){
				txt = txt + "<p><input class='w3-check' type='checkbox' ";
				txt = txt + " id = '" +abrevia[a] + "' ";
				for(i=0;i<myObj[c].acuden.length;i++ ){
					if (myObj[c].acuden[i] == abrevia[a]) txt = txt + "checked='checked' ";
				}
				//alert (cazadores[a]+" " +cazador);
				if ((!conductor)&&( cazadores[a].toLowerCase()!=cazador.toLowerCase())){txt = txt + "disabled = 'true'"}		
				
				txt = txt + "> 	<label>" + cazadores[a] + "</label></p>";
			}
		}else{
			document.getElementById('cuartel').innerHTML = "";
		}
		document.getElementById('cazCheck').innerHTML = txt;		
		document.getElementById('unaBatida').style.display='block';
		
}			
function editAcepta(){
	if (myObj[indiceEditado].privado == 0){
		for(a=0;a<abrevia.length;a++ ){
			var x = document.getElementById(abrevia[a]).checked;
			if (x){
			cazAcude[cazadores[a]] = 1} else {cazAcude[cazadores[a]] = 0}					
		}	
		var myJSON = JSON.stringify(cazAcude,2);
		//alert(myJSON);
		$.post("susEdit.php",myJSON,function(data,status){			
				//alert(data);
			});
    }    
	document.getElementById('unaBatida').style.display='none';
	cargaLista();
}
function batidaNueva(){
	//alert("Añade batida")
	tempo2 = temporada + 1;
		//alert(tempo2)
		txt ="<br><input type='date' name ='fecha'  min ='" + temporada.toString() +
		"-09-01' max = '" + tempo2.toString() +"-02-28' value = '"+
		myObj[c].anho.toString() + "-" 
		st = myObj[c].mes.toString();
		if (st.length == 1)st = "0" + st;
		txt = txt+ st + "-";
		st = myObj[c].dia.toString();
		if (st.length == 1)st = "0" + st;
		txt = txt+ st + "' + id = 'campoFechaNueva'><br>";		
		//alert (txt)
		document.getElementById('panelFechaNueva').innerHTML = txt;
	document.getElementById('fechaBatida').style.display='none';
	document.getElementById('nuevaBatida').style.display='block';
}
function nuevaCancela(){
	//alert("Añade batida")
	
	document.getElementById('nuevaBatida').style.display='none';
}
function nuevaAcepta(){	
	cuartelst = document.getElementById('cuartelNuevo').value;
	fecst = document.getElementById('campoFechaNueva').value;
	fecMat = fecst.split("-");
	var fecha = new Date(fecMat[0],fecMat[1]-1,fecMat[2]);
	diaSem = fecha.getDay();
	festivo = 0;
	if (diaSem == 0){
		diaSem = 7;
		festivo = 1;
	} 
	newBat["temporada"] = 18;
	newBat["anho"] = fecha.getFullYear();
	newBat["mes"] = fecha.getMonth() + 1;
	newBat["dia"] = fecha.getDate();	
	newBat["diasem"] = diasem_1[diaSem-1];
	newBat["festivo"] = festivo;	
	newBat["cuartel"] = cuartelst;
	
	
	var myJSON = JSON.stringify(newBat,2);
	//alert(myJSON);
	$.post("susNewBatida.php",myJSON,function(data,status){			
			//alert(data);
		});		
	
	document.getElementById('nuevaBatida').style.display='none';
	cargaLista();
}
function nuevaOutOfPachis(){
	
	//c = indiceEditado;
	
	tempo2 = temporada + 1;
		//alert(tempo2)
		txt ="<br><input type='date' name ='fecha'  min ='" + temporada.toString() +
		"-09-01' max = '" + tempo2.toString() +"-02-28' " //value = '"+
		/*
		myObj[c].anho.toString() + "-" 
		st = myObj[c].mes.toString();
		if (st.length == 1)st = "0" + st;
		txt = txt+ st + "-";
		st = myObj[c].dia.toString();
		if (st.length == 1)st = "0" + st;
		*/
		
		//txt = txt+ st + "' + id = 'campoFechaNueva'><br>";	
		txt = txt+  "  id = 'campoFechaNuevaOUT'><br>";	
		//alert (txt)
	document.getElementById('panelFechaNuevaOut').innerHTML = txt;	
	document.getElementById('nuevaBatidaOutOfPachis').style.display='block';
}	

function nuevaOutAcepta(){
	cuartelst = document.getElementById('cuartelNuevoOUT').value;
	fecst = document.getElementById('campoFechaNuevaOUT').value;
	fecMat = fecst.split("-");
	var fecha = new Date(fecMat[0],fecMat[1]-1,fecMat[2]);
	diaSem = fecha.getDay();
	festivo = 0;
	if (diaSem == 0){
		diaSem = 7;
		festivo = 1;
	} 
	newBat["temporada"] = temporada;
	newBat["anho"] = fecha.getFullYear();
	newBat["mes"] = fecha.getMonth() + 1;
	newBat["dia"] = fecha.getDate();	
	newBat["diasem"] = diasem_1[diaSem-1];
	newBat["festivo"] = festivo;	
	newBat["cuartel"] = cuartelst;
	newBat["cazador"] = cazador;
	
	
	var myJSON = JSON.stringify(newBat,2);
	//alert(myJSON);
	$.post("susNewBatidaOut.php",myJSON,function(data,status){			
			//alert(data);
		});		
	document.getElementById('nuevaBatidaOutOfPachis').style.display='none';
	cargaLista();
}
function nuevaOutCancela(){
	document.getElementById('nuevaBatidaOutOfPachis').style.display='none';
	//alert("ca");
}