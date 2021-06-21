<template>
    <div>
        <b-form-input
          :placeholder="placeholder"
          :type="type"
          class="form-control"
          :autofocus="autofocus"
          >
          </b-form-input>
          <b-form-invalid-feedback>
            {{feedback}}
          </b-form-invalid-feedback>  
        <div>
            
        </div>
    </div>
</template>

<script>

export default {

props:['placeholder','type',

'feedback','autofocus'],

data(){
    return{} 
 }
}




</script>
