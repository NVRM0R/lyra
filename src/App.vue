<template>
    <div class="navBar" >
        <fileMenu v-bind:files="onServerFiles" @loadNewFile="loadNewFile" @loadProjectFile="loadProjectFile" />
    </div>
    <div class="settings" v-if="this.currentObj!=null">
        <select  @change="setColorScheme($event.target.value)">
            <option  v-if="this.colorMapsV!=null" v-for="color in this.colorMapsV" :value="color" :selected="color === 'viridis'"> {{color}} </option>
            <option  v-else> Загрузка </option>
        </select>
        <div>
            Файл:{{this.currentObj.name}}<br />
            Статус:{{this.currentObj.cyrStatus}}<br />
        </div>
        <div>
            Доступные разбиения:<br/>
            <select  @change="parcellate($event.target.value)">
                <option selected>Исходный снимок</option>
                <option v-for="num in this.currentObj.parc" :value="num"> {{color}} </option>
            </select>
        </div>
        <form @submit.prevent>
            <input type="number" id="parcs" min="1" max="500"> 
            <input type="submit" value="Обработать" @click="parcellate()">
        </form>
        <form @submit.prevent>
            <input type="submit" value="Удалить проект" @click="superDelete()">
        </form>
    </div>
    <div class="visual" v-bind:fileDataName="selectedFile">
        <visual ref="visializator"></visual>
    </div>
</template>

<script>
import fileMenu from "@/components/fileMenu.vue"
import axios from 'axios';
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
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.navBar{
    padding:20px;
}
.visual{
    display:inline-block;
    background-color: #DDD;
    width:900px;
    height:400px;
}
</style>
