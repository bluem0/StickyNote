document.getElementById("note").innerHTML=`
    <div class="note">
        <div class="noteTitle">便利贴</div>
        <div class="noteAdd" onclick="addNote()"></div>
    </div>
    <div class="noteBoxes"></div>
`;
let note=document.getElementsByClassName("note")[0];
note.onmousedown=function(e){
    let inx=e.clientX-note.offsetLeft,iny=e.clientY-note.offsetTop;
    document.onmouseup=function(){
        document.onmousemove=null;
        document.onmouseup=null;
    }
    document.onmousemove=function(e){
        note.style.left=e.clientX-inx;
        note.style.top=e.clientY-iny;
    }
}

let ifShow=[],notesum=0,tool=[],color=[],ifChooseColor=[];
let notes,boxes,shows,boards,tools,texts,draws,colors,toolboards,colorBoards,colorLines,colorBlocks,colorLabels;
function addNote(){
    let newbox=document.createElement("DIV");
    newbox.className="noteBox";
    newbox.style.left=note.offsetLeft;
    newbox.style.top=note.offsetTop+note.offsetHeight+2;
    document.getElementsByClassName("noteBoxes")[0].appendChild(newbox);
    document.getElementsByClassName("noteBox")[notesum].innerHTML=
    `
    <div class="noteControlBoard">
        <textarea class="noteBoxTitle">事项1</textarea>
        <div class="noteTriangle off"></div>
    </div>
    <div class="noteBoard none">
        <textarea class="noteBoardText"></textarea>
        <canvas class="noteBoardDraw"></canvas>
        <canvas class="noteBoardDraw"></canvas>
        <div class="noteToolBoard hidden">
            <div class="noteTool">
                <img class="toolImg" src="picture/text.png">
            </div>
            <div class="noteTool">
                <img class="toolImg" src="picture/pencil.png">
            </div>
            <div class="noteTool">
                <img class="toolImg" src="picture/rect.png">
            </div>
            <div class="noteTool">
                <img class="toolImg" src="picture/line.png">
            </div>
            <div class="noteTool">
                <img class="toolImg" src="picture/clear.png">
            </div>
            <div class="noteColor" title="文字颜色"></div>
            <div class="noteColor" title="画笔颜色"></div>
            <div class="noteColor" title="背景颜色"></div>
            <div class="noteColorChoose none">
                <div class="colorLine">
                    <div class="colorBlock"></div>
                </div>
                <div class="colorLabel"></div>
                <div class="colorLine">
                    <div class="colorBlock"></div>
                </div>
                <div class="colorLabel"></div>
                <div class="colorLine">
                    <div class="colorBlock"></div>
                </div>
                <div class="colorLabel"></div>
                <div class="colorLine">
                    <div class="colorBlock"></div>
                </div>
                <div class="colorLabel"></div>

            </div>
        </div>
    </div>
    `;
    ifShow[notesum]=false;
    tool[notesum]=0;
    notes=document.getElementsByClassName("noteControlBoard");
    boxes=document.getElementsByClassName("noteBox");
    shows=document.getElementsByClassName("noteTriangle");
    boards=document.getElementsByClassName("noteBoard");
    tools=document.getElementsByClassName("noteTool");
    texts=document.getElementsByClassName("noteBoardText");
    draws=document.getElementsByClassName("noteBoardDraw");
    colors=document.getElementsByClassName("noteColor");
    toolboards=document.getElementsByClassName("noteToolBoard");
    colorBoards=document.getElementsByClassName("noteColorChoose");
    colorLines=document.getElementsByClassName("colorLine");
    colorBlocks=document.getElementsByClassName("colorBlock");
    colorLabels=document.getElementsByClassName("colorLabel");
    let i=notesum;
    color[i*3]=[0,0,0,1];
    color[i*3+1]=[220,0,0,1];
    color[i*3+2]=[220,220,220,1];
    ifChooseColor[i]=-1;
    draws[i*2].width=300;
    draws[i*2].height=270;
    draws[i*2+1].width=300;
    draws[i*2+1].height=270;
    notes[i].onmousedown=function(e){
        let inx=e.clientX-boxes[i].offsetLeft,iny=e.clientY-boxes[i].offsetTop;
        for(let j=0;j<notesum;j+=1){
            boxes[j].style.zIndex=1;
        }
        boxes[i].style.zIndex=2;
        document.onmouseup=function(){
            document.onmousemove=null;
            document.onmouseup=null;
        }
        document.onmousemove=function(e){
            boxes[i].style.left=e.clientX-inx;
            boxes[i].style.top=e.clientY-iny;
        }
    }
    shows[i].onclick=function(){
        ifShow[i]=!ifShow[i];
        if(ifShow[i]){
            shows[i].className="noteTriangle on";
            boards[i].className="noteBoard";
        }
        else{
            shows[i].className="noteTriangle off";
            boards[i].className="noteBoard none";
        }
    }
    for(let j=0;j<4;j+=1){
        tools[i*5+j].onclick=function(){
            tool[i]=j;
            changeTool(i);
        }
    }
    tools[i*5+4].onclick=function(){
        clearDraw(2*i);
    }
    for(let j=0;j<3;j+=1){
        colors[i*3+j].style.backgroundColor="rgba("+color[i*3+j][0]+","+color[i*3+j][1]+","+color[i*3+j][2]+","+color[i*3+j][3]+")";
        refreshColor(i);
        colors[i*3+j].onclick=function(){
            changeColor(i,j);
        };
    }
    notesum+=1;    
}
function changeTool(i){
    for(let x=0;x<4;x+=1){
        tools[i*5+x].className=tools[i*5+x].className.split(" ")[0];
    }
    tools[i*5+tool[i]].className+=" chosen";
    texts[i].style.zIndex=1;
    draws[2*i].style.zIndex=2;
    draws[2*i+1].style.zIndex=0;
    let ctx=draws[2*i].getContext("2d");
    let ctx2=draws[2*i+1].getContext("2d");
    switch (tool[i]){
        case 0:
            texts[i].style.zIndex=2;
            draws[2*i].style.zIndex=1;
            draws[2*i+1].style.zIndex=0;
            break;
        case 1:
            draws[2*i+1].style.zIndex=0;
            draws[2*i].onmousedown=function(e){
                ctx.beginPath();
                ctx.strokeStyle="rgba("+color[i*3+1][0]+","+color[i*3+1][1]+","+color[i*3+1][2]+","+color[i*3+1][3]+")";
                ctx.moveTo(e.clientX-boxes[i].offsetLeft,e.clientY-boxes[i].offsetTop-boxes[i].offsetHeight);
                document.onmouseup=function(){
                    ctx.closePath();
                    document.onmousemove=null;
                    document.onmouseup=null;
                }
                document.onmousemove=function(e){
                    ctx.lineTo(e.clientX-boxes[i].offsetLeft,e.clientY-boxes[i].offsetTop-boxes[i].offsetHeight);
                    ctx.stroke();
                }
            }
            break;
        case 2:
            draws[2*i+1].style.zIndex=3;
            draws[2*i+1].onmousedown=function(e){
                let ex=e.clientX,ey=e.clientY,dx,dy;
                ctx.strokeStyle="rgba("+color[i*3+1][0]+","+color[i*3+1][1]+","+color[i*3+1][2]+","+color[i*3+1][3]+")";
                ctx2.strokeStyle="rgba("+color[i*3+1][0]+","+color[i*3+1][1]+","+color[i*3+1][2]+","+color[i*3+1][3]+")";
                document.onmouseup=function(){
                    ctx2.closePath();
                    clearDraw(2*i+1);
                    ctx.beginPath();
                    ctx.strokeRect(ex-boxes[i].offsetLeft,ey-boxes[i].offsetTop-boxes[i].offsetHeight,dx,dy);
                    ctx.closePath();
                    document.onmousemove=null;
                    document.onmouseup=null;
                }
                document.onmousemove=function(e){
                    clearDraw(2*i+1);
                    ctx2.beginPath();
                    dx=e.clientX-ex;
                    dy=e.clientY-ey;
                    ctx2.strokeRect(ex-boxes[i].offsetLeft,ey-boxes[i].offsetTop-boxes[i].offsetHeight,dx,dy);
                }
            }
            break;
        case 3:
            draws[2*i+1].style.zIndex=3;
            draws[2*i+1].onmousedown=function(e){
                let ex=e.clientX,ey=e.clientY,dx,dy;
                ctx.strokeStyle="rgba("+color[i*3+1][0]+","+color[i*3+1][1]+","+color[i*3+1][2]+","+color[i*3+1][3]+")";
                ctx2.strokeStyle="rgba("+color[i*3+1][0]+","+color[i*3+1][1]+","+color[i*3+1][2]+","+color[i*3+1][3]+")";
                document.onmouseup=function(){
                    ctx2.closePath();
                    clearDraw(2*i+1);
                    ctx.beginPath();
                    ctx.moveTo(ex-boxes[i].offsetLeft,ey-boxes[i].offsetTop-boxes[i].offsetHeight);
                    ctx.lineTo(dx-boxes[i].offsetLeft,dy-boxes[i].offsetTop-boxes[i].offsetHeight);
                    ctx.stroke();
                    ctx.closePath();
                    document.onmousemove=null;
                    document.onmouseup=null;
                }
                document.onmousemove=function(e){
                    clearDraw(2*i+1);
                    ctx2.beginPath();
                    dx=e.clientX;
                    dy=e.clientY;
                    ctx2.moveTo(ex-boxes[i].offsetLeft,ey-boxes[i].offsetTop-boxes[i].offsetHeight);
                    ctx2.lineTo(dx-boxes[i].offsetLeft,dy-boxes[i].offsetTop-boxes[i].offsetHeight);
                    ctx2.stroke();
                }
            }
            break;
        default: console.log(tool[i]);
    }
}
function clearDraw(i){
    let ctx=draws[i].getContext("2d");
    ctx.clearRect(0,0,300,300);
}
function refreshColor(i){
    notes[i].style.backgroundColor="rgba("+color[i*3+2][0]+","+color[i*3+2][1]+","+color[i*3+2][2]+","+color[i*3+2][3]+")";
    boards[i].style.backgroundColor="rgba("+color[i*3+2][0]+","+color[i*3+2][1]+","+color[i*3+2][2]+","+color[i*3+2][3]+")";
    toolboards[i].style.backgroundColor="rgba("+color[i*3+2][0]+","+color[i*3+2][1]+","+color[i*3+2][2]+","+color[i*3+2][3]+")";
    colorBoards[i].style.backgroundColor="rgba("+color[i*3+2][0]+","+color[i*3+2][1]+","+color[i*3+2][2]+","+color[i*3+2][3]+")";
    texts[i].style.color="rgba("+color[i*3][0]+","+color[i*3][1]+","+color[i*3][2]+","+color[i*3][3]+")";
    document.getElementsByClassName("noteBoxTitle")[i].style.color="rgba("+color[i*3][0]+","+color[i*3][1]+","+color[i*3][2]+","+color[i*3][3]+")";
}
function changeColor(i,j){
    if(ifChooseColor==j){
        ifChooseColor=-1;
        colorBoards[i].className+=" none";
    }
    else{
        ifChooseColor=j;
        colorBoards[i].className=colorBoards[i].className.split(" ")[0];
        for(let x=0;x<3;x+=1){
            colorLabels[i*4+x].innerHTML=color[i*3+j][x];
            colorBlocks[i*4+x].style.left=Math.floor(color[i*3+j][x]/225*235);
            colorBlocks[i*4+x].onmousedown=function(e){
                let inx=e.clientX;
                document.onmouseup=function(){
                    document.onmousemove=null;
                    document.onmouseup=null;
                }
                document.onmousemove=function(e){
                    let dx=e.clientX-inx,xx=colorBlocks[i*4+x].offsetLeft,bx=0;
                    if(dx+xx>235){bx=235;}
                    else{if(dx+xx>0){bx=dx+xx;}}
                    colorBlocks[i*4+x].style.left=bx+"px";
                    inx=e.clientX;
                    color[i*3+j][x]=Math.floor(bx/235*225);
                    colorLabels[i*4+x].innerHTML=color[i*3+j][x];
                    refreshColor(i);
                    colors[i*3+j].style.backgroundColor="rgba("+color[i*3+j][0]+","+color[i*3+j][1]+","+color[i*3+j][2]+","+color[i*3+j][3]+")";
                }
            }
        }
        colorLabels[i*4+3].innerHTML=color[i*3+j][3];
        colorBlocks[i*4+3].style.left=Math.floor(color[i*3+j][3]*235);
        colorBlocks[i*4+3].onmousedown=function(e){
            let inx=e.clientX;
            document.onmouseup=function(){
                document.onmousemove=null;
                document.onmouseup=null;
            }
            document.onmousemove=function(e){
                let dx=e.clientX-inx,xx=colorBlocks[i*4+3].offsetLeft,bx=0;
                if(dx+xx>235){bx=235;}
                else{if(dx+xx>0){bx=dx+xx;}}
                colorBlocks[i*4+3].style.left=bx+"px";
                inx=e.clientX;
                color[i*3+j][3]=Math.floor(bx/235*100)/100;
                colorLabels[i*4+3].innerHTML=color[i*3+j][3];
                refreshColor(i);
            }
        }
    }
}