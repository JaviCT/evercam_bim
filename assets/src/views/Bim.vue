<template>
  <div class="bim">
    <div id="loader" ref="loader">
      <p>Loading</p>
    </div>
    <span id="dots" @click="toggle()" v-show="isOpen"><i class="fas fa-bars"></i></span>
    <div id="myRow" v-show="isOpen" class="draggable">
      <div id="bar">
        <span><strong>Editor</strong></span>
      </div>
      <div id="values" class="col-md-6">
       <dl>
         <dt>Fx (Focal Lengths X)</dt>
         <dd>
           <input id="Fx" type="range" min="-2.0" max="2.0" value="1.0" step="0.01"/>
           <span id="Fx_label"></span>
         </dd>
         <dt>Fy (Focal Lengths Y)</dt>
         <dd>
           <input id="Fy" type="range" min="-2.0" max="2.0" value="1.0" step="0.01"/>
           <span id="Fy_label"></span>
         </dd>
         <dt>Expand Horizontal</dt>
         <dd>
           <input id="a" type="range" min="0.0" max="4.0" value="1.0" step="0.001"/>
           <span id="a_label"></span>
         </dd>
         <dt>Expand Vertical</dt>
         <dd>
           <input id="b" type="range" min="0.0" max="4.0" value="1.0" step="0.001"/>
           <span id="b_label"></span>
         </dd>
         <dt>Transparency</dt>
         <dd>
           <input id="transparency" type="range" min="0" max="1" value="1" step="any"/>
         </dd>
       </dl>
       <div id="controls2">
         <div id="size2">
           <div id="plus" ="distorter.lens.scale += 0.01; distorter.run();"><i class="fas fa-plus"></i></div>
           <div id="minus"><i class="fas fa-minus"></i></div>
         </div>

         <div id="arrows">
           <div id="up" @click="translatey = translatey - 20; getTransform()"><i class="fas fa-arrow-up"></i></div>
           <div id="left" @click="translatex = translatex - 20; getTransform()"><i class="fas fa-arrow-left"></i></div>
           <div id="right" @click="translatex = translatex + 20; getTransform()"><i class="fas fa-arrow-right"></i></div>
           <div id="down" @click="translatey = translatey + 20; getTransform()"><i class="fas fa-arrow-down"></i></div>
         </div>

         <div id="rotate">
           <div id="redo" @click="angle = (angle + 2) % 360; getTransform()"><i class="fas fa-redo"></i></div>
           <div id="undo" @click="angle = (angle - 2) % 360; getTransform()"><i class="fas fa-undo"></i></div>
         </div>

       </div>
       <div id="buttons2">
         <input id="download" @click="download()" type="button" name="Download" value="Download"/>
         <input type='file' id='getval' v-on:change="readURL()" name="background-image" />
         <video id="video" controls style="display:none"></video>
       </div>
       <div id="buttons">
         <input id="ok" @click="toggle()" type="button" name="Ok" value="Ok"/>
         <input id="cancel" @click="toggle(); myReset()" type="button" name="Cancel" value="Cancel"/>
         <input id="reset" @click="myReset()" type="button" name="Reset" value="Reset"/>
       </div>
      </div>

    </div>
    <div id="comparison">
        <img id="myFigure" ref="myFigure" src="../images/background.jpg" unselectable="on"></img>
        <div id="handle"></div>
        <div id="divisor">
          <div id="myCanvas" ref="myCanvas" class="col-md-6">
            <canvas id="canvas"></canvas>
          </div>
        </div>
        <input type="range" min="0" max="100" value="49" id="slider">
      <div id="player" ref="player">
        <div id="mySpan" style="position:absolute; min-width:100px;">
          <div id="myValue"></div>
        </div>
        <div id="ruler">
          <span id="inicio"><strong>0</strong></span>
          <input type="range" id="myInput" class="movement" min="0" max="362" value="0" step="any"></imput>
          <span id="final"><strong id="totaly"></strong></span>
        </div>
        <div class="button2" id="first" @click="firstBim()"><i class="fas fa-fast-backward"></i></div>
        <div class="button2" id="prev" @click="prevPhoto()">-1</div>
        <div class="button2" id="play" @click="playMedia()"><i class="fas fa-play"></i></div>
        <div class="button2" id="next" @click="nextPhoto()">+1</div>
        <div class="button2" id="end" @click="lastBim()"><i class="fas fa-fast-forward"></i></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isOpen: false,
      distorter: null,
      example: null,
      total: 0,
      i: 0,
      photo: [],
      image: 1,
      para: 0,
      angle: 0,
      margin: 0,
      scalex: 1,
      scaley: 1,
      translatex: -200,
      translatey: 0,
      timer: 0,
      playClicked: 0
    }
  },
  mounted() {
    console.log(this.$refs);
    //this.loadImg();

    this.$refs.myFigure.style.width=document.documentElement.scrollWidth;
    this.$refs.myFigure.style.height=document.documentElement.scrollHeight;
    this.getTransform();

    var esto = this.$refs.myFigure.style.width;
    this.$refs.myCanvas.style.width = esto+"px";

    var myPlayer = this.$refs.player.style.width;
    var player = (esto / 2) - (myPlayer / 1.5);
    this.$refs.player.style.left = player + "px";
    this.$refs.loader.hidden = true;
  },
  methods: {
    toggle () {
      this.isOpen = !this.isOpen
    },

    readURL () {
       var file = document.getElementById("getval").files[0];
       var reader = new FileReader();
       reader.onloadend = function(){

         document.getElementById('myFigure')
          .setAttribute(
              'src', reader.result
          );
       }
       if(file){
          reader.readAsDataURL(file);
        }else{
        }
    },

    startCapturing () {
      capturing = true;
      image = 1;
      i = 1;
      playMedia();
    },

    finishCapturing (e) {
      capturing = false;
      var videoData = [ e.data ];
      var blob = new Blob(videoData, { 'type': 'video/mp4' });
      var videoURL = URL.createObjectURL(blob);
      video.src = videoURL;
      video.play();
    },

    playMedia (){
      if(playClicked == 0){
        if(image == 361){
          image = 1;
          i = image;
        }
        $("#play").empty();
        $("#play").append("<i class='fas fa-pause'></i>");
        playClicked = 1;

        para = 0;
        var refreshIntervalId = setInterval(function(){
          if(i < 361 && para == 0){
            image = i;
            distorter.setImage(photo[i].src);
            document.getElementById("myInput").value = i;
            i++;
          } else{
            clearInterval(refreshIntervalId);
            console.log("PARANDO");
            $("#play").empty();
            $("#play").append("<i class='fas fa-play'></i>");
            if(i == 361){
              i = 1;
            }
          }
          if (i == 361){
            playClicked = 0;
          }
        }, 50);
      } else{
        $("#play").empty();
        $("#play").append("<i class='fas fa-play'></i>");
        playClicked = 0;
        para = 1;
      }
    },

    resizeGrid () {
      $('#grid').height($('#canvas').height());
      $('#grid').width($('#canvas').width());
    },

    /*example = {
      setSliders:    setSliders,
      readSliders:   readSliders
    }*/

    onSliderChange () {
      readSliders();
      distorter.run();
    },

    readSliders () {
      distorter.lens.a = parseFloat($("#a_label")[0].innerHTML = $("#a").val());
      distorter.lens.b = parseFloat($("#b_label")[0].innerHTML = $("#b").val());
      distorter.lens.Fx = parseFloat($("#Fx_label")[0].innerHTML = $("#Fx").val());
      distorter.lens.Fy = parseFloat($("#Fy_label")[0].innerHTML = $("#Fy").val());
      distorter.fov.x = parseFloat($("#fovx").val());
      distorter.fov.y = parseFloat($("#fovy").val());
    },

    setSliders () {
      $("#a").val(distorter.lens.a);
        $("#a_label")[0].innerHTML = distorter.lens.a;
      $("#b").val(distorter.lens.b);
        $("#b_label")[0].innerHTML = distorter.lens.b;
      $("#Fx").val(distorter.lens.Fx);
        $("#Fx_label")[0].innerHTML = distorter.lens.Fx;
      $("#Fy").val(distorter.lens.Fy);
        $("#Fy_label")[0].innerHTML = distorter.lens.Fy;
      $("#fovx").val(distorter.fov.x);
      $("#fovy").val(distorter.fov.y);
    },

    myReset (){
      var mio = document.getElementById("myCanvas");
      mio.style.transform = "rotate(0deg)";
      mio.style.transform += "translate(0px, 0px)";
      mio.style.transform += "scale(1, 1)";

      $("#transparency").val(1);
      document.getElementById("myCanvas").style.opacity = 1;
      $("#a").val(1);
      $("#b").val(1);
      $("#Fx").val(0);
      $("#Fy").val(0);
      $("#fovx").val(0);
      $("#fovy").val(0);
      distorter.lens.a = parseFloat($("#a_label")[0].innerHTML = $("#a").val());
      distorter.lens.b = parseFloat($("#b_label")[0].innerHTML = $("#b").val());
      distorter.lens.Fx = parseFloat($("#Fx_label")[0].innerHTML = $("#Fx").val());
      distorter.lens.Fy = parseFloat($("#Fy_label")[0].innerHTML = $("#Fy").val());
      distorter.fov.x = parseFloat($("#fovx").val());
      distorter.fov.y = parseFloat($("#fovy").val());
      distorter.run();
    },

    loadImg () {
      for (var i = 1; i <363; i++){
        this.total++;
        this.photo[i] = new Image();
        this.photo[i].src = "../images/bim/" + i + ".png";
        //photo[i].src = "https://s3-eu-west-1.amazonaws.com/bimevercam/" + i + ".png";
        this.photo[i].crossOrigin = "";
      }
    },

    thumbnails () {
      var myRange = document.querySelector('#myInput');
      var myValue = document.querySelector('#myValue');
      var myUnits = 'myUnits';
      var off = myRange.offsetWidth / (parseInt(myRange.max) - parseInt(myRange.min));
      var px =  ((myRange.valueAsNumber - parseInt(myRange.min)) * off) - (myValue.offsetParent.offsetWidth / 2);
        myValue.parentElement.style.left = (px + 30) + 'px';
        myValue.parentElement.style.top = (myRange.offsetHeight - 170) + 'px';
        myValue.innerHTML = "<div id='myDiv'><img src='img/bim/" + Math.trunc(myRange.value) + ".png' style='width: 90%; object-fit: contain; width: 100%; position: relative'></img></div><div id='numer'><div><strong>"+ (Math.trunc(myRange.value)) +"</strong></div></div>";//Math.trunc(myRange.value) + ' ' + myUnits;

        myRange.oninput =function(){
          px = ((myRange.valueAsNumber - parseInt(myRange.min)) * off) - (myValue.offsetParent.offsetWidth / 2);
          myValue.innerHTML = "<div id='myDiv'><img src='img/bim/" + Math.trunc(myRange.value) + ".png' style='width: 90%; object-fit: contain; position: relative'></img></div><div id='numer'><div><strong>"+ (Math.trunc(myRange.value)) +"</strong></div></div>";
          myValue.parentElement.style.left = (px + 30) + 'px';
        };
    },

    showVal () {
      $("#play").empty();
      $("#play").append("<i class='fas fa-play'></i>");
      para = 1;
      var value = $("#myInput").val();
      image = Math.trunc(value);
      i = image;
      if(image == 0){
        distorter.setImage("img/bim/0.png")
      }else{
        distorter.setImage(photo[image].src)
      }
    },

    showVal2 () {
      var value = $("#transparency").val();
      document.getElementById("myCanvas").style.opacity = value;
    },

    getTransform () {
      var mio = document.getElementById("myCanvas");
      mio.style.transform = "rotate(" + this.angle + "deg)";
      mio.style.transform += "translate(" + this.translatex + "px, " + this.translatey + "px)";
      mio.style.transform += "scale(" + this.scalex + ", " + this.scaley + ")";
    },

    myFunction(){
      image = $("#sel1").val();
      i = image;
      distorter = FisheyeGl({
        image: photo[image].src
      });
    },

    download () {
      var video = document.getElementById('video');
      var canvas = document.getElementById("canvas");

      var stream = canvas.captureStream(25);
      var recorder = new MediaRecorder(stream);
      var capturing = false;

      recorder.addEventListener('dataavailable', finishCapturing);

      startCapturing();
      recorder.start();

      setTimeout(function() {
        recorder.stop();
        jQuery('#video').toggle('show');
      }, 362 * 80);
    },

    nextPhoto () {
      $("#play").empty();
      $("#play").append("<i class='fas fa-play'></i>");
      para = 1;
      if(image < 361){
        image = image + 1;
        i = image;
        distorter.setImage(photo[i].src);
        document.getElementById("myInput").value = image;
      }else{
        alert("No more BIM");
      }
    },

    prevPhoto () {
      $("#play").empty();
      $("#play").append("<i class='fas fa-play'></i>");
      para = 1;
      if(image > 1){
        image = image - 1;
        i = image;
        distorter.setImage(photo[i].src);
        document.getElementById("myInput").value = image;
      }else{
        distorter.setImage("img/bim/0.png");
        alert("No more BIM");
      }
    },

    firstBim () {
      $("#play").empty();
      $("#play").append("<i class='fas fa-play'></i>");
      para = 1;
      i = 1;
      image = 1;
      distorter.setImage("img/bim/0.png");
      document.getElementById("myInput").value = image;
    },

    lastBim () {
      $("#play").empty();
      $("#play").append("<i class='fas fa-play'></i>");
      para = 1;
      i = 361;
      image = 361
      distorter.setImage(photo[i].src);
      document.getElementById("myInput").value = image;
    },


  }
}
</script>

