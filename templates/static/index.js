const pO="!@#$%^&*()_+1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const pOL = pO.length;
function randomPassword(length){
	let out = "";
	for(let i=0;i<length;i++){out+=pO.charAt(Math.floor(Math.random()*pOL));}
	return out;
}

const disable={
	sign:(temp)=>{document.getElementById("signBtn").disabled=temp;},
	add:(temp)=>{document.getElementById("addBtn").disabled=temp;},
	search:(temp)=>{document.getElementById("searchBtn").disabled=temp;},
}
function setTab(i){
	if(i==0){}
	else if(i==1){}
	else if(i==2){}
};

let signed=false;
let signing=false;
function ajax_signIn_cookies(){
	if(signed) setTab(1)
	else if(!signing){
		disable.sign(true);
		signing=true;
		$.ajax({type:"GET",url:"sign/",
			success:(res)=>{
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
			error:(err)=>{
				disable.sign(false);
				signing=false;
			}
		});
	}
};

let adding=false;
let searching=false;

$(document).ready(()=>{
	setTab(0);
	ajax_signIn_cookies();

	$("#signForm").submit((e)=>{
		if(signed) setTab(1);
		else if(!signing){
			e.preventDefault();
			disable.sign(true);
			signing=true;
			$.ajax({type:"POST",url:"sign/",data:$(this).serialize(),
				success:(res)=>{
					if(res.code==200){
						signed=true;
						setTab(1);
						signing=false;
						disable.sign(false);
						$("#signForm")[0].reset();
					}
					else{
						signing=false;
						disable.sign(false);
					}
				},
				error:(err)=>{
					signing=false;
					disable.sign(false);
				}
			});
		}
	});
	$("#addForm").submit((e)=>{
		if(!adding){
			adding=true;
			e.preventDefault();
			disable.add(true);
			$.ajax({type:"GET",url:"add/",data:$(this).serialize(),
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
	$("#searchForm").submit((e)=>{
		if(!searching){
			searching=true;
			e.preventDefault();
			disable.search(true);
			$.ajax({type:"GET",url:"search/",data:$(this).serialize(),
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
});