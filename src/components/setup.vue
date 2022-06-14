<template>
    <div class="plainText" :dimmed="this.currentObj.status!='setup'">
    <b>Параметры кластеризации:</b><br/>
    Порог корреляции <b class="brighterPlainText">{{this.currentObj.corrThresh/100}}</b>
    <q-slider dark dense v-model="this.currentObj.corrThresh" :disable="this.currentObj.status!='setup'" :min="0" :max="100"/>
    Фильтрация маски <b class="brighterPlainText">{{this.currentObj.maskThresh/100}}</b>
    <q-slider dark dense v-model="this.currentObj.maskThresh" :disable="this.currentObj.status!='setup'" :min="0" :max="80"/>
    <q-btn unelevated dense color="grey-8"    :disable="this.currentObj.status!='setup'"  label="Пуск" @click="this.$emit('calcCorr',this.currentObj.corrThresh/100,this.currentObj.maskThresh/100)"/>
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
    }
  },
  methods:{
  }
}
</script>

<style>

</style>