<style scoped>

@import url(https://fonts.googleapis.com/css?family=Roboto:400,900italic,900,700italic,700,500italic,500,400italic,300italic,300,100italic,100);

* { margin:0 !important; padding:0 !important;} /* to remove the top and left whitespace */

html,body{
  width:100%;
  height:100%;
  margin: 0;
  padding: 0;
  font-family: 'Roboto';
  display: inline;
  color: transparent;
  max-width: 100%;
  max-height: 100%;
}

#myRow{
  background-color: rgba(255, 255, 255, 0.7);
  position: absolute;
  z-index: 9999;
  right:40px;
  top:20px;
  max-width:340px;
  min-width: 340px;
  border-radius: 5px;
  padding-bottom: 10px;
}

#bar{
  width: 100%;
  background-color: white;
  border-radius: 5px;
  text-align: center;
  padding-top: 20px;
  padding-bottom: 20px;
}

#bar strong{
  pointer-events: none;
}

#closeEditor{
  position: absolute;
  z-index: 999;
  height: 20px;
  width: 20px;
  float: right;
}

#closeEditor:hover{
  background-color: rgba(143, 178, 213, 0.55);
}

#closeEditor{
  border: none;
  background-color: transparent;
  width: 5px;
  height: 5px;
}

#comparison {
	overflow: hidden;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: absolute;
}

