<template>
    <div class="settings" v-if="this.currentObj!=null" color="grey-8">
                <div class="plainText" :dimmed="this.currentObj.status!='ready'">
                    Файл:<span class="brighterPlainText"><b>{{this.currentObj.name}}</b></span><br />
                    Статус:<span class="brighterPlainText"><b>{{this.currentObj.cyrStatus}}</b></span><br />
                    <hr/>
                    <setup
                    @calcCorr="calcCorr"
                    v-bind:currentObj="this.currentObj"
                    />
                    <hr />
                    Качество изображения:
                    <div>
                        <q-radio dark dense 
                        v-model="QualitySelector" 
                        val="big" 
                        label="Анатомическое" 
                        @click="loadImage()"
                        :disable="this.currentObj.status!='ready'"
                        />
                        <q-radio dark dense 
                        v-model="QualitySelector" 
                        val="norm" 
                        label="Функциональное" 
                        @click="loadImage()"
                        :disable="this.currentObj.status!='ready'"
                         />
                    </div>
                    Цветовая схема:
                    <q-select dark dense 
                    class="row inline longInp" 
                    v-model="colorSelectorModel" 
                    ref="colorSelector" 
                    :options="this.colorMapsV"  
                    @update:model-value="setColorScheme()" 
                    bg-color="grey-8"
                    :disable="this.currentObj.status!='ready'"
                    />
                    Доступные разбиения:
                    <q-select dark dense
                    class="row inline longInp" 
                    v-model="anatSelectorModel" 
                    ref="anatSelector" 
                    :options="this.currentObj.parc"  
                    @update:model-value="loadImage()" 
                    :disable="this.currentObj.status!='ready'"
                    bg-color="grey-8" 
                    color="white" />
                Новое разбиение:
                </div>
                <div class="parcBox">
                    <q-input 
                    class="row inline" 
                    v-model.number="ParcNumModel" 
                    type="number" id="parcs" 
                    min="1" max="500" 
                    bg-color="grey-7" 
                    :disable="this.currentObj.status!='ready'"
                    dense dark
                    /> 
                    <q-btn 
                    class="row inline" dense unelevated color="grey-8" label="Обработать" @click="parcellate()"/>
                </div>
                <div class="Controlbuttons">
                    <hr/>
                    <q-btn unelevated dense color="grey-8" label="Скачать файлом" @click="downloadProject()"/>
                    <q-btn unelevated dense color="grey-8" label="Обновить проект" @click="updateProject()"/>
                    <q-btn unelevated dense color="red-8" label="Удалить проект" @click="superDelete()"/>
                </div>
    </div>
</template>

<script>
import {ref} from 'vue';
import setup from "@/components/setup.vue"
export default {
    components:{
        setup,
    },
    data(){
        return{
            colorSelectorModel:'gray',
            ParcNumModel:ref(0),
        }
    },
    props:{
            colorMapsV:String,
            currentObj:Object,
            anatSelectorModel:Object,
            QualitySelector:String,
    },
    methods:{
        superDelete(){this.$emit("superDelete");},
        updateProject(){this.$emit("updateProject");},
        downloadProject(){this.$emit("downloadProject");},
        setColorScheme(){this.$emit("setColorScheme");},
        loadImage(){this.$emit("loadImage");this.colorSelectorModel='gray'},
        parcellate(){this.$emit("parcellate");},
        calcCorr(corrThresh,maskThresh){this.$emit("calcCorr",corrThresh,maskThresh);}
    },
}
</script>

<style>
.settings{
    margin-left:auto;
    float:right;
    justify-content: flex-end;
    width: 20%;
}
.plainText{
    color:#A0A0A0;
}
.brighterPlainText{
    color:#D0D0D0
}
.parcInput{
    max-width:50px;
}
.Controlbuttons{
    margin-top:30px;
}
.longInp{
    width:100%;
}
</style>