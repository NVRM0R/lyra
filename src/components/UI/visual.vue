<script>
import {Niivue,NVImage} from '@niivue/niivue'



export default {
  name: 'visual',
  props: {

  },
  data(){
    return {
      colorSchemes: [],
      nv:null,
      volume:[],
    }
  },

  mounted() {
    this.nv = new Niivue();
    this.nv.attachTo('gl')

    this.colorSchemes = this.nv.colorMaps()
  },
    methods:{
        loadImage(file){
            console.log(file)
            this.volume = [
            {
              id:0,
              url: file,
              volume: {hdr: null, img: null},
              name: "some_image",
              colorMap: "gray",
              opacity: 1,
              visible: true,
            }
        ]
        this.nv.loadVolumes(this.volume);
        },
        setColorScheme(name){
          this.nv.volumes[0].colorMap = name
          this.nv.updateGLVolume();
        },
        getColorScheme(){
          return this.nv.colorMaps();
        },
      },
}

</script>

<template>
<div id="visualMainDiv">
<canvas id="gl" height="600" width="800"></canvas>
</div>
</template>

<style>
</style>