#values{
  width: 100%;
  top: 10px;
}

canvas {
  pointer-events:none;
  height: 100vh;
  width: 100vw;
  float : left;
  min-width: 200px;
  min-height: 200px;
  display: block;
  border: none;
}

#myCanvas{
  border:none;
}


#myFigure {
  position: absolute;
	font-size: 0;
	width: 100%;
	height: 100%;
	margin: 0;

  user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}

#divisor {
  pointer-events: none;
  overflow: hidden;
  position: absolute;
  z-index: 1;
	width: 49%;
  -webkit-box-shadow:  0 5px 10px -2px rgba(0,0,0,0.3);
  -moz-box-shadow:  0 5px 10px -2px rgba(0,0,0,0.3);
	box-shadow: 0 5px 10px -2px rgba(0,0,0,0.3);
  border-right: solid 4px #fff;
  background-repeat: no-repeat;
  height:100%;


  &::before,
  &::after {
    content: '';
    position: absolute;
    right: -2px;
    width: 4px;
    height: calc(50% - 25px);
    background: white;
    z-index: 3;
  }
  &::before {
    top: 0;
    -webkit-box-shadow:  0 0px 8px 1px rgba(0,0,0,.3);
    -moz-box-shadow:  0 0px 8px 1px rgba(0,0,0,.3);
    box-shadow: 0 0px 8px 1px rgba(0,0,0,.3);
  }
  &::after {
    bottom: 0;
    -webkit-box-shadow:  0 0px 8px 1px rgba(0,0,0,.3);
    -moz-box-shadow: 0 0px 8px 1px rgba(0,0,0,.3);
    box-shadow: 0 0px 8px 1px rgba(0,0,0,.3);
  }
}

