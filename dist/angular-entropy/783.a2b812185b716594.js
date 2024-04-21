"use strict";(self.webpackChunkangular_entropy=self.webpackChunkangular_entropy||[]).push([[783],{7783:(Ct,U,a)=>{a.r(U),a.d(U,{DashboardModule:()=>u});var g,s,l=a(6895),m=a(4415),q=a(7618),t=a(1571),T=a(8566),S=a(4696),k=a(5227),n=a(433),x=a(301);function I(s,o){1&s&&(t.TgZ(0,"div",20),t._UZ(1,"div",21),t.TgZ(2,"div",22),t._UZ(3,"div",23),t.qZA()())}function J(s,o){if(1&s&&(t.TgZ(0,"button",24),t._uU(1,"Generate"),t.qZA()),2&s){const e=t.oxw();t.Q6J("disabled",!e.simulationCreateForm.valid)}}class p{constructor(o,e,i){this._fb=o,this._simulationService=e,this._alertService=i,this.simulationCreateForm=this._fb.group({name:[null,n.kI.required],maps_count:[null,[n.kI.min(1),n.kI.max(1e3),n.kI.required]],node_min:[null,[n.kI.min(1),n.kI.required]],node_max:[null,[n.kI.max(30),n.kI.required,this.greaterThan("node_min")]],is_public:[!1]}),this.loading=!1}onSubmit(){let o={name:this.simulationCreateForm.value.name,maps_count:this.simulationCreateForm.value.maps_count,node_min:this.simulationCreateForm.value.node_min,node_max:this.simulationCreateForm.value.node_max,is_public:this.simulationCreateForm.value.is_public};this.loading=!0,this._simulationService.createSimulation(o).subscribe(e=>{e.hasOwnProperty("error")||(this._alertService.success("Simulation successfully generated"),this.simulationCreateForm.reset({is_public:!1})),this.loading=!1})}greaterThan(o){return e=>{const i=e.parent;if(i){const r=i.get(o);return Number(r.value)>Number(e.value)?{lessThan:{value:e.value}}:null}return null}}}p.\u0275fac=function(o){return new(o||p)(t.Y36(n.qu),t.Y36(T.s),t.Y36(x.c))},p.\u0275cmp=t.Xpm({type:p,selectors:[["app-simulation-create"]],decls:29,vars:3,consts:[[1,"card"],[1,"card-body"],[1,"mb-4","text-center"],[1,"fa-solid","fa-gear"],[1,"mb-3",3,"formGroup","ngSubmit"],[1,"mb-2","form-check","form-switch"],["type","checkbox","role","switch","id","is_public","formControlName","is_public",1,"form-check-input"],["for","is_public",1,"form-label"],[1,"mb-3"],["for","name",1,"form-label"],["type","text","id","name","name","simulation_name","placeholder","Type a unique name","formControlName","name",1,"form-control"],["for","maps_count",1,"form-label"],["type","text","id","maps_count","name","simulation_maps_count","placeholder","Type a number between 1 and 1000","formControlName","maps_count",1,"form-control"],["for","node_min",1,"form-label"],["type","text","id","node_min","name","simulation_node_min","placeholder","Type a number above 1","formControlName","node_min",1,"form-control"],["for","node_max",1,"form-label"],["type","text","id","node_max","name","simulation_node_max","placeholder","Type a number equal or below 30","formControlName","node_max",1,"form-control"],[1,"text-center"],["class","row mt-3",4,"ngIf"],["class","btn btn-primary d-grid w-100 mb-3","type","submit",3,"disabled",4,"ngIf"],[1,"row","mt-3"],[1,"col-5"],[1,"col-2","ms-3"],[1,"custom-loader","text-center"],["type","submit",1,"btn","btn-primary","d-grid","w-100","mb-3",3,"disabled"]],template:function(o,e){1&o&&(t.TgZ(0,"div",0)(1,"div",1)(2,"h4",2),t._UZ(3,"i",3),t._uU(4," Generate Simulation"),t.qZA(),t.TgZ(5,"form",4),t.NdJ("ngSubmit",function(){return e.onSubmit()}),t.TgZ(6,"div",5),t._UZ(7,"input",6),t.TgZ(8,"label",7),t._uU(9,"Public Simulation"),t.qZA()(),t.TgZ(10,"div",8)(11,"label",9),t._uU(12,"Simulation Name:"),t.qZA(),t._UZ(13,"input",10),t.qZA(),t.TgZ(14,"div",8)(15,"label",11),t._uU(16,"Number of Concept Maps to generate:"),t.qZA(),t._UZ(17,"input",12),t.qZA(),t.TgZ(18,"div",8)(19,"label",13),t._uU(20,"Concept Map Minimum Nodes Count:"),t.qZA(),t._UZ(21,"input",14),t.qZA(),t.TgZ(22,"div",8)(23,"label",15),t._uU(24,"Concept Map Maximum Nodes Count:"),t.qZA(),t._UZ(25,"input",16),t.qZA(),t.TgZ(26,"div",17),t.YNc(27,I,4,0,"div",18),t.YNc(28,J,2,1,"button",19),t.qZA()()()()),2&o&&(t.xp6(5),t.Q6J("formGroup",e.simulationCreateForm),t.xp6(22),t.Q6J("ngIf",e.loading),t.xp6(1),t.Q6J("ngIf",!e.loading))},dependencies:[l.O5,n._Y,n.Fj,n.Wl,n.JJ,n.JL,n.sg,n.u],encapsulation:2});class _{constructor(o,e,i){this._fb=o,this._simulationService=e,this._router=i,this.searchSimulationEvent=new t.vpe,this.simulationSearchForm=this._fb.group({name:[null,n.kI.required]})}onSubmit(){this._router.navigateByUrl("/simulations/"+this.simulationSearchForm.value.name)}}_.\u0275fac=function(o){return new(o||_)(t.Y36(n.qu),t.Y36(T.s),t.Y36(m.F0))},_.\u0275cmp=t.Xpm({type:_,selectors:[["app-simulation-search"]],outputs:{searchSimulationEvent:"searchSimulationEvent"},decls:13,vars:2,consts:[[1,"card"],[1,"card-body"],[1,"mb-4","text-center"],[1,"fa-solid","fa-magnifying-glass"],[1,"mb-3",3,"formGroup","ngSubmit"],[1,"mb-3"],["for","maps",1,"form-label"],["type","text","id","name","name","simulation_name","formControlName","name","placeholder","Type a valid simulation name",1,"form-control"],["type","submit",1,"btn","btn-primary","d-grid","w-100",3,"disabled"]],template:function(o,e){1&o&&(t.TgZ(0,"div",0)(1,"div",1)(2,"h4",2),t._UZ(3,"i",3),t._uU(4," Search Simulation"),t.qZA(),t.TgZ(5,"form",4),t.NdJ("ngSubmit",function(){return e.onSubmit()}),t.TgZ(6,"div",5)(7,"label",6),t._uU(8,"Simulation Name:"),t.qZA(),t._UZ(9,"input",7),t.qZA(),t.TgZ(10,"div",5)(11,"button",8),t._uU(12,"Search"),t.qZA()()()()()),2&o&&(t.xp6(5),t.Q6J("formGroup",e.simulationSearchForm),t.xp6(6),t.Q6J("disabled",!e.simulationSearchForm.valid))},dependencies:[n._Y,n.Fj,n.JJ,n.JL,n.sg,n.u],encapsulation:2}),(s=g||(g={}))[s.CREATE=0]="CREATE",s[s.UPDATE=1]="UPDATE",s[s.DELETE=2]="DELETE";var w=a(7315);function Y(s,o){1&s&&(t.TgZ(0,"div",12),t._UZ(1,"div",13),t.TgZ(2,"div",14),t._UZ(3,"div",15),t.qZA()())}function N(s,o){if(1&s&&(t.TgZ(0,"button",16),t._uU(1,"Create"),t.qZA()),2&s){const e=t.oxw();t.Q6J("disabled",!e.classroomCreateForm.valid)}}class f{constructor(o,e,i){this._fb=o,this._classroomService=e,this._alertService=i,this.classroomCreateForm=this._fb.group({name:[null,n.kI.required],size:[null,[n.kI.min(1),n.kI.max(2e3),n.kI.required]]}),this.loading=!1}onSubmit(){let o={name:this.classroomCreateForm.value.name,size:this.classroomCreateForm.value.size};this.loading=!0,this._classroomService.createClassroom(o).subscribe(e=>{e.hasOwnProperty("error")||(this._alertService.success("Class successfully created"),this._classroomService.updatedClassrooms$.emit(g.CREATE),this.classroomCreateForm.reset()),this.loading=!1})}}f.\u0275fac=function(o){return new(o||f)(t.Y36(n.qu),t.Y36(w.u),t.Y36(x.c))},f.\u0275cmp=t.Xpm({type:f,selectors:[["app-classroom-create"]],decls:17,vars:3,consts:[[1,"card"],[1,"card-body"],[1,"mb-4","text-center"],[1,"fa-solid","fa-school"],[1,"mb-3",3,"formGroup","ngSubmit"],[1,"mb-3"],["for","name",1,"form-label"],["type","text","id","name","name","classroom_name","placeholder","Type a unique name","formControlName","name",1,"form-control"],["type","text","id","name","name","classroom_size","placeholder","Type a number above 1 and below 2000","formControlName","size",1,"form-control"],[1,"text-center"],["class","row mt-3",4,"ngIf"],["class","btn btn-primary d-grid w-100 mb-3","type","submit",3,"disabled",4,"ngIf"],[1,"row","mt-3"],[1,"col-5"],[1,"col-2","ms-3"],[1,"custom-loader","text-center"],["type","submit",1,"btn","btn-primary","d-grid","w-100","mb-3",3,"disabled"]],template:function(o,e){1&o&&(t.TgZ(0,"div",0)(1,"div",1)(2,"h4",2),t._UZ(3,"i",3),t._uU(4," Create Class"),t.qZA(),t.TgZ(5,"form",4),t.NdJ("ngSubmit",function(){return e.onSubmit()}),t.TgZ(6,"div",5)(7,"label",6),t._uU(8,"Class Name:"),t.qZA(),t._UZ(9,"input",7),t.qZA(),t.TgZ(10,"div",5)(11,"label",6),t._uU(12,"Size (Max. number of students):"),t.qZA(),t._UZ(13,"input",8),t.qZA(),t.TgZ(14,"div",9),t.YNc(15,Y,4,0,"div",10),t.YNc(16,N,2,1,"button",11),t.qZA()()()()),2&o&&(t.xp6(5),t.Q6J("formGroup",e.classroomCreateForm),t.xp6(10),t.Q6J("ngIf",e.loading),t.xp6(1),t.Q6J("ngIf",!e.loading))},dependencies:[l.O5,n._Y,n.Fj,n.JJ,n.JL,n.sg,n.u],encapsulation:2});var A=a(2340);function L(s,o){1&s&&(t.TgZ(0,"div",7),t._UZ(1,"div",8),t.TgZ(2,"div",9),t._UZ(3,"div",10),t.qZA()())}function F(s,o){1&s&&(t.TgZ(0,"div")(1,"p",12),t._uU(2,"You are not subscribed to any class."),t.qZA()())}const y=function(s){return[s]};function Q(s,o){if(1&s&&(t.TgZ(0,"tr",12)(1,"td"),t._uU(2),t.qZA(),t.TgZ(3,"td"),t._uU(4),t.qZA(),t.TgZ(5,"td"),t._uU(6),t.qZA(),t.TgZ(7,"td"),t._UZ(8,"i",15),t.qZA()()),2&s){const e=o.$implicit;t.xp6(2),t.Oqu(e.name),t.xp6(2),t.AsE("",e.students_count,"/",e.size,""),t.xp6(2),t.Oqu(e.homeworks_count),t.xp6(2),t.Q6J("routerLink",t.VKq(5,y,"/classrooms/"+e._id.$oid))}}function D(s,o){if(1&s&&(t.TgZ(0,"table",13)(1,"thead")(2,"tr",12)(3,"th"),t._uU(4,"Name"),t.qZA(),t.TgZ(5,"th"),t._uU(6,"Students"),t.qZA(),t.TgZ(7,"th"),t._uU(8,"Active Homeworks"),t.qZA(),t._UZ(9,"th"),t.qZA()(),t.TgZ(10,"tbody"),t.YNc(11,Q,9,7,"tr",14),t.qZA()()),2&s){const e=t.oxw(3);t.xp6(11),t.Q6J("ngForOf",e.classrooms)}}function O(s,o){if(1&s&&(t.TgZ(0,"div"),t.YNc(1,F,3,0,"div",6),t.YNc(2,D,12,1,"table",11),t.qZA()),2&s){const e=t.oxw(2);t.xp6(1),t.Q6J("ngIf",0==e.classrooms.length),t.xp6(1),t.Q6J("ngIf",e.classrooms.length>0)}}function E(s,o){if(1&s&&(t.TgZ(0,"div",1)(1,"div",2)(2,"h4",3),t._UZ(3,"i",4),t._uU(4," Subscribed Classes List"),t.qZA(),t.YNc(5,L,4,0,"div",5),t.YNc(6,O,3,2,"div",6),t.qZA()()),2&s){const e=t.oxw();t.xp6(5),t.Q6J("ngIf",e.loading),t.xp6(1),t.Q6J("ngIf",!e.loading)}}function M(s,o){if(1&s){const e=t.EpF();t.TgZ(0,"div",17)(1,"button",21),t.NdJ("click",function(){t.CHM(e);const r=t.oxw(2);return t.KtG(r.downloadJson())}),t._UZ(2,"i",22),t._uU(3," Export"),t.qZA()()}}function H(s,o){1&s&&(t.TgZ(0,"div",7),t._UZ(1,"div",8),t.TgZ(2,"div",9),t._UZ(3,"div",10),t.qZA()())}function j(s,o){1&s&&(t.TgZ(0,"div")(1,"p",12),t._uU(2,"You have not created any class."),t.qZA()())}function z(s,o){if(1&s){const e=t.EpF();t.TgZ(0,"tr",12)(1,"td"),t._uU(2),t.qZA(),t.TgZ(3,"td"),t._uU(4),t.qZA(),t.TgZ(5,"td"),t._uU(6),t.qZA(),t.TgZ(7,"td")(8,"i",23),t.NdJ("click",function(){const c=t.CHM(e).$implicit,Zt=t.oxw(4);return t.KtG(Zt.copyLink(c.invite_token))}),t.qZA()(),t.TgZ(9,"td"),t._UZ(10,"i",15),t.qZA()()}if(2&s){const e=o.$implicit;t.xp6(2),t.Oqu(e.name),t.xp6(2),t.AsE("",e.students_count,"/",e.size,""),t.xp6(2),t.Oqu(e.homeworks_count),t.xp6(4),t.Q6J("routerLink",t.VKq(5,y,"/classrooms/"+e._id.$oid))}}function $(s,o){if(1&s&&(t.TgZ(0,"table",13)(1,"thead")(2,"tr",12)(3,"th"),t._uU(4,"Name"),t.qZA(),t.TgZ(5,"th"),t._uU(6,"Students"),t.qZA(),t.TgZ(7,"th"),t._uU(8,"Active Homeworks"),t.qZA(),t.TgZ(9,"th"),t._uU(10,"Invite Link"),t.qZA(),t._UZ(11,"th"),t.qZA()(),t.TgZ(12,"tbody"),t.YNc(13,z,11,7,"tr",14),t.qZA()()),2&s){const e=t.oxw(3);t.xp6(13),t.Q6J("ngForOf",e.classrooms)}}function P(s,o){if(1&s&&(t.TgZ(0,"div"),t.YNc(1,j,3,0,"div",6),t.YNc(2,$,14,1,"table",11),t.qZA()),2&s){const e=t.oxw(2);t.xp6(1),t.Q6J("ngIf",0==e.classrooms.length),t.xp6(1),t.Q6J("ngIf",e.classrooms.length>0)}}function G(s,o){if(1&s&&(t.TgZ(0,"div",1)(1,"div",2)(2,"div",16),t._UZ(3,"div",17),t.TgZ(4,"div",18)(5,"h4",19),t._UZ(6,"i",4),t._uU(7," Classes List"),t.qZA()(),t.YNc(8,M,4,0,"div",20),t.qZA(),t.YNc(9,H,4,0,"div",5),t.YNc(10,P,3,2,"div",6),t.qZA()()),2&s){const e=t.oxw();t.xp6(8),t.Q6J("ngIf",e.classrooms&&e.classrooms.length>0),t.xp6(1),t.Q6J("ngIf",e.loading),t.xp6(1),t.Q6J("ngIf",!e.loading)}}class v{constructor(o,e,i){this._classroomService=o,this._alertService=e,this._router=i,this.classrooms=[],this.loading=!1;let r=JSON.parse(localStorage.getItem("currentUserData"));r||this._router.navigate(["/users/auth"]),this.user=r,this._classroomService.updatedClassrooms$.subscribe(c=>{c==g.CREATE&&this.getClassrooms()})}ngOnInit(){this.getClassrooms()}getClassrooms(){this.loading=!0,this._classroomService.getClassrooms().subscribe(o=>{o.hasOwnProperty("error")||(this.classrooms=o,this.classrooms.sort((e,i)=>e.name.localeCompare(i.name))),this.loading=!1})}copyLink(o){if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(A.N.endpointUrl+"classrooms/invite/"+o).then(()=>this._alertService.success("Invite link copied successfully"));else{const e=document.createElement("textarea");e.value=A.N.endpointUrl+"classrooms/invite/"+o,e.style.position="absolute",e.style.left="-99999999px",document.body.prepend(e),e.select();try{document.execCommand("copy"),this._alertService.success("Invite link copied successfully")}catch(i){console.log(i)}finally{e.remove()}}}downloadJson(){let o=this.classrooms.map(r=>{const c=new Date(1e3*r.created_at);return{name:r.name,size:r.size,invite_token:r.invite_token,created_at:c.toLocaleDateString("en-GB",{year:"numeric",month:"2-digit",day:"2-digit"})+" - "+String(c.getHours()).padStart(2,"0")+":"+String(c.getMinutes()).padStart(2,"0"),students_count:r.students_count,homeworks_count:r.homeworks_count}}),e=JSON.stringify(o),i=document.createElement("a");i.setAttribute("href","data:text/json;charset=UTF-8,"+encodeURIComponent(e)),i.setAttribute("download","exported_classes_"+Date.now()+".json"),i.style.display="none",document.body.appendChild(i),i.click(),document.body.removeChild(i)}}function X(s,o){1&s&&(t.TgZ(0,"div",4)(1,"div",5),t._UZ(2,"div",6),t.qZA()())}function B(s,o){1&s&&(t.TgZ(0,"div",7)(1,"div",8)(2,"p",9),t._uU(3,"There seems to be nothing at the moment."),t.qZA()()())}v.\u0275fac=function(o){return new(o||v)(t.Y36(w.u),t.Y36(x.c),t.Y36(m.F0))},v.\u0275cmp=t.Xpm({type:v,selectors:[["app-classroom-list"]],decls:2,vars:2,consts:[["class","card",4,"ngIf"],[1,"card"],[1,"card-body"],[1,"mb-4","text-center"],[1,"fa-solid","fa-school"],["class","row mt-3",4,"ngIf"],[4,"ngIf"],[1,"row","mt-3"],[1,"col-5"],[1,"col-2","ms-3"],[1,"custom-loader","text-center"],["class","table table-hover",4,"ngIf"],[1,"text-center"],[1,"table","table-hover"],["class","text-center",4,"ngFor","ngForOf"],["title","Show class",1,"pe-clickable","fa-solid","fa-right-to-bracket",2,"color","darkgreen",3,"routerLink"],[1,"row"],[1,"col-3"],[1,"col-6","text-center"],[1,"mb-4","pt-2"],["class","col-3",4,"ngIf"],["type","button",1,"btn","btn-primary","w-100",3,"click"],[1,"fa-solid","fa-download","pe-clickable"],["title","Copy class invite link",1,"pe-clickable","fa-solid","fa-copy",3,"click"]],template:function(o,e){1&o&&(t.YNc(0,E,7,2,"div",0),t.YNc(1,G,11,3,"div",0)),2&o&&(t.Q6J("ngIf",0==e.user.role),t.xp6(1),t.Q6J("ngIf",1==e.user.role))},dependencies:[l.sg,l.O5,m.rH],encapsulation:2});const K=function(s){return[s]};function R(s,o){if(1&s&&(t.TgZ(0,"div",7)(1,"div",11)(2,"div",12)(3,"div",13)(4,"span",14),t._uU(5),t.qZA()(),t.TgZ(6,"div",15)(7,"span",16),t._uU(8),t.qZA()()(),t.TgZ(9,"p",17),t._uU(10),t.qZA(),t.TgZ(11,"p",18),t._uU(12),t.qZA(),t.TgZ(13,"p",19),t._uU(14),t.qZA()()()),2&s){const e=o.$implicit;t.xp6(1),t.Q6J("routerLink",t.VKq(8,K,"/classrooms/"+e._id.$oid)),t.xp6(4),t.hij("",e.homeworks_count," active homeworks"),t.xp6(3),t.AsE("",e.students_count," / ",e.size," students"),t.xp6(2),t.Oqu(e.name),t.xp6(2),t.AsE("",null==e.teacher?null:e.teacher.firstname," ",null==e.teacher?null:e.teacher.lastname,""),t.xp6(2),t.Oqu(null==e.teacher?null:e.teacher.email)}}function V(s,o){if(1&s&&(t.TgZ(0,"div",1),t.YNc(1,R,15,10,"div",10),t.qZA()),2&s){const e=t.oxw();t.xp6(1),t.Q6J("ngForOf",e.classrooms)}}class h{constructor(o,e,i){this._classroomService=o,this._alertService=e,this._router=i,this.classrooms=[],this.loading=!1;let r=JSON.parse(localStorage.getItem("currentUserData"));r||this._router.navigate(["/users/auth"]),this.user=r,this._classroomService.updatedClassrooms$.subscribe(c=>{c==g.CREATE&&this.getClassrooms()})}ngOnInit(){this.getClassrooms()}getClassrooms(){this.loading=!0,this._classroomService.getClassrooms().subscribe(o=>{o.hasOwnProperty("error")||(this.classrooms=o,this.classrooms.sort((e,i)=>e.name.localeCompare(i.name))),this.loading=!1})}copyLink(o){navigator.clipboard.writeText("http://localhost:4200/classrooms/invite/"+o).then(()=>this._alertService.success("Invite link copied successfully"))}}h.\u0275fac=function(o){return new(o||h)(t.Y36(w.u),t.Y36(x.c),t.Y36(m.F0))},h.\u0275cmp=t.Xpm({type:h,selectors:[["app-classroom-list-cards"]],decls:4,vars:3,consts:[["class","row mt-2 g-0",4,"ngIf"],[1,"mt-2"],["class","row",4,"ngIf"],["class","mt-2",4,"ngIf"],[1,"row","mt-2","g-0"],[1,"col-12","d-flex","align-items-center","justify-content-center"],[1,"ms-3","custom-big-loader","mt-5"],[1,"row"],[1,"col-12"],[1,""],["class","row",4,"ngFor","ngForOf"],[1,"card","card-class-list","mt-2","mb-3","rounded-4","p-3",3,"routerLink"],[1,"row","mb-2"],[1,"col-8"],[1,"badge","rounded-pill","text-bg-success","fw-normal"],[1,"col-4"],[1,"badge","rounded-pill","text-bg-secondary","fw-light"],[1,"text-black","fs-5","fw-light","mb-0"],[1,"text-grey","fs-6","fw-light","mb-0"],[1,"text-grey","fs-6","fw-lighter","mb-0"]],template:function(o,e){1&o&&(t.YNc(0,X,3,0,"div",0),t.TgZ(1,"div",1),t.YNc(2,B,4,0,"div",2),t.qZA(),t.YNc(3,V,2,1,"div",3)),2&o&&(t.Q6J("ngIf",e.loading),t.xp6(2),t.Q6J("ngIf",!e.loading&&0==e.classrooms.length),t.xp6(1),t.Q6J("ngIf",!e.loading&&e.classrooms.length>0))},dependencies:[l.sg,l.O5,m.rH],encapsulation:2});var W=a(4937),tt=a(427),et=a(1718);function ot(s,o){1&s&&(t.TgZ(0,"div",4)(1,"div",5),t._UZ(2,"div",6),t.qZA()())}function st(s,o){1&s&&(t.TgZ(0,"div",7)(1,"div",8)(2,"p",9),t._uU(3,"There seems to be nothing at the moment."),t.qZA()()())}const it=function(s){return[s]},nt=function(s,o){return{"text-bg-warning":s,"text-bg-success":o}};function at(s,o){if(1&s&&(t.TgZ(0,"div",7)(1,"div",11)(2,"div",12)(3,"div",8)(4,"span",13),t._uU(5),t.qZA()()(),t.TgZ(6,"div",14)(7,"div",15)(8,"p",16),t._UZ(9,"i",17),t._uU(10),t.ALo(11,"dateLabel"),t.qZA()(),t.TgZ(12,"div",18)(13,"p",16),t._UZ(14,"i",19),t._uU(15),t.ALo(16,"dateLabel"),t.qZA()()(),t.TgZ(17,"p",20),t._uU(18),t.qZA()()()),2&s){const e=o.$implicit,i=t.oxw(2);t.xp6(1),t.Q6J("routerLink",t.VKq(10,it,"/classrooms/"+e.classroom_id+"/homeworks/"+e._id.$oid)),t.xp6(3),t.Q6J("ngClass",t.WLB(12,nt,!e.status,e.status)),t.xp6(1),t.Oqu(i.getStatusLabel(e.status)),t.xp6(5),t.hij(" ",t.lcZ(11,6,e.start_datetime)," "),t.xp6(5),t.hij(" ",t.lcZ(16,8,e.expire_datetime)," "),t.xp6(3),t.Oqu(e.title)}}function rt(s,o){if(1&s&&(t.TgZ(0,"div",1),t.YNc(1,at,19,15,"div",10),t.qZA()),2&s){const e=t.oxw();t.xp6(1),t.Q6J("ngForOf",e.homeworks)}}class b{constructor(o,e,i){this._classroomHomeworkService=o,this._router=e,this._userService=i,this.active=!0,this.loading=!1,this.homeworks=[];let r=JSON.parse(localStorage.getItem("currentUserData"));r||this._router.navigate(["/users/auth"]),this.user=r}ngOnInit(){this.getClassroomHomeworks()}getClassroomHomeworks(){this.loading=!0,this._userService.getCurrentUserHomeworks(this.active).subscribe(o=>{if(!o.hasOwnProperty("error")){this.homeworks=o,this.homeworks.map(e=>{e.classroom_id=e.classroom_id.$oid});for(let e of this.homeworks)console.log("classrooms/"+e.classroom_id+"/homeworks/"+e._id.$oid);this.homeworks&&this.homeworks.sort((e,i)=>0==this.user.role?e.expire_datetime-i.expire_datetime:i.expire_datetime-e.expire_datetime)}this.loading=!1})}getStatusLabel(o){return o?"Completed":"To-do"}}b.\u0275fac=function(o){return new(o||b)(t.Y36(W.c),t.Y36(m.F0),t.Y36(tt.K))},b.\u0275cmp=t.Xpm({type:b,selectors:[["app-classroom-homework-list-cards"]],inputs:{active:"active"},decls:4,vars:3,consts:[["class","row mt-2 g-0",4,"ngIf"],[1,"mt-2"],["class","row",4,"ngIf"],["class","mt-2",4,"ngIf"],[1,"row","mt-2","g-0"],[1,"col-12","d-flex","align-items-center","justify-content-center"],[1,"ms-3","custom-big-loader","mt-5"],[1,"row"],[1,"col-12"],[1,""],["class","row",4,"ngFor","ngForOf"],[1,"card","card-class-list","mt-2","mb-3","rounded-4","p-3",3,"routerLink"],[1,"row","mb-2"],[1,"badge","rounded-pill","fw-light",3,"ngClass"],[1,"row","mb-1"],[1,"col-6"],[1,"text-grey","fs-6","fw-lighter","mb-0"],[1,"fa-solid","fa-hourglass-start"],[1,"col-6","text-end"],[1,"fa-solid","fa-hourglass-end"],[1,"text-black","fs-5","fw-light","mb-0"]],template:function(o,e){1&o&&(t.YNc(0,ot,3,0,"div",0),t.TgZ(1,"div",1),t.YNc(2,st,4,0,"div",2),t.qZA(),t.YNc(3,rt,2,1,"div",3)),2&o&&(t.Q6J("ngIf",e.loading),t.xp6(2),t.Q6J("ngIf",!e.loading&&0==e.homeworks.length),t.xp6(1),t.Q6J("ngIf",!e.loading&&e.homeworks.length>0))},dependencies:[l.mk,l.sg,l.O5,m.rH,et.$],encapsulation:2});class Z{constructor(o){this._router=o}ngOnInit(){let o=JSON.parse(localStorage.getItem("currentUserData"));o||this._router.navigate(["/users/auth"]),this.user=o}}function lt(s,o){1&s&&t._UZ(0,"app-dashboard-student")}function mt(s,o){1&s&&t._UZ(0,"div",20)}function ct(s,o){if(1&s&&(t.TgZ(0,"h3",21),t._uU(1),t.qZA()),2&s){const e=t.oxw(2);t.xp6(1),t.Oqu(e.generatedSimulations)}}function dt(s,o){1&s&&t._UZ(0,"div",20)}function ut(s,o){if(1&s&&(t.TgZ(0,"h3",21),t._uU(1),t.qZA()),2&s){const e=t.oxw(2);t.xp6(1),t.Oqu(e.generatedMaps)}}function pt(s,o){if(1&s&&(t.TgZ(0,"div",2)(1,"div",3)(2,"div",4)(3,"div",5)(4,"div",4)(5,"div",6)(6,"div",7)(7,"div",8)(8,"div",9)(9,"div",10)(10,"h5",11),t._UZ(11,"i",12),t._uU(12," Generated Simulations"),t.qZA(),t.TgZ(13,"span",13),t._uU(14),t.qZA()(),t.TgZ(15,"div",14),t.YNc(16,mt,1,0,"div",15),t.YNc(17,ct,2,1,"h3",16),t.qZA()()()()()(),t.TgZ(18,"div",4)(19,"div",6)(20,"div",7)(21,"div",8)(22,"div",9)(23,"div",10)(24,"h5",11),t._UZ(25,"i",17),t._uU(26," Generated Maps"),t.qZA(),t.TgZ(27,"span",13),t._uU(28),t.qZA()(),t.TgZ(29,"div",14),t.YNc(30,dt,1,0,"div",15),t.YNc(31,ut,2,1,"h3",16),t.qZA()()()()()()(),t.TgZ(32,"div",5)(33,"div",18),t._UZ(34,"app-simulation-search"),t.qZA()(),t.TgZ(35,"div",19)(36,"div",18),t._UZ(37,"app-simulation-create"),t.qZA()()(),t.TgZ(38,"div",4)(39,"div",5)(40,"div",18),t._UZ(41,"app-classroom-create"),t.qZA()(),t.TgZ(42,"div",5)(43,"div",18),t._UZ(44,"app-classroom-list"),t.qZA()()()()()),2&s){const e=t.oxw();t.xp6(14),t.hij("Year ",e.getCurrentYear(),""),t.xp6(2),t.Q6J("ngIf",e.loading),t.xp6(1),t.Q6J("ngIf",!e.loading),t.xp6(11),t.hij("Year ",e.getCurrentYear(),""),t.xp6(2),t.Q6J("ngIf",e.loading),t.xp6(1),t.Q6J("ngIf",!e.loading)}}Z.\u0275fac=function(o){return new(o||Z)(t.Y36(m.F0))},Z.\u0275cmp=t.Xpm({type:Z,selectors:[["app-dashboard-student"]],decls:29,vars:5,consts:[[1,"row","g-0","h-75"],[1,"col-12","col-sm-4","g-0","h-100"],[1,"card","d-flex","flex-row","align-items-center","justify-content-start","h-25","py-4","px-2","border-1","rounded-0","border-top-0","border-start-0","border-bottom"],["src","/assets/images/avatar.png","alt","Avatar",1,"img-fluid","avatar","ms-5","me-3"],[1,"d-flex","flex-column"],[1,"text-black","fs-4","fw-light","mb-0"],[1,"text-black","fs-6","fw-light","mb-0"],[1,"card","py-3","px-2","border-1","rounded-0","border-top-0","border-start-0","border-bottom"],[1,"row","g-0"],[1,"col-12","px-5"],[1,"text-black","fs-3","fw-light","mb-0"],[3,"active"],[1,"col-12","col-sm-4","h-100"],[1,"card","h-100","py-4","px-2","border-1","rounded-0","border-top-0","border-start-0","border-end","border-bottom"],[1,"card","h-100","py-4","px-2","border-1","rounded-0","border-top-0","border-start-0","border-bottom"]],template:function(o,e){1&o&&(t.TgZ(0,"div",0)(1,"div",1)(2,"div",2),t._UZ(3,"img",3),t.TgZ(4,"div",4)(5,"p",5),t._uU(6),t.qZA(),t.TgZ(7,"p",6),t._uU(8),t.qZA()()(),t.TgZ(9,"div",7)(10,"div",8)(11,"div",9)(12,"p",10),t._uU(13,"Expired Homeworks"),t.qZA(),t._UZ(14,"app-classroom-homework-list-cards",11),t.qZA()()()(),t.TgZ(15,"div",12)(16,"div",13)(17,"div",8)(18,"div",9)(19,"p",10),t._uU(20,"Classes"),t.qZA(),t._UZ(21,"app-classroom-list-cards"),t.qZA()()()(),t.TgZ(22,"div",12)(23,"div",14)(24,"div",8)(25,"div",9)(26,"p",10),t._uU(27,"Active Homeworks"),t.qZA(),t._UZ(28,"app-classroom-homework-list-cards",11),t.qZA()()()()()),2&o&&(t.xp6(6),t.AsE("",e.user.firstname," ",e.user.lastname,""),t.xp6(2),t.Oqu(e.user.email),t.xp6(6),t.Q6J("active",!1),t.xp6(14),t.Q6J("active",!0))},dependencies:[h,b],encapsulation:2});class C{constructor(o,e){this._simulationService=o,this._router=e,this.generatedSimulations=0,this.generatedMaps=0,this.loading=!0}ngOnInit(){let o=JSON.parse(localStorage.getItem("currentUserData"));o||this._router.navigate(["/users/auth"]),this.user=o,this._simulationService.getSimulationsCounts().subscribe(e=>{if(!e.hasOwnProperty("error")){let i=e;this.generatedSimulations=i.simulations_count,this.generatedMaps=i.simulations_maps_count,this.loading=!1}})}getCurrentYear(){return(new Date).getFullYear()}}C.\u0275fac=function(o){return new(o||C)(t.Y36(T.s),t.Y36(m.F0))},C.\u0275cmp=t.Xpm({type:C,selectors:[["app-dashboard"]],decls:4,vars:2,consts:[[4,"ngIf"],["class","mt-4 container-fluid",4,"ngIf"],[1,"mt-4","container-fluid"],[1,"row","px-2"],[1,"col-6"],[1,"row","mb-4"],[1,"card"],[1,"card-body"],[1,"d-flex","justify-content-between","flex-sm-row","flex-column","gap-3",2,"position","relative"],[1,"d-flex","flex-sm-column","flex-row","align-items-start","justify-content-between"],[1,"card-title"],[1,"text-nowrap","mb-3"],[1,"fa-solid","fa-globe"],[1,"badge","bg-label-success","rounded-pill"],[1,"mt-2"],["class","custom-loader",4,"ngIf"],["class","mb-0",4,"ngIf"],[1,"fa-solid","fa-diagram-project"],[1,"col-12"],[1,"row"],[1,"custom-loader"],[1,"mb-0"]],template:function(o,e){1&o&&(t._UZ(0,"app-navbar"),t.YNc(1,lt,1,0,"app-dashboard-student",0),t.YNc(2,pt,45,6,"div",1),t._UZ(3,"app-footer")),2&o&&(t.xp6(1),t.Q6J("ngIf",0==e.user.role),t.xp6(1),t.Q6J("ngIf",1==e.user.role))},dependencies:[l.O5,S.S,k.c,p,_,f,v,Z],styles:[".rounded-pill[_ngcontent-%COMP%] {\n    border-radius: 50rem !important;\n}\n\n.badge[_ngcontent-%COMP%] {\n    text-transform: uppercase;\n    line-height: .75;\n}\n.bg-label-warning[_ngcontent-%COMP%] {\n    background-color: #fff2d6 !important;\n    color: #ffab00 !important;\n}\n.bg-label-success[_ngcontent-%COMP%] {\n    background-color: #e8fadf !important;\n    color: #71dd37 !important;\n}\n.badge[_ngcontent-%COMP%] {\n    display: inline-block;\n    padding: 0.52em 0.593em;\n    font-size: 0.8125em;\n    font-weight: 500;\n    line-height: 1;\n    color: #fff;\n    text-align: center;\n    white-space: nowrap;\n    vertical-align: baseline;\n    border-radius: 0.25rem;\n}"]});const _t=[{path:"",component:C,canActivate:[q.a]}];class d{}d.\u0275fac=function(o){return new(o||d)},d.\u0275mod=t.oAB({type:d}),d.\u0275inj=t.cJS({imports:[m.Bz.forChild(_t),m.Bz]});var gt=a(5702),ft=a(3135),vt=a(9181),ht=a(1795),bt=a(5273);class u{}u.\u0275fac=function(o){return new(o||u)},u.\u0275mod=t.oAB({type:u}),u.\u0275inj=t.cJS({imports:[l.ez,d,ft.m,gt.SimulationModule,ht.ClassroomModule,bt.ClassroomHomeworkModule,vt.UserModule]})}}]);