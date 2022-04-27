<template>
    <div class="row">
        <div class="flex-break" id="navBar">
            <div >
                <fileMenu v-bind:files="onServerFiles" @loadNewFile="loadNewFile" @loadProjectFile="loadProjectFile" />
            </div>
            <div class="settings" v-if="this.currentObj!=null" color="grey-8">
                <q-select dense v-model="colorSelectorModel" ref="anatSelector" :options="this.colorMapsV"  @change="setColorScheme($event.target.value)" bg-color="grey-8"/>
                <div class="plainText">
                    Файл:<span class="brighterPlainText"><b>{{this.currentObj.name}}</b></span><br />
                    Статус:<span class="brighterPlainText"><b>{{this.currentObj.cyrStatus}}</b></span><br />
                </div>
                <div class="plainText">
                    Доступные разбиения:<br/>
                    <q-select dense v-model="anatSelectorModel" ref="anatSelector" :options="this.currentObj.parc"  @change="parcellate($event.target.value)" bg-color="grey-8" label-color="gray-3" />
                </div>
                <form @submit.prevent>
                    <label><q-input type="number" id="parcs" min="1" max="500" bg-color="grey-7" dense /> 
                    <q-btn dense unelevated color="grey-8" label="Обработать" @click="parcellate()"/></label>
                </form>
                <form @submit.prevent>
                    <q-btn unelevated color="grey-7" label-color="grey-4" label="Удалить проект" @click="superDelete()"/>
                </form>
            </div>
        </div>
        <div class="visual" v-bind:fileDataName="selectedFile">
            <visual ref="visializator"></visual>
        </div>
    </div>
</template>

<script>
import fileMenu from "@/components/fileMenu.vue"
import axios from 'axios';
import {ref} from 'vue'
let SERVER_ADDR = "http://192.168.1.27:5000"
export default{
    components:{
        fileMenu
    },
    data(){
        return{
            onServerFiles:[],
            selectedFile:null,
            colorMapsV:null,
            currentObj:null,
            anatSelectorModel:ref(null),
            colorSelectorModel:ref(null),
        }
    },
    methods:{
        async loadProjectList(){
            try{
                const query = SERVER_ADDR+'/listProjects'
                const response = await axios.get(query)
                this.onServerFiles = response.data['list']
            }catch(e){
                alert('Не удалось получить список проектов')
            }
        },
        loadNewFile(file){
            const formData = new FormData();
            formData.append('anatomical',file)
            const hdr = {
                headers: {
                "Content-Type": 'multipart/form-data',
                "projectName":file.name,
                },
            };

            let url = SERVER_ADDR+'/newProject';
            return axios.post(url, formData, hdr).then((res) => {
                this.$router.go();
                })
                .catch((err) => {
                    return {
                        status: err.response ? err.response.status : 0,
                        data: {},
                        error: err.message,
                    };
                })
        },
        async loadProjectFile(name){

            this.selectedFile = name;
            var infoURL = SERVER_ADDR+'/info/'+this.selectedFile;
            return axios.get(infoURL).then((res) => {
                    this.currentObj = res.data
                    console.log(res.data)
                    switch(res.data['status']){
                        case 'new':
                            this.currentObj.cyrStatus = 'вычисляется матрица корреляций'
                        break
                        case 'ready':
                            this.currentObj.cyrStatus = 'готово'
                        break
                        case 'parcellating':
                            this.currentObj.cyrStatus = 'производится разбиение'
                        break
                    }
                    if(res.data['status']=='ready'){
                        this.$refs.visializator.loadImage(SERVER_ADDR+'/data/'+this.selectedFile)
                    }
                })
                .catch((err) => {
                    return {
                        status: err.response ? err.response.status : 0,
                        data: {},
                        error: err.message,
                    };
                })

        },
        setColorScheme(color){this.$refs.visializator.setColorScheme(color);},
        superDelete(){
            var delURL = SERVER_ADDR+'/delete/'+this.selectedFile;
            return axios.get(delURL);
        }
    },
    mounted(){
        this.loadProjectList();
        this.colorMapsV = this.$refs.visializator.getColorScheme();
        console.log(this.colorMapsV)
    }
}
</script>


<style>
body{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: #202020;
}
#navBar{
    width:30%;
}
.plainText{
    color:#A0A0A0;
}
.brighterPlainText{
    color:#D0D0D0
}
</style>