#handle {
  position: absolute;
  height: 50px;
  width: 50px;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  z-index: 20;

  &::before,
  &::after {
    content: '';
    width: 0;
    height: 0;
    border: 6px inset transparent;
    position: absolute;
    top: 50%;
    margin-top: -6px;
  }
  &::before {
    border-right: 6px solid white;
    left: 50%;
    margin-left: -17px;
  }
  &::after {
    border-left: 6px solid white;
    right: 50%;
    margin-right: -17px;
  }
}

#slider{
  pointer-events: none;
  outline: none;
	-webkit-appearance:none;
	-moz-appearance:none;
	position: absolute;
	top: 50%; left: -25px;
  width: 50px;
  transform: translateY(-50%);
	background: transparent;
	width: calc(100% + 50px);
  z-index: 22;

  &:focus,
  &:active {
    border: none;
    outline: none;
  }
}

#slider[orient=vertical]
{
    writing-mode: bt-lr; /* IE */
    -webkit-appearance: slider-vertical; /* WebKit */
    width: 8px;
    height: 175px;
    padding: 0 5px;
}

#slider::-webkit-slider-thumb {
  pointer-events:auto;
  -webkit-appearance: none;
  border: none;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  background: rgba(0,0,0,0.4) url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHZpZXdCb3g9IjAgMCAyOCAyOCI+PHBhdGggZD0iTTI4IDE0YzAgMC4yNjYtMC4xMDkgMC41MTYtMC4yOTcgMC43MDNsLTQgNGMtMC4xODcgMC4xODctMC40MzggMC4yOTctMC43MDMgMC4yOTctMC41NDcgMC0xLTAuNDUzLTEtMXYtMmgtMTZ2MmMwIDAuNTQ3LTAuNDUzIDEtMSAxLTAuMjY2IDAtMC41MTYtMC4xMDktMC43MDMtMC4yOTdsLTQtNGMtMC4xODctMC4xODctMC4yOTctMC40MzgtMC4yOTctMC43MDNzMC4xMDktMC41MTYgMC4yOTctMC43MDNsNC00YzAuMTg3LTAuMTg3IDAuNDM4LTAuMjk3IDAuNzAzLTAuMjk3IDAuNTQ3IDAgMSAwLjQ1MyAxIDF2MmgxNnYtMmMwLTAuNTQ3IDAuNDUzLTEgMS0xIDAuMjY2IDAgMC41MTYgMC4xMDkgMC43MDMgMC4yOTdsNCA0YzAuMTg3IDAuMTg3IDAuMjk3IDAuNDM4IDAuMjk3IDAuNzAzeiI+PC9wYXRoPjwvc3ZnPg==) 50%/30px 30px no-repeat;
  border: 3px solid white;
  -webkit-box-shadow: 0 0 8px 1px rgba(0,0,0,.3);
  -moz-box-shadow:  0 0 8px 1px rgba(0,0,0,.3);
  box-shadow: 0 0 8px 1px rgba(0,0,0,.3);
}

