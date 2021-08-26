<template>
  <div class="DynamicComponent">
    <p>Здесь будет контент про ОСАГО</p>
  </div>
</template>

<script>
export default {
  name: "DynamicOSAGO",

  created() {
    const url = "/free/v2/question";
    fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
      });
  },
};
</script>
