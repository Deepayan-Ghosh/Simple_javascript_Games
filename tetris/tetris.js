var lastTime=0;
const dropInterval=200;
var dropCount=0;
var player;
var str="1234567";
var score=0, highscore=0;

var canvas=document.getElementById("tetris");
var context=canvas.getContext("2d");
context.scale(10,10);
var color=[null,"red","green","blue","white","orange","#ff00ff","red"];

player={
	matrix:  createPieces(Math.floor(Math.random()*7)),
	position:{
				x:randomNumberGenerator(),
				y:0
			 }
};
arena=createArena(32,40);
function createArena(w,h)
{
	var arena=[];
	while(h--)
	{
		arena.push(new Array(w).fill(0));
	}
	return arena;
}
function randomNumberGenerator()
{
	return (Math.random()*30)|0;
}
function createPieces(value)
{
	if(value==1)
	{
		var matrix=
		[
			[0,0,0],
			[1,1,1],
			[0,1,0],
		];
	}
	else if(value==2)
	{
		var matrix=
		[
			[0,2,0],
			[0,2,0],
			[0,2,2],
		];
	}
	else if(value==3)
	{
		var matrix=
		[
			[3,3],
			[3,3]
		];
	}
	else if(value==4)
	{
		var matrix=
		[
			[0,4,0],
			[0,4,0],
			[4,4,0]
		];
	}
	else if(value==5)
	{
		var matrix=
		[
			[5,5,0],
			[0,5,5],
			[0,0,0]
		];
	}
	else if(value==6)
	{
		var matrix=
		[
			[0,6,6],
			[6,6,0],
			[0,0,0]
		];
	}
	else if(value==7)
	{
		var matrix=
		[
			[0,7,0,0],
			[0,7,0,0],
			[0,7,0,0],
			[0,7,0,0]
		];
	}
	return matrix;
}
function draw()
{
	context.beginPath();
	context.fillStyle="black";
	context.fillRect(0,0,canvas.width,canvas.height);
	context.closePath();
	drawMatrix(arena,{x:0,y:0});
	drawMatrix(player.matrix,player.position);
}
function drawMatrix(matrix,offset)
{
	for(y=0;y<matrix.length;y++)
	{
		for(x=0;x<matrix[y].length;x++)
		{
			if(matrix[y][x]!==0)
			{
				context.fillStyle=color[matrix[y][x]];
				context.fillRect(x+offset.x,y+offset.y,1,1);
			}
			else
			{
				context.fillStyle="black";
				context.fillRect(x+offset.x,y+offset.y,1,1);
			}
		}
	}
}
function collide(arena,piece)
{
	for(y=0;y<piece.length;y++)
	{
		for(x=0;x<piece[y].length;x++)
		{
		if(piece[y][x]!==0)
		{
			if(y+player.position.y>=40)
				return true;
			else if(piece[y][x]!==0 && (arena[y+player.position.y][x+player.position.x]!==0))
			{
				return true;
			}
		}
		}
	}
	return false;
}
function updateArena(arena,piece)
{
	for(y=0;y<piece.length;y++)
	{
		for(x=0;x<piece[y].length;x++)
		{
			if(piece[y][x]!==0)
			{
				arena[y+player.position.y][x+player.position.x]=piece[y][x];
			}
		}
	}
}
function countScore(arena)
{
	outer:  for(y=arena.length-1;y>=0;y--)
			{
				for(x=0;x<arena[y].length;x++)
				{
					if(arena[y][x]===0)
					{
						continue outer;
					}
				}
				score=score+10;
				const row=arena.splice(y,1)[0].fill(0);
				//var row=temp[0].fill(0);
				arena.unshift(row);
				y++;
			}	
}
function playerDrop()
{
	player.position.y+=1;
	if(collide(arena,player.matrix))
	{
		player.position.y--;
		updateArena(arena,player.matrix);
		playerReset();
		countScore(arena);	
	}
	dropCount=0;
}
function playerReset()
{
	player.position.y=0;
	player.position.x=randomNumberGenerator();
	var rand=Math.floor(Math.random()*7);
	//sconsole.log(rand);
	player.matrix=createPieces(str.charAt(rand));
}
function playerRotate(dir,piece)
{
	for(y=0;y<piece.length;y++)
	{
		for(x=0;x<y;x++)
		{
			[
				piece[y][x],
				piece[x][y],
			]
			=
			[
				piece[x][y],
				piece[y][x],
			];
		}
	}
	if(dir>0)
	{
		for(y=0;y<piece.length;y++)
		{
			piece[y].reverse();
		}
	}
	else
		piece.reverse();
	if(collide(arena,piece))
	{
		playerRotate(-dir,piece);
	}
}
function playerMovement(dir,piece)
{
	player.position.x+=dir;
	var flag=1;
	dropCount=0;
	/*for(y=0;y<piece.length;y++)
	{
		for(x=0;x<piece[y].length;x++)
		{
			if(piece[y][x]!==0 && ((player.position.x+dir)<0 || (player.position.x+dir)>29))
			{
				flag=0;
				break;
			}
		}
	}
	if(flag==1)
	{
		player.position.x+=dir;
	}*/
	if(collide(arena,player.matrix))
		player.position.x-=dir;
}
this.addEventListener("keydown",(keyevent)=>
{
	if(keyevent.keyCode===37)
	{
		playerMovement(-1,player.matrix);
	}
	else if(keyevent.keyCode===39)
	{
		playerMovement(1,player.matrix);
	}
	else if(keyevent.keyCode===40)
	{
		playerDrop();
	}
	else if(keyevent.keyCode===81)
		playerRotate(-1,player.matrix);
	else if(keyevent.keyCode===87)
		playerRotate(1,player.matrix);
});
function update(time=0)
{
	var deltaTime=time-lastTime;
	lastTime=time;
	dropCount+=deltaTime;
	if(dropCount>dropInterval)
	{
		playerDrop();
	}		
	for(i=0;i<arena[0].length;i++)
	{
		if(arena[0][i]!==0)
		{
			for(i=0;i<arena.length;i++)
				arena[i].fill(0);
			drawMatrix(arena,{x:0,y:0});
			//alert("Game over");
			score=0;
			if(score>highscore)
				highscore=score;
			alert("New game?");
		}	
	}
	if(score>highscore)
				highscore=score;
	document.getElementById("score").innerHTML="Score:\t"+score;
	document.getElementById("highscore").innerHTML="High Score:\t"+highscore;
	draw();
	requestAnimationFrame(update);
}
update();