#slider::-moz-range-thumb {
  pointer-events:auto;
  -webkit-appearance: none;
  border: none;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  background: rgba(0,0,0,0.4) url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHZpZXdCb3g9IjAgMCAyOCAyOCI+PHBhdGggZD0iTTI4IDE0YzAgMC4yNjYtMC4xMDkgMC41MTYtMC4yOTcgMC43MDNsLTQgNGMtMC4xODcgMC4xODctMC40MzggMC4yOTctMC43MDMgMC4yOTctMC41NDcgMC0xLTAuNDUzLTEtMXYtMmgtMTZ2MmMwIDAuNTQ3LTAuNDUzIDEtMSAxLTAuMjY2IDAtMC41MTYtMC4xMDktMC43MDMtMC4yOTdsLTQtNGMtMC4xODctMC4xODctMC4yOTctMC40MzgtMC4yOTctMC43MDNzMC4xMDktMC41MTYgMC4yOTctMC43MDNsNC00YzAuMTg3LTAuMTg3IDAuNDM4LTAuMjk3IDAuNzAzLTAuMjk3IDAuNTQ3IDAgMSAwLjQ1MyAxIDF2MmgxNnYtMmMwLTAuNTQ3IDAuNDUzLTEgMS0xIDAuMjY2IDAgMC41MTYgMC4xMDkgMC43MDMgMC4yOTdsNCA0YzAuMTg3IDAuMTg3IDAuMjk3IDAuNDM4IDAuMjk3IDAuNzAzeiI+PC9wYXRoPjwvc3ZnPg==) 50%/30px 30px no-repeat;
  border: 3px solid white;
  -webkit-box-shadow: 0 0 8px 1px rgba(0,0,0,.3);
  -moz-box-shadow:  0 0 8px 1px rgba(0,0,0,.3);
  box-shadow: 0 0 8px 1px rgba(0,0,0,.3);
}

