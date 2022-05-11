<template>
    <div class="plainText" :dimmed="this.currentObj.status!='setup'">
    <b>Параметры кластеризации:</b><br/>
    Порог корреляции <b class="brighterPlainText">{{this.corrThresh/100}}</b>
    <q-slider dark dense v-model="corrThresh" :disable="this.currentObj.status!='setup'" :min="0" :max="100"/>
    Фильтрация маски <b class="brighterPlainText">{{this.maskThresh/100}}</b>
    <q-slider dark dense v-model="maskThresh" :disable="this.currentObj.status!='setup'" :min="0" :max="50"/>
    <q-btn unelevated dense color="grey-8"    :disable="this.currentObj.status!='setup'"  label="Пуск" @click="this.$emit('calcCorr',this.corrThresh/100,this.maskThresh/100)"/>
    </div>
</template>

<script>
import { ref } from 'vue'

export default {
    props:{
        currentObj:Object,
    },
  data() {
    return {
      corrThresh: ref(50),
      maskThresh: ref(2),
    }
  },
  methods:{
    updateSliders(){
      if(this.currentObj.maskThresh!=undefined)
        this.maskThresh = int(this.currentObj.maskThresh)
      if(this.currentObj.corrThresh!=undefined)
        this.corrThresh = int(this.currentObj.corrThresh)

    }
  }
}
</script>

<style>

</style>