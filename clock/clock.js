window.onload=
function()
{
	var canvas=document.getElementById("mycanvas"),
		context=canvas.getContext("2d");

	var width=canvas.width,
		height=canvas.height;

	var centerX=width/2,
		centerY=height/2,
		radius=200;

	var endpointY=centerY,
		endpointX=centerX,
		angle=0;

	var number_of_divs=60,
		slice=Math.PI*2/number_of_divs,
		count=0;

	function drawClock()
	{
		count=0;
		for(var i=0;i<Math.PI*2;i=i+slice,count++)
		{
			var y=centerY+Math.sin(i)*radius,
				x=centerX+Math.cos(i)*radius;

			context.beginPath();
			if(count%5!=0)
				context.arc(x,y,1,Math.PI*2,false);
			else
				context.arc(x,y,3,Math.PI*2,false);
			context.fill();
		}
	}
	render();
	var count_sec=0,count_min=0,angle=45*slice,angle_min=45*slice,angle_hour=46*slice,x=0,y=0,x_min=0,y_min=0,x_hour=0,y_hour=0;
	
	var currentTime = new Date();

	var currentOffset = currentTime.getTimezoneOffset();

	var ISTOffset = 330;   

	var ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);

	var seconds=ISTTime.getSeconds(),minutes=ISTTime.getMinutes(),hour=ISTTime.getHours();

	angle=(seconds-14)*slice;
	angle_min=((minutes-15))*slice+((angle+1)/60);
	angle_hour=((hour-3)*5)*slice+((5*(angle_min+1))/60);

	function render()
	{
			context.clearRect(0,0,width,height);
			setTimeout(drawClock(),50000);

			context.font = '60pt Calibri';
      		context.lineWidth = 3;

			context.beginPath();
			context.arc(endpointX,endpointY,5,Math.PI*2,false);
			context.fill();
			
				y_min=centerY+Math.sin(angle_min)*radius;
				x_min=centerX+Math.cos(angle_min)*radius;
				context.beginPath();
				context.moveTo(endpointX,endpointY);
				context.lineTo(x_min-30*Math.cos(angle_min),y_min-30*Math.sin(angle_min));
				context.lineWidth=5;
				context.stroke();

				y_hour=centerY+Math.sin(angle_hour)*radius;
				x_hour=centerX+Math.cos(angle_hour)*radius;
				context.beginPath();
				context.moveTo(endpointX,endpointY);
				context.lineTo(x_hour-50*Math.cos(angle_hour),y_hour-50*Math.sin(angle_hour));
				context.lineWidth=5;
				context.stroke();

			if(minutes>=60)
			{
				minutes=0;
				hour++;
			}

			if(count_sec%60==0 || count_sec==0)
			{
				y=centerY+Math.sin(angle)*radius,
				x=centerX+Math.cos(angle)*radius;

				context.beginPath();
				context.moveTo(endpointX,endpointY);
				context.lineTo(x,y);
				context.lineWidth=5;
				context.stroke();
				seconds++;
				if(seconds>=60)
				{
					seconds=0;
					minutes++;
				}

			}
			else
			{
				context.beginPath();
				context.moveTo(endpointX,endpointY);
				context.lineTo(x,y);
				context.lineWidth=5;
				context.stroke();	
			}
			
		 	context.font = '40pt Calibri';
      		context.lineWidth = 3;
      		context.strokeText(hour+":"+minutes+":"+seconds,725,50);
			
			angle+=(slice/60);
			angle_min+=(slice/3600);
			angle_hour+=(5*slice/216000)
			count_sec=count_sec+1;
			count_min+=1;
		requestAnimationFrame(render);
	}
}