#slider::-ms-thumb {
  pointer-events:auto;
  -webkit-appearance: none;
  border: none;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  background: rgba(0,0,0,0.4) url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHZpZXdCb3g9IjAgMCAyOCAyOCI+PHBhdGggZD0iTTI4IDE0YzAgMC4yNjYtMC4xMDkgMC41MTYtMC4yOTcgMC43MDNsLTQgNGMtMC4xODcgMC4xODctMC40MzggMC4yOTctMC43MDMgMC4yOTctMC41NDcgMC0xLTAuNDUzLTEtMXYtMmgtMTZ2MmMwIDAuNTQ3LTAuNDUzIDEtMSAxLTAuMjY2IDAtMC41MTYtMC4xMDktMC43MDMtMC4yOTdsLTQtNGMtMC4xODctMC4xODctMC4yOTctMC40MzgtMC4yOTctMC43MDNzMC4xMDktMC41MTYgMC4yOTctMC43MDNsNC00YzAuMTg3LTAuMTg3IDAuNDM4LTAuMjk3IDAuNzAzLTAuMjk3IDAuNTQ3IDAgMSAwLjQ1MyAxIDF2MmgxNnYtMmMwLTAuNTQ3IDAuNDUzLTEgMS0xIDAuMjY2IDAgMC41MTYgMC4xMDkgMC43MDMgMC4yOTdsNCA0YzAuMTg3IDAuMTg3IDAuMjk3IDAuNDM4IDAuMjk3IDAuNzAzeiI+PC9wYXRoPjwvc3ZnPg==) 50%/30px 30px no-repeat;
  border: 3px solid white;
  -webkit-box-shadow: 0 0 8px 1px rgba(0,0,0,.3);
  -moz-box-shadow:  0 0 8px 1px rgba(0,0,0,.3);
  box-shadow: 0 0 8px 1px rgba(0,0,0,.3);
}

