// helpfull functions
const pO="!@#$%^&*(){}[]_+-.,;:1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const pOL=pO.length;
function randomPassword(length){
	let out="";
	for(let i=0;i<length;i++){out+=pO.charAt(Math.floor(Math.random()*pOL));}
	return out;
};
function randomPin(length){
	let out="";
	for(let i=0;i<length;i++){out+=Math.floor(Math.random()*10);}
	return out;
};

function copyInputToClipboard(eId){
	navigator.clipboard.writeText(document.getElementById(eId).value)
		.catch(err=>{alert(`ERROR copyInputToClipboard`)});
};
function copyDataToClipboard(data){
	navigator.clipboard.writeText(data)
		.catch(err=>{alert(`ERROR copyDataToClipboard`)});
}

// tabs
const disable={
	sign:temp=>{document.getElementById("signBtn").disabled=temp;},
	add:temp=>{document.getElementById("addBtn").disabled=temp;},
	search:temp=>{document.getElementById("searchBtn").disabled=temp;}
};
function setTab(tab1){
	if(tab1){
		document.getElementById("tab1").style.display="block";
		document.getElementById("tab2").style.display="none";
	}
	else{
		document.getElementById("tab1").style.display="none";
		document.getElementById("tab2").style.display="block";
	}
};
function setSubtab(tab1){
	if(tab1==0){
		document.getElementById("tab21").style.display="block";
		document.getElementById("tab22").style.display="none";
		document.getElementById("tab23").style.display="none";
	}
	else if(tab1==1){
		document.getElementById("tab21").style.display="none";
		document.getElementById("tab22").style.display="block";
		document.getElementById("tab23").style.display="none";
	}
	else if(tab1==2){
		document.getElementById("tab21").style.display="none";
		document.getElementById("tab22").style.display="none";
		document.getElementById("tab23").style.display="block";
	}
};

// signing
let signed=false;
let signing=false;
function ajax_signIn_cookies(){
	if(signed) setTab(false)
	else if(!signing){
		disable.sign(true);
		signing=true;
		$.ajax({type:"GET",url:"sign/",
			success:res=>{
				if(res.code==200){
					signed=true;
					setTab(1);
					signing=false;
					disable.sign(false);
				}
				else{
					signing=false;
					disable.sign(false);
				}
			},
			error:err=>{
				disable.sign(false);
				signing=false;
			}
		});
	}
};

// searching
let searching=false;

const noneResult="";
function makeResult(i){return`<p>${i}</p>`;};
function makeQaResult(e){
	if (e.q1 || e.a1 || e.q2 || e.a2 || e.q3 || e.a3) {
		return `<table border="1">
<tr><th>Questions</th><th>Answers</th></tr>
<tr><th>
	<button type="button"onClick="copyDataToClipboard('${e.q1}')">${(e.q1)?e.q1:noneResult}</button></th><th>
	<button type="button"onClick="copyDataToClipboard('${e.a1}')">${(e.a1)?e.a1:noneResult}</button></th></tr>
<tr><th>
	<button type="button"onClick="copyDataToClipboard('${e.q2}')">${(e.q2)?e.q2:noneResult}</button></th><th>
	<button type="button"onClick="copyDataToClipboard('${e.a2}')">${(e.a2)?e.a2:noneResult}</button></th></tr>
<tr><th>
	<button type="button"onClick="copyDataToClipboard('${e.q3}')">${(e.q3)?e.q3:noneResult}</button></th><th>
	<button type="button"onClick="copyDataToClipboard('${e.a3}')">${(e.a3)?e.a3:noneResult}</button></th></tr>
</table>`;
	}
}
function addResultsToDiv(results){
	const resultDiv = document.getElementById("results");
	resultDiv.innerHTML='';
	results.forEach((e,i)=>{
		const l_i=(e.i!=null)?e.i:noneResult;
		const l_a=(e.a!=null)?e.a:noneResult;
		const l_c=(e.c!=null)?e.c:noneResult;
		const l_p=(e.p!=null)?e.p:noneResult;
		const l_u=(e.u!=null)?e.u:noneResult;
		const l_e=(e.e!=null)?e.e:noneResult;
		const l_ph=(e.ph!=null)?e.ph:noneResult;
		const l_pi=(e.pi!=null)?e.pi:noneResult;
		const l_s=(e.s!=null)?e.s:noneResult;

		resultDiv.innerHTML+=`<div class="result">
	<div>
		<p id="res-i${i}">${l_i}</p>
		<div>${l_c}</div>
		<button id="res-a${i}">${l_a}</button><br><br>
	</div>
	<div>
		<table border="1">
			<tr><th>
				<p>Account Name</p></th><th>
				<button id="res-p${i}"onClick="copyDataToClipboard('${l_p}')">Copy</button></th></tr>
			<tr><th>
				<p>Username</p></th><th>
				<button id="res-u${i}"onClick="copyDataToClipboard('${l_u}')">Copy</button></th></tr>
			<tr><th>
				<p>Email</p></th><th>
				<button id="res-e${i}"onClick="copyDataToClipboard('${l_e}')">Copy</button></th></tr>
			<tr><th>
				<p>Phone</p></th><th>
				<button id="res-ph${i}"onClick="copyDataToClipboard('${l_ph}')">Copy</button></th></tr>
			<tr><th>
				<p>Pin</p></th><th>
				<button id="res-pi${i}"onClick="copyDataToClipboard('${l_pi}')">Copy</button></th></tr>
			<tr><th>
				<p>String</p></th><th>
				<button id="res-s${i}"onClick="copyDataToClipboard('${l_s}')">Copy</button></th></tr>
		</table>
	</div>
	<div>
		${makeQaResult(e)}
	</div>
</div>`;
	resultDiv.innerHTML+="<hr>";
	});
};

