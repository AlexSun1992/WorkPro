<template>
  <div class="DynamicComponent" v-if="questions !== null">
    <div v-for="(question, id) in questions" :key="id">
      <h4>{{ question.SQUESTION }}</h4>
      <p>{{ question.SANSWER }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "DynamicKASKO",
  data() {
    return {
      questions: null,
    };
  },
  async created() {
    const url = "/free/v2/question";
    let response = await fetch(url);
    let data = await response.json();
    console.log(data);
    let property = data.filter(function (item) {
      return item.FKIDRMPRODUCT === "Имущество";
    });
    this.questions = property;
  },
};
</script>