#slider::-moz-range-track {
  pointer-events: disabled;
	-moz-appearance:none;
	height:15px;
	width: 100%;
	background-color: transparent;
	position: relative;
	outline: none;
}

#controls {
  position: absolute;
  z-index: 25;
  background-color: rgba(255, 255, 255, 0.55);
  text-align: center;
  border-radius: 5px;
  border-bottom: 20px;
  top: 20px;
  left: 20px;
}

#controls div{
  font-size: 20px;
  padding: 15px;
}

#controls div:hover{
  background-color: rgba(143, 178, 213, 0.55);
}

#size {
  width: 50px;
  background-color: white;
  text-align: center;
  border-radius: 5px;
  float: left;
}

#size div:hover{
  background-color: rgba(143, 178, 213, 0.55);
}

#controls2 div div{
  font-size: 20px;
  text-align: center;
}

#controls2 div div:hover{
  background-color: rgba(143, 178, 213, 0.55);
}

#controls2{
  display: inline-flex;
  width: 100%;
}

#size2{
  width: 25%;
}

#rotate{
  width: 25%;
}

#arrows{
  width: 50%;
}

#left{
  float: left;
  width: 50%;
}

#right{
  float: right;
  width: 50%;
}

#plus{
  height: 50%;
}

#minus{
  height: 50%;
}

#size2 div, #rotate div{
  padding: 10px;
}

#buttons{
  width: 100%;
  bottom: 10px;
}

#buttons input{
  float: right;
  width: 80px;
  margin: 10px;
}

#buttons2 input{
  width: 90%;
  margin: 10px;
}

#player {
  position: absolute;
  z-index: 999;
  background-color: rgba(255, 255, 255, 0.55);
  border-radius: 5px;
  bottom: 20px;
  margin: none;

  user-select: none;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -o-user-select: none;
}

#player .button2{
  display: inline-block;
  font-size: 20px;
  padding: 20px;
  font-weight: bold;
}

#player .button2:hover{
  background-color: rgba(143, 178, 213, 0.55);
}

#ruler{
  padding: 15px;
  margin: 10px;
}

#myInput {
  position: relative;
  -webkit-appearance: none;
  width: 85%;
}
#myInput:focus {
  outline: none;
}
#myInput::-webkit-slider-runnable-track {
  width: 100%;
  height: 10px;
  cursor: pointer;
  animate: 0.2s;
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  background: #3071a9;
  border-radius: 2px;
  border: 0.2px solid #010101;
}
#myInput::-webkit-slider-thumb {
  height: 36px;
  width: 15px;
  border: solid 2px black;
  border-radius: 3px;
  background: rgba(255,255,255,1.0);
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -12px;
}
#myInput:focus::-webkit-slider-runnable-track {
  background: #367ebd;
}
#myInput::-moz-range-track {
  width: 100%;
  height: 8.4px;
  cursor: pointer;
  animate: 0.2s;
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  background: #3071a9;
  border-radius: 1.3px;
  border: 0.2px solid #010101;
}
#myInput::-moz-range-thumb {
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  border: 1px solid #000000;
  height: 36px;
  width: 16px;
  border-radius: 3px;
  background: #ffffff;
  cursor: pointer;
}
#myInput::-ms-track {
  width: 100%;
  height: 8.4px;
  cursor: pointer;
  animate: 0.2s;
  background: transparent;
  border-color: transparent;
  border-width: 16px 0;
  color: transparent;
}
#myInput::-ms-fill-lower {
  background: #2a6495;
  border: 0.2px solid #010101;
  border-radius: 2.6px;
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
}
#myInput::-ms-fill-upper {
  background: #3071a9;
  border: 0.2px solid #010101;
  border-radius: 2.6px;
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
}
#myInput::-ms-thumb {
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  border: 1px solid #000000;
  height: 36px;
  width: 16px;
  border-radius: 3px;
  background: #ffffff;
  cursor: pointer;
}
#myInput:focus::-ms-fill-lower {
  background: #3071a9;
}
#myInput:focus::-ms-fill-upper {
  background: #367ebd;
}