// adding


let adding=false;

$(document).ready(()=>{
	setTab(!signed);
	setSubtab(0);
	ajax_signIn_cookies();

	// signing
	$("#signForm").submit(e=>{
		if(signed) setTab(false);
		else if(!signing){
			e.preventDefault();
			disable.sign(true);
			signing=true;
			$.ajax({type:"POST",url:"sign/",data:$(this).serialize(),
				success:res=>{
					if(res.code==200){
						signed=true;
						setTab(false);
						signing=false;
						disable.sign(false);
						$("#signForm")[0].reset();
					}
					else{
						signing=false;
						disable.sign(false);
					}
				},
				error:err=>{
					signing=false;
					disable.sign(false);
				}
			});
		}
	});

	// tabs
	document.getElementById("tab1Btn").addEventListener("click",()=>{setSubtab(0);});
	document.getElementById("tab2Btn").addEventListener("click",()=>{setSubtab(1);});
	
	// searching
		// clears
	document.getElementById("search-clear").addEventListener("click",()=>{
		document.getElementById("searchName").value="";
		document.getElementById("searchUser").value="";
		document.getElementById("searchEmail").value="";
		document.getElementById("searchPhone").value="";
		document.getElementById("searchPin").value="";
	});

	document.getElementById("searchName-clear").addEventListener("click",()=>{document.getElementById("searchName").value="";});
	document.getElementById("searchUser-clear").addEventListener("click",()=>{document.getElementById("searchUser").value="";});
	document.getElementById("searchEmail-clear").addEventListener("click",()=>{document.getElementById("searchEmail").value="";});
	document.getElementById("searchPhone-clear").addEventListener("click",()=>{document.getElementById("searchPhone").value="";});
	document.getElementById("searchPin-clear").addEventListener("click",()=>{document.getElementById("searchPin").value="";});

	document.getElementById("searchClear").addEventListener("click",()=>{document.getElementById("results").innerHTML="";});

	addResultsToDiv([{
		i: 0,
		a: "Steam",
		p: "password",
		
		u: "Das Boot",
		e: "dasboot@gmail.com",
		ph: "1234567890",
		
		pi: "123456",
		s: "turtle macro funtime happy attack",
		
		q1: "q1",
		a1: "a1",
		q2: "q2",
		a2: "a2",
		q3: "q3",
		a3: "a3",
		
		c:"10/20/2023 15:48"
	},{
		i: 1,
		a: "Apple",
		p: "password",
		
		u: "Das Boot",
		e: "dasboot@gmail.com",
		ph: "1234567890",
		
		pi: "123456",
		s: "turtle macro funtime happy attack",
		
		q1: "q1",
		a1: "a1",
		q2: "q2",
		a2: "a2",
		q3: "q3",
		a3: "a3",
		
		c:"10/20/2023 15:48"
	},{
		i: 2,
		a: "Rappers",
		p: "password",
		
		u: "Das Boot",
		e: "dasboot@gmail.com",
		ph: "1234567890",
		
		pi: "123456",
		s: "turtle macro funtime happy attack",
		
		q1: "q1",
		a1: "a1",
		q2: "q2",
		a2: "a2",
		q3: "q3",
		a3: "a3",
		
		c:"10/20/2023 15:48"
	}]);

	$("#searchForm").submit(f=>{
		if(!searching){
			searching=true;
			f.preventDefault();
			disable.search(true);
			
			let formDataArray=$(this).serializeArray();
			formDataArray.filter(e=>{return e.value!=='';});
			formDataArray=$.param(formDataArray);
			
			$.ajax({type:"POST",url:`search/${formDataArray}`,
				success:(res)=>{
					if(res.code==200){
						searching=false;
						disable.search(false);
					}
					else{
						searching=false;
						disable.search(false);
					}
				},
				error:(err)=>{
					searching=false;
					disable.search(false);
				}
			});
		}
	});

	// adding
		// copies
	document.getElementById("addPass-copy").addEventListener("click",()=>{copyInputToClipboard("addPass");});
	document.getElementById("addUser-copy").addEventListener("click",()=>{copyInputToClipboard("addUser");});
	document.getElementById("addEmail-copy").addEventListener("click",()=>{copyInputToClipboard("addEmail");});
	document.getElementById("addPhone-copy").addEventListener("click",()=>{copyInputToClipboard("addPhone");});
	document.getElementById("addString-copy").addEventListener("click",()=>{copyInputToClipboard("addString");});
	document.getElementById("addQ1-copy").addEventListener("click",()=>{copyInputToClipboard("addQ1");});
	document.getElementById("addA1-copy").addEventListener("click",()=>{copyInputToClipboard("addA1");});
	document.getElementById("addQ2-copy").addEventListener("click",()=>{copyInputToClipboard("addQ2");});
	document.getElementById("addA2-copy").addEventListener("click",()=>{copyInputToClipboard("addA2");});
	document.getElementById("addQ3-copy").addEventListener("click",()=>{copyInputToClipboard("addQ3");});
	document.getElementById("addA3-copy").addEventListener("click",()=>{copyInputToClipboard("addA3");});
	
		// randoms
	document.getElementById("addPass-rand").addEventListener("click",()=>{
		document.getElementById("addPass").value=randomPassword(parseInt(document.getElementById("addPass-rand-len").value));
	});

	document.getElementById("addPin-rand").addEventListener("click",()=>{
		document.getElementById("addPin").value=randomPin(parseInt(document.getElementById("addPin-rand-len").value));
	});

	document.getElementById("addQ1-rand").addEventListener("click",()=>{
		document.getElementById("addQ1").value=randomPassword(parseInt(document.getElementById("addQA-rand-len").value));
	});
	document.getElementById("addA1-rand").addEventListener("click",()=>{
		document.getElementById("addA1").value=randomPassword(parseInt(document.getElementById("addQA-rand-len").value));
	});
	document.getElementById("addQ2-rand").addEventListener("click",()=>{
		document.getElementById("addQ2").value=randomPassword(parseInt(document.getElementById("addQA-rand-len").value));
	});
	document.getElementById("addA2-rand").addEventListener("click",()=>{
		document.getElementById("addA2").value=randomPassword(parseInt(document.getElementById("addQA-rand-len").value));
	});
	document.getElementById("addQ3-rand").addEventListener("click",()=>{
		document.getElementById("addQ3").value=randomPassword(parseInt(document.getElementById("addQA-rand-len").value));
	});
	document.getElementById("addA3-rand").addEventListener("click",()=>{
		document.getElementById("addA3").value=randomPassword(parseInt(document.getElementById("addQA-rand-len").value));
	});

	$("#addForm").submit(f=>{
		if(!adding){
			adding=true;
			f.preventDefault();
			disable.add(true);
			
			let formDataArray=$(this).serializeArray();
			formDataArray.filter(e=>{return e.value!=='';});
			formDataArray=$.param(formDataArray);
			
			$.ajax({type:"GET",url:"add/",data:formDataArray,
				success:(res)=>{
					if(res.code==200){
						adding=false;
						disable.add(false);
						$("#addForm")[0].reset();
					}
					else{
						adding=false;
						disable.add(false);
					}
				},
				error:(err)=>{
					adding=false;
					disable.add(false);
				}
			});
		}
	});
});