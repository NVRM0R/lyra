
<template>
<div id="NIIwindows">
    <div class="canvasWindow">
        <canvas width="800" height="400" id="sag"> </canvas>
        <input type="range" min="0" max="100" class="slider" @input="drawCanvas">
    </div>
</div>
</template>

<script>
import nifti from "nifti-reader-js/src/nifti"

export default {
  name: 'visual',
  data(){
    return {
        dataHeader:null,
        dataVolume:null,
        slice:50,
        shape:[0,0,0],
        typedData:null,
        cvs:null,
        ctx:null,
    }
  },
methods:{
        readNIFTI(data) {

            // parse nifti
            if (nifti.isCompressed(data)) {
                data = nifti.decompress(data);
            }

            if (nifti.isNIFTI(data)) {
                this.dataHeader = nifti.readHeader(data);
                this.dataVolume = nifti.readImage(this.dataHeader, data);
            }
            this.shape = this.dataHeader.dims.slice(1,4);
            this.modelInit();
            this.drawCanvas();
        },
        modelInit(){
            if (this.dataHeader.datatypeCode === nifti.NIFTI1.TYPE_UINT8) {
                this.typedData = new Uint8Array(this.dataVolume);
            } else if (this.dataHeader.datatypeCode === nifti.NIFTI1.TYPE_INT16) {
                this.typedData = new Int16Array(this.dataVolume);
            } else if (this.dataHeader.datatypeCode === nifti.NIFTI1.TYPE_INT32) {
                this.typedData = new Int32Array(this.dataVolume);
            } else if (this.dataHeader.datatypeCode === nifti.NIFTI1.TYPE_FLOAT32) {
                this.typedData = new Float32Array(this.dataVolume);
            } else if (this.dataHeader.datatypeCode === nifti.NIFTI1.TYPE_FLOAT64) {
                this.typedData = new Float64Array(this.dataVolume);
            } else if (this.dataHeader.datatypeCode === nifti.NIFTI1.TYPE_INT8) {
                this.typedData = new Int8Array(this.dataVolume);
            } else if (this.dataHeader.datatypeCode === nifti.NIFTI1.TYPE_UINT16) {
                this.typedData = new Uint16Array(this.dataVolume);
            } else if (this.dataHeader.datatypeCode === nifti.NIFTI1.TYPE_UINT32) {
                this.typedData = new Uint32Array(this.dataVolume);
            } else {
                return;
            }
         
            this.cvs = document.getElementById("sag");
            this.ctx = this.cvs.getContext("2d");
        },
        drawCanvas(event = null){
            if(event!=null)
                var slice = event.target.value
            else
                var slice = 0;
            var pixS,crdS;
            var pixC,crdC;
            var lShape = this.shape
            var saggital = new ImageData(lShape[0],lShape[1]);
            var coronal = new ImageData(lShape[2],lShape[1]);
            for (var j = 0; j < lShape[1]; j++)
                for (var i = 0; i < lShape[0]; i++){
                    crdS = (slice * lShape[0] * lShape[1]) + (j * lShape[0]) + i
                    pixS = this.typedData[crdS];
                    crdS = j*lShape[0]+i;
                    saggital.data[crdS * 4] = pixS & 0xFF;
                    saggital.data[crdS * 4 + 1] = pixS & 0xFF;
                    saggital.data[crdS * 4 + 2] = pixS & 0xFF;
                    saggital.data[crdS * 4 + 3] = 0xFF;
                }
            /*
            for (var j = 0; j < this.shape[2]; j++)
                for (var i = 0; i < this.shape[1]; i++){   
                    crdC = (slice * this.shape[1] * this.shape[2]) + (j * this.shape[1]) + i
                    pixC = this.typedData[crdC];
                    crdC = j*this.shape[1]+i;
                    coronal.data[crdC * 4] = pixC & 0xFF;
                    coronal.data[crdC * 4 + 1] = pixC & 0xFF;
                    coronal.data[crdC * 4 + 2] = pixC & 0xFF;
                    coronal.data[crdC * 4 + 3] = 0xFF;
                }

            */

            this.ctx.putImageData(saggital,0,0);
            //this.ctx.putImageData(coronal,400,0);
        },
        loadImage(fileDataName) {
        let url = "http://192.168.1.27:5000/data/"+fileDataName
        fetch(url)
        .then(res => res.blob()) // Gets the response and returns it as a blob
        .then(blob => {
            let objectURL = URL.createObjectURL(blob);
            new Response(blob).arrayBuffer()
            .then(result => {
            console.log( result.byteLength);
            this.readNIFTI(result);
            });
                
        });
    },
}
}
</script>
<style>
#NIIwindows{
    width:100%;
}
#canvasWindow{
    height:220px;
    display:block;
}
</style>