#loader {
      position: absolute;
      z-index: 9999;
      width: 100%;
      height: 100%;
      margin: 0;
      background: #0d0d0d;
      justify-content: center;
      align-items: center;
}

#loader p{
  position: absolute;
  top: 40%;
  left: 46%;
  font-size: 40px;
  font-weight: 100;
  color: #f60d54 ;
}

.loading,
.loading::before,
.loading::after {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-left-color: rgba(255, 255, 255, 0.4);
  -webkit-border-radius: 999px;
  -moz-border-radius: 999px;
  border-radius: 999px;
}

.loading {
  margin: -25px 0 0 -25px;
  height: 50px;
  width: 50px;
  -webkit-animation: animation-rotate 1000ms linear infinite;
  -moz-animation: animation-rotate 1000ms linear infinite;
  -o-animation: animation-rotate 1000ms linear infinite;
  animation: animation-rotate 1000ms linear infinite;
}

.loading::before {
  content: "";
  margin: -23px 0 0 -23px;
  height: 44px;
  width: 44px;
  -webkit-animation: animation-rotate 1000ms linear infinite;
  -moz-animation: animation-rotate 1000ms linear infinite;
  -o-animation: animation-rotate 1000ms linear infinite;
  animation: animation-rotate 1000ms linear infinite;
}

.loading::after {
  content: "";
  margin: -29px 0 0 -29px;
  height: 56px;
  width: 56px;
  -webkit-animation: animation-rotate 2000ms linear infinite;
  -moz-animation: animation-rotate 2000ms linear infinite;
  -o-animation: animation-rotate 2000ms linear infinite;
  animation: animation-rotate 2000ms linear infinite;
}

@-webkit-keyframes animation-rotate {
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@-moz-keyframes animation-rotate {
  100% {
    -moz-transform: rotate(360deg);
  }
}

@-o-keyframes animation-rotate {
  100% {
    -o-transform: rotate(360deg);
  }
}

@keyframes animation-rotate {
  100% {
    transform: rotate(360deg);
  }
}

#myDiv {
    width: 200px;
    height: 130px;
    background-color: rgba(0, 0, 0, 0.0);
    padding: 0px;
}

#dots{
  position: absolute;
  z-index: 999;
  font-size: 50px;
  color: white;
  top: 30px;
  right: 30px;
}

#inicio{
  margin-top: -4px;
  float: left;
  margin-right: 5px;
}

#final{
  margin-top: -14px;
  margin-left: 8px;
  float: right;
}

#numer{
  width: 100%;
  color: white;
  text-align: center;
  padding-right:35%;
  padding-left: 35%;
}

#numer div{
  background-color: rgba(0, 0, 0, 0.8);
  height: 100%;
}

#video{
  max-width: 100%;
  max-height: 100%;
}

</style>


$(document).ready(function() {



    $(window).on('resize', function() {
      esto = $(document).width();
      player = (esto / 2) - (myPlayer / 1.5);
      document.getElementById("player").style.left = player + "px";
    });

    distorter = FisheyeGl({
      image: ""
    });

    $("dl").on("change", onSliderChange);
    $("dd input").on("mousemove", onSliderChange);

    setSliders();
    readSliders();
    distorter.run();

    window.onresize = resizeGrid;
    setTimeout(resizeGrid, 0);


    document.getElementById("totaly").innerHTML = total;

    $('#myInput').focusin(thumbnails);
    $('#myInput').mouseout(function(){
      $('#myDiv').hide();
      $('#numer').hide();
    });


    //Slider show
    $("#myInput").on('change', showVal);


    $("#transparency").on('change', showVal2);
    $("#transparency").on('mousemove', showVal2);


    $("#slider").on("mousemove", moveDivisor);
    function moveDivisor() {
      handle.style.left = slider.value+"%";
      divisor.style.width = slider.value+"%";
    }

});
