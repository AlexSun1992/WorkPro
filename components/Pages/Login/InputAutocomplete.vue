<template>
<div class="autocomplete">
       <ul>
            <li
          v-for="(item,index) in matches"

          :key="item[filterby]"

          @click="itemClicked(index)">

          {{item[filterby]}}
          
            </li>
      </ul> 
</div>
</template>

<script>

export default{

props:['items','filterby','stringValue'],

methods:{

itemClicked(index){

this.$emit('setValue',index)

this.$emit('setName',index)

this.$emit('setSurname',index)

  }
},


computed:{

  matches(){

  return this.items.filter((item) => item[this.filterby].toLowerCase().includes(this.stringValue))
   
   }

  }

}

</script>


<style scoped>
.autocomplete{
  width:100%;
  position:relative;
  box-shadow: 0 0 1px 1px black;
  max-height: 100px;
  overflow-y:scroll;
}

.autocomplete ul{
  margin: 0;
}

.autocomplete ul li{
  list-style-type: none;
  text-align:left;
  padding-left:0;
  width:100%;
  cursor:pointer;
  background: #f1f1f1;
}

li{
  list-style: none;
  border-bottom:1px solid lightgrey;
  padding:10px;
  cursor:pointer;
}

.autocomplete ul li:not(.selected):hover{
  background: #8c8c8c;
  color:#fff;
}

.options ul li.selected {
  background: #8c8c8c;
}


</style>