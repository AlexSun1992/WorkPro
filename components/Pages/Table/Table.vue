<template>
  <div>
    <div class="container mt-5">
      <table>
        <thead>
          <tr>
            <th>Тип документа</th>
            <th>Загруженные файлы</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in items" :key="i">
            <td>{{ item.FKIDDOCTYPE }}</td>
            <td><FileLoader :item="item" tableId="9662" /></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import FileLoader from "./FileLoader";
export default {
  name: "Table",
  components: { FileLoader },
  data() {
    return {
      items: null,
    };
  },
  head: {
    link: [
      {
        rel: "stylesheet",
        href:
          "https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css",
      },
    ],
  },
  async fetch() {
    let data = await this.$axios.$get(
      "/am/main/v2/data/27/983?json={pIdDocPhoto:1351480299}"
    );
    this.items = data[0]._data;
  },
};
</script>

<style scoped>
table {
  border: 1px solid #ccc;
  width: 100%;
  margin: 0;
  padding: 0;
  border-collapse: collapse;
  border-spacing: 0;
}

table tr {
  border: 1px solid #ddd;
  padding: 5px;
}

table th,
table td {
  padding: 10px;
  border-right: 1px solid #ddd;
}
</style>
